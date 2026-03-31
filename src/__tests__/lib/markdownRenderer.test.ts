/**
 * Tests de sécurité pour src/lib/markdownRenderer.ts (sanitizeHtml)
 *
 * Pourquoi ces tests existent :
 * markdownToHtml est utilisé pour afficher le contenu des livrables générés
 * par l'IA (page agent, estimations). Ce contenu peut potentiellement contenir
 * du HTML malveillant si un prompt injection réussit ou si la base de données
 * est compromise. Sans sanitization, un XSS stocké permet de voler les sessions
 * des mandataires connectés — accès dashboard, données clients, factures.
 *
 * Chaque test vérifie un vecteur d'attaque OWASP XSS connu.
 * Référence : OWASP XSS Filter Evasion Cheat Sheet.
 *
 * REGRESSION : faille XSS via javascript: encodé en entités HTML — corrigée
 * par ajout du décodage d'entités dans sanitizeHtml (2026-03).
 */

import { describe, it, expect } from "vitest"
import { markdownToHtml, stripMarkdown } from "@/lib/markdownRenderer"

// ─── Rendu markdown normal ──────────────────────────────────────────

describe("markdownToHtml — rendu correct", () => {
  it("rend un paragraphe simple", () => {
    const html = markdownToHtml("Bonjour le monde")
    expect(html).toContain("<p")
    expect(html).toContain("Bonjour le monde")
  })

  it("rend un titre H2", () => {
    const html = markdownToHtml("## Mon titre")
    expect(html).toContain("<h2")
    expect(html).toContain("Mon titre")
  })

  it("rend du texte en gras", () => {
    const html = markdownToHtml("Un mot **important** ici")
    expect(html).toContain("<strong>important</strong>")
  })

  it("rend du texte en italique", () => {
    const html = markdownToHtml("Un mot *souligné* ici")
    expect(html).toContain("<em>souligné</em>")
  })

  it("rend un lien avec target=_blank et rel=noopener", () => {
    const html = markdownToHtml("[ImmoCrew](https://immocrew.fr)")
    expect(html).toContain('href="https://immocrew.fr"')
    expect(html).toContain('target="_blank"')
    expect(html).toContain('rel="noopener noreferrer"')
  })

  it("rend une liste non ordonnée", () => {
    const html = markdownToHtml("- item 1\n- item 2")
    expect(html).toContain("<ul")
    expect(html).toContain("<li>item 1</li>")
    expect(html).toContain("<li>item 2</li>")
  })

  it("rend une liste ordonnée", () => {
    const html = markdownToHtml("1. premier\n2. deuxième")
    expect(html).toContain("<ol")
    expect(html).toContain("<li>premier</li>")
    expect(html).toContain("<li>deuxième</li>")
  })

  it("rend une blockquote", () => {
    const html = markdownToHtml("> Citation importante")
    expect(html).toContain("<blockquote")
    expect(html).toContain("Citation importante")
  })
})

// ─── Sanitization — vecteurs XSS ───────────────────────────────────

describe("markdownToHtml — sanitization XSS", () => {
  it("supprime les balises <script> et leur contenu", () => {
    const html = markdownToHtml("Texte <script>alert(1)</script> suite")
    expect(html).not.toContain("<script")
    expect(html).not.toContain("alert(1)")
    expect(html).toContain("Texte")
    expect(html).toContain("suite")
  })

  it("supprime les balises <script> auto-fermantes", () => {
    const html = markdownToHtml('Texte <script src="evil.js"/> suite')
    expect(html).not.toContain("<script")
  })

  it("supprime les balises <svg> avec onload (vecteur XSS classique)", () => {
    const html = markdownToHtml('<svg onload="alert(1)">test</svg>')
    expect(html).not.toContain("<svg")
    expect(html).not.toContain("onload")
  })

  it("supprime les attributs on* (onerror, onclick, onload, etc.)", () => {
    const html = markdownToHtml('<img src="x" onerror="alert(1)">')
    expect(html).not.toContain("onerror")
    expect(html).not.toContain("alert(1)")
  })

  it("neutralise les URLs javascript: dans les href", () => {
    const html = markdownToHtml('[clic](javascript:alert(1))')
    // Le lien est rendu par formatInline, puis sanitizeHtml neutralise le href
    expect(html).not.toContain("javascript:")
  })

  it("neutralise les URLs javascript: encodées en entités HTML (&#58;)", () => {
    const malicious = '<a href="javascript&#58;alert(1)">clic</a>'
    const html = markdownToHtml(malicious)
    expect(html).not.toContain("javascript:")
    expect(html).not.toContain("javascript&#58;")
  })

  it("neutralise les URLs javascript: encodées en hex (&#x6A;)", () => {
    const malicious = '<a href="&#x6A;avascript:alert(1)">clic</a>'
    const html = markdownToHtml(malicious)
    expect(html).not.toContain("javascript:")
  })

  it("supprime les balises <iframe>", () => {
    const html = markdownToHtml('<iframe src="https://evil.com"></iframe>')
    expect(html).not.toContain("<iframe")
  })

  it("supprime les balises <object> et <embed>", () => {
    const html = markdownToHtml('<object data="evil.swf"></object><embed src="evil.swf">')
    expect(html).not.toContain("<object")
    expect(html).not.toContain("<embed")
  })

  it("supprime les balises <form> et <input> (injection de formulaire)", () => {
    const html = markdownToHtml('<form action="https://evil.com"><input type="password"></form>')
    expect(html).not.toContain("<form")
    expect(html).not.toContain("<input")
  })

  it("supprime les balises <style> (CSS injection)", () => {
    const html = markdownToHtml("<style>body{background:url(evil)}</style>")
    expect(html).not.toContain("<style")
  })

  it("supprime les handlers onclick sur des éléments légitimes", () => {
    const html = markdownToHtml('<p onclick="alert(1)">texte</p>')
    expect(html).not.toContain("onclick")
  })

  it("neutralise data: URLs en src (SVG/HTML injection)", () => {
    const html = markdownToHtml('<img src="data:text/html,<script>alert(1)</script>">')
    expect(html).not.toContain("data:text/html")
  })
})

// ─── stripMarkdown ──────────────────────────────────────────────────

describe("stripMarkdown", () => {
  it("retire le formatage bold et italic", () => {
    expect(stripMarkdown("Un mot **gras** et *italique*")).toBe(
      "Un mot gras et italique"
    )
  })

  it("retire les liens markdown en gardant le texte", () => {
    expect(stripMarkdown("[ImmoCrew](https://immocrew.fr)")).toBe("ImmoCrew")
  })

  it("retire les titres markdown", () => {
    expect(stripMarkdown("## Mon titre")).toBe("Mon titre")
  })

  it("retire les blockquotes", () => {
    expect(stripMarkdown("> Citation")).toBe("Citation")
  })
})

/**
 * Script de generation d'echantillons reels pour l'audit Sophie.
 * Execute chaque prompt avec le profil Sophie (Angers, La Doutre, IAD)
 * et sauvegarde les outputs dans /tmp/sophie-outputs/
 *
 * Usage: ANTHROPIC_API_KEY=sk-... npx tsx scripts/generate-sophie-samples.ts
 */

import Anthropic from "@anthropic-ai/sdk"
import { writeFileSync, mkdirSync } from "fs"
import { buildPostSocialPrompt } from "../src/lib/prompts/post-social"
import { buildAnnonceStorytellingPrompt } from "../src/lib/prompts/annonce-storytelling"
import { buildArticleSeoPrompt } from "../src/lib/prompts/article-seo"
import { buildScriptVideoPrompt } from "../src/lib/prompts/script-video"
import { buildNewsletterPrompt } from "../src/lib/prompts/newsletter"
import { buildEmailProspectionPrompt } from "../src/lib/prompts/email-prospection"
import { buildPositioningStatementPrompt } from "../src/lib/prompts/positioning-statement"
import { buildBioMultiformatPrompt } from "../src/lib/prompts/bio-multiformat"
import { buildEditorialCalendarPrompt } from "../src/lib/prompts/editorial-calendar"
import { buildLandingBienPrompt } from "../src/lib/prompts/landing-bien"

const client = new Anthropic()
const OUTPUT_DIR = "/tmp/sophie-outputs"
mkdirSync(OUTPUT_DIR, { recursive: true })

// Profil Sophie realiste
const sophie = {
  prenom: "Sophie",
  nom: "Martin",
  reseau: "IAD France",
  annees_experience: 2,
  specialite: "Appartements anciens et maisons de ville",
  zone_geo: {
    ville: "Angers",
    departement: "49 - Maine-et-Loire",
    quartiers: ["La Doutre", "Centre-ville", "Saint-Serge", "Lac de Maine"],
  },
  ton: "Pro mais accessible, chaleureuse, directe — comme une voisine qui connait tout le quartier",
  valeurs: "Transparence, proximite, reactivite, honnetete sur les prix",
  ce_qui_differencie: "Je connais chaque rue de La Doutre, j'y habite depuis 10 ans. Je dis la verite sur les prix meme quand ca ne plait pas.",
  biens: [
    {
      titre: "T3 lumineux avec vue Loire",
      type: "Appartement",
      adresse: "12 rue Beaurepaire, La Doutre, Angers",
      prix: 185000,
      surface: 68,
      pieces: 3,
      points_forts: "Vue Loire degagee, parquet chene massif, cave voutee, 5 min a pied du tramway",
    },
    {
      titre: "Maison de ville avec jardin clos",
      type: "Maison",
      adresse: "8 rue des Lices, Centre-ville, Angers",
      prix: 295000,
      surface: 110,
      pieces: 5,
      points_forts: "Jardin 80m2 clos, garage, cheminee fonctionnelle, quartier calme a 3 min du centre",
    },
  ],
  reseaux_sociaux: {
    instagram: "@sophie.immo.angers",
    facebook: "Sophie Martin Immobilier Angers",
    linkedin: "sophie-martin-iad",
  },
  nb_transactions_an: 5,
  gamme_prix: "120K - 350K EUR",
  cible_clients: "Primo-accedants 25-35 ans, familles qui cherchent plus grand, investisseurs locatifs etudiants (proximite fac)",
}

async function generate(name: string, prompt: { system: string; user: string }, maxTokens: number) {
  console.log(`\n--- Generating: ${name} ---`)
  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: maxTokens,
      system: prompt.system,
      messages: [{ role: "user", content: prompt.user }],
    })
    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
    writeFileSync(`${OUTPUT_DIR}/${name}.txt`, text)
    console.log(`  OK — ${response.usage.output_tokens} tokens, saved to ${name}.txt`)
    return text
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`  ERREUR: ${msg}`)
    writeFileSync(`${OUTPUT_DIR}/${name}.txt`, `ERREUR: ${msg}`)
    return null
  }
}

async function main() {
  console.log("=== Generation des echantillons Sophie ===\n")

  // 1. Posts sociaux (3 posts mix pour l'echantillon)
  await generate("01-posts-sociaux", buildPostSocialPrompt({
    ...sophie,
    plateforme: "mix",
    nombre_posts: 3,
  }), 4096)

  // 2. Annonce storytelling (1 annonce)
  await generate("02-annonce-storytelling", buildAnnonceStorytellingPrompt({
    ...sophie,
    nombre_annonces: 1,
  }), 4096)

  // 3. Article SEO (1 article)
  await generate("03-article-seo", buildArticleSeoPrompt({
    ...sophie,
    nombre_articles: 1,
  }), 4096)

  // 4. Script video (1 script)
  await generate("04-script-video", buildScriptVideoPrompt({
    ...sophie,
    nombre_scripts: 1,
    format: "reel",
    confort_camera: "debutant",
  }), 4096)

  // 5. Newsletter
  await generate("05-newsletter", buildNewsletterPrompt({
    ...sophie,
    mois: "avril 2026",
    bien_du_mois: sophie.biens[0],
    tendance_marche: "Les prix a Angers ont baisse de 3% sur un an, mais La Doutre resiste bien grace a la proximite du tramway et du centre.",
    conseil_mensuel: "Comment preparer son bien pour les visites de printemps",
  }), 4096)

  // 6. Email prospection
  await generate("06-email-prospection", buildEmailProspectionPrompt({
    ...sophie,
    type_email: "prospection_vendeurs",
    biens: sophie.biens,
  }), 2048)

  // 7. Positionnement
  await generate("07-positionnement", buildPositioningStatementPrompt(sophie), 4096)

  // 8. Bio multiformat
  await generate("08-bio-multiformat", buildBioMultiformatPrompt({
    ...sophie,
    accroche_identitaire: "La mandataire qui connait chaque pierre de La Doutre",
    piliers_differenciation: ["Expertise hyper-locale La Doutre", "Transparence totale sur les prix", "Reactivite 24h"],
  }), 2048)

  // 9. Calendrier editorial (7 jours pour l'echantillon)
  await generate("09-calendrier-editorial", buildEditorialCalendarPrompt({
    ...sophie,
    frequence_hebdo: 5,
    date_debut: "2026-04-01",
  }), 8192)

  // 10. Landing bien
  await generate("10-landing-bien", buildLandingBienPrompt({
    ...sophie,
    bien: sophie.biens[0],
    email_contact: "sophie.martin@iad-france.fr",
    telephone_contact: "06 12 34 56 78",
  }), 8192)

  console.log("\n=== Terminé ! Outputs dans /tmp/sophie-outputs/ ===")
}

main()

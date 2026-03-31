/**
 * Client-side markdown to HTML renderer.
 * Lightweight parser for deliverable content display.
 * Handles: h2, h3, paragraphs, bold, italic, links, lists (ul/ol), blockquotes, tables, hr.
 */

function formatInline(text: string): string {
  return text
    .replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" loading="lazy" class="rounded-lg my-4 w-full" />'
    )
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-secondary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
    )
}

export function markdownToHtml(md: string): string {
  const lines = md.split("\n")
  const html: string[] = []
  let inList = false
  let listType: "ul" | "ol" = "ul"
  let inTable = false

  for (const line of lines) {
    const trimmed = line.trim()

    if (!trimmed) {
      if (inList) {
        html.push(listType === "ul" ? "</ul>" : "</ol>")
        inList = false
      }
      if (inTable) {
        html.push("</tbody></table>")
        inTable = false
      }
      continue
    }

    if (trimmed === "---") continue

    // Table rows
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      if (/^\|[\s\-:|]+\|$/.test(trimmed)) continue
      const cells = trimmed
        .split("|")
        .filter((c) => c.trim() !== "")
        .map((c) => formatInline(c.trim()))
      if (!inTable) {
        html.push(
          '<table class="w-full text-body-sm border-collapse my-4"><thead><tr>'
        )
        cells.forEach((c) =>
          html.push(
            `<th class="border border-border px-3 py-2 text-left font-semibold bg-neutral-50">${c}</th>`
          )
        )
        html.push("</tr></thead><tbody>")
        inTable = true
        continue
      }
      html.push("<tr>")
      cells.forEach((c) =>
        html.push(`<td class="border border-border px-3 py-2">${c}</td>`)
      )
      html.push("</tr>")
      continue
    }
    if (inTable) {
      html.push("</tbody></table>")
      inTable = false
    }

    // H2
    if (trimmed.startsWith("## ")) {
      if (inList) {
        html.push(listType === "ul" ? "</ul>" : "</ol>")
        inList = false
      }
      html.push(
        `<h2 class="font-display text-h4 text-primary mt-6 mb-2">${formatInline(trimmed.slice(3))}</h2>`
      )
      continue
    }

    // H3
    if (trimmed.startsWith("### ")) {
      if (inList) {
        html.push(listType === "ul" ? "</ul>" : "</ol>")
        inList = false
      }
      html.push(
        `<h3 class="font-display text-h5 text-primary mt-4 mb-1">${formatInline(trimmed.slice(4))}</h3>`
      )
      continue
    }

    // Unordered list
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!inList) {
        html.push('<ul class="list-disc list-inside space-y-1 my-2">')
        inList = true
        listType = "ul"
      }
      html.push(`<li>${formatInline(trimmed.slice(2))}</li>`)
      continue
    }

    // Ordered list
    if (/^\d+\.\s/.test(trimmed)) {
      if (!inList) {
        html.push('<ol class="list-decimal list-inside space-y-1 my-2">')
        inList = true
        listType = "ol"
      }
      html.push(`<li>${formatInline(trimmed.replace(/^\d+\.\s/, ""))}</li>`)
      continue
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      if (inList) {
        html.push(listType === "ul" ? "</ul>" : "</ol>")
        inList = false
      }
      html.push(
        `<blockquote class="border-l-4 border-secondary/30 pl-4 my-3 text-neutral-600 italic"><p>${formatInline(trimmed.slice(2))}</p></blockquote>`
      )
      continue
    }

    // Paragraph
    if (inList) {
      html.push(listType === "ul" ? "</ul>" : "</ol>")
      inList = false
    }
    html.push(
      `<p class="my-2 leading-relaxed">${formatInline(trimmed)}</p>`
    )
  }

  if (inList) html.push(listType === "ul" ? "</ul>" : "</ol>")
  if (inTable) html.push("</tbody></table>")
  return sanitizeHtml(html.join("\n"))
}

/**
 * Minimal HTML sanitizer — strips dangerous tags and attributes.
 * No external dependency. Covers: <script>, <iframe>, <object>, <embed>,
 * <form>, <input>, on* event handlers, javascript: URLs.
 */
function sanitizeHtml(html: string): string {
  // First: decode HTML entities that could bypass checks (&#58; → :, &#x6A; → j, etc.)
  const decoded = html.replace(/&#x?[0-9a-fA-F]+;/g, (match) => {
    const el = typeof document !== "undefined" ? document.createElement("span") : null
    if (el) { el.innerHTML = match; return el.textContent || "" }
    // Server-side fallback: decode common numeric entities
    const hex = match.startsWith("&#x")
    const num = hex ? parseInt(match.slice(3, -1), 16) : parseInt(match.slice(2, -1), 10)
    return isNaN(num) ? match : String.fromCharCode(num)
  })

  return decoded
    // Remove <script>...</script> (including content)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    // Remove self-closing <script/>
    .replace(/<script\b[^>]*\/?>/gi, "")
    // Remove <iframe>, <object>, <embed>, <form>, <input>, <style>, <svg>, <math> tags (with content)
    .replace(/<(iframe|object|embed|form|input|style|svg|math)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
    // Remove self-closing variants
    .replace(/<(iframe|object|embed|form|input|style|svg|math)\b[^>]*\/?>/gi, "")
    // Remove on* event attributes — handle whitespace/tab variations
    .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    // Remove javascript: URLs in any attribute (href, src, action, etc.) — case-insensitive, whitespace-tolerant
    .replace(/(href|src|action|formaction|xlink:href)\s*=\s*(?:"[^"]*javascript\s*:[^"]*"|'[^']*javascript\s*:[^']*')/gi, '$1=""')
    // Remove data: URLs in src (potential SVG/HTML injection)
    .replace(/src\s*=\s*(?:"data:(?:text\/html|image\/svg)[^"]*"|'data:(?:text\/html|image\/svg)[^']*')/gi, 'src=""')
}

/**
 * Strip markdown formatting to get plain text (for clipboard copy).
 */
export function stripMarkdown(md: string): string {
  return md
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/^>\s+/gm, "")
    .replace(/^[-*]\s+/gm, "- ")
    .replace(/^\d+\.\s+/gm, (match) => match)
    .replace(/^---$/gm, "")
    .replace(/\|/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

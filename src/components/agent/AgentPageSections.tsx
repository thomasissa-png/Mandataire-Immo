/**
 * Composants des 6 sections de la landing page mandataire /agent/[slug].
 * Server Components — reçoivent les données en props, zéro état client.
 */
import type { AgentProfile, AgentBienSummary } from "@/types/agent"

// ─── Helpers ────────────────────────────────────────────────────────

/** Génère les initiales pour l'avatar fallback */
function getInitials(prenom: string, nom: string): string {
  return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase()
}

/** Sépare une string par virgule en tableau, filtre les vides */
function splitList(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

/** Formate un prix en EUR */
function formatPrice(prix: number): string {
  return prix.toLocaleString("fr-FR") + " \u20ac"
}

// ─── 1. HeroSection ────────────────────────────────────────────────

interface HeroProps {
  profile: AgentProfile
}

export function HeroSection({ profile }: HeroProps) {
  const rawAccroche = profile.bio_generee
    ? profile.bio_generee.split(".")[0] + "."
    : profile.bio_personnelle
      ? profile.bio_personnelle.split(".")[0] + "."
      : ""
  const accroche = rawAccroche.length > 120
    ? rawAccroche.slice(0, 117).replace(/\s+\S*$/, "") + "…"
    : rawAccroche

  return (
    <section className="bg-primary text-white section-padding">
      <div className="container-immocrew flex flex-col items-center text-center gap-6">
        {/* Photo ou initiale */}
        {profile.photo_profil_key ? (
          <img
            src={`/api/images/${encodeURIComponent(profile.photo_profil_key)}`}
            alt={`Photo de ${profile.prenom} ${profile.nom}`}
            className="w-28 h-28 rounded-full object-cover border-4 border-secondary shadow-lg"
          />
        ) : (
          <div
            className="w-28 h-28 rounded-full bg-secondary flex items-center justify-center border-4 border-white/20 shadow-lg"
            aria-hidden="true"
          >
            <span className="font-display text-display-lg text-primary font-bold">
              {getInitials(profile.prenom, profile.nom)}
            </span>
          </div>
        )}

        {/* Nom + réseau badge */}
        <div>
          <h1 className="text-display-lg tablet:text-display-xl text-white mb-2">
            {profile.prenom} {profile.nom}
          </h1>
          {profile.reseau && (
            <span className="inline-block bg-secondary/20 text-secondary px-4 py-1 rounded-full text-body-sm font-semibold">
              Mandataire {profile.reseau}
            </span>
          )}
        </div>

        {/* Ville + accroche */}
        {profile.ville && (
          <p className="text-body-lg text-neutral-300">
            {profile.ville}
            {profile.departement ? ` (${profile.departement})` : ""}
          </p>
        )}
        {accroche && (
          <p className="text-body-lg text-white/80 max-w-2xl">{accroche}</p>
        )}

        {/* CTA rapide : téléphone + email */}
        <div className="flex flex-col tablet:flex-row items-center gap-3 mt-2">
          {profile.telephone && (
            <a
              href={`tel:${profile.telephone.replace(/\s/g, "")}`}
              className="inline-flex h-11 px-6 items-center gap-2 rounded-full bg-white text-primary font-display font-bold text-body-sm shadow-sm hover:bg-neutral-100 active:scale-[0.97] transition-all duration-normal"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              Appeler
            </a>
          )}
          <a
            href="#contact"
            className="inline-flex h-11 px-6 items-center gap-2 rounded-full bg-secondary text-primary font-display font-bold text-body-sm shadow-sm hover:bg-secondary-600 hover:text-white active:scale-[0.97] transition-all duration-normal"
          >
            Me contacter
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── 2. QuiSuisJeSection ──────────────────────────────────────────

interface QuiSuisJeProps {
  profile: AgentProfile
  bioGeneree: string | null
}

export function QuiSuisJeSection({ profile, bioGeneree }: QuiSuisJeProps) {
  const bio = bioGeneree || profile.bio_personnelle
  const valeurs = splitList(profile.valeurs)
  const hasStats = profile.experience_annees || profile.nb_transactions_an

  if (!bio && valeurs.length === 0 && !hasStats) return null

  return (
    <section className="section-padding bg-card">
      <div className="container-immocrew max-w-3xl">
        <h2 className="text-h2 font-display text-primary mb-8">Qui suis-je</h2>

        {/* Bio */}
        {bio && (
          <p className="text-body-lg text-foreground leading-relaxed mb-8 whitespace-pre-line">
            {bio}
          </p>
        )}

        {/* Stats : expérience + transactions */}
        {hasStats && (
          <div className="flex flex-wrap gap-8 mb-8">
            {profile.experience_annees && (
              <div className="text-center">
                <p className="text-display-lg font-display text-secondary font-bold">
                  {profile.experience_annees}
                </p>
                <p className="text-caption text-muted-foreground">ans d'expérience</p>
              </div>
            )}
            {profile.nb_transactions_an && (
              <div className="text-center">
                <p className="text-display-lg font-display text-secondary font-bold">
                  {profile.nb_transactions_an}
                </p>
                <p className="text-caption text-muted-foreground">transactions / an</p>
              </div>
            )}
          </div>
        )}

        {/* Valeurs (badges) */}
        {valeurs.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {valeurs.map((v) => (
              <span
                key={v}
                className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-body-sm font-medium"
              >
                {v}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// ─── 3. MaZoneSection ─────────────────────────────────────────────

interface MaZoneProps {
  profile: AgentProfile
}

export function MaZoneSection({ profile }: MaZoneProps) {
  const quartiers = splitList(profile.quartiers)
  const specialites = splitList(profile.specialites)
  const typeBiens = splitList(profile.type_biens)

  const hasContent =
    profile.departement || quartiers.length > 0 || specialites.length > 0 || typeBiens.length > 0 || profile.gamme_prix

  if (!hasContent) return null

  return (
    <section className="section-padding">
      <div className="container-immocrew max-w-3xl">
        <h2 className="text-h2 font-display text-primary mb-8">Ma zone et mes spécialités</h2>

        <div className="grid grid-cols-1 tablet:grid-cols-2 gap-8">
          {/* Zone géographique */}
          {(profile.departement || quartiers.length > 0) && (
            <div>
              <h3 className="text-h4 font-display text-foreground mb-3">Zone géographique</h3>
              {profile.departement && (
                <p className="text-body text-muted-foreground mb-2">
                  Département : <span className="text-foreground font-medium">{profile.departement}</span>
                </p>
              )}
              {quartiers.length > 0 && (
                <div>
                  <p className="text-body text-muted-foreground mb-2">Quartiers :</p>
                  <div className="flex flex-wrap gap-2">
                    {quartiers.map((q) => (
                      <span
                        key={q}
                        className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-body-sm"
                      >
                        {q}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Spécialités */}
          {(specialites.length > 0 || typeBiens.length > 0 || profile.gamme_prix) && (
            <div>
              <h3 className="text-h4 font-display text-foreground mb-3">Spécialités</h3>
              {specialites.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2">
                    {specialites.map((s) => (
                      <span
                        key={s}
                        className="bg-secondary/10 text-secondary-700 px-3 py-1 rounded-full text-body-sm font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {typeBiens.length > 0 && (
                <p className="text-body text-muted-foreground mb-2">
                  Types de biens : <span className="text-foreground font-medium">{typeBiens.join(", ")}</span>
                </p>
              )}
              {profile.gamme_prix && (
                <p className="text-body text-muted-foreground">
                  Gamme de prix : <span className="text-foreground font-medium">{profile.gamme_prix}</span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── 4. MesBiensSection ──────────────────────────────────────────

interface MesBiensProps {
  biens: AgentBienSummary[]
}

export function MesBiensSection({ biens }: MesBiensProps) {
  return (
    <section className="section-padding bg-card">
      <div className="container-immocrew">
        <h2 className="text-h2 font-display text-primary mb-8">Mes biens en vente</h2>

        {biens.length === 0 ? (
          <div className="rounded-xl border border-border bg-background p-8 text-center max-w-md mx-auto">
            <svg className="w-10 h-10 text-neutral-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
            </svg>
            <p className="text-body text-muted-foreground mb-3">
              Aucun bien en vente actuellement — contactez-moi pour discuter de votre projet.
            </p>
            <a
              href="#contact"
              className="inline-flex h-10 px-5 items-center rounded-full bg-primary text-white font-display font-bold text-body-sm hover:bg-primary-700 transition-colors shadow-sm"
            >
              Me contacter →
            </a>
          </div>
        ) : (

        <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-6">
          {biens.map((bien) => {
            const photo =
              bien.photos_staging.length > 0
                ? bien.photos_staging[0].url
                : bien.photos_originales.length > 0
                  ? bien.photos_originales[0].url
                  : null

            const href = bien.slug ? `/bien/${bien.slug}` : `/bien/${bien.id}`

            return (
              <a
                key={bien.id}
                href={href}
                className="group block rounded-xl border border-border bg-background overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-normal"
              >
                {/* Photo */}
                {photo ? (
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={photo}
                      alt={bien.titre_annonce || bien.titre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-normal"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-neutral-100 flex items-center justify-center">
                    <svg className="w-12 h-12 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
                    </svg>
                  </div>
                )}

                {/* Infos */}
                <div className="p-4">
                  <h3 className="text-body font-semibold text-foreground mb-1 line-clamp-1">
                    {bien.titre_annonce || bien.titre}
                  </h3>
                  <p className="text-body-sm text-muted-foreground mb-2">
                    {bien.type_bien} &middot; {bien.pieces} pièces &middot; {bien.surface} m²
                    {bien.city ? ` · ${bien.city}` : ""}
                  </p>
                  <p className="text-h4 font-display text-secondary font-bold">
                    {formatPrice(bien.prix)}
                  </p>
                </div>
              </a>
            )
          })}
        </div>

        )}
      </div>
    </section>
  )
}

// ─── 5. ContactSection ───────────────────────────────────────────

interface ContactProps {
  profile: AgentProfile
  email: string
}

export function ContactSection({ profile, email }: ContactProps) {
  const tagline = profile.ce_qui_te_differencie

  return (
    <section id="contact" className="section-padding bg-primary">
      <div className="container-immocrew text-center max-w-2xl">
        <h2 className="text-h2 font-display text-white mb-4">Me contacter</h2>

        {tagline ? (
          <p className="text-body-lg text-white/80 mb-8">{tagline}</p>
        ) : (
          <p className="text-body-lg text-white/80 mb-8">Parlons de votre projet immobilier</p>
        )}

        <div className="flex flex-col tablet:flex-row items-center justify-center gap-4">
          {profile.telephone && (
            <a
              href={`tel:${profile.telephone.replace(/\s/g, "")}`}
              className="inline-flex h-12 px-8 items-center gap-2 rounded-full bg-white text-primary font-display font-bold text-body shadow-sm hover:bg-neutral-100 hover:shadow-md active:scale-[0.97] transition-all duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              Appeler
            </a>
          )}

          <a
            href={`mailto:${email}?subject=Prise de contact — ${profile.prenom} ${profile.nom}`}
            className="inline-flex h-12 px-8 items-center gap-2 rounded-full bg-secondary text-primary font-display font-bold text-body shadow-sm hover:bg-secondary-600 hover:shadow-md active:scale-[0.97] transition-all duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            Envoyer un email
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── 6. ReseauxSection ───────────────────────────────────────────

interface ReseauxProps {
  profile: AgentProfile
}

export function ReseauxSection({ profile }: ReseauxProps) {
  const links = [
    { url: profile.linkedin_url, label: "LinkedIn", icon: LinkedInIcon },
    { url: profile.instagram, label: "Instagram", icon: InstagramIcon },
    { url: profile.facebook, label: "Facebook", icon: FacebookIcon },
    { url: profile.site_web, label: "Site web", icon: GlobeIcon },
  ].filter((l) => l.url.trim() !== "")

  if (links.length === 0) return null

  return (
    <section className="section-padding">
      <div className="container-immocrew text-center">
        <h2 className="text-h2 font-display text-primary mb-8">Mes réseaux</h2>

        <div className="flex justify-center gap-6">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg p-2"
            >
              <span className="w-12 h-12 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center group-hover:bg-primary-100 transition-colors duration-normal">
                <link.icon />
              </span>
              <span className="text-caption text-muted-foreground group-hover:text-primary-700 transition-colors">
                {link.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── SVG Icons (inline, pas de lib externe) ─────────────────────

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

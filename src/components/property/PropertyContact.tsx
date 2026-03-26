interface PropertyContactProps {
  nom: string | null
  email: string | null
  telephone: string | null
  titre_bien: string
}

/**
 * CTA de contact mandataire en bas de page bien.
 * Liens directs : email (mailto) et telephone (tel).
 */
export function PropertyContact({
  nom,
  email,
  telephone,
  titre_bien,
}: PropertyContactProps) {
  const emailSubject = encodeURIComponent(`Demande d'information — ${titre_bien}`)
  const emailBody = encodeURIComponent(
    `Bonjour${nom ? ` ${nom}` : ""},\n\nJe suis interesse(e) par le bien "${titre_bien}". Pourriez-vous me donner plus d'informations ?\n\nCordialement`
  )

  return (
    <div className="text-center text-white">
      <h2 className="text-h2 text-white mb-4">Interesse par ce bien ?</h2>
      <p className="text-body-lg text-neutral-300 mb-8">
        {nom
          ? `Contactez ${nom} directement pour organiser une visite.`
          : "Contactez le mandataire directement pour organiser une visite."}
      </p>

      <div className="flex flex-col tablet:flex-row gap-4 justify-center">
        {telephone && (
          <a
            href={`tel:${telephone}`}
            className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-600 text-white font-medium px-8 py-4 rounded-lg text-body-lg transition-colors"
          >
            <PhoneIcon />
            {telephone}
          </a>
        )}
        {email && (
          <a
            href={`mailto:${email}?subject=${emailSubject}&body=${emailBody}`}
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-8 py-4 rounded-lg text-body-lg transition-colors border border-white/20"
          >
            <EmailIcon />
            Envoyer un email
          </a>
        )}
      </div>
    </div>
  )
}

function PhoneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

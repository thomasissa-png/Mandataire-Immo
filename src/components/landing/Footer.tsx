export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary-800 text-background">
      <div className="container-immocrew py-12 desktop:py-16">
        <div className="desktop:flex desktop:items-start desktop:justify-between desktop:gap-12">
          {/* Logo + tagline */}
          <div className="mb-8 desktop:mb-0">
            <a href="/" className="font-display text-h2 font-bold text-background hover:opacity-80 transition-opacity duration-normal">
              ImmoCrew
            </a>
            <p className="text-body-sm text-primary-200 mt-2 max-w-xs">
              L&apos;&eacute;quipe marketing des mandataires immobiliers.
            </p>
          </div>

          {/* Liens */}
          <div className="flex flex-wrap gap-8 desktop:gap-16">
            <div>
              <h4 className="font-display text-h6 text-primary-200 uppercase tracking-widest mb-3">
                Produit
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#piliers"
                    className="text-body-sm text-background hover:text-secondary transition-colors duration-normal"
                  >
                    Comment &ccedil;a marche
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-body-sm text-background hover:text-secondary transition-colors duration-normal"
                  >
                    Tarifs
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="text-body-sm text-background hover:text-secondary transition-colors duration-normal"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-display text-h6 text-primary-200 uppercase tracking-widest mb-3">
                L&eacute;gal
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/cgv"
                    className="text-body-sm text-background hover:text-secondary transition-colors duration-normal"
                  >
                    CGV
                  </a>
                </li>
                <li>
                  <a
                    href="/confidentialite"
                    className="text-body-sm text-background hover:text-secondary transition-colors duration-normal"
                  >
                    Politique de confidentialit&eacute;
                  </a>
                </li>
                <li>
                  <a
                    href="/mentions-legales"
                    className="text-body-sm text-background hover:text-secondary transition-colors duration-normal"
                  >
                    Mentions l&eacute;gales
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-display text-h6 text-primary-200 uppercase tracking-widest mb-3">
                Contact
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="mailto:contact@immocrew.fr"
                    className="text-body-sm text-background hover:text-secondary transition-colors duration-normal"
                  >
                    contact@immocrew.fr
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Separator + Copyright */}
        <div className="mt-10 pt-6 border-t border-primary-600">
          <p className="text-caption text-primary-200 text-center">
            &copy; {currentYear} ImmoCrew. Tous droits r&eacute;serv&eacute;s.
          </p>
        </div>
      </div>
    </footer>
  )
}

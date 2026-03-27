# Préférences Fondateur — Thomas

> Source de vérité pour @moi. Mis à jour après chaque session.
> Dernière mise à jour : 2026-03-26, session 5.

## Pricing & Business

- **Prix ronds obligatoires** : pas de charm pricing "en 7" (497/197/97). Les prix doivent être ronds (400/150/100) car le positionnement "zero bullshit" interdit les artifices de manipulation psychologique. La cohérence de marque prime sur l'optimisation tarifaire.
- **Sophie résiliée = plus d'accès** : les livrables sont liés à l'abonnement actif. Si Sophie résilie, elle ne peut plus voir ses livrables. C'est une décision business, pas un bug.
- **Admin valide avant automatisation** : le flow de production reste déclenché manuellement par l'admin (/admin) pour l'instant. L'automatisation complète (/api/auto-produce) est prête mais désactivée.

## Branding & Communication

- **JAMAIS de concurrent nommé** : pas de "Cocoon-Immo", pas de nom de service concurrent sur le site. Utiliser des catégories ("freelance marketing", "outil avec templates", "plateforme SaaS").
- **Seuil qualité 10/10 exigé** : Thomas refuse la notion de MVP. Chaque écran, chaque composant doit être au niveau d'un SaaS premium (Notion, Linear). Les agents ne doivent JAMAIS valider un composant UI sans se demander "Sophie serait-elle FIÈRE de montrer ça ?". Un div coloré vide n'est pas une bannière. Une liste plate n'est pas un dashboard. Chaque critère doit être à 9+ individuellement, pas en moyenne.
- **Pas de MVP, qualité production** : "On est sur un produit de qualité qu'on veut mettre à disposition." Les composants génériques (listes plates, texte brut, stats basiques, blocs vides) sont inacceptables. Chaque composant doit avoir des visuels (icônes, patterns), une structure logique, et du feedback sur chaque interaction.
- **Dashboard = coach marketing, pas bibliothèque** : le dashboard doit commencer par un résumé personnalisé ("voici ce qu'on a compris sur toi") puis un plan d'action structuré (mets à jour tes bios, publie 3 posts/semaine, tourne tes vidéos). Chaque section avec conseils + liens vers articles blog. La valeur ajoutée c'est le coaching, pas juste le contenu.
- **Profil compact, pas de gros bloc bleu** : avatar inline 64px + nom à côté. Pas de bannière plein-largeur de 144px. Infos métier en pills horizontales. TOUS les réseaux sociaux (Instagram, Facebook, LinkedIn, site web), pas juste LinkedIn.
- **Annonces liées aux biens** : si Sophie donne ses biens à l'onboarding, les annonces doivent être générées spécifiquement pour SES biens, pas des annonces génériques.
- **Accents français obligatoires** : tous les textes visibles doivent avoir les accents corrects. Utiliser des vrais caractères UTF-8 (é, è, à, ç), jamais des escapes unicode (\u00E9) dans les constantes JS.

## UX & Design

- **Modal pour l'auth** : pas de page pleine. Le modal popup s'ouvre par-dessus la page actuelle, fermable avec X, clic dehors, Escape.
- **Header + Footer sur les pages auth** : les pages /sign-in et /sign-up gardent le Header + Footer pour la cohérence de navigation. Sophie ne doit jamais perdre ses repères.
- **Pas de duplication d'info** : si Sophie donne son prénom/nom à l'inscription, l'onboarding les pré-remplit. Ne jamais redemander une information déjà fournie.
- **LinkedIn plutôt que questionnaire** : préfère demander un lien LinkedIn plutôt que 3 champs texte pour l'histoire personnelle. Sophie ne racontera pas son parcours entre deux visites.

## Technique

- **NextAuth.js plutôt que Clerk** : auth locale, zero dépendance externe. Clerk causait des erreurs serveur et la dépendance externe ajoutait un point de défaillance.
- **Tout doit être automatisé** : la production de contenu, la publication d'articles SEO (cron 2x/semaine), le recyclage du contenu en posts sociaux. Un fondateur solo ne peut pas produire manuellement.
- **Object Storage pour la persistance** : les fichiers générés (articles cron) doivent être sauvegardés en Object Storage en plus du filesystem (ephémère sur Replit).

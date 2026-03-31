# Préférences Fondateur — Thomas

> Source de vérité pour @moi. Mis à jour après chaque session.
> Dernière mise à jour : 2026-03-31, session 9.

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
- **Upload photos + annonces complètes** : Sophie doit pouvoir uploader 3-10 photos de ses biens depuis son dashboard et recevoir une annonce complète (texte storytelling + photos intégrées) prête à copier-coller sur SeLoger/LeBonCoin en 30 secondes. Avec un lien web partageable vers la page publique du bien. C'est la prochaine priorité absolue.
- **Persona Sophie = utilisatrice réelle, pas évaluatrice** : l'agent @mandataire doit simuler 10 scénarios d'usage concrets (copier un post, ajouter un bien, passer au mensuel, signaler un problème) au lieu de noter des critères abstraits. Si un scénario est impossible (pas de bouton), c'est un FAIL à 0/10.
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
- **Umami Cloud, pas PostHog** : tracking analytics = Umami Cloud uniquement. Ne jamais proposer PostHog, Plausible, GA4 ou autre sauf demande explicite. Website ID : 533b1471-2f40-41dd-8754-02fa0f0615f8.

## Calibration qualité

- **Zéro fausse promesse** : si le texte dit "on récupère tout automatiquement", la fonctionnalité DOIT exister. Pas de promesse sans implémentation, même en V1. Mieux vaut reformuler honnêtement que mentir.
- **Agents persona = calibrés sur la VALEUR** : un agent testeur qui valide le code mais pas la valeur est inutile. La recalibration de @mandataire (S7) a fait passer le score de 9/10 à 6/10 — aligné avec les vrais problèmes. Thomas exige que TOUS les agents persona de TOUS les projets aient cette calibration. C'est le learning le plus important du framework.
- **Le plan du mois doit être un COACH** : dire SUR QUELLE PLATEFORME publier, POURQUOI ces horaires, donner des LIENS vers des articles, un ORDRE de priorité. Pas juste "publie 3 posts/semaine". Thomas compare au niveau Notion/Linear.
- **Dashboard = SaaS premium** : pas de liste plate, pas de blocs vides, pas de todo liste générique. Sidebar desktop, navigation sticky mobile, sections avec sous-titres explicatifs, doublons dédupliqués.
- **Si on promet quelque chose à Sophie, on le crée** : landing personnalisée, scraping lien annonce, calendrier visuel — si c'est dans le produit ou la landing, ça doit exister dans le dashboard.
- **Espacements compacts, pas décoratifs** : les sections trop espacées donnent une impression de vide, pas de premium. Les paddings de section doivent être py-8/py-12/py-16 (pas py-12/py-16/py-24). Signalé 2+ fois sur plusieurs sites.
- **Cohérence visuelle dashboard** : toutes les pages dashboard doivent avoir le même layout (DashboardPageLayout). Thomas le signale comme friction récurrente si chaque page a son propre titre/style.
- **Pas d'annonces sans biens** : générer des annonces fictives pour un client sans biens réels est inutile et décrédibilise le service. La génération doit être conditionnée à la présence de vrais biens.
- **Règle n°4 absolue** : TOUJOURS déléguer aux agents spécialisés, même si un timeout risque. Relancer l'agent plutôt que prendre le relais manuellement. Thomas y tient expressément.

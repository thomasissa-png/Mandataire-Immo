# ImmoCrew vs Versiroom -- Comparaison terrain (Sophie, mandataire IAD Angers)

Date : 2026-03-25

---

## 1. Comparaison des annonces

| Critere | ImmoCrew | Versiroom | Gagnant |
|---------|----------|-----------|---------|
| **Qualite texte** | Storytelling long, immersif, ton humain. Structure editoriale complete (quartier, bien, quotidien, chiffres, CTA). ~500 mots. | 2-3 phrases factuelles generees par GPT-4.1-mini (200 tokens max). Sobre, fiche technique. | **ImmoCrew** -- ecart majeur |
| **Personnalisation locale** | Cite La Doutre, la rue Beaurepaire, le marche de la Trinite, l'ecole Saint-Nicolas, le tramway Confluent, la boulangerie Daveau. Ancrage reel. | Mentionne le quartier et l'adresse transmis en input, sans connaissance locale. | **ImmoCrew** -- net |
| **Donnees verifiees (DVF, DPE)** | Prix au m2 cite (2 720 EUR) mais sans source DVF. DPE "non communique". Pas de pipeline de donnees publiques. | Structure Property integre `dvf_median_price_m2`, `dvf_period`, `dpe_classe`, `ges_classe`, geocoding BAN. Pipeline d'enrichissement automatique. | **Versiroom** -- donnees structurees |
| **Pret a publier** | Texte publiable tel quel sur SeLoger/LeBonCoin apres ajustement longueur. | Description trop courte pour une annonce complete. Sert de base a une fiche marchand, pas a une publication portail. | **ImmoCrew** -- texte actionnable |
| **Hebergement + partage** | Pas de page web dediee au bien dans le code actuel. | Dossier genere par bien avec photos avant/apres, description, carte. Partage possible. | **Versiroom** -- infra existante |

**Synthese** : ImmoCrew gagne sur le contenu textuel (qualite, ton, ancrage local). Versiroom gagne sur les donnees structurees et l'infrastructure technique (DVF, DPE, geocoding, hebergement par bien).

---

## 2. Visuels Versiroom -- Avis Sophie

**Utilite pour mon quotidien ?**
Oui, clairement. 80% de mes mandats sont des biens vides ou mal meublis. Quand je publie une annonce avec des photos de pieces vides, les clics sont 2x moins nombreux. Le home staging virtuel, ca change la premiere impression.

**Pour quels biens ?**
Les biens vides a la vente, surtout T2/T3 dans l'ancien. Aussi les biens en travaux ou je veux montrer le potentiel. En revanche, pour un bien deja meuble et propre, ca ne sert a rien.

**Combien je paierais ?**
5-10 EUR par bien pour 3-5 visuels home-stagues serait acceptable. Au-dela de 15 EUR le bien, je reflechis. A 30 EUR, non -- un photographe avec matterport me coute 150 EUR mais il fait tout.

**Ca remplace un photographe ?**
Non. Ca remplace le home staging physique (meubles en carton, location de mobilier a 500 EUR/mois). Le photographe reste necessaire pour les prises de vue initiales de qualite. Mais ca democratise le staging pour des biens ou je n'aurais jamais investi dans du staging reel.

**Mes craintes ?**
- Que le meuble genere ne corresponde pas a la taille reelle de la piece (canape trop grand, mauvaises proportions)
- Obligation legale de mentionner "photo non contractuelle / home staging virtuel" -- certains acheteurs se sentent trompes
- Dependance a une API externe : si OpenAI coupe ou triple les prix, je fais quoi ?

**Note interet : 7/10** -- Utile et concret, mais pas transformatif. C'est un "nice to have" qui devient "must have" seulement si le prix est bas et la qualite fiable.

---

## 3. Synergie -- Si les 2 etaient combines

**Ce que ca donnerait :**
Un workflow complet mandataire : (1) je saisis l'adresse, (2) enrichissement auto DVF + DPE + carte, (3) je uploade mes photos, (4) home staging IA sur les photos, (5) annonce storytelling generee avec les donnees verifiees injectees, (6) page web dediee au bien avec visuels avant/apres + texte + carte + CTA visite. Un "dossier de vente digital" cle en main.

**Ca vaudrait un premium ?**
Oui. Un tel outil justifie 19-29 EUR/mois en SaaS. C'est le genre d'outil que IAD ou MegAgent pourrait imposer a son reseau. La combinaison "visuels + texte + donnees" est rare sur le marche -- les outils existants font l'un OU l'autre, jamais les trois.

**Les 3 features Versiroom qui manquent le plus a ImmoCrew :**

1. **Enrichissement DVF/DPE automatique** -- Le pipeline `enrich-property` de Versiroom (geocoding BAN + DVF + carte) elimine les "a confirmer" et "non communique" qui plombent l'annonce ImmoCrew
2. **Home staging visuel** -- ImmoCrew n'a aucune composante image. Pour une annonce immobiliere, le texte seul ne suffit pas.
3. **Page web hebergee par bien** -- Versiroom a une notion de "dossier" partabeable. ImmoCrew genere du texte brut JSON sans support de diffusion.

---

## 4. Recommandations techniques (@ia)

- **Integrer un pipeline d'enrichissement adresse** : geocoding BAN + API DVF (open data) + DPE ADEME. Injecter les donnees verifiees dans le prompt de generation d'annonce pour eliminer les champs "a confirmer". Cout API : 0 EUR (APIs publiques).

- **Ajouter la generation d'images home staging** : utiliser gpt-image-1 (OpenAI) en primaire avec Replicate SDXL en fallback, comme Versiroom. Budget : ~0.04-0.08 USD/image. Limiter a 5 images/bien pour controler les couts.

- **Creer une page web par bien** : route `/bien/[id]` avec visuels avant/apres, annonce storytelling, carte Leaflet, donnees DVF/DPE, CTA contact Sophie. Cout marginal sur l'hebergement existant.

- **Upgrader le prompt d'annonce** : passer de 200 tokens (Versiroom) au format storytelling ImmoCrew, mais en injectant les donnees DVF/DPE comme variables de contexte. Utiliser Claude Sonnet (meilleur ratio qualite/cout pour du redactionnel long) au lieu de GPT-4.1-mini.

- **Prevoir un mode export portail** : generateur de versions courtes (SeLoger 1500 car.) et longues (site perso) a partir de la meme annonce source, pour eviter a Sophie le copier-coller-raccourcir manuel.

---

*Rapport produit par @ia en posture Sophie (mandataire IAD) + expertise technique IA.*

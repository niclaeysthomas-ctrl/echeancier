/* L'ÉCHÉANCIER — LE MANUEL : l'essentiel de la vie d'adulte.
   Contenu = données pures (MANUEL), rendu plus bas. Le texte des fiches est écrit ici,
   il est de confiance : il peut contenir du <b>. Seul ce que Thomas tape passe par esc(). */

const MAN_MAJ = "septembre 2026";

/* blocs :
   ["p", html]                      paragraphe
   ["h", titre]                     sous-titre
   ["l", [items]]                   liste à puces
   ["n", [items]]                   liste numérotée (des étapes, dans l'ordre)
   ["e", titre, html]               encart rouge — le piège
   ["g", titre, html]               encart vert — ton droit
   ["b", titre, html]               encart bleu — l'astuce
   ["chif", [[valeur, quoi, note]]] chiffres-clés
   ["num", [[numéro, quoi]]]        numéros / sites
*/

const MANUEL = [

/* ═══════════ 1. IMPÔTS ═══════════ */
{ id: "imp", e: "🧾", t: "Impôts", sub: "Ce que l’État attend de toi, et quand", fiches: [

  { id: "imp-base", t: "Ta première déclaration", r: "Déclarer ≠ payer. Même à 0 €, tu as intérêt à déclarer.",
    kw: "impots gouv declaration revenus avis imposition numero fiscal", bl: [
    ["p", "Dès que tu n’es plus rattaché au foyer fiscal de tes parents, tu dois déclarer tes revenus <b>chaque année, même s’ils sont nuls</b>. Ce n’est pas une formalité vide : la déclaration produit ton <b>avis d’imposition</b>, et cet avis est le papier que tout le monde va te réclamer."],
    ["h", "Pourquoi l’avis d’imposition est le document le plus utile de ta vie administrative"],
    ["l", ["Un propriétaire ou une résidence te le demande pour louer.",
           "La CAF, les bourses, les aides au logement s’appuient dessus.",
           "Une banque te le demande pour un prêt ou parfois pour ouvrir un compte.",
           "Certaines démarches (aide juridictionnelle, tarifs sociaux, CSS santé) n’existent que si tu peux prouver tes revenus."]],
    ["e", "Le piège", "Ne rien déclarer parce qu’on n’a « rien gagné », puis se retrouver sans avis d’imposition au moment de louer un appart. On appelle ça un <b>avis de situation déclarative</b> : sans déclaration, il n’existe pas."],
    ["h", "Le calendrier"],
    ["l", ["La campagne s’ouvre en <b>avril</b>, la date limite tombe entre <b>fin mai et début juin</b> selon ton département (3 zones).",
           "Tout se passe sur <b>impots.gouv.fr</b>, avec ton <b>numéro fiscal</b> (13 chiffres). Tu l’obtiens sur le 1ᵉʳ avis de tes parents où tu figures, ou en le demandant au centre des finances publiques.",
           "Si l’administration connaît déjà tout de tes revenus, tu reçois une <b>déclaration automatique</b> : tu vérifies, et tu ne valides que s’il y a quelque chose à corriger."]],
    ["g", "Tu peux corriger", "Après l’envoi, un service de <b>correction en ligne</b> ouvre à l’automne. Et même après, tu peux faire une <b>réclamation</b> jusqu’au 31 décembre de la 2ᵉ année suivante. Une erreur de déclaration n’est presque jamais irréparable."],
    ["b", "L’astuce", "Crée ton espace particulier <b>avant</b> d’en avoir besoin, et note ton numéro fiscal dans ton carnet (dernier onglet du Manuel). Le jour où une agence te demande ton avis un vendredi soir, tu le télécharges en 30 secondes."]],
    todo: [["imp-espace", "Créer mon espace sur impots.gouv.fr"], ["imp-num", "Noter mon numéro fiscal dans le carnet"]],
    voir: ["imp-ratt", "pap-garder"] },

  { id: "imp-ratt", t: "Rattaché à tes parents, ou pas ?", r: "C’est un calcul, pas une évidence. Fais-le à deux, une fois par an.",
    kw: "rattachement foyer fiscal parents demi part pension alimentaire quotient", bl: [
    ["p", "Tant que tu as <b>moins de 25 ans au 1ᵉʳ janvier et que tu es étudiant</b>, tu peux choisir : rester sur la déclaration de tes parents, ou déclarer seul. Les deux options sont légales, elles n’ont juste pas le même coût — et le coût n’est pas toujours pour toi."],
    ["h", "Ce que ça change"],
    ["l", ["<b>Rattaché</b> : tes revenus s’ajoutent à ceux de tes parents, mais leur foyer gagne une demi-part (ou une part). Leur impôt baisse — l’avantage est <b>plafonné</b> (de l’ordre de 1 800 € par demi-part ces dernières années).",
           "<b>Détaché</b> : tu as ton propre foyer, ton propre avis d’imposition, et tes revenus ne gonflent pas l’impôt de tes parents. En contrepartie, ils perdent la demi-part.",
           "<b>Troisième voie</b> : tu te détaches et tes parents déduisent la <b>pension alimentaire</b> qu’ils te versent (plafond annuel par enfant, révisé chaque année). Souvent le meilleur montage quand ils sont bien imposés et qu’ils t’aident vraiment."]],
    ["e", "Le piège", "Décider seul dans son coin. Le rattachement se joue sur <b>deux déclarations à la fois</b> : la bonne question n’est pas « qu’est-ce qui m’arrange », c’est « combien la famille paie au total dans chaque scénario ». Fais le calcul avec eux, sur le simulateur d’impots.gouv.fr, avant la date limite."],
    ["b", "L’astuce", "Le simulateur officiel est gratuit et anonyme. Simule les 3 scénarios en 20 minutes : c’est parfois plusieurs centaines d’euros d’écart, une fois par an, pour un quart d’heure de travail."],
    ["g", "Ça ne se répète pas", "Le choix se refait <b>chaque année</b>. Être rattaché une année ne t’engage pas pour la suivante — et au premier vrai salaire, le calcul bascule en général."]],
    voir: ["imp-job", "pap-caf"] },

  { id: "imp-job", t: "Job, stage, alternance : ce qui est imposable", r: "Beaucoup de tes revenus d’étudiant sont exonérés — mais il faut le demander.",
    kw: "job etudiant stage gratification alternance apprenti exoneration smic", bl: [
    ["p", "Tous les revenus ne se valent pas devant l’impôt. Trois régimes très favorables existent pour ton âge, et aucun ne s’applique automatiquement à 100 % : c’est <b>toi</b> qui indiques le bon montant dans la bonne case."],
    ["chif", [["3 SMIC mensuels", "job étudiant", "exonérés sur option si tu as moins de 26 ans au 1ᵉʳ janvier"],
              ["1 SMIC annuel", "stage", "la gratification est exonérée jusqu’à ce plafond"],
              ["1 SMIC annuel", "apprentissage", "même logique pour un contrat d’apprentissage"]]],
    ["e", "Vérifie le chiffre de l’année", "Les plafonds suivent le SMIC et bougent tous les ans (on tourne autour de 5 200–5 500 € pour les 3 SMIC mensuels, et de 21 000–22 000 € pour le SMIC annuel). Le montant exact de <b>l’année concernée</b> est écrit noir sur blanc dans la notice de la déclaration."],
    ["h", "Ce qui n’est jamais exonéré"],
    ["l", ["Un CDD ou CDI classique, même court, hors dispositif job étudiant.",
           "La part de gratification de stage qui dépasse le plafond.",
           "Les revenus d’activité indépendante (auto-entrepreneur, cours particuliers déclarés, contenus monétisés) : eux, tu les déclares intégralement."]],
    ["g", "Cotisations sociales", "Une gratification de stage inférieure au minimum légal est aussi exonérée de <b>cotisations sociales</b> — c’est pour ça qu’un stage « payé 600 € » te verse bien ~600 € net. Un vrai salaire, lui, perd environ 22 % entre le brut et le net."],
    ["b", "L’astuce", "Garde tous tes bulletins et ta convention de stage. Si le fisc demande, c’est la seule preuve du régime que tu as appliqué — et les bulletins de salaire, on les garde <b>à vie</b> (retraite)."]],
    voir: ["job-stage", "pap-garder"] },

  { id: "imp-pas", t: "Le prélèvement à la source, en clair", r: "Ton taux est modifiable en ligne, en 3 minutes, quand ta situation change.",
    kw: "prelevement source taux neutre personnalise acompte remboursement", bl: [
    ["p", "Depuis 2019, l’impôt est prélevé <b>au fil de l’eau</b> : ton employeur applique un taux que le fisc lui transmet. Tu ne « paies plus l’impôt de l’an dernier », tu paies celui de l’année en cours — avec une régularisation l’été suivant."],
    ["h", "Les trois taux"],
    ["l", ["<b>Personnalisé</b> : calculé sur ta dernière déclaration. C’est celui par défaut.",
           "<b>Neutre (ou non personnalisé)</b> : le taux d’un célibataire sans revenus annexes. Utile si tu ne veux pas que ton employeur devine ta situation familiale — mais il est souvent plus élevé.",
           "<b>Individualisé</b> : pour les couples aux revenus déséquilibrés. Pas encore ton problème."]],
    ["g", "Tu peux faire baisser ton taux tout de suite", "Perte d’un job, fin d’alternance, revenus en baisse : dans ton espace impots.gouv.fr, <b>« Gérer mon prélèvement à la source »</b> → moduler. Le nouveau taux s’applique en un à deux mois. Inutile d’attendre la régularisation de l’été : c’est de la trésorerie que tu récupères maintenant."],
    ["e", "Le piège", "Le premier vrai salaire après des années d’études : le fisc n’a aucun historique, ton taux est souvent proche de 0, et l’ardoise arrive <b>un an et demi plus tard</b>, d’un coup. Si tu passes en CDI ou en alternance bien payée, mets de côté dès maintenant l’équivalent de ce que tu devrais payer, ou augmente volontairement ton taux."],
    ["b", "Relie-le à ton budget", "Un impôt qui tombe en septembre en quatre mensualités, c’est exactement ce que l’onglet Flux sait absorber : crée la ligne dès que tu connais le montant, l’app la lissera dans ta projection."]],
    voir: ["ban-decouvert"] },

  { id: "imp-autres", t: "Les autres prélèvements qui te tomberont dessus", r: "Tu paies déjà des impôts que tu ne vois pas. Sache lesquels.",
    kw: "tva csg taxe habitation fonciere redevance contributions", bl: [
    ["h", "Ceux que tu paies sans les voir"],
    ["l", ["<b>La TVA</b> : 20 % sur la plupart des achats, 10 % sur la restauration et les transports, 5,5 % sur l’alimentaire et les livres, 2,1 % sur les médicaments remboursés. Sur 100 € de courses, environ 5 € partent en TVA ; sur 100 € de matériel, environ 17 €.",
           "<b>La CSG / CRDS</b> : ~9,7 % prélevés sur les salaires (inclus dans l’écart brut-net) et ~17,2 % de prélèvements sociaux sur les revenus du capital — dont les intérêts d’une assurance-vie, mais <b>pas</b> ceux du Livret A ni du Livret Jeune, totalement nets.",
           "<b>Les taxes sur l’énergie et les carburants</b>, incluses dans le prix affiché."]],
    ["h", "Ceux qui apparaîtront plus tard"],
    ["l", ["<b>Taxe d’habitation</b> : supprimée sur la résidence principale. Elle reste due sur une <b>résidence secondaire</b> et, dans certains cas, sur un logement vacant.",
           "<b>Taxe foncière</b> : payée par le propriétaire, en octobre. Le jour où tu achètes, c’est une charge annuelle à budgéter (compte souvent l’équivalent d’un mois de loyer).",
           "<b>Redevance télé</b> : supprimée depuis 2022."]],
    ["b", "Ce qu’il faut en retenir", "Ton « taux d’imposition » réel n’est pas la ligne de l’avis d’imposition. Quand tu compares deux vies (salaire ici, salaire ailleurs, statut indépendant), compare ce qui reste <b>après tout</b>, pas le brut."]]}
]},

/* ═══════════ 2. BANQUE ═══════════ */
{ id: "ban", e: "🏦", t: "Banque & argent", sub: "Frais, fraude, découvert : tes droits sont chiffrés", fiches: [

  { id: "ban-fraude", t: "On m’a débité sans mon accord", r: "Fais opposition, conteste par écrit : la banque doit rembourser sous 1 jour ouvré.", urg: "💳 Débit que je n’ai pas fait",
    kw: "fraude carte bancaire debit conteste remboursement perceval litige", bl: [
    ["p", "C’est le domaine où la loi est la plus protectrice — et le plus méconnue. Pour une opération que tu n’as <b>pas autorisée</b>, la règle est : la banque rembourse d’abord, elle enquête ensuite."],
    ["n", ["<b>Fais opposition</b> immédiatement (appli bancaire, ou le numéro au dos de ta carte).",
           "<b>Conteste par écrit</b> : message dans l’appli ou lettre recommandée, en listant date, montant, commerçant de chaque opération contestée.",
           "<b>Dépose un signalement sur Perceval</b> (service-public.fr) si tu as toujours ta carte en main : c’est la plateforme officielle de signalement de fraude à la carte, et le récépissé appuie ton dossier.",
           "Si la banque traîne ou refuse : relance écrite, puis <b>le médiateur bancaire</b> (gratuit, coordonnées obligatoires sur le site de ta banque)."]],
    ["g", "Ce que dit la loi", "Pour une opération non autorisée signalée à temps, la banque doit te rembourser <b>immédiatement, au plus tard le premier jour ouvré suivant</b> ta demande. Elle ne peut retenir la somme que si elle a de bonnes raisons de soupçonner une fraude de ta part — et elle doit le motiver."],
    ["chif", [["13 mois", "pour contester", "un débit carte non autorisé (8 semaines pour un prélèvement autorisé, 13 mois s’il n’y a aucun mandat)"],
              ["0 €", "à ta charge", "pour un paiement à distance frauduleux (numéro volé, carte jamais sortie de ta poche)"],
              ["50 €", "franchise maximale", "si la carte a été physiquement perdue ou volée et utilisée avant ton opposition"]]],
    ["e", "Le piège", "Le mot <b>négligence grave</b>. C’est le seul argument qui permet à une banque de refuser. Elle le sortira si tu as communiqué un code. D’où la règle absolue de la fiche suivante : ne valide jamais rien que tu n’as pas déclenché toi-même."],
    ["b", "Après remboursement", "Vérifie que tes <b>prélèvements récurrents</b> liés à l’ancienne carte (abonnements, transports) ont bien été mis à jour avec le nouveau numéro. Un prélèvement rejeté coûte des frais des deux côtés."]],
    todo: [["ban-oppo-num", "Noter le numéro d’opposition de ma banque dans le carnet"]],
    voir: ["arn-conseiller", "ban-oppo"] },

  { id: "ban-oppo", t: "Carte perdue ou volée", r: "Opposition d’abord, plainte ensuite. Dans cet ordre.", urg: "💳 J’ai perdu ma carte",
    kw: "opposition carte perdue volee plainte numero interbancaire", bl: [
    ["n", ["<b>Bloque la carte dans ton appli bancaire</b> — presque toutes ont un blocage temporaire réversible en un geste. Commence par là : si tu la retrouves dans ton manteau, tu la débloques.",
           "Si le blocage n’existe pas ou que tu es sûr du vol : <b>opposition définitive</b>, par l’appli ou par téléphone.",
           "Vérifie tes opérations des derniers jours, conteste tout ce qui n’est pas toi (fiche précédente).",
           "<b>Vol</b> (pas simple perte) : dépose plainte. Le récépissé sert pour l’assurance et pour les litiges."]],
    ["num", [["Le numéro au dos de ta carte", "toujours le bon réflexe — c’est ta banque, elle te connaît"],
             ["0 892 705 705", "serveur interbancaire d’opposition, 24h/24, payant — utile si tu n’as ni carte ni appli sous la main"]]],
    ["e", "Le piège", "Faire opposition <b>et rien d’autre</b>. L’opposition arrête l’hémorragie, elle ne rembourse rien. Le remboursement se déclenche uniquement quand tu <b>contestes</b> les opérations une par une."],
    ["b", "Prépare-toi maintenant", "Photographie le recto de ta carte (sans le cryptogramme) et note le numéro d’opposition dans le carnet du Manuel. Le jour où tu n’as plus ni carte ni téléphone, tu as encore ces informations sur un autre appareil."]],
    voir: ["tel-perdu", "ban-fraude"] },

  { id: "ban-frais", t: "Les frais bancaires : ce qui est plafonné", r: "La plupart des frais « incompressibles » sont plafonnés par la loi. Relis tes relevés.",
    kw: "frais bancaires commission intervention rejet plafond agios fragilite", bl: [
    ["p", "Les banques ont le droit de facturer des incidents. Elles n’ont pas le droit de facturer ce qu’elles veulent : plusieurs plafonds sont fixés par décret et s’appliquent à tout le monde."],
    ["chif", [["8 € / 80 €", "commission d’intervention", "maximum par opération irrégulière, et par mois"],
              ["20 €", "rejet de prélèvement", "plafonné au montant du prélèvement, sans dépasser 20 €"],
              ["30 € / 50 €", "chèque sans provision", "selon que le chèque est inférieur ou supérieur à 50 €"],
              ["4 € / 20 €", "clientèle fragile", "plafonds réduits si tu es reconnu en situation de fragilité financière"]]],
    ["g", "L’offre « clientèle fragile »", "Si les incidents s’enchaînent, la banque doit te proposer une <b>offre spécifique</b> à quelques euros par mois, qui plafonne les frais à 20 € par mois et 200 € par an, avec une carte à autorisation systématique. Ce n’est pas une punition : c’est un dispositif légal, et il évite la spirale. On peut le demander soi-même."],
    ["b", "L’astuce qui marche vraiment", "Appelle ton conseiller, sois factuel : « j’ai eu X € de frais ce mois-ci pour un incident isolé, je demande un geste commercial ». Le remboursement partiel est courant pour un client sans historique d’incidents. Ça ne marche pas deux fois par an."],
    ["e", "Le piège", "Les frais s’empilent en cascade : un prélèvement rejeté déclenche des frais, qui creusent le solde, qui font rejeter le suivant. Le bon geste est de <b>reprogrammer ou suspendre</b> un prélèvement à venir plutôt que de le laisser tomber."]],
    todo: [["ban-relev", "Relire un relevé complet et lister mes frais du mois"]],
    voir: ["ban-decouvert"] },

  { id: "ban-decouvert", t: "Découvert, agios, interdit bancaire", r: "Un découvert autorisé coûte cher ; un découvert non autorisé coûte très cher.",
    kw: "decouvert agios autorise interdit bancaire ficp fichage taux usure", bl: [
    ["h", "Deux mondes différents"],
    ["l", ["<b>Découvert autorisé</b> : un montant convenu avec ta banque. Tu paies des <b>agios</b> (intérêts, souvent 7 à 16 % par an, au prorata des jours). Désagréable, pas dramatique.",
           "<b>Découvert non autorisé (dépassement)</b> : là s’ajoutent les commissions d’intervention et les rejets. C’est le régime où 20 € de dépassement peuvent coûter 60 € de frais."]],
    ["g", "Ce que tu peux négocier", "Le montant du découvert autorisé se demande, il n’est pas gravé. Passer de 0 à 300 € d’autorisation transforme des frais d’incident en quelques euros d’agios. Demande-le <b>avant</b> d’en avoir besoin — une banque accepte plus facilement quand le compte est sain."],
    ["e", "Le vrai danger", "Le <b>crédit renouvelable</b> (« réserve d’argent », « crédit disponible » proposé avec la carte d’un magasin) : des taux souvent au-dessus de 18 %, une dette qui se reconstitue toute seule, et un remboursement mensuel si faible que le capital ne baisse presque pas. C’est le produit financier le plus dangereux accessible à ton âge."],
    ["h", "Si ça dérape"],
    ["l", ["<b>FICP</b> : fichage à la Banque de France après des incidents de remboursement de crédit. Il ferme l’accès au crédit, mais pas au compte bancaire.",
           "<b>Interdit bancaire (FCC)</b> : après un chèque sans provision non régularisé — 5 ans, ou levée dès régularisation.",
           "<b>Dossier de surendettement</b> : gratuit, se dépose à la Banque de France, suspend les poursuites pendant l’examen. Ce n’est pas une honte, c’est une procédure prévue par la loi."]],
    ["b", "Ce que fait cette app pour toi", "L’onglet 📈 Cap te donne la <b>date</b> de ton prochain passage sous zéro, avant qu’il arrive. C’est exactement à ce moment-là qu’un appel à ta banque coûte 0 € au lieu de 60 €."]],
    voir: ["ban-frais"] },

  { id: "ban-vir", t: "Virement : ce qui est réversible, ce qui ne l’est pas", r: "Un virement instantané parti est parti. Un prélèvement, lui, se conteste.",
    kw: "virement instantane iban rib prelevement mandat sepa contestation", bl: [
    ["h", "Du plus réversible au moins réversible"],
    ["l", ["<b>Prélèvement SEPA</b> : contestable <b>sans motif sous 8 semaines</b>, et jusqu’à <b>13 mois</b> s’il n’y a jamais eu de mandat. C’est le moyen de paiement le plus protecteur pour toi.",
           "<b>Paiement par carte</b> : contestable en cas de fraude, et parfois via la procédure de « chargeback » si le vendeur n’a jamais livré.",
           "<b>Virement classique</b> : une fois exécuté, la banque peut seulement <b>demander</b> à la banque du bénéficiaire de restituer. Elle ne peut pas l’imposer.",
           "<b>Virement instantané</b> : crédité en quelques secondes, <b>irrévocable</b>. C’est précisément pour ça que toutes les arnaques le réclament."]],
    ["g", "La vérification du bénéficiaire", "Depuis fin 2025, les banques européennes doivent vérifier que le <b>nom</b> du bénéficiaire correspond à l’IBAN et t’alerter si ça ne colle pas. Si un avertissement s’affiche, arrête-toi. C’est le signal le plus fiable qu’on t’a envoyé un faux RIB."],
    ["e", "Le piège du RIB", "Donner son RIB pour <b>recevoir</b> de l’argent est sans danger : il ne permet pas de prélever sans mandat. En revanche, un RIB reçu par mail dans un fil de discussion (« notre IBAN a changé ») est l’arnaque classique : appelle l’interlocuteur sur son <b>numéro habituel</b> pour confirmer, jamais celui écrit dans le mail."],
    ["b", "Réflexe", "Pour un premier virement vers quelqu’un, envoie <b>1 €</b> d’abord et fais confirmer la réception. Ça coûte une minute et ça a sauvé beaucoup de gens."]],
    voir: ["arn-conseiller", "arn-vente"] },

  { id: "ban-change", t: "Changer de banque, ou en avoir une", r: "Le transfert de tes prélèvements est fait par la nouvelle banque, gratuitement.",
    kw: "mobilite bancaire changer banque droit au compte cloture frais tenue", bl: [
    ["g", "La mobilité bancaire", "Tu signes un mandat à la nouvelle banque : c’est <b>elle</b> qui prévient tous tes émetteurs de prélèvements et de virements (salaire, CAF, abonnements) et redirige tout. Délai légal : <b>22 jours ouvrés</b>. Gratuit. Tu n’as plus à courir après chaque organisme."],
    ["g", "Le droit au compte", "Si une banque refuse de t’ouvrir un compte, elle doit te remettre une <b>attestation de refus</b>. Avec elle, la Banque de France <b>désigne</b> une banque obligée de t’ouvrir un compte avec les services de base, gratuitement. Personne ne peut légalement te laisser sans compte en France."],
    ["h", "Ce qui vaut le coup d’être comparé"],
    ["l", ["Les <b>cotisations de carte</b> : c’est souvent le poste le plus cher d’une banque traditionnelle, pour un service identique.",
           "Les <b>frais à l’étranger</b> (retraits, paiements hors zone euro) : l’écart entre deux banques peut être de 1 à 10.",
           "Les <b>frais d’incident</b> : voir la fiche des plafonds.",
           "La disponibilité d’un <b>vrai conseiller</b>, qui compte le jour où tu demandes un prêt ou un geste commercial."]],
    ["e", "Le piège", "Fermer l’ancien compte trop tôt. Garde-le <b>deux à trois mois</b> avec un petit solde : il y a toujours un prélèvement oublié. Une fois tout migré, demande la clôture par écrit — elle est gratuite."],
    ["b", "Avant de partir", "Vérifie si ton ancienne banque détient un produit lié (livret, épargne, assurance) : c’est ce qui coince le plus souvent dans une clôture."]],
    voir: ["ban-frais"] }
]},

/* ═══════════ 3. CHEZ TOI ═══════════ */
{ id: "log", e: "🔑", t: "Chez toi", sub: "Logement, serrurier, fuites, factures", fiches: [

  { id: "log-serrurier", t: "Enfermé dehors : ne pas se faire plumer", r: "N’appelle jamais le premier numéro de Google. Assurance, gardien, puis devis écrit.", urg: "🔑 Je suis enfermé dehors",
    kw: "serrurier arnaque porte claquee devis urgence depannage prix", bl: [
    ["p", "C’est l’arnaque la mieux rodée de France, et elle marche parce qu’elle attaque au pire moment : tu es dehors, il fait froid, tu paierais n’importe quoi. Le seul antidote est de connaître les gestes <b>avant</b>."],
    ["h", "Comment l’arnaque fonctionne"],
    ["l", ["Des sociétés achètent le référencement Google sur « serrurier + ta ville », collent des autocollants dans les halls et les ascenseurs, et affichent de faux avis.",
           "Tu appelles : une <b>plateforme nationale</b> annonce un prix d’appel (« à partir de 79 € ») et envoie un sous-traitant.",
           "Sur place, le discours change : « votre serrure est trop sécurisée, il faut percer », « je dois la remplacer ». Le perçage, souvent inutile, justifie une serrure neuve à 600 €.",
           "La facture finale tourne entre 800 et 2 000 €, parfois payée en plusieurs fois par carte, sous pression, la nuit."]],
    ["h", "L’ordre des appels, dans cet ordre"],
    ["n", ["<b>Ton assurance habitation.</b> Beaucoup de contrats incluent une <b>assistance serrurerie</b> qui envoie un artisan agréé et prend tout ou partie à sa charge. Le numéro est sur ton contrat — mets-le dans le carnet du Manuel <b>aujourd’hui</b>.",
           "<b>Le gardien, l’accueil de la résidence ou le bailleur.</b> Une résidence étudiante a très souvent un <b>passe</b> ou un serrurier conventionné. C’est gratuit ou presque, et c’est le premier réflexe si tu vis en résidence.",
           "<b>Un voisin ou un proche qui a ton double.</b> D’où l’intérêt d’en avoir confié un.",
           "<b>Seulement en dernier recours</b>, un serrurier : un artisan local identifiable, avec une adresse physique et un SIRET, pas une plateforme."]],
    ["g", "Tes droits pendant l’intervention", "Un <b>devis écrit, détaillé et signé avant les travaux</b> est obligatoire pour le dépannage à domicile au-delà d’un montant fixé par arrêté (150 € TTC). Il doit indiquer le déplacement, la main-d’œuvre, les pièces, et le prix <b>total TTC</b>. Un professionnel qui refuse de l’écrire est hors la loi — et tu peux le renvoyer, tu ne lui dois rien."],
    ["chif", [["80–180 €", "porte simplement claquée", "en journée, ouverture sans dégât, quelques minutes de travail"],
              ["150–300 €", "porte fermée à clé", "plus technique, parfois avec remplacement du cylindre"],
              ["× 1,5 à × 2", "nuit, dimanche, férié", "majoration normale — mais annoncée sur le devis, pas après"]]],
    ["h", "Les cinq phrases qui te protègent"],
    ["l", ["« <b>Envoyez-moi le devis par SMS avant de venir.</b> » Un pro sérieux le fait ; une plateforme raccroche.",
           "« <b>Vous ouvrez sans percer d’abord.</b> » Une porte claquée s’ouvre par la carte ou le crochetage. Le perçage est un choix, pas une fatalité.",
           "« <b>Je ne signe rien avant d’avoir lu le montant total.</b> » Ne signe jamais un bon d’intervention avec des cases vides.",
           "« <b>Je paie par carte ou par chèque, avec facture.</b> » Jamais en espèces : sans trace, tu n’as plus aucun recours.",
           "« <b>Je note votre nom et votre SIRET.</b> » Le simple fait de le demander fait tomber beaucoup de prix."]],
    ["e", "Si c’est déjà arrivé", "Ne signe pas « bon pour accord » : écris <b>« sous réserve, prix contesté »</b> à côté de ta signature. Puis : lettre recommandée de contestation à la société, signalement sur <b>SignalConso</b> (DGCCRF), et si le montant est élevé, saisine gratuite d’un <b>conciliateur de justice</b>. Une facture abusive obtenue par pression peut relever de la pratique commerciale trompeuse."],
    ["b", "Prévention, une fois pour toutes", "Un double chez un proche, une boîte à clés à code si tu as un endroit sûr, et le numéro d’assistance de ton assurance enregistré. Trois minutes aujourd’hui contre 800 € une nuit d’hiver."]],
    todo: [["log-double", "Confier un double de mes clés à quelqu’un de confiance"],
           ["log-assist", "Noter le numéro d’assistance de mon assurance habitation"],
           ["log-gardien", "Noter le numéro de l’accueil / du gardien de ma résidence"]],
    voir: ["ass-hab", "log-eau"] },

  { id: "log-bail", t: "Le bail, la caution, l’état des lieux", r: "L’état des lieux d’entrée décide de ce que tu récupéreras en partant. Sur-documente-le.",
    kw: "bail location depot garantie caution etat des lieux quittance loyer charges", bl: [
    ["p", "Presque tous les litiges de fin de bail se jouent sur un document rédigé le jour de l’entrée, en dix minutes, par quelqu’un de pressé. C’est le seul moment où tu as tout le pouvoir."],
    ["h", "Le jour de l’état des lieux d’entrée"],
    ["l", ["Note <b>tout</b>, même ce qui paraît ridicule : trace au mur, joint noirci, plaque qui ne chauffe pas, store cassé, moquette tachée.",
           "Prends <b>des photos datées</b> de chaque pièce et envoie-les-toi par mail le jour même : le mail horodaté fait foi bien mieux qu’une photo dans la galerie.",
           "Relève les <b>compteurs</b> (eau, électricité, gaz) et fais-les écrire sur le document.",
           "Tu as <b>10 jours</b> après la signature pour demander un complément à l’état des lieux si tu as découvert quelque chose."]],
    ["chif", [["1 mois", "dépôt de garantie, logement nu", "de loyer hors charges, maximum légal"],
              ["2 mois", "dépôt de garantie, meublé", "maximum légal également"],
              ["10 j", "pour compléter l’état des lieux", "après la remise des clés"]]],
    ["g", "Ce que le propriétaire ne peut pas faire", "Exiger plus que le maximum légal de dépôt de garantie, demander un loyer en espèces sans quittance, refuser de te remettre une <b>quittance de loyer</b> gratuitement quand tu la demandes, ou te facturer la <b>vétusté</b> (l’usure normale du temps : peinture fatiguée, moquette âgée). La vétusté n’est jamais à ta charge."],
    ["e", "Le piège", "Ne pas demander de quittances. Elles prouvent que tu as payé, elles servent pour la CAF, pour un dossier de location suivant, et pour un litige. Demande-les chaque mois, ou une fois par an en bloc."],
    ["b", "Assurance obligatoire", "L’assurance habitation est <b>obligatoire</b> pour un locataire, et l’attestation est réclamée chaque année. Sans elle, le bailleur peut souscrire à ta place et te le refacturer, ou résilier le bail."]],
    todo: [["log-photos", "Avoir mes photos d’état des lieux d’entrée sauvegardées ailleurs que sur mon téléphone"]],
    voir: ["log-partir", "ass-hab"] },

  { id: "log-partir", t: "Partir : préavis et récupérer sa caution", r: "Le préavis part de la réception de ta lettre, pas de la date que tu écris dessus.",
    kw: "preavis conge logement restitution depot garantie retard penalite", bl: [
    ["chif", [["1 mois", "préavis", "meublé, ou logement en zone tendue, ou cas particuliers (mutation, premier emploi, RSA)"],
              ["3 mois", "préavis", "location vide hors zone tendue"],
              ["1 mois", "restitution du dépôt", "si l’état des lieux de sortie est conforme à celui d’entrée"],
              ["2 mois", "restitution du dépôt", "s’il y a des différences à déduire"],
              ["+10 %", "par mois de retard", "du loyer mensuel hors charges, dû automatiquement si le bailleur dépasse le délai"]]],
    ["h", "La procédure"],
    ["n", ["Envoie ton congé en <b>recommandé avec accusé de réception</b> (ou par acte d’huissier, ou remise en main propre contre signature). Le délai court à partir de la <b>réception</b>.",
           "Prépare la sortie : trous rebouchés, ménage sérieux, ampoules en état. Une heure de ménage vaut souvent 200 € de retenue.",
           "À l’état des lieux de sortie, compare <b>ligne à ligne</b> avec celui d’entrée, papier en main. Les photos datées sont ton arme.",
           "Donne ta nouvelle adresse par écrit — un bailleur qui « ne savait pas où envoyer » gagne du temps sur ton dos.",
           "Résilie l’assurance habitation, l’électricité, la box, en gardant les relevés de compteur."]],
    ["g", "S’il ne rend rien", "Lettre de mise en demeure en recommandé, rappelant le délai légal et la <b>pénalité de 10 % par mois</b>. Puis conciliateur de justice (gratuit) ou commission départementale de conciliation. Au-delà, le juge des contentieux de la protection — pour ces montants, la procédure est accessible sans avocat."],
    ["e", "Le piège", "Accepter une retenue « pour remise en peinture » sur un logement que tu as occupé trois ans. La peinture est de la <b>vétusté</b>. Le bailleur doit justifier chaque retenue par un <b>devis ou une facture</b> — pas par une estimation de coin de table."]],
    voir: ["log-bail"] },

  { id: "log-eau", t: "Fuite, dégât des eaux, panne", r: "Coupe l’arrivée, photographie, préviens l’assurance sous 5 jours ouvrés.", urg: "💧 Il y a une fuite",
    kw: "degat des eaux fuite plomberie constat amiable assurance panne electricite gaz", bl: [
    ["h", "Dans l’ordre, pendant que ça coule"],
    ["n", ["<b>Coupe l’arrivée d’eau</b> (le robinet d’arrêt général du logement, souvent sous l’évier, dans les toilettes ou le placard d’entrée — repère-le maintenant, pas ce jour-là).",
           "Coupe l’électricité de la zone touchée si l’eau approche d’une prise ou d’un tableau.",
           "<b>Photographie tout</b> avant de nettoyer : c’est ce qui chiffrera ton indemnisation.",
           "Préviens le <b>voisin concerné</b> (au-dessus ou en dessous) et le gardien / syndic / bailleur.",
           "Remplis un <b>constat amiable dégât des eaux</b> avec le voisin : un exemplaire chacun, chacun l’envoie à son assureur.",
           "Déclare à ton assurance : <b>5 jours ouvrés</b> pour un dégât des eaux."]],
    ["chif", [["5 j ouvrés", "dégât des eaux", "délai de déclaration à l’assureur"],
              ["2 j ouvrés", "vol ou cambriolage", "délai plus court, plainte d’abord"],
              ["10 j", "catastrophe naturelle", "à compter de la publication de l’arrêté"]]],
    ["h", "Qui paie quoi en location"],
    ["l", ["<b>Au locataire</b> : l’entretien courant, les joints, le remplacement d’un flexible, le débouchage, les petites réparations d’usage.",
           "<b>Au propriétaire</b> : la vétusté, la plomberie encastrée, la chaudière hors entretien courant, tout ce qui relève de la structure.",
           "En cas de doute, la liste des réparations locatives est fixée par décret — elle est consultable sur service-public.fr, et elle tranche la plupart des disputes."]],
    ["num", [["0 800 47 33 33", "Urgence Sécurité Gaz (GRDF) — gratuit, 24h/24 : odeur de gaz, tu sors et tu appelles de l’extérieur"],
             ["Sur ta facture", "le numéro de dépannage électricité de ton gestionnaire de réseau"],
             ["112", "urgence générale, depuis n’importe quel téléphone"]]],
    ["e", "Le piège", "Nettoyer et sécher avant de photographier, puis se présenter à l’assurance avec un mur repeint et rien à montrer. Photographie d’abord, toujours."]],
    todo: [["log-robinet", "Repérer le robinet d’arrêt d’eau et le tableau électrique de chez moi"]],
    voir: ["ass-hab"] },

  { id: "log-charges", t: "Électricité, gaz, box : ne pas payer trop", r: "Une mensualisation mal réglée est un prêt gratuit que tu fais à ton fournisseur.",
    kw: "edf electricite mensualisation regularisation kwh box internet forfait resiliation", bl: [
    ["h", "La mensualisation, bien comprise"],
    ["l", ["Tu paies un montant fixe estimé chaque mois, puis une <b>régularisation</b> annuelle ajuste la différence.",
           "<b>Mensualité trop haute</b> : tu avances de l’argent toute l’année pour rien. <b>Trop basse</b> : tu prends une facture de rattrapage dans la figure, souvent au pire moment.",
           "Tu peux <b>modifier ta mensualité</b> à tout moment depuis ton espace client, en général sans justification. Fais-le après six mois de consommation réelle."]],
    ["b", "Le geste qui vaut le coup", "Relève ton compteur toi-même et transmets le relevé : une estimation est toujours grossière. Sur un petit logement, l’écart entre estimé et réel se chiffre en dizaines d’euros par an."],
    ["h", "Comparer sans se faire avoir"],
    ["l", ["Le comparateur du <b>médiateur national de l’énergie</b> (energie-info.fr) est public, gratuit et sans démarchage — contrairement aux comparateurs commerciaux financés par les fournisseurs.",
           "Un fournisseur ne peut pas te changer de contrat sans ton accord explicite. Le <b>démarchage à domicile ou par téléphone</b> pour l’énergie est très encadré : tu peux tout refuser et signaler.",
           "En cas de litige non résolu en deux mois, le <b>médiateur de l’énergie</b> se saisit gratuitement."]],
    ["h", "Téléphone et box"],
    ["l", ["Si tu es sous engagement 24 mois, la <b>loi Chatel</b> limite ce que tu dois : passé le 12ᵉ mois, tu ne paies que le <b>quart</b> des mensualités restantes pour résilier.",
           "La <b>portabilité du numéro</b> : ton nouvel opérateur s’occupe de tout avec ton code RIO (obtenu en appelant le 3179 depuis ta ligne). Ne résilie jamais avant, tu perdrais ton numéro.",
           "Les forfaits sans engagement à petit prix passent souvent en tarif plein après 12 mois : note la date dans ton calendrier, ou dans l’onglet Flux de cette app."]],
    ["e", "Le piège", "Les augmentations silencieuses. L’opérateur a le droit de modifier son tarif, mais il doit te prévenir au moins un mois avant — et tu as alors <b>4 mois pour résilier sans frais</b>. Le mail qui annonce ça ressemble exactement à une publicité : lis-le."]],
    voir: ["ach-abo"] },

  { id: "log-arnaque-loc", t: "L’arnaque à la fausse location", r: "Jamais un centime avant d’avoir visité et signé. Aucune exception.",
    kw: "arnaque location fausse annonce leboncoin caution avant visite dossierfacile", bl: [
    ["p", "Chaque rentrée, des milliers d’étudiants versent une caution pour un logement qui n’existe pas. Le scénario est toujours le même : une annonce trop belle, un propriétaire « à l’étranger », et une urgence fabriquée."],
    ["h", "Les signaux qui doivent tout arrêter"],
    ["l", ["Le loyer est nettement <b>sous le marché</b> du quartier.",
           "Le propriétaire est « en déplacement », « à l’étranger », « militaire en mission » et ne peut pas faire visiter.",
           "On te demande un acompte, une caution ou « un mois pour réserver » <b>avant la visite</b>.",
           "On te propose de payer par <b>mandat cash, crypto, cartes cadeaux ou virement instantané</b>.",
           "Les photos sont trouvables ailleurs : fais une <b>recherche d’image inversée</b>, c’est souvent l’annonce d’une vraie agence recopiée."]],
    ["g", "La règle absolue", "<b>Aucun versement</b> avant d’avoir visité le logement, vu une pièce d’identité du bailleur et signé un bail. Le dépôt de garantie se remet à la signature, pas avant. Personne d’honnête ne te demandera l’inverse."],
    ["b", "Blinde ton dossier plutôt que ton portefeuille", "<b>DossierFacile</b> est le service public gratuit qui certifie ton dossier de location. Un dossier certifié passe devant beaucoup de candidatures — et t’évite d’envoyer tes pièces d’identité en clair à des inconnus."],
    ["e", "Ce que tu envoies", "Sur une pièce d’identité transmise à un bailleur, ajoute un filigrane « destiné exclusivement à la location de [adresse], le [date] ». Ça n’empêche pas tout, mais ça rend le document inutilisable pour ouvrir un compte à ton nom."]],
    voir: ["arn-vente", "num-comptes"] }
]},

/* ═══════════ 4. TÉLÉPHONE & NUMÉRIQUE ═══════════ */
{ id: "tel", e: "📱", t: "Téléphone & numérique", sub: "Perte, vol, comptes piratés", fiches: [

  { id: "tel-perdu", t: "J’ai perdu mon téléphone", r: "Localiser → verrouiller → suspendre la ligne → plainte → bloquer l’IMEI.", urg: "📱 J’ai perdu mon téléphone",
    kw: "telephone perdu vole imei localiser opposition ligne plainte sim", bl: [
    ["p", "Un téléphone perdu, ce n’est pas un objet à 600 € : c’est ton mail, ta banque, tes codes de validation et ton identité. L’ordre des gestes compte plus que la vitesse."],
    ["h", "Les six gestes, dans l’ordre"],
    ["n", ["<b>Localise-le</b> depuis un autre appareil : <i>Localiser</i> (iCloud.com/find) ou <i>Find Hub / Localiser mon appareil</i> (Google). Tant qu’il a du réseau, tu vois où il est — et tu peux le faire sonner, ce qui règle la moitié des cas.",
           "<b>Verrouille-le à distance</b>, avec un message et un numéro de contact affiché à l’écran. Le mode Perdu désactive aussi Apple Pay / Google Pay <b>instantanément</b>.",
           "<b>Suspends ta ligne</b> chez ton opérateur (espace client depuis un ordinateur, ou service client). Sans ça, quelqu’un peut téléphoner à tes frais et surtout <b>recevoir tes SMS de validation</b>.",
           "<b>Change le mot de passe de ta boîte mail principale</b>, puis celui de ta banque. Le mail d’abord : c’est lui qui permet de réinitialiser tout le reste.",
           "<b>Dépose plainte</b> en cas de vol (ou une déclaration de perte). Le récépissé est exigé par l’assurance et par l’opérateur.",
           "<b>Fais bloquer l’IMEI</b> auprès de ton opérateur, avec le récépissé : le téléphone devient inutilisable sur tous les réseaux français, même avec une autre carte SIM."]],
    ["e", "Le piège de la double authentification", "Si tous tes codes de sécurité arrivent <b>par SMS</b> sur le téléphone que tu viens de perdre, tu es enfermé dehors de tous tes comptes en même temps. C’est le moment où les gens paniquent. D’où la fiche suivante : les codes de secours se préparent avant."],
    ["e", "Le faux message « votre iPhone a été retrouvé »", "Quelques heures après la perte, tu reçois un SMS ou un mail imitant Apple ou Google, avec un lien pour « se reconnecter ». C’est du phishing ciblé, destiné à récupérer ton identifiant pour <b>déverrouiller le téléphone volé</b>. Ne clique jamais : passe uniquement par iCloud.com ou l’appli officielle."],
    ["b", "N’efface pas trop vite", "L’effacement à distance coupe la localisation. Verrouille d’abord, garde-le localisable, et n’efface que quand tu as renoncé à le récupérer ou que des données sensibles sont en jeu."],
    ["h", "Est-il assuré ?"],
    ["l", ["Beaucoup de <b>cartes bancaires haut de gamme</b> couvrent le vol (parfois la casse) d’un téléphone <b>payé avec la carte</b>.",
           "Certaines <b>assurances habitation</b> couvrent le vol avec effraction ou avec agression.",
           "Une assurance dédiée souscrite chez l’opérateur coûte souvent 8 à 15 € par mois, avec une franchise élevée : sur deux ans, tu as payé presque le prix d’un téléphone. Vérifie d’abord ce que tu as <b>déjà</b>."]]],
    todo: [["tel-imei", "Noter mon IMEI dans le carnet (composer *#06#)"],
           ["tel-loc", "Vérifier que Localiser / Find Hub est bien activé"]],
    voir: ["tel-avant", "num-comptes", "ban-oppo"] },

  { id: "tel-avant", t: "Les six choses à faire AVANT de le perdre", r: "Dix minutes aujourd’hui. Elles valent une journée entière le jour venu.",
    kw: "sauvegarde imei codes secours 2fa preparation vol", bl: [
    ["n", ["<b>Note ton IMEI.</b> Compose <b>*#06#</b> : le numéro s’affiche. C’est l’identifiant unique de l’appareil, celui qu’il faut fournir pour le faire bloquer. Écris-le dans le carnet du Manuel.",
           "<b>Vérifie que la localisation à distance est active</b> — <i>Localiser</i> sur iPhone, <i>Localiser mon appareil</i> sur Android. Teste-la une fois depuis un ordinateur pour savoir à quoi elle ressemble.",
           "<b>Active une sauvegarde automatique</b> (iCloud, Google One, ou une sauvegarde sur ton ordinateur). Le téléphone se rachète ; les photos, non.",
           "<b>Imprime ou note tes codes de secours</b> de double authentification (Google, Apple, banque, réseaux). Ce sont ces codes à usage unique qui te rouvrent tes comptes sans téléphone. Range-les <b>hors du téléphone</b>.",
           "<b>Mets un vrai code de déverrouillage</b> : 6 chiffres minimum, pas ta date de naissance, et surtout pas le même code que ta carte bancaire.",
           "<b>Ajoute un contact d’urgence</b> et un message sur l’écran verrouillé. Une part non négligeable des téléphones perdus est rendue quand on peut joindre le propriétaire."]],
    ["b", "Le geste de plus", "Passe ta double authentification du <b>SMS</b> vers une <b>application d’authentification</b> ou une clé physique. Le SMS est le maillon faible : il suffit qu’on détourne ta ligne (« SIM swapping ») pour recevoir tes codes."],
    ["g", "Sur ta ligne", "Tu peux demander à ton opérateur un <b>code de sécurité</b> exigé pour toute opération sensible sur ton compte (changement de SIM, portabilité). Tous ne le proposent pas, mais quand ça existe, ça bloque net le détournement de ligne."]],
    todo: [["tel-backup", "Vérifier que ma sauvegarde automatique fonctionne"],
           ["tel-2fa", "Sortir ma double authentification du SMS (appli d’authentification)"],
           ["tel-codes", "Mettre mes codes de secours à l’abri, hors du téléphone"]],
    voir: ["tel-perdu", "num-comptes"] },

  { id: "num-comptes", t: "Ton adresse mail est la clé de ta vie", r: "Qui contrôle ton mail contrôle tout le reste. Protège-le en priorité.",
    kw: "mot de passe gestionnaire mail securite 2fa piratage phishing", bl: [
    ["p", "Chaque service te propose « mot de passe oublié ? » et envoie un lien à ton adresse mail. Ton mail n’est donc pas un compte parmi d’autres : c’est le <b>passe-partout</b> de tous les autres. C’est là qu’il faut mettre l’effort."],
    ["h", "Les trois règles qui suffisent"],
    ["l", ["<b>Un mot de passe unique par service</b>, généré et retenu par un <b>gestionnaire de mots de passe</b>. C’est le seul moyen réaliste — la mémoire humaine ne tient pas 60 mots de passe différents.",
           "<b>Double authentification</b> sur le mail, la banque et les réseaux. Par application plutôt que par SMS.",
           "<b>Un mot de passe long plutôt que compliqué</b> : quatre mots sans lien entre eux battent « P@ssw0rd! » largement."]],
    ["e", "Le vrai risque, ce n’est pas un pirate", "C’est une <b>fuite de données</b> chez un site où tu t’étais inscrit il y a six ans. Ton mail et ton mot de passe se retrouvent dans une base revendue, et quelqu’un les essaie partout. Si tu réutilises le même mot de passe, une seule fuite ouvre tout. Va voir sur <b>haveibeenpwned.com</b> dans quelles fuites ton adresse apparaît déjà — la liste surprend toujours."],
    ["b", "Une adresse par usage", "Une adresse pour l’administratif et la banque, une autre pour les inscriptions et les boutiques. La seconde prend le spam et les fuites ; la première reste propre et n’est connue que d’organismes sérieux."],
    ["g", "Le droit à l’effacement", "Tu peux demander à n’importe quel service la <b>suppression de ton compte et de tes données</b> (RGPD). En cas de refus ou de silence pendant un mois, plainte gratuite en ligne auprès de la <b>CNIL</b>."]],
    todo: [["num-gest", "Installer un gestionnaire de mots de passe et y mettre mes 10 comptes clés"],
           ["num-mail2fa", "Activer la double authentification sur ma boîte mail principale"]],
    voir: ["num-pirate", "arn-sms"] },

  { id: "num-pirate", t: "Un compte piraté : quoi faire", r: "Reprends le mail d’abord, déconnecte les sessions, puis préviens tes contacts.",
    kw: "piratage compte pirate usurpation cybermalveillance plainte sextorsion", bl: [
    ["n", ["<b>Reprends le contrôle du mail en premier</b>, même si ce n’est pas lui qui a été piraté : c’est par lui que l’attaquant réinitialisera le reste.",
           "Change le mot de passe, puis <b>déconnecte toutes les sessions actives</b> (chaque grand service a ce bouton : « appareils connectés », « sessions »). Un changement de mot de passe seul ne chasse pas toujours l’intrus.",
           "Vérifie les <b>réglages détournés</b> : règle de transfert automatique des mails, adresse de récupération modifiée, numéro de téléphone ajouté, signature changée. C’est ce que les attaquants laissent derrière eux pour revenir.",
           "Préviens tes contacts si des messages sont partis en ton nom.",
           "<b>Dépose plainte</b> et fais-toi accompagner sur <b>cybermalveillance.gouv.fr</b> (service public gratuit, avec des parcours guidés selon le type d’attaque)."]],
    ["e", "Le chantage à la webcam", "Un mail affirme avoir filmé ton écran et réclame un paiement en cryptomonnaie, parfois en citant un vrai mot de passe (issu d’une fuite). Dans l’immense majorité des cas, <b>il n’y a aucune vidéo</b> : c’est un envoi automatisé en masse. Ne réponds pas, ne paie pas, change le mot de passe cité, et signale. Payer ne fait qu’ouvrir une seconde demande."],
    ["g", "Si on usurpe ton identité", "Faux profil à ton nom, compte ouvert avec tes papiers : c’est un délit (usurpation d’identité numérique, jusqu’à un an d’emprisonnement et 15 000 € d’amende). Plainte, signalement à la plateforme concernée, et information écrite aux organismes touchés."],
    ["num", [["17", "police / gendarmerie"],
             ["3018", "cyberharcèlement, chantage en ligne, comptes piratés — gratuit, 7j/7, pour les jeunes"],
             ["cybermalveillance.gouv.fr", "diagnostic et mise en relation avec un professionnel"]]]]},
]},

/* ═══════════ 5. ARNAQUES ═══════════ */
{ id: "arn", e: "🛡️", t: "Arnaques", sub: "Les scénarios exacts, et comment on les casse", fiches: [

  { id: "arn-conseiller", t: "Le faux conseiller bancaire", r: "Ta banque ne te demandera JAMAIS de valider quelque chose que tu n’as pas déclenché.", urg: "🎭 On m’appelle « de ma banque »",
    kw: "faux conseiller banque arnaque spoofing virement securite code validation", bl: [
    ["p", "C’est l’arnaque qui coûte le plus cher aux particuliers en France, et elle ne vise pas les naïfs : elle vise les gens pressés, un mardi à 18 h. Le scénario est industrialisé."],
    ["h", "Le déroulé, toujours le même"],
    ["n", ["Le téléphone sonne. <b>Le numéro affiché est celui de ta banque</b> — l’affichage se falsifie très facilement.",
           "L’interlocuteur connaît ton nom, ta banque, parfois tes dernières opérations (données achetées après une fuite ou un phishing).",
           "Il annonce une <b>fraude en cours</b> sur ton compte. Urgence, ton argent est en danger, il « sécurise ».",
           "Il te demande de <b>valider une notification dans ton appli</b>, de donner un <b>code reçu par SMS</b>, d’<b>enregistrer un nouveau bénéficiaire</b> ou de faire un « virement de sécurité » vers un compte technique.",
           "Chaque validation que tu donnes exécute <b>un vrai virement</b>, autorisé par toi. C’est tout le but de la manœuvre."]],
    ["g", "La phrase à retenir", "Un conseiller ne demande <b>jamais</b> : ton mot de passe, ton code d’appli, un code reçu par SMS, la validation d’une opération, ni la création d’un bénéficiaire. Si on te le demande, c’est une arnaque. Sans exception, quelle que soit l’explication."],
    ["b", "Le réflexe qui règle tout", "« Je vous rappelle. » Tu raccroches, tu attends <b>deux minutes</b> (une ligne peut rester ouverte), et tu appelles le numéro <b>au dos de ta carte</b>. Si l’appel était vrai, tu n’as rien perdu. S’il était faux, tu viens d’économiser plusieurs milliers d’euros."],
    ["h", "Si tu as déjà validé"],
    ["l", ["Appelle ta banque <b>tout de suite</b> pour tenter de bloquer les virements encore en cours.",
           "Fais opposition sur la carte et change tes accès.",
           "<b>Dépose plainte</b>, puis conteste <b>par écrit</b> auprès de la banque.",
           "Insiste : la justice a jugé qu’un client victime d’un <b>faux conseiller crédible</b> ne commet pas forcément une « négligence grave » — la banque doit alors rembourser. Beaucoup refusent au premier courrier ; le <b>médiateur bancaire</b>, gratuit, débloque souvent la situation."]]],
    voir: ["ban-fraude", "arn-reflexes"] },

  { id: "arn-sms", t: "Faux SMS et faux mails : colis, amende, sécu", r: "Aucun lien. Tu vas toi-même sur le site officiel, par ton propre chemin.",
    kw: "phishing sms smishing colis amende antai ameli impots faux lien 33700", bl: [
    ["h", "Les classiques du moment"],
    ["l", ["<b>« Votre colis est en attente, réglez 2,99 € de frais »</b> — le but n’est pas les 2,99 €, c’est ton numéro de carte.",
           "<b>« Avis de contravention »</b> imitant l’ANTAI. Les vraies amendes arrivent par courrier, et le paiement en ligne se fait <b>uniquement</b> sur amendes.gouv.fr.",
           "<b>« Votre carte Vitale expire »</b> — une carte Vitale n’expire pas et ne se renouvelle jamais contre paiement.",
           "<b>« Remboursement d’impôt en attente »</b> — le fisc rembourse par virement automatique, sans jamais réclamer tes coordonnées bancaires par SMS.",
           "<b>« Bonjour maman, j’ai changé de numéro »</b> — puis une demande d’argent urgente. Appelle l’ancien numéro pour vérifier.",
           "<b>Le faux QR code</b> collé sur un horodateur ou une borne : il renvoie vers un faux site de paiement."]],
    ["h", "Les signes qui trahissent"],
    ["l", ["Une <b>urgence</b> et une <b>menace</b> (suspension, pénalité, colis perdu).",
           "Un lien dont le domaine n’est pas exactement le site officiel : regarde ce qu’il y a <b>juste avant le premier /</b>, c’est le seul morceau qui compte.",
           "Une demande de coordonnées bancaires pour <b>recevoir</b> de l’argent.",
           "Un montant minuscule à payer : il sert à valider que ta carte fonctionne."]],
    ["g", "La règle universelle", "Ne clique <b>jamais</b> sur le lien d’un message non sollicité. Va sur le site officiel <b>par ton propre chemin</b> : ton favori, l’appli déjà installée, ou en tapant l’adresse. Si l’information est vraie, tu la retrouveras là-bas."],
    ["num", [["33700", "transférer un SMS frauduleux (puis envoyer le numéro de l’expéditeur) — gratuit"],
             ["signal-spam.fr", "signaler un mail de phishing"],
             ["phishing-initiative.fr", "faire fermer un site de phishing"],
             ["0 805 805 817", "Info Escroqueries — service public gratuit, pour savoir quoi faire"]]]]},

  { id: "arn-vente", t: "Vinted, Leboncoin : les pièges", r: "Tout ce qui sort de la plateforme est une arnaque. Sans exception.",
    kw: "vinted leboncoin arnaque vente lien paiement mondial relay faux virement", bl: [
    ["h", "Côté vendeur — l’arnaque la plus fréquente"],
    ["l", ["Un acheteur « ne peut pas payer sur l’appli » et t’envoie un <b>lien de paiement</b> ou un « lien de livraison » soi-disant Mondial Relay, Vinted ou Colissimo. La page ressemble parfaitement à l’originale. Tu y entres ta carte <b>pour recevoir de l’argent</b> — c’est le signe qu’il n’y a jamais de raison valable.",
           "Un faux SMS « virement en attente, cliquez pour recevoir ».",
           "Un acheteur qui insiste pour communiquer par WhatsApp ou SMS : sortir de la messagerie de la plateforme, c’est sortir de toute protection."]],
    ["e", "Le point clé", "<b>On ne saisit jamais de coordonnées bancaires pour recevoir de l’argent.</b> Un encaissement se fait avec un RIB ou via la plateforme, jamais avec un numéro de carte et un cryptogramme."],
    ["h", "Côté acheteur"],
    ["l", ["Paie <b>via la plateforme</b>, avec sa protection acheteur, même si le vendeur propose 5 € de moins en virement direct. Ces 5 € sont le prix de ta seule garantie.",
           "Méfie-toi d’un profil créé la semaine dernière, sans historique, avec des photos trouvables ailleurs.",
           "Pour une remise en main propre : lieu public, en journée, et vérification de l’objet <b>avant</b> de payer. Pour un téléphone, vérifie l’IMEI et qu’il n’est pas verrouillé sur un compte."]],
    ["g", "Si tu t’es fait avoir", "Opposition immédiate, contestation écrite à la banque, plainte, signalement à la plateforme. Un paiement par <b>carte</b> laisse une chance de contestation ; un <b>virement instantané</b>, presque aucune. C’est la raison pour laquelle les escrocs le réclament."]],
    voir: ["ban-vir", "arn-reflexes"] },

  { id: "arn-job", t: "Les offres qui rapportent trop", r: "Si on te paie pour faire transiter de l’argent, tu es en train de commettre un délit.",
    kw: "mule bancaire faux job arnaque travail domicile blanchiment crypto trading", bl: [
    ["e", "La mule bancaire", "Une annonce propose 200 à 500 € pour « recevoir un virement et le renvoyer », ou pour « prêter son compte quelques jours ». C’est du <b>blanchiment</b>. Les sommes qui transitent proviennent d’escroqueries, et c’est <b>ton</b> compte que la justice retrouve. Le fait de ne pas avoir su ne protège pas : la peine encourue va jusqu’à <b>5 ans d’emprisonnement et 375 000 € d’amende</b>, plus la fermeture du compte et un fichage bancaire durable."],
    ["h", "Les autres formats"],
    ["l", ["<b>Faux job à domicile</b> : mise en ligne de commentaires, « likes » rémunérés, saisie de données. On te demande d’abord un petit dépôt ou tes papiers d’identité.",
           "<b>Faux recruteur</b> sur les réseaux professionnels, avec un « test technique » qui exige d’installer un logiciel.",
           "<b>Trading et crypto</b> : une plateforme montre de beaux gains fictifs, tu peux retirer 50 € au début (l’appât), puis les retraits exigent des « frais de déblocage » sans fin. Toute promesse de rendement garanti est une arnaque — l’AMF publie une <b>liste noire</b> des sites non autorisés, consulte-la avant tout versement.",
           "<b>Le conseil d’ami sur les réseaux</b> : un compte piraté d’un proche vante un placement miracle. Appelle-le, il n’est pas au courant."]],
    ["g", "Le test en une question", "« Pourquoi me paierait-on <b>moi</b>, sans compétence particulière, pour une tâche aussi simple ? » S’il n’y a pas de réponse économique crédible, c’est que le produit vendu, c’est toi : ton compte, ton identité, ou ton argent."],
    ["b", "Vérifier un employeur", "Numéro SIREN sur annuaire-entreprises.data.gouv.fr, ancienneté de la société, adresse réelle, et une offre qui ne passe jamais uniquement par une messagerie instantanée."]],
    voir: ["arn-reflexes", "job-contrat"] },

  { id: "arn-reflexes", t: "Les sept réflexes anti-arnaque", r: "Toutes les arnaques attaquent le même point : ta peur d’attendre.", urg: "🛡️ Je crois qu’on m’arnaque",
    kw: "reflexes arnaque signaler signalconso perceval escroquerie plainte", bl: [
    ["n", ["<b>Ralentis.</b> Toute arnaque a besoin que tu décides dans la minute. Dire « je vous rappelle demain » n’a jamais fait perdre une vraie opportunité.",
           "<b>Rappelle par ton propre chemin.</b> Jamais le numéro du message, jamais celui qu’on te dicte : celui de ta carte, de ta facture, du site officiel.",
           "<b>Aucun code ne se donne.</b> Ni par téléphone, ni par SMS, ni à un « technicien ».",
           "<b>Le moyen de paiement demandé est un aveu.</b> Virement instantané, cartes cadeaux, cryptomonnaie, mandat cash : ce sont des paiements irréversibles. Aucun organisme sérieux ne les exige.",
           "<b>Vérifie l’adresse d’un site</b> caractère par caractère, juste avant le premier <b>/</b>.",
           "<b>Parle-en à quelqu’un.</b> La honte est l’outil principal de l’escroc : il mise sur le fait que tu n’en parleras pas avant d’avoir payé. Dire la situation à voix haute à un proche casse l’emprise en trente secondes.",
           "<b>Si c’est fait, agis vite et sans honte.</b> Les premières heures décident du remboursement. Tu n’es ni le premier ni le plus bête : ces scénarios sont conçus par des équipes entières."]],
    ["h", "Où signaler, selon le cas"],
    ["num", [["Perceval", "fraude à la carte bancaire (via service-public.fr), quand tu as toujours ta carte"],
             ["SignalConso", "litige avec un professionnel : devis abusif, facture gonflée, refus de garantie"],
             ["cybermalveillance.gouv.fr", "compte piraté, rançongiciel, aide technique"],
             ["Pharos (internet-signalement.gouv.fr)", "contenu ou site illicite"],
             ["33700", "SMS et appels frauduleux"],
             ["0 805 805 817", "Info Escroqueries, pour être orienté — gratuit"]]],
    ["g", "Le dépôt de plainte", "Il se fait dans n’importe quel commissariat ou gendarmerie, <b>quel que soit ton lieu de résidence</b>, et on ne peut pas te le refuser. Pour beaucoup d’escroqueries, une <b>plainte en ligne</b> est possible. Le récépissé est la pièce qui débloque assurance et banque."]]}
]},

/* ═══════════ 6. SANTÉ & ASSURANCES ═══════════ */
{ id: "san", e: "🩺", t: "Santé & assurances", sub: "Être couvert sans payer trois fois", fiches: [

  { id: "san-medecin", t: "Médecin traitant, Vitale, remboursements", r: "Sans médecin traitant déclaré, tu es remboursé 30 % au lieu de 70 %.",
    kw: "medecin traitant carte vitale ameli remboursement parcours de soins tiers payant", bl: [
    ["p", "Le système français rembourse bien, mais seulement si tu es dans le « parcours de soins coordonné ». La déclaration de médecin traitant est un formulaire de trois lignes signé en consultation — et elle vaut quelques centaines d’euros par an."],
    ["chif", [["70 %", "consultation, parcours respecté", "part remboursée par l’Assurance maladie, le reste par la mutuelle"],
              ["30 %", "hors parcours", "sans médecin traitant déclaré, ou consultation d’un spécialiste sans passer par lui"],
              ["2 €", "participation forfaitaire", "retenue par consultation, plafonnée par an — jamais remboursée par la mutuelle"]]],
    ["g", "Les spécialistes en accès direct", "Gynécologue, ophtalmologue, psychiatre (jusqu’à 26 ans), stomatologue et dentiste sont accessibles <b>sans passer par ton médecin traitant</b>, sans pénalité."],
    ["h", "Les gestes à faire une fois"],
    ["l", ["<b>Déclarer un médecin traitant</b> — n’importe quel généraliste qui accepte, y compris près de ton école plutôt que chez tes parents. Ça se change à tout moment.",
           "<b>Mettre à jour ta carte Vitale</b> une fois par an (borne en pharmacie ou à la caisse) : une carte non mise à jour bloque le tiers payant.",
           "<b>Activer ton compte ameli</b> : attestations de droits, suivi des remboursements, et la <b>carte européenne</b> (CEAM) à commander <b>deux semaines avant</b> un voyage en Europe — elle est gratuite et évite d’avancer des frais d’hospitalisation."]],
    ["b", "Si l’argent manque", "La <b>Complémentaire santé solidaire</b> (CSS) donne une couverture gratuite ou à 1 € par jour sous conditions de ressources, et elle s’étudie <b>individuellement</b> quand tu es détaché du foyer fiscal. Beaucoup d’étudiants y ont droit sans le savoir. Demande sur ameli.fr."],
    ["e", "Le piège des dépassements", "Un médecin en <b>secteur 2</b> pratique des dépassements d’honoraires : le remboursement se calcule sur le tarif de base, pas sur ce que tu paies. Annuaire santé d’ameli.fr : le secteur et les tarifs de chaque praticien y sont affichés avant le rendez-vous."]],
    todo: [["san-mt", "Déclarer un médecin traitant"], ["san-ameli", "Activer mon compte ameli"]],
    voir: ["san-urgence", "san-mutuelle"] },

  { id: "san-mutuelle", t: "La mutuelle : à quoi ça sert vraiment", r: "Elle ne sert pas pour le généraliste. Elle sert pour les dents, les yeux et l’hôpital.",
    kw: "mutuelle complementaire sante garanties optique dentaire hospitalisation 100 sante", bl: [
    ["p", "La Sécurité sociale couvre très bien le grave et mal le courant. La mutuelle (complémentaire santé) rembourse le reste — le « ticket modérateur » — et surtout ce qui coûte vraiment cher : optique, dentaire, audio, hospitalisation."],
    ["h", "Lire une garantie sans se faire avoir"],
    ["l", ["<b>« 100 % »</b> ne veut pas dire « tout remboursé » : ça veut dire 100 % du <b>tarif de base de la Sécu</b>, qui est parfois très loin du prix réel. Une couronne dentaire facturée 500 € avec une base Sécu de 120 € te laisse un gros reste à charge si la garantie est à « 100 % ».",
           "Regarde les postes en <b>euros par an</b> (forfait optique, forfait dentaire) : ce sont les seuls chiffres comparables.",
           "Vérifie les <b>délais de carence</b> : certains contrats ne remboursent l’optique ou le dentaire qu’après plusieurs mois.",
           "Le <b>100 % Santé</b> impose une offre de lunettes, prothèses dentaires et auditives <b>intégralement remboursée</b> — un opticien ou un dentiste doit obligatoirement te la proposer. Demande-la explicitement."]],
    ["b", "À ton âge", "Si tu es encore couvert par la mutuelle de tes parents en tant qu’ayant droit, tu n’as sans doute rien à payer. Vérifie avant de souscrire quoi que ce soit. Et le jour où tu es salarié, la mutuelle d’entreprise est <b>obligatoire, cofinancée par l’employeur</b>, et presque toujours meilleure que ce que tu paierais seul — tu devras alors résilier l’ancienne (la mutuelle d’entreprise est un motif de résiliation immédiate)."],
    ["g", "Résilier quand tu veux", "Passé <b>un an</b> de contrat, une complémentaire santé, une assurance auto ou habitation se résilie <b>à tout moment, sans frais et sans motif</b>. Le nouvel assureur s’occupe généralement des démarches."]],
    voir: ["ass-double"] },

  { id: "ass-hab", t: "L’assurance habitation", r: "Obligatoire en location — et c’est elle qui paie serrurier, dégât des eaux et vol.",
    kw: "assurance habitation mrh locataire obligation responsabilite civile assistance franchise", bl: [
    ["p", "C’est le contrat le plus rentable de ta vie d’étudiant : une centaine d’euros par an, et il couvre bien plus que « l’appartement »."],
    ["h", "Ce qu’il y a dedans, et que presque personne ne lit"],
    ["l", ["<b>La responsabilité civile</b> : les dommages que tu causes à autrui, y compris hors de chez toi. C’est elle qu’on te demande en stage, en sport, en association.",
           "<b>Dégât des eaux, incendie, vol</b> — souvent avec des conditions (effraction constatée pour le vol).",
           "<b>Une assistance</b> qui inclut fréquemment la <b>serrurerie d’urgence</b>, un relogement, parfois le dépannage plomberie. C’est le numéro à connaître par cœur.",
           "Parfois le <b>bris de glace</b> et les <b>appareils nomades</b> (téléphone, ordinateur) hors du domicile."]],
    ["h", "Les chiffres qui comptent dans ton contrat"],
    ["l", ["La <b>franchise</b> : ce qui reste à ta charge à chaque sinistre. Une prime basse avec une franchise de 300 € n’est pas une bonne affaire pour de petits sinistres.",
           "Le <b>capital mobilier</b> : la valeur de tes biens que l’assureur prendra pour base. Trop bas, tu es sous-indemnisé ; très haut, tu paies pour rien.",
           "Les <b>exclusions</b> : c’est toujours là que se joue un refus d’indemnisation. Lis cette page-là en priorité."]],
    ["g", "Déclaration d’un sinistre", "5 jours ouvrés en général, <b>2 jours ouvrés pour un vol</b> (avec plainte préalable). Photos, factures d’achat si tu les as, et un inventaire écrit. Garder les factures des objets de valeur dans un dossier mail, c’est dix minutes qui valent des centaines d’euros."],
    ["b", "Fais-le maintenant", "Ouvre ton contrat, trouve le <b>numéro d’assistance 24h/24</b> et ton <b>numéro de contrat</b>, et mets-les dans le carnet du Manuel. C’est exactement ce qu’on ne retrouve jamais le soir où on en a besoin."]],
    todo: [["ass-num", "Mettre mon n° de contrat et l’assistance habitation dans le carnet"]],
    voir: ["log-serrurier", "log-eau"] },

  { id: "ass-double", t: "Tu es peut-être assuré trois fois", r: "Fais l’inventaire une fois par an : les doublons d’assurance coûtent cher et ne servent à rien.",
    kw: "assurance doublon carte bancaire garantie voyage annulation resiliation hamon", bl: [
    ["p", "Les garanties s’empilent sans qu’on s’en rende compte : une par l’opérateur, une par la carte bancaire, une par l’assurance habitation, une par l’école. En cas de sinistre, <b>tu ne seras indemnisé qu’une fois</b> — mais tu auras payé trois primes."],
    ["h", "Ce que ta carte bancaire couvre déjà (souvent)"],
    ["l", ["<b>Assurance voyage et rapatriement</b> quand le billet est payé avec la carte.",
           "<b>Annulation ou retard</b> de transport, bagages perdus.",
           "<b>Location de voiture</b> : rachat de franchise, ce qui rend inutile l’assurance vendue au comptoir.",
           "<b>Achat</b> : garantie casse ou vol pendant quelques semaines après l’achat, extension de garantie constructeur.",
           "La condition est toujours la même : <b>avoir payé avec cette carte</b>. Les conditions détaillées sont dans la notice de ta carte, en ligne."]],
    ["e", "Les doublons typiques", "L’assurance téléphone de l’opérateur alors que la carte couvre déjà le vol ; l’assurance annulation vendue avec un billet alors que la carte la contient ; l’extension de garantie en magasin alors que la <b>garantie légale de 2 ans</b> existe déjà."],
    ["b", "L’inventaire annuel", "Une fois par an, liste tes assurances et ce que chacune couvre vraiment. C’est souvent 10 à 30 € par mois récupérés — exactement l’ordre de grandeur qui change une projection dans l’onglet Cap."],
    ["g", "Résilier est devenu simple", "Après un an, les assurances auto, habitation et santé se résilient <b>à tout moment</b>. Les contrats souscrits en ligne doivent proposer une résiliation en ligne, en quelques clics."]],
    todo: [["ass-inv", "Faire l’inventaire de mes assurances et supprimer les doublons"]],
    voir: ["ach-garantie", "ass-hab"] }
]},

/* ═══════════ 7. PAPIERS & DÉMARCHES ═══════════ */
{ id: "pap", e: "📄", t: "Papiers & démarches", sub: "Ce qu’on garde, ce qu’on refait, qui prévenir", fiches: [

  { id: "pap-garder", t: "Quels papiers garder, combien de temps", r: "Les bulletins de salaire, toute ta vie. Le reste a une durée.",
    kw: "papiers conserver duree bulletin salaire quittance facture avis imposition archives", bl: [
    ["p", "La règle n’est pas administrative, elle est juridique : on garde un document tant que quelqu’un peut encore te réclamer quelque chose, ou tant que tu peux encore réclamer toi-même."],
    ["chif", [["À vie", "bulletins de salaire, contrats de travail, diplômes", "la retraite se calcule sur des carrières de 45 ans ; aucune administration ne les reconstituera pour toi"],
              ["3 ans", "avis d’imposition, quittances de loyer", "l’administration fiscale peut contrôler sur cette durée (garde-les 4 ans, ça ne coûte rien)"],
              ["5 ans", "relevés bancaires, factures d’électricité et de gaz", "durée pendant laquelle une somme peut être réclamée"],
              ["2 à 5 ans", "factures d’achat", "au minimum toute la durée de la garantie du bien"]]],
    ["h", "Le bail et le logement"],
    ["l", ["Bail, état des lieux d’entrée et de sortie, quittances : <b>3 ans après la fin du bail</b>.",
           "Les <b>photos</b> d’état des lieux comptent autant que le document lui-même."]],
    ["b", "L’organisation qui tient", "Un dossier numérique unique, sauvegardé dans le cloud <b>et</b> ailleurs, avec des sous-dossiers par thème et des noms de fichiers datés (<b>2026-09_bulletin-paie.pdf</b>). Scanne au fil de l’eau : le rattrapage n’arrive jamais. Le service public propose aussi un espace de stockage dans <b>France Connect / mon espace particulier</b> pour certains documents."],
    ["e", "Le piège", "Perdre ses bulletins de stage et de job étudiant en se disant que « ça ne compte pas ». Les trimestres de retraite validés par ces périodes existent, et c’est à toi de pouvoir les prouver s’ils manquent au relevé de carrière."]],
    todo: [["pap-dossier", "Créer mon dossier de papiers numérique, sauvegardé à deux endroits"]],
    voir: ["job-paie"] },

  { id: "pap-titres", t: "Carte d’identité, passeport, permis", r: "Anticipe de plusieurs mois : c’est le délai, pas la démarche, qui coince.",
    kw: "carte identite passeport permis ants france titres delai rendez vous timbre fiscal", bl: [
    ["h", "Comment ça marche"],
    ["n", ["Tu fais une <b>pré-demande en ligne</b> sur le site de l’ANTS (ants.gouv.fr) — c’est le site officiel, gratuit.",
           "Tu prends <b>rendez-vous dans une mairie équipée</b> (toutes ne le sont pas ; ce n’est pas forcément la tienne, tu peux aller dans n’importe laquelle).",
           "Tu achètes un <b>timbre fiscal</b> en ligne si nécessaire (passeport ; carte d’identité gratuite sauf en cas de perte).",
           "Tu te présentes avec les originaux, on prend tes empreintes, puis tu récupères le titre quelques semaines plus tard."]],
    ["e", "Les faux sites", "Beaucoup de sites privés se placent en tête des résultats et facturent 30 à 50 € pour remplir un formulaire gratuit — ou pour vendre un rendez-vous qui ne vaut rien. Les seuls sites officiels se terminent par <b>.gouv.fr</b>. Rien, jamais, ne se paie hors timbre fiscal officiel."],
    ["b", "Les délais", "Aux périodes chargées (printemps, avant l’été), le délai entre la demande de rendez-vous et le titre en main peut dépasser <b>deux à trois mois</b>. Si tu vises un stage à l’étranger, un échange, ou un voyage, regarde la date d’expiration de tes titres <b>maintenant</b>, pas en juin."],
    ["g", "Bon à savoir", "Une carte d’identité d’adulte est valable 15 ans, un passeport 10 ans. Pour beaucoup de pays, le passeport doit être valable <b>encore 6 mois après</b> la date de retour. Et l’<b>attestation de recensement / JDC</b> reste exigée pour passer des examens et le permis jusqu’à 25 ans : range-la avec les documents à garder."]],
    voir: ["pap-garder"] },

  { id: "pap-demenage", t: "Déménager : qui prévenir, dans quel ordre", r: "Une seule démarche en ligne prévient une bonne partie des organismes.",
    kw: "demenagement changement adresse service public caf impots opérateur suivi courrier", bl: [
    ["n", ["<b>Le service de changement d’adresse en ligne</b> de service-public.fr prévient d’un coup plusieurs organismes (impôts, CAF, Assurance maladie, Pôle emploi / France Travail, caisses de retraite, fournisseurs d’énergie partenaires). C’est gratuit et ça prend dix minutes.",
           "<b>Ta banque et ton assurance</b> : à faire séparément, et l’assurance habitation doit être transférée ou résiliée <b>avant</b> l’entrée dans le nouveau logement — pas après.",
           "<b>Énergie et box</b> : ouverture du nouveau contrat et relevé de compteur le jour même, résiliation de l’ancien avec relevé également.",
           "<b>L’école, l’employeur, le médecin, la mutuelle.</b>",
           "<b>La réexpédition du courrier</b> chez La Poste (payante, 6 ou 12 mois) : c’est le filet de sécurité pour tout ce que tu as oublié."]],
    ["e", "Le piège", "Oublier de résilier l’ancien contrat d’électricité : tu continues à payer la consommation de celui qui arrive après toi. Le relevé de compteur daté, photographié, est la seule preuve qui tranche un litige."],
    ["b", "Côté budget", "Un déménagement, ce sont deux mois où les charges se chevauchent. Dans l’onglet 🔮 Prévision de cette app, crée un plan « déménagement » avec le double loyer du mois de bascule : tu verras tout de suite si le creux passe."]],
    voir: ["log-partir", "pap-caf"] },

  { id: "pap-caf", t: "CAF et APL : la règle du jeu", r: "L’aide se recalcule sur tes revenus récents. Tout changement doit être signalé vite.",
    kw: "caf apl aide logement declaration trimestrielle indu trop percu etudiant", bl: [
    ["p", "L’aide au logement est recalculée automatiquement <b>tous les trois mois</b>, à partir de tes revenus des douze derniers mois glissants. Tu n’as plus à tout redéclarer chaque année, mais tu dois signaler <b>immédiatement</b> les changements de situation."],
    ["h", "Ce qu’il faut signaler sans attendre"],
    ["l", ["Déménagement, changement de colocation, de loyer.",
           "Début ou fin d’un job, d’une alternance, d’un stage gratifié.",
           "Mise en couple, changement de situation familiale.",
           "Changement de compte bancaire."]],
    ["e", "L’indu", "Le trop-perçu est la mauvaise surprise classique : la CAF verse trop pendant des mois, s’en aperçoit, et réclame la totalité d’un coup — parfois plus de mille euros, récupérés directement sur les aides suivantes. Ce n’est pas une sanction, c’est un remboursement. La seule protection est de signaler les changements <b>tout de suite</b>."],
    ["g", "Si l’indu tombe quand même", "Tu peux demander un <b>échéancier</b> de remboursement, et déposer une <b>demande de remise gracieuse</b> motivée (situation financière difficile, bonne foi) auprès de la commission de recours amiable. Les deux se font depuis ton espace CAF, et la remise est accordée plus souvent qu’on ne le croit."],
    ["b", "Pour ta projection", "Les APL tombent autour du 5 de chaque mois. Comme elles peuvent varier au trimestre, c’est la ligne la plus volatile de ton budget : quand le montant change, mets-le à jour dans l’onglet Flux, sinon toute la projection dérive."]],
    voir: ["imp-ratt"] }
]},

/* ═══════════ 8. TRAVAIL ═══════════ */
{ id: "job", e: "💼", t: "Stage, job, contrat", sub: "Ce qu’on te doit, ce que tu signes", fiches: [

  { id: "job-stage", t: "Convention de stage et gratification", r: "Au-delà de deux mois, la gratification est obligatoire. Ce n’est pas un cadeau.",
    kw: "stage convention gratification duree conges tuteur ecole obligation", bl: [
    ["p", "Un stage est encadré par la loi, pas par la bonne volonté de l’entreprise. La <b>convention tripartite</b> (toi, l’école, l’entreprise) est le contrat : tout ce qui n’y est pas écrit n’existe pas."],
    ["chif", [["2 mois", "seuil de gratification", "au-delà de 2 mois (plus de 44 jours ou 308 heures) dans la même année d’enseignement, elle devient obligatoire"],
              ["≈ 4,35 €/h", "minimum légal", "15 % du plafond horaire de la Sécurité sociale — le chiffre exact est réévalué chaque année, vérifie-le"],
              ["6 mois", "durée maximale", "d’un stage dans la même entreprise sur une année d’enseignement"]]],
    ["h", "Ce que la convention doit préciser"],
    ["l", ["Les <b>dates</b>, la durée hebdomadaire, les missions confiées et le nom du <b>tuteur</b>.",
           "Le montant de la gratification et ses modalités de versement.",
           "Les <b>avantages</b> : remboursement des transports aux mêmes conditions que les salariés, accès aux titres-restaurant ou à la cantine.",
           "Les règles de <b>congés et d’absences</b> : au-delà de deux mois, la convention doit prévoir des jours de congé."]],
    ["g", "Tes droits pendant le stage", "Tu n’es pas salarié, mais tu es protégé : durée de travail identique à celle des salariés, repos hebdomadaire, interdiction de te confier une tâche dangereuse, et <b>couverture accident du travail</b>. Un stage qui occupe un poste de travail permanent est un emploi déguisé — ça se conteste, au besoin avec l’aide de ton école, qui est signataire."],
    ["e", "Le piège", "Accepter une prolongation ou un changement de missions « à l’oral ». Tout avenant doit être écrit et signé par les trois parties. Sans ça, tu n’as aucun recours si la gratification promise ne suit pas."],
    ["b", "À la fin", "Demande l’<b>attestation de stage</b> (obligatoire, elle mentionne la durée et la gratification) et garde-la : elle sert pour la retraite et pour justifier ton expérience."]],
    voir: ["imp-job", "job-contrat"] },

  { id: "job-contrat", t: "Lire un contrat avant de signer", r: "Trois lignes décident de tout : poste, rémunération, période d’essai.",
    kw: "contrat travail cdd cdi periode essai clause non concurrence mobilite salaire brut", bl: [
    ["h", "Ce que tu vérifies systématiquement"],
    ["l", ["<b>L’intitulé du poste et la qualification</b> (coefficient, niveau dans la convention collective) : c’est ce qui détermine ton salaire minimum et ta progression, pas la belle formule du titre.",
           "<b>La rémunération</b> : brut ou net ? annuel sur 12 ou 13 mois ? variable garanti ou pas ? Une prime « discrétionnaire » n’est pas due.",
           "<b>La période d’essai</b> et sa possibilité de renouvellement : pendant cette période, chacun peut rompre avec un simple délai de prévenance.",
           "<b>Le lieu de travail</b> et une éventuelle clause de <b>mobilité</b>, qui peut t’envoyer ailleurs sans que ce soit une modification du contrat.",
           "<b>La clause de non-concurrence</b> : elle n’est valable que si elle est limitée dans le temps et l’espace <b>et financièrement compensée</b>. Sans contrepartie financière, elle est nulle.",
           "<b>La convention collective</b> applicable : c’est elle qui fixe les minima, les congés supplémentaires, les primes. Cherche-la par son nom, elle est en accès libre sur Légifrance."]],
    ["e", "Le piège du brut/net", "Entre le brut et le net, compte environ <b>−22 %</b> pour un statut non-cadre, un peu plus pour un cadre — puis encore l’impôt à la source. Un « 30 000 € » annoncé en entretien, c’est autour de 1 950 € net par mois, avant impôt. Négocie toujours en sachant lequel des deux tu compares."],
    ["b", "Avant de signer", "Demande le contrat <b>par écrit et à l’avance</b>. Une entreprise qui te met la pression pour signer le jour même sans te laisser lire est déjà en train de te dire comment elle travaille."]],
    voir: ["job-paie", "arn-job"] },

  { id: "job-paie", t: "Décoder une fiche de paie", r: "Regarde trois lignes : brut, net à payer, net imposable. Elles ne sont jamais égales.",
    kw: "fiche paie bulletin salaire brut net imposable cotisations conges payes", bl: [
    ["h", "Les lignes qui comptent vraiment"],
    ["l", ["<b>Salaire brut</b> : la base de tout, et ce dont on parle dans un contrat.",
           "<b>Net à payer avant impôt</b> : ce qui reste après cotisations sociales.",
           "<b>Net à payer</b> : après prélèvement à la source. C’est ce qui arrive sur ton compte.",
           "<b>Net imposable</b> : plus élevé que le net versé (la CSG non déductible s’y rajoute). C’est ce montant, pas l’autre, qu’il faut retrouver dans ta déclaration.",
           "<b>Le cumul annuel</b>, en bas : c’est le chiffre à surveiller pour les plafonds d’exonération (job étudiant, stage)."]],
    ["h", "Ce qu’on oublie de réclamer"],
    ["l", ["<b>50 % de l’abonnement de transport</b> : l’employeur doit le rembourser, y compris aux stagiaires et aux temps partiels.",
           "Les <b>heures supplémentaires</b>, majorées (25 % puis 50 %), ou récupérées.",
           "Les <b>congés payés</b> : 2,5 jours ouvrables par mois travaillé, dès le premier mois. Non pris, ils sont payés au départ.",
           "La <b>mutuelle d’entreprise</b>, dont l’employeur paie au moins la moitié."]],
    ["e", "Vérifie une fois", "Une erreur de paie (heures non comptées, prime oubliée, mauvais coefficient) se réclame pendant <b>3 ans</b>. Mais plus on attend, plus c’est difficile à prouver : lis le premier bulletin ligne à ligne, puis vérifie les suivants d’un coup d’œil sur le net et le cumul."],
    ["b", "Garde-les", "Tous, à vie, y compris ceux d’un job d’été de trois semaines. Le relevé de carrière se conteste avec les bulletins, pas avec des souvenirs."]],
    voir: ["pap-garder", "imp-pas"] },

  { id: "job-fin", t: "Quand ça s’arrête", r: "Trois documents sont obligatoires à la fin d’un contrat. Ne pars pas sans eux.",
    kw: "fin contrat solde tout compte certificat travail attestation france travail chomage prime precarite", bl: [
    ["h", "Les trois documents obligatoires"],
    ["l", ["<b>Le certificat de travail</b> : dates, poste. Il prouve ton expérience.",
           "<b>L’attestation destinée à France Travail</b> : sans elle, pas d’indemnisation chômage possible.",
           "<b>Le reçu pour solde de tout compte</b> : le détail des sommes versées. Tu peux le <b>contester pendant 6 mois</b> après l’avoir signé — et si tu ne le signes pas, pendant 3 ans."]],
    ["g", "Ce qui t’est dû", "Le solde des <b>congés payés non pris</b>, les heures supplémentaires en attente, et, pour un CDD arrivé à son terme sans embauche, la <b>prime de précarité</b> (10 % de la rémunération brute totale, sauf exceptions dont le contrat étudiant pendant les vacances scolaires)."],
    ["b", "Droits au chômage", "Il faut avoir travaillé un nombre minimal de mois sur une période de référence — les règles changent régulièrement, vérifie la condition en vigueur. Un stage ne compte pas ; une alternance, si. Inscris-toi <b>dès le lendemain</b> de la fin de contrat : les droits ne sont pas rétroactifs."],
    ["e", "Le piège", "Signer le solde de tout compte sur le parking, sans lire. Prends-le, rentre chez toi, compare avec tes bulletins et tes congés restants. Rien ne t’oblige à signer immédiatement."]],
    voir: ["job-paie"] }
]},

/* ═══════════ 9. ACHATS ═══════════ */
{ id: "ach", e: "🛒", t: "Achats & droits", sub: "Garantie, rétractation, abonnements", fiches: [

  { id: "ach-garantie", t: "La garantie légale, la vraie", r: "Deux ans, gratuite, sur tout. L’extension vendue en caisse fait doublon.",
    kw: "garantie legale conformite deux ans vice cache extension magasin sav reparation", bl: [
    ["p", "Un vendeur qui te propose une « garantie 2 ans » à 49 € te vend quelque chose que la loi te donne déjà. Il existe deux garanties légales, gratuites et obligatoires, et une garantie commerciale, facultative."],
    ["chif", [["2 ans", "garantie légale de conformité", "sur tout bien neuf acheté à un professionnel, à compter de la livraison"],
              ["24 mois", "présomption en ta faveur", "pendant ce délai, c’est au vendeur de prouver que le défaut n’existait pas à l’achat (12 mois pour un bien d’occasion)"],
              ["+6 mois", "après réparation", "la garantie est prolongée ; en cas de remplacement, elle repart pour 2 ans"]]],
    ["h", "Comment on l’utilise"],
    ["l", ["Tu t’adresses <b>au vendeur</b>, pas au fabricant. C’est lui le responsable légal, même s’il te renvoie vers un service après-vente.",
           "Tu choisis entre <b>réparation et remplacement</b> ; si aucune des deux n’est possible dans un délai raisonnable, tu peux demander le remboursement.",
           "C’est <b>gratuit</b> : pas de frais de port, pas de participation, pas de « frais de dossier ».",
           "En plus de ça, la <b>garantie des vices cachés</b> court 2 ans à compter de la découverte du défaut, jusqu’à 20 ans après l’achat."]],
    ["e", "Le piège", "Se laisser renvoyer vers le fabricant à l’étranger, ou accepter un avoir à la place d’un remboursement. Une phrase suffit : « j’invoque la <b>garantie légale de conformité</b>, article L217-3 du code de la consommation ». Le ton change généralement dans la seconde."],
    ["b", "Si ça bloque", "Mise en demeure écrite, puis <b>SignalConso</b> (DGCCRF), puis médiateur de la consommation du secteur — gratuit et obligatoire pour l’entreprise. Garde toujours la facture : c’est la seule preuve de la date d’achat."]],
    voir: ["ach-retract", "ass-double"] },

  { id: "ach-retract", t: "14 jours pour changer d’avis (et les cas où non)", r: "Le droit de rétractation existe en ligne, pas en magasin.",
    kw: "retractation quatorze jours achat en ligne remboursement colis livraison retard", bl: [
    ["g", "La règle", "Pour un achat <b>à distance</b> (internet, téléphone) ou par <b>démarchage à domicile</b>, tu as <b>14 jours</b> après réception pour te rétracter, <b>sans motif</b>. Le vendeur rembourse tout, frais de livraison aller compris, dans les 14 jours suivants. Les frais de retour, eux, peuvent rester à ta charge."],
    ["e", "Ce qui n’en bénéficie pas", "Achat <b>en magasin</b> (un retour y est une politesse commerciale, pas un droit), biens personnalisés, denrées périssables, contenu numérique téléchargé après accord exprès, journaux, billets de spectacle ou de transport datés, et les travaux d’urgence expressément demandés."],
    ["h", "Colis en retard, jamais arrivé, ou abîmé"],
    ["l", ["Le <b>vendeur</b> est responsable de la livraison, pas le transporteur. C’est à lui que tu t’adresses, toujours.",
           "Si la date de livraison annoncée est dépassée : tu le mets en demeure de livrer dans un délai raisonnable ; à défaut, tu <b>annules et tu es remboursé sous 14 jours</b>.",
           "Colis abîmé : émets des <b>réserves précises</b> sur le bon de livraison (« carton enfoncé, écran fissuré »), pas un vague « sous réserve de déballage », et photographie avant d’ouvrir.",
           "Colis marqué livré mais absent : le vendeur doit prouver la livraison. Réclame par écrit."]],
    ["b", "L’achat malin", "Paie par <b>carte</b> pour garder une voie de contestation, et conserve la confirmation de commande — c’est elle qui fait foi sur le prix affiché, même si le site change ensuite."]],
    voir: ["ach-garantie", "ban-vir"] },

  { id: "ach-abo", t: "Les abonnements qui ne meurent jamais", r: "Fais la liste une fois. C’est presque toujours le poste le plus facile à couper.",
    kw: "abonnements resiliation trois clics prelevements streaming salle sport engagement", bl: [
    ["p", "Les abonnements sont conçus pour être oubliés : petits montants, prélèvement automatique, reconduction tacite. Sur un an, trois abonnements oubliés à 12 € font 432 €."],
    ["h", "Faire le ménage en trente minutes"],
    ["n", ["Ouvre tes <b>relevés bancaires sur trois mois</b> et surligne tout ce qui revient. L’onglet 💸 Dépenses de cette app sait <b>détecter automatiquement les récurrences</b> dans ce que tu as noté.",
           "Pour chacun : utilisé ce mois-ci ? Si la réponse hésite, c’est non.",
           "Résilie depuis le compte lui-même. Les contrats souscrits en ligne doivent proposer une résiliation <b>en ligne, en quelques clics</b> — le bouton doit être visible et direct.",
           "Vérifie le mois suivant que le prélèvement a bien cessé, et note la date de fin d’engagement des autres."]],
    ["g", "La reconduction tacite", "Un professionnel doit t’<b>informer par écrit</b>, entre trois et un mois avant la date limite, que tu peux ne pas reconduire. S’il ne l’a pas fait, tu peux résilier <b>à tout moment</b> à partir de la reconduction, et te faire rembourser les sommes prélevées ensuite."],
    ["e", "Les salles de sport", "Le contrat le plus retors du marché : engagement de 12 mois, résiliation uniquement par recommandé, motifs limités. Les motifs légitimes reconnus (déménagement lointain, perte d’emploi, raison médicale attestée) fonctionnent, mais il faut <b>écrire</b>, avec justificatif, et garder une copie."],
    ["b", "Le dernier recours", "Ne fais jamais opposition au prélèvement sans avoir résilié par écrit : le contrat continue de courir, et la dette avec. Résiliation d’abord, opposition ensuite si le prélèvement persiste."]],
    voir: ["log-charges"] }
]},

/* ═══════════ 10. URGENCES ═══════════ */
{ id: "urg", e: "🚨", t: "Urgences", sub: "Les numéros, et quoi dire", fiches: [

  { id: "urg-num", t: "Les numéros qui comptent", r: "En cas de doute médical un dimanche : 116 117 avant le 15.",
    kw: "numeros urgence 15 17 18 112 114 116117 3919 3114 119 sos", bl: [
    ["num", [["15", "SAMU — urgence médicale vitale, malaise, détresse"],
             ["17", "Police / gendarmerie"],
             ["18", "Pompiers — incendie, accident, fuite de gaz, personne en danger"],
             ["112", "Numéro d’urgence européen, depuis n’importe quel téléphone, même sans carte SIM"],
             ["114", "Urgences par SMS — pour les personnes sourdes ou quand on ne peut pas parler"],
             ["116 117", "Médecin de garde, la nuit et le week-end, quand ce n’est pas vital"],
             ["0 800 47 33 33", "Urgence Sécurité Gaz — odeur de gaz : tu sors, puis tu appelles"],
             ["3114", "Souffrance psychique et pensées suicidaires — gratuit, 24h/24, professionnels de santé"],
             ["3919", "Violences faites aux femmes — anonyme et gratuit"],
             ["119", "Enfance en danger"],
             ["3018", "Cyberharcèlement, chantage en ligne — gratuit, 7j/7"]]],
    ["h", "Ce qu’on te demandera, dans cet ordre"],
    ["n", ["<b>Où</b> : adresse précise, étage, code d’entrée, point de repère. C’est la seule information vraiment irremplaçable.",
           "<b>Quoi</b> : ce qui s’est passé, en une phrase.",
           "<b>Qui</b> : combien de personnes, leur état, si elles parlent, si elles respirent.",
           "<b>Ton numéro</b>, et tu <b>ne raccroches pas</b> avant qu’on te le dise — on va te guider."]],
    ["b", "Prépare ton téléphone", "Renseigne ta <b>fiche médicale d’urgence</b> (Santé sur iPhone, Informations d’urgence sur Android) : groupe sanguin, allergies, traitements, personne à prévenir. Elle est accessible <b>écran verrouillé</b>, par les secours, sans ton code. C’est deux minutes."]],
    todo: [["urg-fiche", "Remplir la fiche médicale d’urgence de mon téléphone"]],
    voir: ["urg-soins"] },

  { id: "urg-soins", t: "Malade un dimanche", r: "Urgences = vital. Pour le reste, 116 117, pharmacie de garde, téléconsultation.",
    kw: "urgences hopital garde dimanche pharmacie teleconsultation forfait passage", bl: [
    ["h", "Le bon niveau de soin"],
    ["l", ["<b>Vital</b> (douleur thoracique, difficulté à respirer, perte de connaissance, hémorragie, paralysie soudaine) : <b>15</b> ou <b>112</b>, sans hésiter une seconde.",
           "<b>Ça ne peut pas attendre lundi, sans être vital</b> : <b>116 117</b>, le médecin de garde. On t’oriente, on te donne un rendez-vous, parfois on fait venir un médecin.",
           "<b>Petit problème, conseil</b> : le pharmacien de garde. Il conseille, dépanne, et voit passer beaucoup plus de cas qu’on ne l’imagine.",
           "<b>Téléconsultation</b> : remboursée dans les mêmes conditions qu’une consultation classique quand elle s’inscrit dans le parcours de soins, y compris le week-end."]],
    ["e", "Ce que coûtent les urgences", "Un passage aux urgences non suivi d’hospitalisation donne lieu à un <b>forfait</b> (autour de 20 €), à ta charge ou prise en charge par ta mutuelle. Ce n’est pas ce qui doit t’arrêter si c’est grave — mais ça n’est pas gratuit, et c’est une raison de plus d’appeler le 116 117 quand ce n’est pas urgent."],
    ["g", "À l’étranger, en Europe", "Avec la <b>carte européenne d’assurance maladie</b> (gratuite, à commander sur ameli.fr deux semaines avant le départ), tu es soigné dans les mêmes conditions que les habitants du pays. Hors Europe, c’est l’assurance de ta carte bancaire ou une assurance voyage qui prend le relais — vérifie <b>avant</b> de partir."],
    ["b", "Toujours utile", "Note dans ton téléphone le nom de ton médecin traitant, ta pharmacie, tes allergies et tes traitements. Aux urgences, on te posera ces questions au pire moment pour s’en souvenir."]],
    voir: ["san-medecin"] },

  { id: "urg-moral", t: "Si ça va vraiment mal", r: "Le 3114 est gratuit, anonyme, 24h/24, et au bout du fil il y a un soignant.",
    kw: "detresse psychologique suicide 3114 aide etudiant sante psy accompagnement", bl: [
    ["p", "Ça n’a rien à faire dans une app de budget — sauf que l’argent qui manque, l’isolement et la pression des études sont exactement ce qui fait déraper un moral, et qu’on cherche rarement ces numéros au bon moment."],
    ["num", [["3114", "numéro national de prévention du suicide — gratuit, 24h/24, confidentiel, tenu par des soignants"],
             ["0 800 235 236", "Fil Santé Jeunes — anonyme et gratuit, tous les jours"],
             ["116 117", "médecin de garde, la nuit et le week-end"]]],
    ["g", "Mon soutien psy", "Le dispositif public prend en charge des <b>séances chez un psychologue</b>, sans avance de frais, sur simple prise de rendez-vous avec un praticien partenaire. Les universités et écoles ont aussi un <b>service de santé</b> avec des consultations gratuites, souvent sous-utilisé."],
    ["b", "Le geste simple", "Enregistre le 3114 dans tes contacts maintenant, tant que ça va. Ce n’est pas dramatique : c’est le même raisonnement que noter l’IMEI de son téléphone. On prépare quand on est tranquille, on ne cherche pas quand on est en difficulté."]],
    voir: ["urg-num"] }
]}
];

/* ═══════════════════ CARNET : ce que Thomas remplit lui-même ═══════════════════ */
const CARNET = [
  ["ban_oppo", "🏦 Opposition carte", "le numéro au dos de ma carte", "Le premier numéro à composer si la carte disparaît."],
  ["ban_cons", "🏦 Mon conseiller", "nom + téléphone", ""],
  ["ass_num", "🛡️ Assurance habitation", "n° de contrat", "Réclamé à chaque sinistre et par le bailleur."],
  ["ass_tel", "🛡️ Assistance 24h/24", "le numéro d’urgence de l’assurance", "Serrurier, dégât des eaux, relogement."],
  ["log_gard", "🔑 Gardien / accueil résidence", "téléphone", "Souvent un passe, la nuit où tu es dehors."],
  ["log_bail", "🔑 Bailleur / agence", "nom + téléphone", ""],
  ["tel_imei", "📱 IMEI de mon téléphone", "compose *#06# pour l’obtenir", "Indispensable pour faire bloquer l’appareil."],
  ["tel_ope", "📱 Mon opérateur", "service client + n° de ligne", ""],
  ["san_med", "🩺 Médecin traitant", "nom + téléphone", ""],
  ["san_secu", "🩺 N° de sécurité sociale", "15 chiffres", "Reste sur ton téléphone, n’est jamais envoyé nulle part."],
  ["fis_num", "🧾 Numéro fiscal", "13 chiffres", "Pour te connecter à impots.gouv.fr."],
  ["urg_prev", "🚨 Personne à prévenir", "nom + téléphone", ""]
];

/* ═══════════════════ ÉTAT & OUTILS ═══════════════════ */
let MAN = { vue: "home", cat: null, fiche: null, q: "" };

function manS() {
  if (!S.manuel || typeof S.manuel !== "object") S.manuel = {};
  if (!S.manuel.done) S.manuel.done = {};
  if (!S.manuel.lu) S.manuel.lu = {};
  if (!S.manuel.carnet) S.manuel.carnet = {};
  return S.manuel;
}
const manCat = id => MANUEL.find(c => c.id === id);
function manToutes() {
  const o = [];
  MANUEL.forEach(c => c.fiches.forEach(f => o.push({ f, c })));
  return o;
}
const manFiche = id => manToutes().find(x => x.f.id === id) || null;

/* toutes les cases à cocher du manuel, à plat */
function manTodos() {
  const o = [];
  manToutes().forEach(({ f, c }) => (f.todo || []).forEach(t => o.push({ k: t[0], lab: t[1], f, c })));
  return o;
}
function manProgres() {
  const t = manTodos(), d = manS().done;
  return { fait: t.filter(x => d[x.k]).length, total: t.length, liste: t };
}

/* texte brut d’une fiche, pour la recherche */
function manTexte(f) {
  let t = f.t + " " + (f.r || "") + " " + (f.kw || "");
  (f.bl || []).forEach(b => b.slice(1).forEach(x => {
    if (typeof x === "string") t += " " + x;
    else if (Array.isArray(x)) x.forEach(y => t += " " + (Array.isArray(y) ? y.join(" ") : y));
  }));
  (f.todo || []).forEach(x => t += " " + x[1]);
  return t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}
const manNorm = s => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

/* ═══════════════════ RENDU DES BLOCS ═══════════════════ */
const M_ENC = { e: ["menc-e", "⚠️"], g: ["menc-g", "⚖️"], b: ["menc-b", "💡"] };

function manBloc(b) {
  const k = b[0];
  if (k === "p") return `<p class="mp">${b[1]}</p>`;
  if (k === "h") return `<div class="mh">${b[1]}</div>`;
  if (k === "l") return `<ul class="ml">${b[1].map(x => `<li>${x}</li>`).join("")}</ul>`;
  if (k === "n") return `<ol class="mn">${b[1].map(x => `<li><span>${x}</span></li>`).join("")}</ol>`;
  if (M_ENC[k]) return `<div class="menc ${M_ENC[k][0]}"><b>${M_ENC[k][1]} ${b[1]}</b>${b[2]}</div>`;
  if (k === "chif") return `<div class="mchif">${b[1].map(c =>
    `<div class="mchif-c"><div class="v">${c[0]}</div><div class="q">${c[1]}</div><div class="n">${c[2]}</div></div>`).join("")}</div>`;
  if (k === "num") return `<div class="mnum">${b[1].map(n =>
    `<div class="mnum-l"><div class="k">${n[0]}</div><div class="d">${n[1]}</div></div>`).join("")}</div>`;
  return "";
}

/* ═══════════════════ VUES ═══════════════════ */
function vueManuel() {
  manS();
  if (MAN.vue === "fiche" && MAN.fiche) return manVueFiche();
  if (MAN.vue === "cat" && MAN.cat) return manVueCat();
  if (MAN.vue === "carnet") return manVueCarnet();
  if (MAN.vue === "todo") return manVueTodo();
  return manVueHome();
}

function manVueHome() {
  const P = manProgres(), lu = Object.keys(manS().lu).length, tot = manToutes().length;
  const urgs = manToutes().filter(x => x.f.urg);
  const jour = manToutes()[(+today().slice(8, 10) + +today().slice(5, 7) * 31) % tot];

  return `
  <div class="sec" style="margin-top:14px">
    <div class="man-head">
      <div class="man-t">LE MANUEL</div>
      <div class="man-s">L’essentiel de la vie d’adulte : ce que personne ne t’apprend, et qui coûte cher le jour où ça tombe.</div>
    </div>
    <input class="man-q" id="man-q" type="search" placeholder="🔎 Chercher : serrurier, impôts, caution…" value="${esc(MAN.q)}">
    <div id="man-res">${MAN.q ? manResultats() : ""}</div>
  </div>

  <div class="${MAN.q ? "hidden" : ""}">
    <div class="sec"><h2>Ça arrive maintenant</h2>
      <div class="man-urg">${urgs.map(x =>
        `<button class="man-u" data-a="man-f" data-id="${x.f.id}">${x.f.urg}</button>`).join("")}</div>
    </div>

    <div class="sec"><h2>À lire aujourd’hui</h2>
      <div class="card man-jour" data-a="man-f" data-id="${jour.f.id}">
        <div class="man-jour-c">${jour.c.e} ${jour.c.t}</div>
        <div class="man-jour-t">${jour.f.t}</div>
        <div class="man-jour-r">${jour.f.r}</div>
      </div>
    </div>

    <div class="sec"><h2>Les rayons</h2>
      <div class="man-grid">${MANUEL.map(c => {
        const n = c.fiches.length, l = c.fiches.filter(f => manS().lu[f.id]).length;
        return `<button class="man-c" data-a="man-c" data-id="${c.id}">
          <div class="e">${c.e}</div><div class="t">${c.t}</div>
          <div class="s">${l ? l + "/" + n + " lues" : n + " fiches"}</div></button>`;
      }).join("")}</div>
    </div>

    <div class="sec"><h2>Ta mise en règle</h2>
      <div class="card tap" data-a="man-todo" style="margin-top:10px">
        <div class="man-pg"><div class="man-pg-n num">${P.fait}<span>/${P.total}</span></div>
          <div class="man-pg-x">réflexes en place<div class="bar" style="margin-top:6px"><i style="width:${P.total ? Math.round(P.fait / P.total * 100) : 0}%;background:var(--good)"></i></div></div></div>
        <div class="mini" style="margin:10px 0 0">${P.fait === P.total && P.total
          ? "Tout est en place. C’est rare — garde-le à jour."
          : "Douze gestes à faire une fois, qui te sauvent une journée entière le jour où ça arrive."}</div>
      </div>
      <button class="btn sm" style="margin-top:8px" data-a="man-carnet">📇 Mon carnet d’urgence</button>
    </div>

    <div class="sec"><div class="mini">${tot} fiches · ${lu} lue${lu > 1 ? "s" : ""} · contenu à jour en ${MAN_MAJ}.
      Les montants et plafonds cités sont des ordres de grandeur : les chiffres officiels bougent chaque année, l’esprit de la règle beaucoup moins.</div></div>
  </div>`;
}

function manResultats() {
  const q = manNorm(MAN.q);
  if (q.length < 2) return "";
  const mots = q.split(/\s+/).filter(Boolean);
  const res = manToutes().filter(({ f }) => { const t = manTexte(f); return mots.every(m => t.includes(m)); })
    .map(x => { const tit = manNorm(x.f.t + " " + x.f.r + " " + (x.f.kw || ""));
                return { x, s: mots.every(m => tit.includes(m)) ? 2 : (mots.some(m => tit.includes(m)) ? 1 : 0) }; })
    .sort((a, b) => b.s - a.s).map(o => o.x);
  if (!res.length) return `<div class="empty" style="padding:18px 10px">Rien sur « ${esc(MAN.q)} ».<br>Essaie un mot plus simple : clé, banque, loyer, arnaque…</div>`;
  return `<div class="man-res-n">${res.length} fiche${res.length > 1 ? "s" : ""}</div>` + res.map(({ f, c }) =>
    `<div class="row tap" data-a="man-f" data-id="${f.id}"><div class="em">${c.e}</div>
      <div class="in"><div class="t">${f.t}</div><div class="s">${f.r}</div></div></div>`).join("");
}

function manVueCat() {
  const c = manCat(MAN.cat);
  if (!c) { MAN.vue = "home"; return manVueHome(); }
  return `
  <div class="sec" style="margin-top:14px">
    <button class="man-back" data-a="man-home">‹ Le Manuel</button>
    <div class="man-head" style="margin-top:10px">
      <div class="man-t">${c.e} ${c.t.toUpperCase()}</div><div class="man-s">${c.sub}</div></div>
  </div>
  <div class="sec">${c.fiches.map(f => `
    <div class="row tap" data-a="man-f" data-id="${f.id}">
      <div class="em">${manS().lu[f.id] ? "✓" : "›"}</div>
      <div class="in"><div class="t">${f.t}</div><div class="s">${f.r}</div></div></div>`).join("")}</div>`;
}

function manVueFiche() {
  const x = manFiche(MAN.fiche);
  if (!x) { MAN.vue = "home"; return manVueHome(); }
  const { f, c } = x, D = manS().done;
  const todo = (f.todo || []).map(t =>
    `<button class="man-todo ${D[t[0]] ? "on" : ""}" data-a="man-do" data-k="${t[0]}">
      <span class="b">${D[t[0]] ? "✓" : ""}</span><span class="l">${t[1]}</span></button>`).join("");
  const voir = (f.voir || []).map(id => { const y = manFiche(id); return y
    ? `<button class="man-voir" data-a="man-f" data-id="${id}">${y.c.e} ${y.f.t} ›</button>` : ""; }).join("");

  return `
  <div class="sec" style="margin-top:14px">
    <button class="man-back" data-a="man-c" data-id="${c.id}">‹ ${c.t}</button>
    <h1 class="man-f-t">${f.t}</h1>
    <div class="man-f-r">⚡ ${f.r}</div>
  </div>
  <div class="sec man-body">${(f.bl || []).map(manBloc).join("")}</div>
  ${todo ? `<div class="sec"><h2>À faire une fois</h2><div style="margin-top:10px">${todo}</div></div>` : ""}
  ${voir ? `<div class="sec"><h2>Voir aussi</h2><div style="margin-top:10px">${voir}</div></div>` : ""}
  <div class="sec"><button class="btn sm" data-a="man-home">Retour au Manuel</button></div>`;
}

function manVueTodo() {
  const P = manProgres(), D = manS().done;
  const parCat = {};
  P.liste.forEach(t => { (parCat[t.c.id] = parCat[t.c.id] || { c: t.c, l: [] }).l.push(t); });
  return `
  <div class="sec" style="margin-top:14px">
    <button class="man-back" data-a="man-home">‹ Le Manuel</button>
    <div class="man-head" style="margin-top:10px">
      <div class="man-t">TA MISE EN RÈGLE</div>
      <div class="man-s">${P.fait} sur ${P.total}. Chaque ligne est un geste à faire une seule fois dans ta vie.</div></div>
  </div>
  ${Object.values(parCat).map(g => `<div class="sec"><h2>${g.c.e} ${g.c.t}</h2><div style="margin-top:10px">
    ${g.l.map(t => `<button class="man-todo ${D[t.k] ? "on" : ""}" data-a="man-do" data-k="${t.k}">
      <span class="b">${D[t.k] ? "✓" : ""}</span><span class="l">${t.lab}
      <i data-a="man-f" data-id="${t.f.id}">la fiche ›</i></span></button>`).join("")}</div></div>`).join("")}`;
}

function manVueCarnet() {
  const C = manS().carnet;
  return `
  <div class="sec" style="margin-top:14px">
    <button class="man-back" data-a="man-home">‹ Le Manuel</button>
    <div class="man-head" style="margin-top:10px">
      <div class="man-t">📇 MON CARNET D’URGENCE</div>
      <div class="man-s">Les numéros qu’on ne retrouve jamais le soir où on en a besoin. Remplis-les une fois.</div></div>
    <div class="menc menc-b" style="margin-top:12px"><b>🔒 Ça reste chez toi</b>
      Ces informations sont enregistrées uniquement dans ce téléphone, comme le reste de l’app. Elles ne partent sur aucun serveur.
      Elles suivent tes sauvegardes (Bilan → Exporter, ou Le Coffre).</div>
  </div>
  <div class="sec">${CARNET.map(([k, lab, ph, hint]) => `
    <div class="f"><label>${lab}</label>
      <input data-cn="${k}" value="${esc(C[k] || "")}" placeholder="${esc(ph)}">
      ${hint ? `<div class="mini" style="margin:5px 0 0">${hint}</div>` : ""}</div>`).join("")}</div>
  <div class="sec"><div class="mini">Astuce : garde aussi une copie papier de deux ou trois de ces numéros dans ton portefeuille.
    Le jour où tu perds le téléphone, l’app est dessus.</div></div>`;
}

/* ═══════════════════ ACTIONS ═══════════════════ */
function manAction(a, el) {
  if (a === "man-home") { MAN.vue = "home"; MAN.fiche = null; render(); window.scrollTo(0, 0); return true; }
  if (a === "man-c") { MAN.vue = "cat"; MAN.cat = el.dataset.id; render(); window.scrollTo(0, 0); return true; }
  if (a === "man-f") {
    const x = manFiche(el.dataset.id); if (!x) return true;
    MAN.vue = "fiche"; MAN.fiche = x.f.id; MAN.cat = x.c.id;
    manS().lu[x.f.id] = true; save(); render(); window.scrollTo(0, 0); return true;
  }
  if (a === "man-todo") { MAN.vue = "todo"; render(); window.scrollTo(0, 0); return true; }
  if (a === "man-carnet") { MAN.vue = "carnet"; render(); window.scrollTo(0, 0); return true; }
  if (a === "man-do") {
    const k = el.dataset.k, D = manS().done;
    if (D[k]) delete D[k]; else { D[k] = today(); toast("Fait. Un truc de moins à craindre."); }
    save(); render(); return true;
  }
  return false;
}

/* recherche : ne redessine que les résultats, pour ne pas perdre le focus */
document.addEventListener("input", ev => {
  if (ev.target && ev.target.id === "man-q") {
    MAN.q = ev.target.value;
    const r = document.getElementById("man-res");
    if (r) r.innerHTML = manResultats();
    const bloc = r && r.parentElement && r.parentElement.nextElementSibling;
    if (bloc) bloc.classList.toggle("hidden", MAN.q.trim().length >= 2);
  }
});
/* carnet : sauvegarde à la volée, sans redessiner (le champ garde le focus) */
document.addEventListener("change", ev => {
  const t = ev.target;
  if (t && t.dataset && t.dataset.cn) { manS().carnet[t.dataset.cn] = t.value.trim(); save(); }
});

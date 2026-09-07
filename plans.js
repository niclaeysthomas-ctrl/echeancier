/* L'ÉCHÉANCIER — PRÉVISION : des plans qu'on allume pour voir ce qu'ils changent */

const PLANS_MODELES = [
  ["📚", "Cours particuliers", [["Cours particuliers", 200, "salaire", "mensuel"]]],
  ["💼", "Job étudiant", [["Salaire job étudiant", 450, "salaire", "mensuel"]]],
  ["🎓", "Alternance", [["Salaire alternance", 900, "salaire", "mensuel"]]],
  ["🚗", "Le permis", [["Auto-école", -1200, "ecole", "ponctuel"]]],
  ["✈️", "Un voyage", [["Voyage", -500, "voyage", "ponctuel"]]],
  ["🏠", "Déménager moins cher", [["Loyer économisé", 150, "logement", "mensuel"]]],
  ["✂️", "Couper des abonnements", [["Abos supprimés", 22, "abos", "mensuel"]]],
  ["🎸", "Acheter du matos", [["Matériel", -300, "shopping", "ponctuel"]]],
  ["🏦", "Un prêt", [["Mensualité du prêt", -150, "credit", "mensuel"]]]
];

/* ---------- vue ---------- */
function vuePlans() {
  const scs = S.scenarios || [];
  const actifs = scs.filter(x => x.actif);
  const H = +(S.reglages.horizonPlan || 365);
  const imp = scs.length ? impact(S, H) : null;
  const seg = [182, 365, 730].map(n =>
    `<button data-a="hplan" data-n="${n}" class="${H === n ? "on" : ""}">${n === 182 ? "6 mois" : (n === 365 ? "1 an" : "2 ans")}</button>`).join("");

  if (!scs.length) return `
    <div class="sec" style="margin-top:14px"><h2>Tes plans</h2>
      <div class="card" style="margin-top:10px">
        <div style="font-size:14.5px;line-height:1.6">Un plan, c&#39;est une hypothèse : <b>« et si je donnais des cours
          particuliers ? »</b>, <b>« et si je passais le permis ? »</b>. Tu l&#39;allumes, tu vois exactement ce que ça
          change à 6 mois, 1 an, 2 ans. Tu peux en combiner plusieurs.</div></div>
    </div>
    <div class="sec"><h2>Pars d&#39;un modèle</h2>${modelesPlans()}</div>
    <div class="sec"><button class="btn" data-a="plan-new">＋ Créer un plan vide</button></div>`;

  return `
  <div class="sec" style="margin-top:14px"><div class="sec-h"><h2>Tes plans</h2>
    <span class="mut" style="font-size:11.5px">${actifs.length} allumé${actifs.length > 1 ? "s" : ""} sur ${scs.length}</span></div>
    ${scs.map(sc => `<div class="row tap" data-a="plan-edit" data-id="${sc.id}">
      <div class="em">${sc.emoji || "🔮"}</div>
      <div class="in"><div class="t">${esc(sc.nom)}</div><div class="s">${esc(resumeScenario(sc))}</div></div>
      <button class="sw ${sc.actif ? "on" : ""}" data-a="plan-tog" data-id="${sc.id}"><i></i></button></div>`).join("")}
    <div class="btns" style="margin-top:8px">
      <button class="btn sm" data-a="plan-new">＋ Nouveau plan</button>
      <button class="btn sm" data-a="plan-mod">⚡ Modèles</button></div>
  </div>
  ${!actifs.length ? `<div class="empty">Allume un plan pour voir ce qu&#39;il change.</div>` : `
  <div class="sec"><h2>Ce que ça change</h2>
    <div class="seg" style="margin-top:10px">${seg}</div>
    ${courbe2(imp.A.map(l => ({ date: l.date, solde: l.solde })).filter((_, i) => i <= H),
              imp.B.map(l => ({ date: l.date, solde: l.solde })).filter((_, i) => i <= H))}
    <div class="cards" style="margin-top:9px">
      <div class="card kpi"><div class="k">Dans 6 mois</div>
        <div class="v num ${cls(imp.avec.m6)}">${fmt0(imp.avec.m6)}</div>
        <div class="s">contre ${fmt0(imp.sans.m6)} sans ces plans, soit ${fmt(imp.diff.m6, true)}</div></div>
      <div class="card kpi"><div class="k">Dans 1 an</div>
        <div class="v num ${cls(imp.avec.an)}">${fmt0(imp.avec.an)}</div>
        <div class="s">contre ${fmt0(imp.sans.an)} sans ces plans</div></div>
    </div>
    <div class="card kpi" style="margin-top:9px"><div class="k">Effet mensuel</div>
      <div class="v num ${cls(imp.parMois)}">${fmt(imp.parMois, true)}<span style="font-size:13px;color:var(--muted)">/mois</span></div>
      <div class="s">c&#39;est ce que ces plans ajoutent (ou retirent) à ton solde, chaque mois en moyenne</div></div>
    ${blocDecouvert(imp)}
    ${blocObjectifPlan(imp, H)}
    ${blocEpargnePlan(imp)}
  </div>
  <div class="sec"><h2>Le détail des plans allumés</h2>
    ${actifs.map(sc => `<div class="card" style="margin-bottom:8px">
      <div style="font-size:14.5px;font-weight:700;margin-bottom:6px">${sc.emoji || "🔮"} ${esc(sc.nom)}</div>
      ${(sc.lignes || []).map(l => `<div style="display:flex;justify-content:space-between;font-size:12.5px;padding:5px 0;border-top:1px solid var(--line)">
        <span>${esc(l.nom)} <span class="mut">· ${l.freq === "ponctuel" ? "une fois le " + jourCourt(l.date)
          : "chaque mois à partir du " + jourCourt(l.date) + (l.fin ? ", jusqu&#39;au " + jourCourt(l.fin) : "")}</span></span>
        <span class="num ${cls(l.montant)}" style="font-weight:600">${fmt(l.montant, true)}</span></div>`).join("")}
    </div>`).join("")}
  </div>`}`;
}

function blocDecouvert(imp) {
  const a = imp.sans.decouv, b = imp.avec.decouv;
  if (!a && !b) return `<div class="alerte al-good" style="margin-top:9px"><div>✅</div><div>
    <b>Aucun passage sous ton matelas</b> ni avant ni après ces plans, sur toute la période.</div></div>`;
  if (a && !b) return `<div class="alerte al-good" style="margin-top:9px"><div>🎉</div><div>
    <b>Ces plans effacent ton découvert</b> Sans eux tu passais sous ton matelas le ${jourCourt(a)}. Avec, jamais.</div></div>`;
  if (!a && b) return `<div class="alerte al-bad" style="margin-top:9px"><div>⚠️</div><div>
    <b>Ces plans te mettent dans le rouge</b> Tu passes sous ton matelas le ${jourCourt(b)}, alors que sans eux ça ne serait jamais arrivé.</div></div>`;
  const gagne = diffJ(a, b);
  if (gagne === 0) return `<div class="alerte al-warn" style="margin-top:9px"><div>⏳</div><div>
    <b>Ça n&#39;empêche pas le trou de septembre</b> Tu passes sous ton matelas le ${jourCourt(b)} dans les deux cas :
    ces plans arrivent après. Ils réparent la suite, pas le mois qui vient.</div></div>`;
  return `<div class="alerte ${gagne > 0 ? "al-warn" : "al-bad"}" style="margin-top:9px"><div>${gagne > 0 ? "⏳" : "⚠️"}</div><div>
    <b>Tu passes toujours sous ton matelas</b> Le ${jourCourt(b)} au lieu du ${jourCourt(a)} —
    ${gagne > 0 ? "tu gagnes " + nJours(gagne) + ", mais le problème reste entier."
      : "soit " + nJours(Math.abs(gagne)) + " plus tôt qu&#39;avant."}</div></div>`;
}
function dateAtteinte(lignes, cible) {
  const l = lignes.find(x => x.solde >= cible);
  return l ? l.date : null;
}
function blocObjectifPlan(imp, H) {
  const o = S.objectif;
  if (!o || !o.montant) return "";
  const cible = +o.montant + (+S.matelas || 0);
  const dA = dateAtteinte(imp.A, cible), dB = dateAtteinte(imp.B, cible);
  if (!dA && !dB) return `<div class="card kpi" style="margin-top:9px"><div class="k">Objectif ${esc(o.nom || "")}</div>
    <div class="v num">Hors de portée</div>
    <div class="s">Même avec ces plans, tu n&#39;atteins pas ${fmt0(o.montant)} sur la période affichée.</div></div>`;
  if (dA && !dB) return "";
  return `<div class="card kpi" style="margin-top:9px"><div class="k">🎯 Objectif ${esc(o.nom || "")}</div>
    <div class="v pos num">${jourCourt(dB)}</div>
    <div class="s">${dA ? "au lieu du " + jourCourt(dA) + " — soit " + nJours(Math.abs(diffJ(dB, dA))) + " plus tôt"
      : "avec ces plans tu y arrives, alors que sans eux tu n&#39;y arrivais pas sur la période"}</div></div>`;
}
function blocEpargnePlan(imp) {
  const e = epargne(S);
  if (!e.total) return "";
  const b = bilan(S);
  const netAvec = b.netMois + imp.parMois;
  if (b.netMois >= 0 && netAvec >= 0) return "";
  if (b.netMois < 0 && netAvec >= 0) return `<div class="alerte al-good" style="margin-top:9px"><div>🐖</div><div>
    <b>Tu arrêtes de puiser dans ton épargne</b> Sans ces plans tu perdais ${fmt0(-b.netMois)} par mois.
    Avec, ton train de vie tient tout seul — tes ${fmt0(e.total)} restent intacts.</div></div>`;
  const moisAvant = e.total / Math.abs(b.netMois), moisApres = e.total / Math.abs(netAvec);
  const dit = m => m >= 120 ? "plus de 10 ans" : (m >= 24 ? (m / 12).toFixed(1).replace(".0", "").replace(".", ",") + " ans" : Math.floor(m) + " mois");
  return `<div class="alerte ${moisApres >= 60 ? "al-good" : "al-warn"}" style="margin-top:9px"><div>🐖</div><div>
    <b>Ton épargne tient ${dit(moisApres)}</b> au lieu de ${dit(moisAvant)} —
    tu ne perds plus que ${fmt0(-netAvec)} par mois, contre ${fmt0(-b.netMois)} aujourd&#39;hui.</div></div>`;
}
function modelesPlans() {
  return PLANS_MODELES.map((m, i) => `<div class="row tap" data-a="plan-mod-add" data-i="${i}">
    <div class="em">${m[0]}</div>
    <div class="in"><div class="t">${esc(m[1])}</div>
      <div class="s">${m[2].map(l => (l[1] > 0 ? "+" : "") + l[1] + " €" + (l[3] === "ponctuel" ? " une fois" : "/mois")).join(" · ")}</div></div>
    <div class="m mut">＋</div></div>`).join("");
}

/* ---------- édition ---------- */
let PL = null;
function editPlan(id) {
  PL = (S.scenarios || []).find(x => x.id === id) || null;
  if (!PL) { PL = { id: uid(), nom: "", emoji: "🔮", actif: true, lignes: [] }; S.scenarios = S.scenarios || []; S.scenarios.push(PL); }
  dessinePlan();
}
function dessinePlan() {
  const emos = ["🔮", "📚", "💼", "🎓", "🚗", "✈️", "🏠", "✂️", "🎸", "🏦", "🥊", "💡"];
  openSheet(`<h3>${PL.nom ? esc(PL.nom) : "Nouveau plan"}</h3>
  <div class="sub">Ajoute ce que ce plan change : un revenu en plus, une dépense, ou les deux.</div>
  <div class="f"><label>Nom du plan</label><input id="pl-nom" value="${esc(PL.nom)}" placeholder="Cours particuliers, permis…" autocomplete="off"></div>
  <div class="f"><label>Icône</label><div class="cgrid" style="grid-template-columns:repeat(6,1fr)">
    ${emos.map(e => `<button data-a="pl-emo" data-e="${e}" class="${PL.emoji === e ? "on" : ""}"><span class="e">${e}</span></button>`).join("")}</div></div>
  <h2 style="margin:18px 0 8px">Les lignes de ce plan</h2>
  ${(PL.lignes || []).length ? PL.lignes.map(l => `<div class="row tap" data-a="pl-ligne" data-l="${l.id}">
    <div class="em">${cat(l.cat).e}</div>
    <div class="in"><div class="t">${esc(l.nom)}</div>
      <div class="s">${l.freq === "ponctuel" ? "Une fois · " + jourCourt(l.date)
        : "Chaque mois dès " + jourCourt(l.date) + (l.fin ? " → " + jourCourt(l.fin) : "")}</div></div>
    <div class="m ${cls(l.montant)} num">${fmt(l.montant, true)}</div></div>`).join("")
    : '<div class="mini">Aucune ligne pour l&#39;instant.</div>'}
  <button class="btn sm" style="margin-top:6px" data-a="pl-ligne">＋ Ajouter une ligne</button>
  <button class="btn pri" style="margin-top:14px" data-a="pl-save">Enregistrer</button>
  <button class="btn dan" style="margin-top:8px" data-a="pl-del">Supprimer ce plan</button>
  <button class="btn sm" style="margin-top:8px;border:none;color:var(--muted)" data-a="close">Fermer</button>`);
}
let PLL = null;
function editLigne(lid) {
  const e = document.getElementById("pl-nom"); if (e) PL.nom = e.value;
  PLL = (PL.lignes || []).find(x => x.id === lid) ||
    { id: uid(), nom: "", montant: 0, cat: "divers", freq: "mensuel", date: today(), fin: null, sens: 1 };
  PLL.sens = PLL.montant >= 0 ? 1 : -1;
  dessineLigne();
}
function dessineLigne() {
  const grille = Object.keys(CATS).map(k =>
    `<button data-a="pll-cat" data-k="${k}" class="${PLL.cat === k ? "on" : ""}"><span class="e">${CATS[k].e}</span>${CATS[k].n}</button>`).join("");
  openSheet(`<h3>Une ligne du plan</h3>
  <div class="sub">Ce que ça rapporte ou ce que ça coûte, et à partir de quand.</div>
  <div class="f"><label>Quoi</label><input id="pll-nom" value="${esc(PLL.nom)}" placeholder="Cours particuliers, auto-école…" autocomplete="off"></div>
  <div class="f"><label>Sens</label><div class="pick">
    <button data-a="pll-sens" data-v="1" class="${PLL.sens > 0 ? "on in" : ""}">↑ Ça rapporte</button>
    <button data-a="pll-sens" data-v="-1" class="${PLL.sens < 0 ? "on out" : ""}">↓ Ça coûte</button></div></div>
  <div class="f2">
    <div class="f"><label>Montant (€)</label><input id="pll-m" type="number" inputmode="decimal" step="0.01"
      value="${PLL.montant ? Math.abs(PLL.montant) : ""}" placeholder="0"></div>
    <div class="f"><label>Rythme</label><div class="pick" style="gap:4px">
      <button data-a="pll-freq" data-v="mensuel" class="${PLL.freq !== "ponctuel" ? "on" : ""}" style="font-size:11px">Chaque mois</button>
      <button data-a="pll-freq" data-v="ponctuel" class="${PLL.freq === "ponctuel" ? "on" : ""}" style="font-size:11px">Une fois</button>
    </div></div></div>
  <div class="f2">
    <div class="f"><label>${PLL.freq === "ponctuel" ? "Date" : "À partir du"}</label>
      <input id="pll-d" type="date" value="${PLL.date}"></div>
    ${PLL.freq !== "ponctuel" ? `<div class="f"><label>Jusqu&#39;au (facultatif)</label>
      <input id="pll-f" type="date" value="${PLL.fin || ""}"></div>` : "<div></div>"}</div>
  <div class="f"><label>Catégorie</label><div class="cgrid">${grille}</div></div>
  <button class="btn pri" data-a="pll-save">Enregistrer la ligne</button>
  ${(PL.lignes || []).some(x => x.id === PLL.id) ? `<button class="btn dan" style="margin-top:8px" data-a="pll-del">Supprimer la ligne</button>` : ""}
  <button class="btn sm" style="margin-top:8px;border:none;color:var(--muted)" data-a="pl-retour">Retour au plan</button>`);
}
function litLigne() {
  const g = k => (document.getElementById(k) || {}).value;
  if (g("pll-nom") !== undefined) PLL.nom = g("pll-nom") || "";
  if (g("pll-m") !== undefined) PLL.montant = Math.abs(parseFloat(String(g("pll-m")).replace(",", ".")) || 0) * PLL.sens;
  if (g("pll-d") !== undefined) PLL.date = g("pll-d") || today();
  if (g("pll-f") !== undefined) PLL.fin = g("pll-f") || null;
}
function sauveLigne() {
  litLigne();
  if (!PLL.nom.trim()) return toast("Il manque le nom");
  if (!PLL.montant) return toast("Il manque le montant");
  PL.lignes = PL.lignes || [];
  const i = PL.lignes.findIndex(x => x.id === PLL.id);
  const l = { id: PLL.id, nom: PLL.nom.trim(), montant: PLL.montant, cat: PLL.cat, freq: PLL.freq, date: PLL.date, fin: PLL.fin };
  if (i >= 0) PL.lignes[i] = l; else PL.lignes.push(l);
  save(); recalc(); render(); dessinePlan();
}
function sauvePlan() {
  const e = document.getElementById("pl-nom"); if (e) PL.nom = e.value;
  if (!PL.nom.trim()) return toast("Donne un nom à ton plan");
  PL.nom = PL.nom.trim();
  save(); closeSheet(); recalc(); render(); toast("Plan enregistré ✓");
}
function ajouteModelePlan(i) {
  const m = PLANS_MODELES[i];
  const sc = { id: uid(), nom: m[1], emoji: m[0], actif: true,
    lignes: m[2].map(l => ({ id: uid(), nom: l[0], montant: l[1], cat: l[2], freq: l[3],
      date: l[3] === "ponctuel" ? addM(today(), 1) : moisDe(addM(today(), 1)) + "-05", fin: null })) };
  S.scenarios = S.scenarios || [];
  S.scenarios.push(sc);
  save(); recalc(); render();
  PL = sc; dessinePlan();
  toast("Plan ajouté — ajuste les montants");
}

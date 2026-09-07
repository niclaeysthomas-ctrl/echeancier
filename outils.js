/* L'ÉCHÉANCIER — outils : saisie éclair, mise en route, simulateur, objectif, tendances */

/* ============ 1. SAISIE ÉCLAIR ============
   Noter une dépense en deux gestes : je tape le montant, je tape la catégorie. C'est enregistré. */
let EC = null;
function eclair(date) {
  EC = { v: "", nom: "", date: date || today(), sens: -1 };
  dessineEclair();
}
function catsFrequentes() {
  const n = {};
  for (const r of S.reels) if (r.montant < 0) n[r.cat] = (n[r.cat] || 0) + 1;
  const tri = Object.keys(n).sort((a, b) => n[b] - n[a]);
  const def = ["courses", "resto", "sorties", "transport", "shopping", "sante", "abos", "divers"];
  const out = [];
  for (const k of [...tri, ...def]) if (!out.includes(k) && out.length < 8) out.push(k);
  return out;
}
function dessineEclair() {
  const val = EC.v || "0";
  const touche = t => `<button class="tk" data-a="ec-t" data-t="${t}">${t}</button>`;
  const jrs = [["Aujourd&#39;hui", today()], ["Hier", addJ(today(), -1)], ["Avant-hier", addJ(today(), -2)]];
  openSheet(`
  <div class="ec-top">
    <div class="ec-sens">
      <button data-a="ec-sens" data-v="-1" class="${EC.sens < 0 ? "on out" : ""}">Dépense</button>
      <button data-a="ec-sens" data-v="1" class="${EC.sens > 0 ? "on in" : ""}">Rentrée</button>
    </div>
    <div class="ec-val ${EC.sens < 0 ? "neg" : "pos"} num">${EC.sens < 0 ? "−" : "+"}${val}<span class="cur"> €</span></div>
    <input id="ec-nom" class="ec-nom" value="${esc(EC.nom)}" placeholder="Libellé (facultatif)" autocomplete="off">
  </div>
  <div class="ec-dates">${jrs.map(([lab, d]) =>
    `<button data-a="ec-date" data-d="${d}" class="${EC.date === d ? "on" : ""}">${lab}</button>`).join("")}
    <button data-a="ec-cal" class="${jrs.some(x => x[1] === EC.date) ? "" : "on"}">${jrs.some(x => x[1] === EC.date) ? "📅" : jourCourt(EC.date)}</button></div>
  <div class="pad">
    ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(touche).join("")}
    ${touche(",")}${touche(0)}
    <button class="tk" data-a="ec-del">⌫</button>
  </div>
  <div class="ec-lab">Choisis la catégorie — c&#39;est enregistré</div>
  <div class="cgrid">${catsFrequentes().map(k =>
    `<button data-a="ec-ok" data-k="${k}"><span class="e">${CATS[k].e}</span>${CATS[k].n}</button>`).join("")}</div>
  <div class="btns" style="margin-top:10px">
    <button class="btn sm" data-a="ec-plus">Toutes les catégories</button>
    <button class="btn sm" data-a="ec-form">Formulaire complet</button></div>
  <button class="btn sm" style="margin-top:8px;border:none;color:var(--muted)" data-a="close">Fermer</button>`);
}
function ecTape(t) {
  const e = document.getElementById("ec-nom"); if (e) EC.nom = e.value;
  if (t === ",") { if (!EC.v.includes(",")) EC.v = (EC.v || "0") + ","; }
  else if (EC.v.includes(",") && EC.v.split(",")[1].length >= 2) return;
  else if (EC.v.length < 8) EC.v = (EC.v === "0" ? "" : EC.v) + t;
  dessineEclair();
}
function ecValide(k) {
  const e = document.getElementById("ec-nom"); if (e) EC.nom = e.value;
  const m = parseFloat((EC.v || "0").replace(",", "."));
  if (!m) return toast("Tape un montant d\u2019abord");
  S.reels.push({ id: uid(), date: EC.date, montant: Math.abs(m) * EC.sens, cat: k, nom: EC.nom.trim() });
  save(); closeSheet(); recalc(); render();
  toast(CATS[k].e + " " + fmt(Math.abs(m) * EC.sens, true) + " noté");
}

/* ============ 2. MISE EN ROUTE ============
   Tout saisir d'un coup au lieu d'ouvrir quinze formulaires. */
const DEPART = [
  ["Ce qui rentre", [
    ["Salaire / alternance", "salaire", 1, "rec", 28], ["APL / CAF", "aides", 1, "rec", 5],
    ["Aide des parents", "famille", 1, "rec", 1], ["Bourse", "aides", 1, "rec", 5]]],
  ["Le toit et les factures", [
    ["Loyer", "logement", -1, "rec", 5], ["Charges", "logement", -1, "rec", 5],
    ["Électricité", "energie", -1, "rec", 10], ["Internet", "telecom", -1, "rec", 12],
    ["Forfait mobile", "telecom", -1, "rec", 15], ["Assurance habitation", "assurance", -1, "rec", 10]]],
  ["Les prélèvements du quotidien", [
    ["Transport (Navigo…)", "transport", -1, "rec", 1], ["Salle de sport", "sport", -1, "rec", 1],
    ["Mutuelle", "sante", -1, "rec", 5], ["Netflix", "abos", -1, "rec", 20],
    ["Spotify", "abos", -1, "rec", 20], ["Frais bancaires", "banque", -1, "rec", 30],
    ["Épargne automatique", "epargne", -1, "rec", 2]]],
  ["Tes enveloppes du mois", [
    ["Courses", "courses", -1, "env", 1], ["Restos & livraisons", "resto", -1, "env", 1],
    ["Sorties", "sorties", -1, "env", 1], ["Essence", "transport", -1, "env", 1],
    ["Shopping", "shopping", -1, "env", 1]]]
];
function sheetDepart() {
  let i = 0;
  const bloc = (titre, arr) => `<h2 style="margin:18px 0 8px">${titre}</h2>` + arr.map(([nom, c, sens, type, jour]) => {
    const k = i++;
    return `<div class="dl">
      <div class="dl-n">${CATS[c].e} ${esc(nom)}</div>
      <input class="dl-m" id="d-m-${k}" type="number" inputmode="decimal" step="0.01" placeholder="—"
        data-nom="${esc(nom)}" data-cat="${c}" data-sens="${sens}" data-type="${type}">
      ${type === "env" ? '<span class="dl-j mut">/mois</span>'
        : `<input class="dl-j" id="d-j-${k}" type="number" min="1" max="31" value="${jour}" title="jour du mois">`}
    </div>`;
  }).join("");
  openSheet(`<h3>Mise en route</h3>
  <div class="sub">Remplis seulement ce qui te concerne, laisse le reste vide. Montant, et le jour du mois où ça tombe.
    Tu pourras tout corriger après.</div>
  ${DEPART.map(([t, a]) => bloc(t, a)).join("")}
  <button class="btn pri" style="margin-top:16px" data-a="dep-save">Créer mes flux</button>
  <button class="btn sm" style="margin-top:8px;border:none;color:var(--muted)" data-a="close">Plus tard</button>`);
}
function departSave() {
  let n = 0;
  document.querySelectorAll(".dl-m").forEach(inp => {
    const v = Math.abs(parseFloat(String(inp.value).replace(",", ".")) || 0);
    if (!v) return;
    const d = inp.dataset, id = inp.id.replace("d-m-", "d-j-");
    const ji = document.getElementById(id);
    const jour = ji ? Math.max(1, Math.min(31, +ji.value || 1)) : 1;
    const sens = +d.sens, env = d.type === "env";
    if (env && S.flux.some(x => x.enveloppe && x.actif && x.cat === d.cat)) return;
    const date = `${moisDe(today())}-${String(jour).padStart(2, "0")}`;
    S.flux.push({
      id: uid(), nom: d.nom, montant: v * sens, cat: d.cat, actif: true,
      wk: env ? "aucun" : (sens > 0 ? "avant" : "apres"), enveloppe: env, freq: "mensuel",
      date, debut: env ? null : date, fin: null, jour, mois: +date.slice(5, 7)
    });
    n++;
  });
  if (!n) return toast("Rien de rempli");
  save(); closeSheet(); recalc(); render();
  toast(n + " flux créés ✓");
}

/* ============ 3. SIMULATEUR « ET SI ? » ============ */
let SIM = null;
function sheetSimu(pre) {
  SIM = SIM || { v: "", nom: "", date: today(), mode: "once" };
  if (pre) Object.assign(SIM, pre);
  dessineSimu();
}
function litSimu() {
  const g = k => (document.getElementById(k) || {}).value;
  if (g("si-m") !== undefined) SIM.v = g("si-m");
  if (g("si-n") !== undefined) SIM.nom = g("si-n");
  if (g("si-d") !== undefined) SIM.date = g("si-d") || today();
}
function dessineSimu() {
  const m = Math.abs(parseFloat(String(SIM.v).replace(",", ".")) || 0);
  let r = null, verdict = "";
  if (m) {
    if (SIM.mode === "once") r = simule(S, m, SIM.date, PROJ);
    else {
      const S2 = JSON.parse(JSON.stringify(S));
      S2.flux.push({ id: "sim", nom: SIM.nom || "Simulation", montant: -m, cat: "divers", actif: true,
        wk: "apres", enveloppe: false, freq: "mensuel", date: SIM.date, debut: SIM.date, fin: null,
        jour: +SIM.date.slice(8, 10), mois: +SIM.date.slice(5, 7) });
      const L2 = projection(S2, 400).filter(l => l.date >= today());
      const L1 = PROJ.filter(l => l.date >= today());
      const min2 = L2.reduce((a, l) => Math.min(a, l.solde), Infinity);
      const bas2 = L2.reduce((a, l) => l.solde < a.solde ? l : a, L2[0]);
      r = { montant: m, date: SIM.date, seuil: +S.matelas || 0,
        avantMin: L1.reduce((a, l) => Math.min(a, l.solde), Infinity), apresMin: min2,
        dateBas: bas2.date, ok: min2 >= (+S.matelas || 0), manque: Math.max(0, (+S.matelas || 0) - min2),
        possible: null, soldeApres: L2[L2.length - 1].solde,
        courbe: L2.map(l => ({ date: l.date, solde: l.solde })) };
    }
  }
  if (r) {
    verdict = r.ok
      ? `<div class="alerte al-good"><div>✅</div><div><b>Oui, tu peux</b>
          Même après, ton point le plus bas reste ${fmt(r.apresMin)} (le ${jourCourt(r.dateBas)}) —
          ${fmt0(r.apresMin - r.seuil)} de marge au-dessus de ton matelas.
          ${r.juste ? "<br>C&#39;est jouable mais serré : un imprévu et tu y passes." : ""}</div></div>`
      : r.avantMin < r.seuil
      ? `<div class="alerte al-warn"><div>🪞</div><div><b>Ce n&#39;est pas cette dépense, le problème</b>
          Même sans elle, tu passes déjà sous ton matelas (${fmt(r.avantMin)} au plus bas).
          Avec, tu descends à ${fmt(r.apresMin)} le ${jourCourt(r.dateBas)}
          — à régler avant : ${fmt0(r.seuil - r.avantMin)} manquent déjà à ta trajectoire.</div></div>`
      : `<div class="alerte al-bad"><div>⛔️</div><div><b>Non, pas comme ça</b>
          Ça te fait tomber à ${fmt(r.apresMin)} le ${jourCourt(r.dateBas)}, soit ${fmt0(r.manque)} sous ton matelas.
          ${r.possible ? "En revanche, à partir du <b>" + jourCourt(r.possible) + "</b>, ça passe."
            : "Il faudrait " + fmt0(r.manque) + " de plus, ou étaler la dépense."}</div></div>`;
  }
  openSheet(`<h3>Et si… ?</h3>
  <div class="sub">Une envie, un projet, un imprévu. L&#39;app te dit si ça passe — et sinon, à partir de quand.</div>
  <div class="f2">
    <div class="f"><label>Montant (€)</label><input id="si-m" type="number" inputmode="decimal" step="0.01"
      value="${SIM.v}" placeholder="0"></div>
    <div class="f"><label>Quand</label><input id="si-d" type="date" value="${SIM.date}"></div></div>
  <div class="f"><label>C&#39;est quoi</label><input id="si-n" value="${esc(SIM.nom)}" placeholder="Guitare, week-end, permis…" autocomplete="off"></div>
  <div class="f"><label>Rythme</label><div class="pick">
    <button data-a="si-mode" data-v="once" class="${SIM.mode === "once" ? "on" : ""}">Une fois</button>
    <button data-a="si-mode" data-v="mois" class="${SIM.mode === "mois" ? "on" : ""}">Chaque mois</button></div></div>
  <button class="btn pri" data-a="si-go">Calculer</button>
  ${m ? `<div style="margin-top:14px">${verdict}
    ${courbe2(PROJ.filter(l => l.date >= today()), r.courbe)}
    <div class="cards" style="margin-top:9px">
      <div class="card kpi"><div class="k">Point bas sans</div><div class="v num ${cls(r.avantMin)}">${fmt0(r.avantMin)}</div></div>
      <div class="card kpi"><div class="k">Point bas avec</div><div class="v num ${cls(r.apresMin)}">${fmt0(r.apresMin)}</div></div></div>
    ${SIM.mode === "once" && !r.ok ? (() => {
      const j = Math.max(1, diffJ(today(), SIM.date));
      const besoin = r.manque;
      return `<div class="mini" style="margin-top:10px">Pour que ça passe à cette date, il te faut
        <b>${fmt0(besoin)}</b> de plus — soit ${j >= 60 ? fmt0(besoin / (j / 30.44)) + " par mois" : fmt0(besoin / (j / 7)) + " par semaine"}
        à mettre de côté (ou à ne pas dépenser) d&#39;ici là.</div>`; })() : ""}
    <button class="btn" style="margin-top:10px" data-a="si-add">Ajouter pour de vrai à mon échéancier</button>` : ""}
  <button class="btn sm" style="margin-top:8px;border:none;color:var(--muted)" data-a="close">Fermer</button>`);
}
function courbe2(avant0, apres0) {
  const W = 320, H = 110, p = 4;
  const pas = Math.max(1, Math.ceil(Math.max(avant0.length, apres0.length) / 160));
  const avant = echantillonne(avant0, 160, pas).pts;
  const apres = echantillonne(apres0, 160, pas).pts;
  const all = [...avant.map(l => l.solde), ...apres.map(l => l.solde), +S.matelas || 0, 0];
  let mn = Math.min(...all), mx = Math.max(...all);
  if (mx - mn < 10) { mx += 5; mn -= 5; }
  const mg = (mx - mn) * .1; mn -= mg; mx += mg;
  const n = Math.max(avant.length, apres.length);
  const X = i => p + i * (W - 2 * p) / Math.max(1, n - 1);
  const Y = v => H - p - (v - mn) * (H - 2 * p) / (mx - mn);
  const d = a => "M" + a.map((l, i) => X(i) + "," + Y(l.solde).toFixed(1)).join("L");
  const ys = Y(+S.matelas || 0);
  const coulA = "#5b8def";
  const coulB = apres.reduce((a, l) => Math.min(a, l.solde), Infinity) < (+S.matelas || 0) ? "#ff5f5f" : "#3ddc97";
  return `<div class="chart" style="margin-top:9px"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
    <line x1="0" y1="${ys.toFixed(1)}" x2="${W}" y2="${ys.toFixed(1)}" stroke="#f5c451" stroke-width="1" stroke-dasharray="2 4" opacity=".55"/>
    <path d="${d(avant)}" fill="none" stroke="${coulA}" stroke-width="1.6" opacity=".6" vector-effect="non-scaling-stroke"/>
    <path d="${d(apres)}" fill="none" stroke="${coulB}" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>
    <div style="display:flex;gap:12px;font-size:10.5px;color:var(--dim);padding:2px 2px 6px;flex-wrap:wrap">
      <span><b style="color:${coulA}">—</b> sans</span><span><b style="color:${coulB}">—</b> avec</span>
      <span>matelas ${fmt0(+S.matelas || 0)}</span>
      ${pas > 1 ? `<span style="margin-left:auto">creux par ${pas === 7 ? "semaine" : pas + " jours"}</span>` : ""}</div></div>`;
}

/* ============ 4. OBJECTIF D'ÉPARGNE ============ */
function sheetObjectif() {
  const o = S.objectif || {};
  openSheet(`<h3>Mon objectif</h3>
  <div class="sub">Un montant que tu veux avoir sur ton compte à une date. L&#39;app calcule ce qu&#39;il faut mettre
    de côté et te dit si ta trajectoire actuelle y arrive.</div>
  <div class="f"><label>C&#39;est pour quoi</label><input id="o-nom" value="${esc(o.nom || "")}" placeholder="Permis, voyage, matelas de sécurité…" autocomplete="off"></div>
  <div class="f2">
    <div class="f"><label>Montant (€)</label><input id="o-m" type="number" inputmode="decimal" step="10" value="${o.montant || ""}" placeholder="0"></div>
    <div class="f"><label>Pour quand</label><input id="o-d" type="date" value="${o.date || addJ(today(), 180)}"></div></div>
  <button class="btn pri" data-a="o-save">Enregistrer</button>
  ${o.montant ? `<button class="btn dan" style="margin-top:8px" data-a="o-del">Supprimer l&#39;objectif</button>` : ""}
  <button class="btn sm" style="margin-top:8px;border:none;color:var(--muted)" data-a="close">Annuler</button>`);
}
function htmlObjectif() {
  const e = objectifEtat(S, PROJ);
  if (!e) return `<div class="sec"><button class="btn" data-a="objectif">🎯 Me fixer un objectif d&#39;épargne</button></div>`;
  return `<div class="sec"><div class="sec-h"><h2>Objectif</h2>
    <button class="tag" data-a="objectif">modifier</button></div>
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:baseline">
        <div style="font-size:16px;font-weight:700">🎯 ${esc(e.nom)}</div>
        <div class="num" style="font-size:15px;font-weight:700">${fmt0(e.montant)}</div></div>
      <div class="mut" style="font-size:11.5px;margin-top:2px">pour le ${jourCourt(e.date)} · dans ${nJours(e.jours)}</div>
      <div class="bar" style="height:9px;margin-top:10px"><i style="width:${e.pct}%;background:${e.atteint ? "var(--good)" : "var(--warn)"}"></i></div>
      <div style="font-size:12.5px;margin-top:9px;line-height:1.5">
        ${e.atteint
          ? `<b class="pos">Tu y es.</b> À ce rythme tu auras ${fmt0(e.prevu)} le ${jourCourt(e.date)}, soit ${fmt0(e.prevu - e.cible)} de plus que nécessaire.`
          : `À ce rythme tu auras <b>${fmt0(e.prevu)}</b> — il te manque <b class="neg">${fmt0(e.manque)}</b>.
             Soit <b>${fmt0(e.parMois)} de plus par mois</b> (${fmt0(e.parJour)} par jour) à trouver ou à ne pas dépenser.`}
        ${e.creuxAvant !== null && e.creuxAvant < (+S.matelas || 0)
          ? `<br><span class="mut">⚠️ Attention : d&#39;ici là tu descends jusqu&#39;à ${fmt(e.creuxAvant)}, il faudra tenir.</span>` : ""}
      </div></div></div>`;
}

/* ============ 5. SECTIONS ============ */
function htmlSemaine() {
  const t = today();
  const L = PROJ.filter(l => l.date >= t && l.date <= addJ(t, 7));
  if (!L.length) return "";
  const evts = [];
  for (const l of L) for (const e of l.evts) evts.push({ ...e, date: l.date });
  const sort = evts.filter(e => e.montant < 0).reduce((s, e) => s + e.montant, 0);
  const entr = evts.filter(e => e.montant > 0).reduce((s, e) => s + e.montant, 0);
  const fin = L[L.length - 1];
  return `<div class="sec"><div class="sec-h"><h2>Les 7 prochains jours</h2>
    <span class="mut" style="font-size:11.5px">solde le ${jourCourt(fin.date)} : <b class="${cls(fin.solde)}">${fmt0(fin.solde)}</b></span></div>
    ${evts.length ? evts.sort((a, b) => a.montant - b.montant).slice(0, 5).map(e => `
      <div class="row"><div class="em">${cat(e.cat).e}</div>
        <div class="in"><div class="t">${esc(e.nom)}</div><div class="s">${e.date === t ? "Aujourd&#39;hui" : (e.date === addJ(t, 1) ? "Demain" : maj1(jourCourt(e.date)))}</div></div>
        <div class="m ${cls(e.montant)} num">${fmt(e.montant, true)}</div></div>`).join("")
      + (evts.length > 5 ? `<div class="mut" style="font-size:11.5px;text-align:center;padding:4px">…et ${evts.length - 5} autres</div>` : "")
      : '<div class="card mut" style="font-size:13px">Rien de prévu cette semaine.</div>'}
    ${entr || sort ? `<div class="mut" style="font-size:12px;margin-top:8px;text-align:center">
      ${sort ? "à sortir : <b class=\"neg\">" + fmt0(sort) + "</b>" : ""}${entr && sort ? " · " : ""}${entr ? "à rentrer : <b class=\"pos\">" + fmt0(entr) + "</b>" : ""}</div>` : ""}
  </div>`;
}
function htmlProvisions() {
  const p = provisions(S);
  if (!p.liste.length) return "";
  return `<div class="sec"><div class="sec-h"><h2>À mettre de côté</h2>
    <span class="warn num" style="font-size:13px;font-weight:700;color:var(--warn)">${fmt0(p.mois)}/mois</span></div>
    <div class="card">
      <div style="font-size:12.5px;line-height:1.55;margin-bottom:10px">Ces échéances ne tombent pas tous les mois.
        Si tu mets <b>${fmt0(p.mois)}</b> de côté chaque mois, elles ne te surprendront jamais.</div>
      ${p.liste.map(x => `<div style="display:flex;justify-content:space-between;font-size:13px;padding:6px 0;border-top:1px solid var(--line)">
        <span>${cat(x.f.cat).e} ${esc(x.f.nom)} <span class="mut" style="font-size:11px">· ${fmt0(x.f.montant)} ${FREQ[x.f.freq].n.toLowerCase()}${x.prochaine ? ", le " + jourCourt(x.prochaine) : ""}</span></span>
        <span class="num" style="font-weight:600">${fmt0(x.mois)}</span></div>`).join("")}
    </div></div>`;
}
function htmlHisto() {
  const h = histoMois(S, 6).filter(x => x.n > 0);
  if (h.length < 1) return "";
  const max = Math.max(...h.map(x => Math.abs(x.sorties)), 1);
  const tend = tendances(S, 3);
  const derives = tend.liste.filter(x => x.ecart !== null && x.ecart > .15 && x.projete < -20).slice(0, 3);
  return `<div class="sec"><h2>Tes mois, pour de vrai</h2>
    <div class="mini" style="margin-top:8px">D&#39;après ce que tu as noté. Plus tu notes, plus c&#39;est juste.</div>
    ${h.map(x => `<div class="card" style="margin-bottom:8px">
      <div style="display:flex;justify-content:space-between;align-items:baseline">
        <div style="font-size:14px;font-weight:600">${nomMois(x.mois)}
          <span class="mut" style="font-size:11px">· ${x.n} opération${x.n > 1 ? "s" : ""}</span></div>
        <div class="num" style="font-size:14px;font-weight:700"><span class="neg">${fmt0(x.sorties)}</span>${x.entrees ? ' <span class="mut"> · </span><span class="pos">' + fmt0(x.entrees) + "</span>" : ""}</div></div>
      <div class="bar"><i style="width:${Math.abs(x.sorties) / max * 100}%;background:var(--bad);opacity:.75"></i></div>
      <div class="mut" style="font-size:11.5px;margin-top:6px">${x.cats.slice(0, 3).map(c => cat(c.cat).e + " " + fmt0(c.v)).join(" · ") || "—"}</div>
    </div>`).join("")}
    ${derives.length ? `<div class="alerte al-warn" style="margin-top:4px"><div>📈</div><div><b>Ça dérape ce mois-ci</b>
      ${derives.map(d => cat(d.cat).n + " : " + fmt0(d.projete) + " à ce rythme, contre " + fmt0(d.moyenne) + " d&#39;habitude (+" + Math.round(d.ecart * 100) + " %)").join("<br>")}</div></div>` : ""}
  </div>`;
}

/* ============ 6. COMMENT ÇA CALCULE ============ */
function sheetAide() {
  openSheet(`<h3>Comment l&#39;app calcule</h3>
  <div class="sub">Pour que tu saches d&#39;où sortent les chiffres — et quand ils mentent.</div>
  ${[
    ["🎯 Ton solde est le point de départ",
     "Tout part du solde que tu recopies depuis ta banque, et de sa date. L&#39;app ne projette que ce qui vient après. Mets-le à jour une fois par semaine et la projection reste juste : tout le passé se purge tout seul."],
    ["📅 Les prélèvements suivent les jours ouvrés",
     "Un prélèvement qui tombe un samedi ou un férié passe le lundi ; un salaire, lui, tombe le vendredi d&#39;avant. Les fériés français sont calculés (Pâques comprise), donc les dates sont celles de ta banque, pas celles du calendrier théorique."],
    ["🧺 Les enveloppes se vident, elles ne s&#39;ajoutent pas",
     "Une enveloppe (courses, sorties) est un budget mensuel. Il est étalé sur les jours du mois, et chaque dépense que tu notes dans cette catégorie le consomme au lieu de s&#39;ajouter. Si tu dépasses, le dépassement compte en plus."],
    ["🔁 Le double comptage est bloqué",
     "Si tu notes une dépense qui ressemble à une échéance prévue (même sens, montant à 4 % près, à 4 jours près), l&#39;app comprend que c&#39;est la même opération. La prévision passe en « déjà passé » et n&#39;est comptée qu&#39;une fois."],
    ["💶 Le reste à vivre va jusqu&#39;à ta prochaine rentrée d&#39;argent",
     "Pas jusqu&#39;à la fin du mois : jusqu&#39;au jour où de l&#39;argent rentre. On retire ce qui est déjà engagé d&#39;ici là, les enveloppes restantes et ton matelas. Ce qui reste est vraiment à toi."],
    ["⚠️ Ce que l&#39;app ne sait pas",
     "Elle ne voit que ce que tu lui donnes. Si tu ne notes pas tes dépenses du quotidien, la projection sera trop optimiste. Les enveloppes servent justement à couvrir ça sans tout saisir."]
  ].map(([t, d]) => `<div class="card" style="margin-bottom:8px">
    <div style="font-size:14px;font-weight:700;margin-bottom:5px">${t}</div>
    <div style="font-size:12.5px;line-height:1.6;color:var(--muted)">${d}</div></div>`).join("")}
  <button class="btn sm" style="margin-top:8px;border:none;color:var(--muted)" data-a="close">Fermer</button>`);
}

/* ============ 7. ÉPARGNE ============ */
function sheetLivrets() {
  const l = (S.livrets || []).slice();
  while (l.length < 4) l.push({ nom: "", montant: "", taux: "" });
  openSheet(`<h3>Mon épargne</h3>
  <div class="sub">Tes livrets, à côté du compte courant. L&#39;app s&#39;en sert pour te dire combien de temps
    tu tiens si tu dépenses plus que tu ne gagnes — et ce que ça te coûte de piocher dedans.</div>
  ${l.map((x, i) => `<div class="f2" style="grid-template-columns:1.4fr 1fr;margin-bottom:9px">
    <div class="f" style="margin:0"><label>${i === 0 ? "Nom du livret" : "&nbsp;"}</label>
      <input id="lv-n-${i}" value="${esc(x.nom || "")}" placeholder="Livret A" autocomplete="off"></div>
    <div class="f" style="margin:0"><label>${i === 0 ? "Montant (€)" : "&nbsp;"}</label>
      <input id="lv-m-${i}" type="number" inputmode="decimal" step="0.01" value="${x.montant || ""}" placeholder="0"></div>
  </div>`).join("")}
  <button class="btn pri" style="margin-top:6px" data-a="lv-save">Enregistrer</button>
  <button class="btn sm" style="margin-top:8px;border:none;color:var(--muted)" data-a="close">Annuler</button>`);
}
function livretsSave() {
  const out = [];
  for (let i = 0; i < 4; i++) {
    const n = (document.getElementById("lv-n-" + i) || {}).value || "";
    const m = parseFloat(String((document.getElementById("lv-m-" + i) || {}).value || "").replace(",", ".")) || 0;
    if (m) out.push({ id: uid(), nom: n.trim() || "Livret", montant: m, taux: 0 });
  }
  S.livrets = out;
  save(); closeSheet(); recalc(); render();
  toast(out.length ? "Épargne enregistrée ✓" : "Épargne effacée");
}
function htmlEpargne() {
  const e = epargne(S);
  if (!e.total) return `<div class="sec"><button class="btn" data-a="livrets">🐖 Ajouter mes livrets</button></div>`;
  const t = tenue(S);
  const l = ligneAuj();
  const patrimoine = e.total + (l ? l.solde : 0);
  return `<div class="sec"><div class="sec-h"><h2>Mon épargne</h2>
    <button class="tag" data-a="livrets">modifier</button></div>
    <div class="card kpi"><div class="k">Ce que tu as, en tout</div>
      <div class="v pos num">${fmt0(patrimoine)}</div>
      <div class="s">${fmt0(e.total)} sur tes livrets + ${fmt0(l ? l.solde : 0)} sur ton compte</div></div>
    ${e.liste.map(x => `<div class="row"><div class="em">🐖</div>
      <div class="in"><div class="t">${esc(x.nom)}</div>
        <div class="s">${Math.round(x.montant / e.total * 100)} % de ton épargne</div></div>
      <div class="m num">${fmt0(x.montant)}</div></div>`).join("")}
    ${t.mois !== null ? `<div class="alerte ${t.mois < 12 ? "al-bad" : "al-warn"}" style="margin-top:9px"><div>⏳</div><div>
      <b>Tu vis au-dessus de ce qui rentre</b>
      Il te manque ${fmt0(t.deficit)} par mois, soit ${fmt0(Math.abs(t.parAn))} sur un an.
      À ce rythme, ton épargne y passe en <b>${Math.floor(t.mois)} mois</b> — vers ${nomMois(moisDe(t.date))}.
      Ce n&#39;est pas un drame en soi : c&#39;est un choix. Mais il vaut mieux le faire les yeux ouverts.</div></div>`
    : `<div class="alerte al-good" style="margin-top:9px"><div>✅</div><div><b>Ton train de vie tient tout seul</b>
      Tu n&#39;as pas besoin de piocher dans tes livrets — ton épargne travaille pour plus tard.</div></div>`}
  </div>`;
}

/* L'ÉCHÉANCIER — interface */

const CLE = "echeancier_v1";
const vide = () => ({
  v: 1,
  ancre: { date: today(), solde: 0 },
  matelas: 0,
  flux: [],
  reels: [],
  reglages: { horizon: 90, wkDefaut: "apres" },
  vu: null
});
let S = vide();
let VUE = "mois";
let MOIS = moisDe(today());
let PROJ = [];
let PROJ_MAP = {};

function charge() {
  try { const b = localStorage.getItem(CLE); if (b) S = Object.assign(vide(), JSON.parse(b)); } catch (e) {}
  if (!S.ancre) S.ancre = { date: today(), solde: 0 };
  if (!Array.isArray(S.flux)) S.flux = [];
  if (!Array.isArray(S.reels)) S.reels = [];
}
function save() { try { localStorage.setItem(CLE, JSON.stringify(S)); } catch (e) { toast("Sauvegarde impossible"); } }
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

/* ---------- affichage ---------- */
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g,
  c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const nbsp = " ";
function fmt(n, signe) {
  const v = Math.abs(Math.round((+n || 0) * 100) / 100);
  const s = v.toLocaleString("fr-FR", { minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 });
  const p = (+n < -0.004 ? "−" : (signe && +n > 0.004 ? "+" : ""));
  return p + s + nbsp + "€";
}
function fmt0(n) {
  const v = Math.round(Math.abs(+n || 0));
  return (+n < 0 ? "−" : "") + v.toLocaleString("fr-FR") + nbsp + "€";
}
function fmtC(n) {                                     // compact, pour le calendrier
  const a = Math.abs(n), s = n < 0 ? "−" : "+";
  if (a < 1) return "";
  if (a >= 1000) return s + (a / 1000).toFixed(a >= 10000 ? 0 : 1).replace(".", ",") + "k";
  return s + Math.round(a);
}
const JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const MOISN = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const ABR = ["janv.", "févr.", "mars", "avril", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
const maj1 = s => s.charAt(0).toUpperCase() + s.slice(1);
const nomMois = m => maj1(MOISN[+m.slice(5, 7) - 1]) + " " + m.slice(0, 4);
const jourLong = s => JOURS[jsem(s)] + " " + (+s.slice(8, 10)) + " " + MOISN[+s.slice(5, 7) - 1];
const jourCourt = s => JOURS[jsem(s)].slice(0, 3) + ". " + (+s.slice(8, 10)) + " " + ABR[+s.slice(5, 7) - 1];
const nJours = n => n + " jour" + (Math.abs(n) > 1 ? "s" : "");
const cls = n => n < -0.004 ? "neg" : (n > 0.004 ? "pos" : "mut");

function toast(m) {
  const t = document.getElementById("toast");
  t.textContent = m; t.classList.add("on");
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("on"), 2100);
}
function openSheet(html) {
  document.getElementById("sbody").innerHTML = html;
  document.getElementById("sheet").classList.add("on");
  document.getElementById("sbg").classList.add("on");
  document.getElementById("sheet").scrollTop = 0;
}
function closeSheet() {
  document.getElementById("sheet").classList.remove("on");
  document.getElementById("sbg").classList.remove("on");
}

/* ---------- calculs partagés ---------- */
function recalc() {
  PROJ = projection(S, 400);
  PROJ_MAP = {};
  for (const l of PROJ) PROJ_MAP[l.date] = l;
}
const ligneAuj = () => PROJ_MAP[today()] || null;

/* Prochaine occurrence d'un flux à partir d'aujourd'hui. */
function prochaine(f) {
  const o = occurrences(f, today(), addJ(today(), 800));
  return o.length ? o[0].date : null;
}
function descFlux(f) {
  if (f.enveloppe) return "Enveloppe · " + fmt0(Math.abs(f.montant)) + " par mois";
  if (f.freq === "ponctuel") return "Une fois · " + jourCourt(f.date);
  const p = prochaine(f);
  let d = FREQ[f.freq].n;
  if (f.freq === "mensuel") d = "Le " + (f.jour || 1) + " de chaque mois";
  if (f.freq === "annuel") d = "Chaque année";
  return d + (p ? " · prochain " + jourCourt(p) : " · terminé");
}

/* ---------- header ---------- */
function renderHeader() {
  const t = today();
  document.getElementById("hdate").textContent = maj1(jourLong(t));
  const l = ligneAuj();
  const solde = l ? l.solde : (+S.ancre.solde || 0);
  const el = document.getElementById("hsolde");
  el.innerHTML = fmt(solde).replace(/( €)$/, "<small>$1</small>");
  el.className = "solde num " + (solde < 0 ? "neg" : "");
  const jrs = diffJ(S.ancre.date, t);
  const dep = S.flux.length || S.reels.length;
  document.getElementById("hlab").innerHTML = !dep
    ? "Commence par tes prélèvements <b>→ onglet Flux</b>"
    : (jrs === 0 ? "Solde saisi <b>aujourd&#39;hui</b>"
      : "Projeté depuis ton solde du " + jourCourt(S.ancre.date) + " (" + fmt0(S.ancre.solde) + ")");
}

/* ---------- vue MOIS ---------- */
function vueMois() {
  const t = today();
  const a = MOIS + "-01", b = finDeMois(a);
  const occ = pointage(S, agenda(S, a, b), S.ancre.date);
  const parJour = {};
  for (const o of occ) (parJour[o.date] = parJour[o.date] || []).push({ nom: o.f.nom, cat: o.f.cat, montant: o.montant, type: "prevu", f: o.f, wk: o.brut !== o.date, pointe: o.pointe });
  for (const r of S.reels) if (moisDe(r.date) === MOIS) (parJour[r.date] = parJour[r.date] || []).push({ nom: r.nom || cat(r.cat).n, cat: r.cat, montant: r.montant, type: "reel", id: r.id });

  const catsEnv = new Set(S.flux.filter(f => f.enveloppe && f.actif).map(f => f.cat));
  const rMois = S.reels.filter(r => moisDe(r.date) === MOIS && !catsEnv.has(r.cat));
  const entrees = occ.filter(o => o.montant > 0 && !o.pointe).reduce((s, o) => s + o.montant, 0)
    + rMois.filter(r => r.montant > 0).reduce((s, r) => s + r.montant, 0);
  const sorties = occ.filter(o => o.montant < 0 && !o.pointe).reduce((s, o) => s + o.montant, 0)
    + rMois.filter(r => r.montant < 0).reduce((s, r) => s + r.montant, 0);
  const env = S.flux.filter(f => f.actif && f.enveloppe).reduce((s, f) => s + f.montant, 0);

  const prem = jsem(a), dec = (prem + 6) % 7;                    // lundi en tête
  const nb = dansMois(+MOIS.slice(0, 4), +MOIS.slice(5, 7));
  let cells = "";
  for (let i = 0; i < dec; i++) {
    const d = addJ(a, i - dec);
    cells += `<div class="day out"><div class="n">${+d.slice(8, 10)}</div></div>`;
  }
  for (let i = 1; i <= nb; i++) {
    const d = `${MOIS}-${String(i).padStart(2, "0")}`;
    const ev = parJour[d] || [];
    const net = ev.reduce((s, e) => s + (e.pointe ? 0 : e.montant), 0);
    const l = PROJ_MAP[d];
    const risk = l && d >= t && l.solde < 0;                       // vrai découvert
    const tight = l && d >= t && !risk && l.solde < (+S.matelas || 0); // sous le matelas
    const gros = ev.some(e => e.montant <= -150);
    const dots = [...new Set(ev.map(e => e.cat))].slice(0, 5)
      .map(c => `<span class="dot" style="background:${cat(c).c}"></span>`).join("");
    cells += `<div class="day${d === t ? " today" : ""}${risk ? " risk" : ""}${tight ? " tight" : ""}${gros ? " big" : ""}${[0, 6].includes(jsem(d)) ? " wknd" : ""}" data-a="jour" data-d="${d}">
      <div class="n">${i}</div>
      <div class="amt ${cls(net)}">${fmtC(net)}</div>
      <div class="dots">${dots}</div></div>`;
  }

  const listeJours = Object.keys(parJour).sort().map(d => {
    const ev = parJour[d].slice().sort((x, y) => x.montant - y.montant);
    const l = PROJ_MAP[d];
    return `<div class="day-h${d < t ? " past" : ""}"><div class="d">${maj1(jourCourt(d))}</div>
      <div class="r">${l && d >= S.ancre.date ? "solde " + fmt0(l.solde) : ""}</div></div>` +
      ev.map(e => ligneEvt(e, d)).join("");
  }).join("");

  return `
  ${blocAlerte()}
  <div class="sec">
    <div class="cal-nav">
      <button data-a="mois-" >‹</button>
      <div class="m">${nomMois(MOIS)}</div>
      <button data-a="mois+">›</button>
    </div>
    <div class="grid7">${["L", "M", "M", "J", "V", "S", "D"].map(x => `<div class="dow">${x}</div>`).join("")}</div>
    <div class="grid7">${cells}</div>
    <div class="cards" style="margin-top:10px">
      <div class="card kpi"><div class="k">Entrées du mois</div><div class="v pos num">${fmt0(entrees)}</div></div>
      <div class="card kpi"><div class="k">Sorties du mois</div><div class="v neg num">${fmt0(sorties + env)}</div>
        <div class="s">${env ? "dont " + fmt0(-env) + " d&#39;enveloppes" : "prélèvements & échéances"}</div></div>
    </div>
    <div class="card kpi" style="margin-top:9px"><div class="k">Reste à la fin du mois</div>
      <div class="v num ${cls(entrees + sorties + env)}">${fmt(entrees + sorties + env, true)}</div>
      <div class="s">ce que ce mois ajoute ou retire à ton compte</div></div>
  </div>
  <div class="sec"><h2>Le détail, jour par jour</h2>
    ${listeJours || '<div class="empty">Aucune échéance ce mois-ci.<br>Ajoute tes prélèvements dans l&#39;onglet 🔁 Flux.</div>'}
  </div>`;
}

function ligneEvt(e, d) {
  const c = cat(e.cat);
  const tag = e.pointe ? '<span class="tag">déjà passé</span> '
    : e.type === "reel" ? '<span class="tag">réel</span> '
    : (e.wk ? '<span class="tag">décalé</span> ' : "");
  return `<div class="row tap${e.pointe ? " off" : ""}" data-a="${e.type === "reel" ? "edit-reel" : "edit-flux"}" data-id="${e.type === "reel" ? e.id : (e.f ? e.f.id : "")}">
    <div class="em">${c.e}</div>
    <div class="in"><div class="t">${esc(e.nom)}</div><div class="s">${tag}${c.n}</div></div>
    <div class="m ${cls(e.montant)} num">${fmt(e.montant, true)}</div></div>`;
}

function blocAlerte() {
  if (!S.flux.length && !S.reels.length) {
    return `<div class="sec"><div class="alerte al-warn"><div>👋</div><div><b>On commence ?</b>
      1. Mets ton solde actuel (bouton en haut). 2. Entre tes prélèvements dans 🔁 Flux — ou envoie-les moi, je les charge d&#39;un coup.</div></div></div>`;
  }
  const t = today(), l = ligneAuj();
  const bas = creux(PROJ.filter(x => x.date <= addJ(t, 90)));
  const sous = passageSous(PROJ.filter(x => x.date <= addJ(t, 90)), +S.matelas || 0);
  const rav = resteAVivre(S, PROJ);
  let h = "";
  if (sous) {
    h += `<div class="alerte al-bad" style="margin-bottom:8px"><div>⚠️</div><div>
      <b>${sous.date === t ? "Tu es sous ton seuil" : "Tu passes sous " + fmt0(+S.matelas || 0) + " le " + jourCourt(sous.date)}</b>
      ${sous.date === t ? "" : "dans " + nJours(diffJ(t, sous.date))} — solde prévu ${fmt(sous.solde)}.
      ${sous.evts.length ? "Ce jour-là : " + esc(sous.evts.map(e => e.nom).join(", ")) + "." : ""}
      ${bas && bas.date !== sous.date ? " Le pire est le " + jourCourt(bas.date) + " : " + fmt(bas.solde) + "." : ""}</div></div>`;
  } else if (bas) {
    h += `<div class="alerte al-good" style="margin-bottom:8px"><div>✅</div><div>
      <b>Rien dans le rouge sur 90 jours</b> Ton point le plus bas : ${fmt(bas.solde)} le ${jourCourt(bas.date)}.</div></div>`;
  }
  if (rav) {
    h += `<div class="cards">
      <div class="card kpi"><div class="k">${rav.libre >= 0 ? "Reste à vivre" : "Il te manque"}</div>
        <div class="v num ${cls(rav.parJour)}">${rav.libre >= 0 ? fmt0(rav.parJour) + '<span style="font-size:13px;color:var(--muted)">/jour</span>' : fmt0(Math.abs(rav.libre))}</div>
        <div class="s">${rav.libre >= 0
          ? fmt0(rav.libre) + " libres sur " + rav.jours + " j, jusqu&#39;" + (rav.entree ? "à " + esc(rav.entree.f.nom) + " le " + jourCourt(rav.cible) : "à la fin du mois")
          : "pour tenir jusqu&#39;" + (rav.entree ? "à " + esc(rav.entree.f.nom) + " le " + jourCourt(rav.cible) : "à la fin du mois") + " sans toucher au matelas"}</div></div>
      <div class="card kpi"><div class="k">Déjà engagé</div>
        <div class="v neg num">${fmt0(rav.obligations + rav.enveloppes)}</div>
        <div class="s">prélèvements à venir d&#39;ici le ${jourCourt(rav.cible)}</div></div></div>`;
  }
  return `<div class="sec">${h}</div>`;
}

/* ---------- vue CAP (projection) ---------- */
function vueCap() {
  const t = today();
  const H = +S.reglages.horizon || 90;
  const lignes = PROJ.filter(l => l.date >= t && l.date <= addJ(t, H));
  if (!lignes.length) return '<div class="empty">Rien à projeter pour l&#39;instant.</div>';
  const bas = creux(lignes), haut = lignes.reduce((m, l) => l.solde > m.solde ? l : m, lignes[0]);
  const sous = passageSous(lignes, +S.matelas || 0);
  const fin = lignes[lignes.length - 1];
  const entrees = lignes.reduce((s, l) => s + l.entrees, 0);
  const sorties = lignes.reduce((s, l) => s + l.sorties, 0);
  const rav = resteAVivre(S, PROJ);

  const seg = [30, 90, 180, 365].map(n =>
    `<button data-a="horizon" data-n="${n}" class="${H === n ? "on" : ""}">${n === 365 ? "1 an" : n + " j"}</button>`).join("");

  return `
  <div class="sec" style="margin-top:14px"><h2>Ton cap financier</h2>
    <div class="seg" style="margin-top:10px">${seg}</div>
    ${courbe(lignes)}
    <div class="cards" style="margin-top:9px">
      <div class="card kpi"><div class="k">Point le plus bas</div>
        <div class="v num ${cls(bas.solde)}">${fmt0(bas.solde)}</div>
        <div class="s">le ${jourCourt(bas.date)}${bas.evts.length ? " · " + esc(bas.evts[0].nom) : ""}</div></div>
      <div class="card kpi"><div class="k">Dans ${H === 365 ? "1 an" : H + " jours"}</div>
        <div class="v num ${cls(fin.solde)}">${fmt0(fin.solde)}</div>
        <div class="s">${fmt(fin.solde - (ligneAuj() ? ligneAuj().solde : 0), true)} par rapport à aujourd&#39;hui</div></div>
      <div class="card kpi"><div class="k">Entrées à venir</div><div class="v pos num">${fmt0(entrees)}</div></div>
      <div class="card kpi"><div class="k">Sorties à venir</div><div class="v neg num">${fmt0(sorties)}</div></div>
    </div>
    ${sous ? `<div class="alerte al-bad" style="margin-top:9px"><div>⚠️</div><div><b>Alerte découvert</b>
      Le ${jourCourt(sous.date)}, ton solde tombe à ${fmt(sous.solde)} — ${fmt0(Math.abs(sous.solde - (+S.matelas || 0)))} sous ton seuil.
      ${bas.date !== sous.date ? "Et ça continue de descendre : le pire est le " + jourCourt(bas.date) + " à " + fmt(bas.solde)
        + ", soit " + fmt0(Math.abs(bas.solde - (+S.matelas || 0))) + " à trouver d&#39;ici là." : ""}</div></div>`
    : `<div class="alerte al-good" style="margin-top:9px"><div>✅</div><div><b>Aucun passage sous ${fmt0(+S.matelas || 0)}</b> sur la période.</div></div>`}
    ${rav ? `<div class="card kpi" style="margin-top:9px"><div class="k">${rav.libre >= 0 ? "Enveloppe libre" : "Manque à combler"} d&#39;ici le ${jourCourt(rav.cible)}</div>
      <div class="v num ${cls(rav.libre)}">${fmt0(rav.libre)}</div>
      <div class="s">soit ${fmt0(rav.parJour)} par jour pendant ${nJours(rav.jours)}. Calcul : solde ${fmt0(ligneAuj() ? ligneAuj().solde : 0)}
      − ${fmt0(rav.obligations)} de prélèvements − ${fmt0(rav.enveloppes)} d&#39;enveloppes${+S.matelas ? " − " + fmt0(+S.matelas) + " de matelas" : ""}.</div></div>` : ""}
  </div>
  <div class="sec"><h2>Les prochaines échéances</h2>
    ${lignes.filter(l => l.evts.length).slice(0, 40).map(l => `
      <div class="day-h"><div class="d">${maj1(jourCourt(l.date))}${l.date === t ? " · aujourd&#39;hui" : " · dans " + nJours(diffJ(t, l.date))}</div>
      <div class="r">solde ${fmt0(l.solde)}</div></div>
      ${l.evts.map(e => ligneEvt(e, l.date)).join("")}`).join("") || '<div class="empty">Aucune échéance sur la période.</div>'}
  </div>`;
}

function courbe(lignes) {
  const W = 320, Ht = 150, pad = 4;
  const vals = lignes.map(l => l.solde);
  const seuil = +S.matelas || 0;
  let mn = Math.min(...vals, seuil, 0), mx = Math.max(...vals, seuil, 0);
  if (mx - mn < 10) { mx += 5; mn -= 5; }
  const marge = (mx - mn) * .12; mn -= marge; mx += marge;
  const X = i => pad + i * (W - 2 * pad) / Math.max(1, lignes.length - 1);
  const Y = v => Ht - pad - (v - mn) * (Ht - 2 * pad) / (mx - mn);
  const pts = lignes.map((l, i) => X(i) + "," + Y(l.solde).toFixed(1));
  const d = "M" + pts.join("L");
  const aire = d + `L${X(lignes.length - 1)},${Y(mn)}L${X(0)},${Y(mn)}Z`;
  const y0 = Y(0), ys = Y(seuil);
  const bas = creux(lignes);
  const ib = lignes.indexOf(bas);
  const neg = vals.some(v => v < seuil);
  const mrq = [];
  let dernier = -99;
  lignes.forEach((l, i) => {
    if (!l.evts.length) return;
    const gros = l.evts.reduce((s, e) => s + e.montant, 0);
    if (Math.abs(gros) < 150 || i - dernier < 12) return;
    dernier = i;
    mrq.push(`<circle cx="${X(i).toFixed(1)}" cy="${Y(l.solde).toFixed(1)}" r="2.6" fill="${gros > 0 ? "#3ddc97" : "#ff5f5f"}"/>`);
  });
  return `<div class="chart"><svg viewBox="0 0 ${W} ${Ht}" preserveAspectRatio="none">
    <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${neg ? "#f5c451" : "#3ddc97"}" stop-opacity=".28"/>
      <stop offset="100%" stop-color="${neg ? "#f5c451" : "#3ddc97"}" stop-opacity="0"/></linearGradient></defs>
    ${y0 > 0 && y0 < Ht ? `<line x1="0" y1="${y0.toFixed(1)}" x2="${W}" y2="${y0.toFixed(1)}" stroke="#ff5f5f" stroke-width="1" stroke-dasharray="3 3" opacity=".6"/>` : ""}
    ${seuil ? `<line x1="0" y1="${ys.toFixed(1)}" x2="${W}" y2="${ys.toFixed(1)}" stroke="#f5c451" stroke-width="1" stroke-dasharray="2 4" opacity=".5"/>` : ""}
    <path d="${aire}" fill="url(#g1)"/>
    <path d="${d}" fill="none" stroke="${neg ? "#f5c451" : "#3ddc97"}" stroke-width="2" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
    ${ib >= 0 ? `<circle cx="${X(ib).toFixed(1)}" cy="${Y(bas.solde).toFixed(1)}" r="3.4" fill="${bas.solde < seuil ? "#ff5f5f" : "#e9ecf2"}"/>` : ""}
    ${mrq.join("")}
  </svg>
  <div style="display:flex;justify-content:space-between;font-size:10.5px;color:var(--dim);padding:2px 2px 6px">
    <span>${jourCourt(lignes[0].date)}</span><span class="num">bas : ${fmt0(bas.solde)}</span><span>${jourCourt(lignes[lignes.length - 1].date)}</span></div></div>`;
}

/* ---------- vue FLUX ---------- */
function vueFlux() {
  const g = { in: [], fixe: [], env: [], ponct: [], off: [] };
  for (const f of S.flux) {
    if (!f.actif) g.off.push(f);
    else if (f.enveloppe) g.env.push(f);
    else if (f.freq === "ponctuel") g.ponct.push(f);
    else if (f.montant > 0) g.in.push(f);
    else g.fixe.push(f);
  }
  const tri = a => a.sort((x, y) => Math.abs(y.montant) - Math.abs(x.montant));
  const b = bilan(S);
  const bloc = (titre, arr, note) => !arr.length ? "" : `<div class="sec"><div class="sec-h"><h2>${titre}</h2>
    <span class="mut" style="font-size:11.5px">${note || ""}</span></div>
    ${tri(arr).map(f => {
      const c = cat(f.cat);
      const mm = f.enveloppe ? f.montant : parMois(f);
      return `<div class="row tap${f.actif ? "" : " off"}" data-a="edit-flux" data-id="${f.id}">
        <div class="em">${c.e}</div>
        <div class="in"><div class="t">${esc(f.nom)}</div><div class="s">${esc(descFlux(f))}</div></div>
        <div class="m ${cls(f.montant)} num">${fmt(f.montant, true)}
          ${f.freq !== "mensuel" && f.freq !== "ponctuel" && !f.enveloppe ? `<small>${fmt0(mm)}/mois</small>` : ""}</div></div>`;
    }).join("")}</div>`;

  return `
  <div class="sec" style="margin-top:14px">
    <div class="cards">
      <div class="card kpi"><div class="k">Il rentre</div><div class="v pos num">${fmt0(b.entreesMois)}<span style="font-size:13px;color:var(--muted)">/mois</span></div></div>
      <div class="card kpi"><div class="k">Il sort</div><div class="v neg num">${fmt0(b.sortiesMois)}<span style="font-size:13px;color:var(--muted)">/mois</span></div></div>
    </div>
    <div class="card kpi" style="margin-top:9px"><div class="k">Ce qu&#39;il te reste chaque mois</div>
      <div class="v num ${cls(b.netMois)}">${fmt(b.netMois, true)}</div>
      <div class="s">soit ${fmt(b.netAn, true)} sur un an, si rien ne change</div></div>
  </div>
  ${bloc("Ce qui rentre", g.in)}
  ${bloc("Prélèvements & factures", g.fixe)}
  ${bloc("Enveloppes (dépenses variables)", g.env, "budget lissé")}
  ${bloc("Échéances ponctuelles", g.ponct)}
  ${bloc("En pause", g.off)}
  ${!S.flux.length ? `<div class="empty">Aucun flux enregistré.<br><br>Appuie sur <b>+</b> pour ajouter un prélèvement,<br>ou pars des modèles ci-dessous.</div>` : ""}
  <div class="sec"><div class="btns"><button class="btn" data-a="modeles">⚡ Modèles</button><button class="btn" data-a="detect">🔎 Détecter mes prélèvements</button></div></div>`;
}

/* ---------- vue RÉEL (dépenses) ---------- */
function vueReel() {
  const mois = MOIS, t = today();
  const rs = S.reels.filter(r => moisDe(r.date) === mois).sort((a, b) => a.date < b.date ? 1 : -1);
  const tot = rs.reduce((s, r) => s + r.montant, 0);
  const envs = S.flux.filter(f => f.actif && f.enveloppe);
  const pv = prevuReel(S, mois);

  const jauges = envs.map(f => {
    const r = resteEnveloppe(S, f, mois, mois + "-01");
    const pct = Math.min(100, r.budget ? r.depense / r.budget * 100 : 0);
    const c = cat(f.cat);
    const jrsRest = Math.max(0, diffJ(t, finDeMois(mois + "-01")) + 1);
    return `<div class="card" style="margin-bottom:8px">
      <div style="display:flex;justify-content:space-between;align-items:baseline">
        <div style="font-size:14px;font-weight:600">${c.e} ${esc(f.nom)}</div>
        <div class="num" style="font-size:13px"><b class="${r.depense > r.budget ? "neg" : ""}">${fmt0(r.depense)}</b>
          <span class="mut">/ ${fmt0(r.budget)}</span></div></div>
      <div class="bar"><i style="width:${pct}%;background:${pct >= 100 ? "var(--bad)" : (pct > 80 ? "var(--warn)" : c.c)}"></i></div>
      <div class="s mut" style="font-size:11.5px;margin-top:6px">
        ${r.reste > 0 ? "Reste " + fmt0(r.reste) + (mois === moisDe(t) && jrsRest ? " · " + fmt0(r.reste / jrsRest) + " par jour sur " + jrsRest + " j" : "")
        : "Enveloppe dépassée de " + fmt0(r.depense - r.budget)}</div></div>`;
  }).join("");

  return `
  <div class="sec" style="margin-top:14px">
    <div class="cal-nav"><button data-a="mois-">‹</button><div class="m">${nomMois(mois)}</div><button data-a="mois+">›</button></div>
    <div class="btns"><button class="btn pri" data-a="new-reel">＋ Noter une dépense</button>
      <button class="btn" data-a="import-releve" style="flex:0 0 44%">📥 Coller un relevé</button></div>
  </div>
  ${envs.length ? `<div class="sec"><h2>Mes enveloppes ce mois-ci</h2>${jauges}</div>` : ""}
  <div class="sec"><div class="sec-h"><h2>Opérations notées (${rs.length})</h2>
    <span class="num neg" style="font-size:13px;font-weight:700">${fmt0(rs.filter(r => r.montant < 0).reduce((s, r) => s + r.montant, 0))}
      ${rs.some(r => r.montant > 0) ? '<span class="pos"> · ' + fmt0(rs.filter(r => r.montant > 0).reduce((s, r) => s + r.montant, 0)) + "</span>" : ""}</span></div>
    ${rs.map(r => {
      const c = cat(r.cat);
      return `<div class="row tap" data-a="edit-reel" data-id="${r.id}">
        <div class="em">${c.e}</div>
        <div class="in"><div class="t">${esc(r.nom || c.n)}</div><div class="s">${jourCourt(r.date)} · ${c.n}</div></div>
        <div class="m ${cls(r.montant)} num">${fmt(r.montant, true)}</div></div>`;
    }).join("") || '<div class="empty">Rien de noté ce mois-ci.<br>Note tes dépenses du quotidien : c&#39;est ce qui rend la projection juste.</div>'}
  </div>
  <div class="sec"><h2>Prévu contre réel</h2>
    <div class="card"><table class="pv"><tr><td class="mut" style="font-size:11px">Poste</td>
      <td class="mut" style="font-size:11px;text-align:right">Prévu</td><td class="mut" style="font-size:11px">Réel</td></tr>
    ${pv.filter(p => p.prevu || p.reel).map(p => {
      const c = cat(p.cat);
      const ecart = p.reel - p.prevu;
      return `<tr><td>${c.e} ${c.n}</td><td class="num mut">${p.prevu ? fmt0(p.prevu) : "—"}</td>
        <td class="num ${p.prevu && Math.abs(p.reel) > Math.abs(p.prevu) * 1.05 && p.reel < 0 ? "neg" : ""}">${p.reel ? fmt0(p.reel) : "—"}</td></tr>`;
    }).join("") || '<tr><td colspan="3" class="mut">Rien à comparer.</td></tr>'}
    </table></div></div>`;
}

/* ---------- vue BILAN ---------- */
function vueBilan() {
  const b = bilan(S);
  const max = Math.max(...b.postes.map(p => Math.abs(p.mois)), 1);
  const abos = S.flux.filter(f => f.actif && !f.enveloppe && f.montant < 0 && f.freq !== "ponctuel")
    .sort((x, y) => parAn(x) - parAn(y));
  const totAbo = abos.reduce((s, f) => s + parAn(f), 0);

  return `
  <div class="sec" style="margin-top:14px"><h2>Ce que coûte ta vie</h2>
    <div class="card kpi" style="margin-top:10px"><div class="k">Charges fixes + enveloppes</div>
      <div class="v neg num">${fmt0(b.sortiesMois)}<span style="font-size:13px;color:var(--muted)">/mois</span></div>
      <div class="s">soit <b>${fmt0(b.sortiesMois * 12)}</b> par an. Il faut que tu gagnes au moins
        ${fmt0(Math.abs(b.sortiesMois))} par mois pour être à l&#39;équilibre.</div></div>
    <div class="cards" style="margin-top:9px">
      <div class="card kpi"><div class="k">Taux d&#39;épargne</div>
        <div class="v num ${cls(b.netMois)}">${b.entreesMois > 0 ? Math.round(b.netMois / b.entreesMois * 100) + " %" : "—"}</div>
        <div class="s">de ce qui rentre te reste</div></div>
      <div class="card kpi"><div class="k">Par jour</div>
        <div class="v neg num">${fmt0(b.sortiesMois * 12 / 365)}</div>
        <div class="s">ce que tu dépenses en moyenne, chaque jour</div></div>
    </div>
  </div>
  <div class="sec"><h2>Où part l&#39;argent</h2>
    ${b.postes.filter(p => p.mois < 0).map(p => {
      const c = cat(p.cat);
      return `<div class="card" style="margin-bottom:8px" data-a="poste" data-id="${p.cat}">
        <div style="display:flex;justify-content:space-between;align-items:baseline">
          <div style="font-size:14.5px;font-weight:600">${c.e} ${c.n} <span class="mut" style="font-size:11.5px">· ${p.n} ligne${p.n > 1 ? "s" : ""}</span></div>
          <div class="num" style="font-size:15px;font-weight:700">${fmt0(p.mois)}<span class="mut" style="font-size:11px">/mois</span></div></div>
        <div class="bar"><i style="width:${Math.abs(p.mois) / max * 100}%;background:${c.c}"></i></div>
        <div class="mut" style="font-size:11.5px;margin-top:6px">${fmt0(p.an)} par an ·
          ${esc(p.flux.sort((x, y) => x.mois - y.mois).map(x => x.f.nom).slice(0, 4).join(", "))}</div></div>`;
    }).join("") || '<div class="empty">Ajoute tes flux pour voir la répartition.</div>'}
  </div>
  ${abos.length ? `<div class="sec"><div class="sec-h"><h2>Le coût annuel, ligne par ligne</h2>
    <span class="neg num" style="font-size:13px;font-weight:700">${fmt0(totAbo)}/an</span></div>
    ${abos.map(f => `<div class="row tap" data-a="edit-flux" data-id="${f.id}">
      <div class="em">${cat(f.cat).e}</div>
      <div class="in"><div class="t">${esc(f.nom)}</div><div class="s">${fmt(f.montant)} × ${FREQ[f.freq].parAn % 1 ? FREQ[f.freq].parAn.toFixed(1) : FREQ[f.freq].parAn} par an</div></div>
      <div class="m neg num">${fmt0(parAn(f))}<small>par an</small></div></div>`).join("")}
    <div class="mini" style="margin-top:10px">Si tu ne touches à rien, ces lignes t&#39;auront coûté <b>${fmt0(Math.abs(totAbo * 5))}</b> dans 5 ans.
    La plus chère à l&#39;année : ${esc(abos[0] ? abos[0].nom : "—")} (${fmt0(abos[0] ? parAn(abos[0]) : 0)}).</div>
  </div>` : ""}
  <div class="sec"><h2>Réglages & données</h2>
    <div class="card" style="margin-bottom:9px">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px">
        <div><div style="font-size:14px;font-weight:600">Matelas de sécurité</div>
          <div class="mut" style="font-size:11.5px">le seuil sous lequel l&#39;app t&#39;alerte</div></div>
        <div class="num" style="font-size:16px;font-weight:700">${fmt0(+S.matelas || 0)}</div></div>
      <button class="btn sm" style="margin-top:10px" data-a="set-matelas">Modifier</button></div>
    <div class="btns" style="margin-bottom:8px">
      <button class="btn" data-a="export">⬇︎ Exporter</button>
      <button class="btn" data-a="import">⬆︎ Importer</button></div>
    <button class="btn dan" data-a="raz">Tout effacer</button>
    <div class="mini" style="margin-top:12px">Tes données ne quittent jamais ton téléphone : tout est stocké en local
      (clé <code>echeancier_v1</code>), rien n&#39;est envoyé nulle part. Sauvegarde aussi via
      <a href="https://niclaeysthomas-ctrl.github.io/pointage/coffre.html" style="color:var(--blue)">LE COFFRE</a>.</div>
  </div>`;
}

/* ---------- formulaire d'un flux ---------- */
let ED = null;
function editFlux(id) {
  const f = S.flux.find(x => x.id === id);
  ED = f ? JSON.parse(JSON.stringify(f)) : {
    id: null, nom: "", montant: 0, cat: "divers", freq: "mensuel", jour: +today().slice(8, 10),
    date: today(), debut: today(), fin: null, actif: true, wk: S.reglages.wkDefaut || "apres",
    enveloppe: false, sens: -1
  };
  ED.sens = ED.montant > 0 ? 1 : -1;
  ED.type = ED.enveloppe ? "env" : (ED.freq === "ponctuel" ? "once" : "rec");
  ED.date1 = ED.freq === "ponctuel" ? ED.date : (ED.debut || today());
  dessineFlux();
}
function lireFlux() {
  const g = k => { const e = document.getElementById("f-" + k); return e ? e.value : null; };
  if (g("nom") !== null) ED.nom = g("nom");
  if (g("montant") !== null) ED.montant = Math.abs(parseFloat(String(g("montant")).replace(",", ".")) || 0) * ED.sens;
  if (g("freq") !== null) ED.freq = g("freq");
  if (g("date1") !== null) ED.date1 = g("date1");
  if (g("fin") !== null) ED.fin = g("fin") || null;
  if (g("wk") !== null) ED.wk = g("wk");
}
function dessineFlux() {
  const grille = Object.keys(CATS).map(k =>
    `<button data-a="ed-cat" data-k="${k}" class="${ED.cat === k ? "on" : ""}"><span class="e">${CATS[k].e}</span>${CATS[k].n}</button>`).join("");
  const freqs = Object.keys(FREQ).filter(k => k !== "ponctuel")
    .map(k => `<option value="${k}"${ED.freq === k ? " selected" : ""}>${FREQ[k].n}</option>`).join("");
  const labDate = ED.type === "once" ? "Date" : (ED.freq === "hebdo" || ED.freq === "quinzaine" ? "Première fois" : "Prochaine échéance");

  openSheet(`
  <h3>${ED.id ? "Modifier" : "Nouveau flux"}</h3>
  <div class="sub">Un prélèvement, un revenu, une facture ou un budget.</div>
  <div class="f"><label>Nom</label><input id="f-nom" value="${esc(ED.nom)}" placeholder="Loyer, Netflix, alternance…" autocomplete="off"></div>
  <div class="f"><label>Sens</label><div class="pick">
    <button data-a="ed-sens" data-v="-1" class="${ED.sens < 0 ? "on out" : ""}">↓ Ça sort</button>
    <button data-a="ed-sens" data-v="1" class="${ED.sens > 0 ? "on in" : ""}">↑ Ça rentre</button></div></div>
  <div class="f2">
    <div class="f"><label>Montant (€)</label><input id="f-montant" type="number" inputmode="decimal" step="0.01"
      value="${ED.montant ? Math.abs(ED.montant) : ""}" placeholder="0"></div>
    <div class="f"><label>Type</label><div class="pick" style="gap:4px">
      <button data-a="ed-type" data-v="rec" class="${ED.type === "rec" ? "on" : ""}" style="font-size:11px">🔁</button>
      <button data-a="ed-type" data-v="once" class="${ED.type === "once" ? "on" : ""}" style="font-size:11px">📌</button>
      <button data-a="ed-type" data-v="env" class="${ED.type === "env" ? "on" : ""}" style="font-size:11px">🧺</button>
    </div></div></div>
  <div class="mini">${ED.type === "rec" ? "🔁 Récurrent : revient à date fixe (loyer, abo, salaire)."
      : ED.type === "once" ? "📌 Une seule fois : une échéance datée (impôts, voyage, achat)."
      : "🧺 Enveloppe : un budget mensuel pour des dépenses variables (courses, sorties). Il se lisse sur le mois et se vide quand tu notes des dépenses de cette catégorie."}</div>
  ${ED.type === "rec" ? `<div class="f"><label>Fréquence</label><select id="f-freq">${freqs}</select></div>` : ""}
  ${ED.type !== "env" ? `<div class="f"><label>${labDate}</label><input id="f-date1" type="date" value="${ED.date1 || today()}"></div>` : ""}
  ${ED.type === "rec" ? `<div class="f"><label>Si ça tombe un week-end ou un férié</label><select id="f-wk">
      <option value="apres"${ED.wk === "apres" ? " selected" : ""}>Passe le jour ouvré suivant (prélèvements)</option>
      <option value="avant"${ED.wk === "avant" ? " selected" : ""}>Passe le jour ouvré précédent (salaires)</option>
      <option value="aucun"${ED.wk === "aucun" ? " selected" : ""}>Ne rien décaler</option></select></div>
    <div class="f"><label>Fin (facultatif)</label><input id="f-fin" type="date" value="${ED.fin || ""}"></div>` : ""}
  <div class="f"><label>Catégorie</label><div class="cgrid">${grille}</div></div>
  <button class="btn pri" data-a="ed-save">Enregistrer</button>
  ${ED.id ? `<div class="btns" style="margin-top:8px">
    <button class="btn" data-a="ed-pause">${ED.actif ? "⏸ Mettre en pause" : "▶︎ Réactiver"}</button>
    <button class="btn dan" data-a="ed-del">Supprimer</button></div>` : ""}
  <button class="btn sm" style="margin-top:8px;border:none;color:var(--muted)" data-a="close">Annuler</button>`);
}
function saveFlux() {
  lireFlux();
  if (!ED.nom.trim()) return toast("Il manque le nom");
  if (!ED.montant) return toast("Il manque le montant");
  const f = {
    id: ED.id || uid(), nom: ED.nom.trim(), montant: ED.montant, cat: ED.cat,
    actif: ED.actif !== false, wk: ED.type === "rec" ? ED.wk : "aucun", enveloppe: ED.type === "env",
    freq: ED.type === "once" ? "ponctuel" : (ED.type === "env" ? "mensuel" : ED.freq),
    date: ED.date1, debut: ED.date1, fin: ED.fin || null,
    jour: +(ED.date1 || today()).slice(8, 10), mois: +(ED.date1 || today()).slice(5, 7)
  };
  if (f.enveloppe) { f.debut = null; f.fin = null; }
  const i = S.flux.findIndex(x => x.id === f.id);
  if (i >= 0) S.flux[i] = f; else S.flux.push(f);
  save(); closeSheet(); recalc(); render();
  toast(i >= 0 ? "Modifié" : "Ajouté ✓");
}

/* ---------- dépense réelle ---------- */
let ER = null;
function editReel(id) {
  const r = S.reels.find(x => x.id === id);
  ER = r ? Object.assign({}, r) : { id: null, date: today(), montant: 0, cat: "courses", nom: "", sens: -1 };
  ER.sens = ER.montant > 0 ? 1 : -1;
  dessineReel();
}
function dessineReel() {
  const grille = Object.keys(CATS).map(k =>
    `<button data-a="er-cat" data-k="${k}" class="${ER.cat === k ? "on" : ""}"><span class="e">${CATS[k].e}</span>${CATS[k].n}</button>`).join("");
  openSheet(`
  <h3>${ER.id ? "Modifier la dépense" : "Noter une dépense"}</h3>
  <div class="sub">Ce que tu as réellement dépensé ou reçu.</div>
  <div class="f2">
    <div class="f"><label>Montant (€)</label><input id="r-montant" type="number" inputmode="decimal" step="0.01"
      value="${ER.montant ? Math.abs(ER.montant) : ""}" placeholder="0" autofocus></div>
    <div class="f"><label>Sens</label><div class="pick">
      <button data-a="er-sens" data-v="-1" class="${ER.sens < 0 ? "on out" : ""}">↓</button>
      <button data-a="er-sens" data-v="1" class="${ER.sens > 0 ? "on in" : ""}">↑</button></div></div></div>
  <div class="f"><label>Libellé</label><input id="r-nom" value="${esc(ER.nom || "")}" placeholder="Courses Lidl, kebab, essence…" autocomplete="off"></div>
  <div class="f"><label>Date</label><input id="r-date" type="date" value="${ER.date}"></div>
  <div class="f"><label>Catégorie</label><div class="cgrid">${grille}</div></div>
  <button class="btn pri" data-a="er-save">Enregistrer</button>
  ${ER.id ? `<button class="btn dan" style="margin-top:8px" data-a="er-del">Supprimer</button>` : ""}
  <button class="btn sm" style="margin-top:8px;border:none;color:var(--muted)" data-a="close">Annuler</button>`);
}
function saveReel() {
  const g = k => { const e = document.getElementById("r-" + k); return e ? e.value : ""; };
  const m = Math.abs(parseFloat(String(g("montant")).replace(",", ".")) || 0) * ER.sens;
  if (!m) return toast("Il manque le montant");
  const r = { id: ER.id || uid(), date: g("date") || today(), montant: m, cat: ER.cat, nom: g("nom").trim() };
  const i = S.reels.findIndex(x => x.id === r.id);
  if (i >= 0) S.reels[i] = r; else S.reels.push(r);
  save(); closeSheet(); recalc(); render(); toast(i >= 0 ? "Modifié" : "Noté ✓");
}

/* ---------- détail d'un jour ---------- */
function sheetJour(d) {
  const occ = pointage(S, agenda(S, d, d), S.ancre.date);
  const rs = S.reels.filter(r => r.date === d);
  const l = PROJ_MAP[d];
  const net = occ.reduce((s, o) => s + (o.pointe ? 0 : o.montant), 0) + rs.reduce((s, r) => s + r.montant, 0);
  openSheet(`
    <h3>${maj1(jourLong(d))}</h3>
    <div class="sub">${l && d >= S.ancre.date ? "Solde prévu ce soir-là : <b class=\"" + cls(l.solde) + "\">" + fmt(l.solde) + "</b>" : "Hors période de projection"}
      ${l && l.env ? " · dont " + fmt0(l.env) + " d&#39;enveloppes lissées" : ""}</div>
    ${occ.length ? '<h2 style="margin-bottom:8px">Prévu</h2>' + occ.map(o => ligneEvt({ nom: o.f.nom, cat: o.f.cat, montant: o.montant, type: "prevu", f: o.f, wk: o.brut !== o.date, pointe: o.pointe }, d)).join("") : ""}
    ${rs.length ? '<h2 style="margin:14px 0 8px">Noté</h2>' + rs.map(r => ligneEvt({ nom: r.nom || cat(r.cat).n, cat: r.cat, montant: r.montant, type: "reel", id: r.id }, d)).join("") : ""}
    ${!occ.length && !rs.length ? '<div class="empty">Rien ce jour-là.</div>' : `<div class="card kpi" style="margin-top:12px"><div class="k">Net du jour</div><div class="v num ${cls(net)}">${fmt(net, true)}</div></div>`}
    <button class="btn pri" style="margin-top:14px" data-a="new-reel" data-d="${d}">＋ Noter une dépense ce jour-là</button>
    <button class="btn sm" style="margin-top:8px;border:none;color:var(--muted)" data-a="close">Fermer</button>`);
}

/* ---------- modèles ---------- */
const MODELES = [
  ["Loyer", "logement", -0, "rec"], ["Charges / copropriété", "logement", -0, "rec"],
  ["Électricité", "energie", -0, "rec"], ["Internet / box", "telecom", -0, "rec"],
  ["Forfait mobile", "telecom", -0, "rec"], ["Assurance habitation", "assurance", -0, "rec"],
  ["Mutuelle santé", "sante", -0, "rec"], ["Salle de sport", "sport", -0, "rec"],
  ["Abonnement transport", "transport", -0, "rec"], ["Netflix", "abos", -0, "rec"],
  ["Spotify", "abos", -0, "rec"], ["Frais bancaires", "banque", -0, "rec"],
  ["Prêt étudiant", "credit", -0, "rec"], ["Frais de scolarité", "ecole", -0, "rec"],
  ["Courses", "courses", -0, "env"], ["Sorties & bars", "sorties", -0, "env"],
  ["Restos & livraisons", "resto", -0, "env"], ["Essence / carburant", "transport", -0, "env"],
  ["Shopping", "shopping", -0, "env"], ["Épargne automatique", "epargne", -0, "rec"],
  ["Salaire / alternance", "salaire", 1, "rec"], ["APL / CAF", "aides", 1, "rec"],
  ["Aide des parents", "famille", 1, "rec"], ["Bourse", "aides", 1, "rec"]
];
function sheetModeles() {
  openSheet(`<h3>Modèles courants</h3><div class="sub">Choisis, mets ton montant, c&#39;est enregistré.</div>
  ${MODELES.map((m, i) => `<div class="row tap" data-a="modele" data-i="${i}">
    <div class="em">${cat(m[1]).e}</div><div class="in"><div class="t">${esc(m[0])}</div>
    <div class="s">${m[3] === "env" ? "Enveloppe mensuelle" : (m[2] > 0 ? "Revenu récurrent" : "Prélèvement mensuel")}</div></div>
    <div class="m mut">＋</div></div>`).join("")}
  <button class="btn sm" style="margin-top:8px;border:none;color:var(--muted)" data-a="close">Fermer</button>`);
}

/* ---------- import d'un relevé ---------- */
const REGLES = [
  [/total ?(energies)? ?(aire|market|access|acces|station|relais|wash)|essence|carburant|esso|bp |shell|avia|intermarche station/i, "transport"],
  [/loyer|immobili|agence|foncia|nexity|studea|crous|residence|résidence/i, "logement"],
  [/edf|engie|total ?energ|electri|électri|gaz|eau |veolia|suez/i, "energie"],
  [/free|orange|sfr|bouygues|sosh|red by|mobile|internet|box/i, "telecom"],
  [/carrefour|lidl|leclerc|auchan|intermarch|monoprix|franprix|casino|super ?u|aldi|picard|biocoop|g20|epicerie/i, "courses"],
  [/restaurant|resto|kebab|mcdo|burger king|sushi|pizza|deliveroo|uber ?eats|just ?eat|boulanger|starbuck|subway|tacos|brioche/i, "resto"],
  [/sncf|ratp|navigo|\buber\b|blablacar|station|parking|peage|péage|trainline|flixbus|velib|lime|tier/i, "transport"],
  [/netflix|spotify|deezer|disney|canal|prime video|youtube|apple|icloud|adobe|chatgpt|openai|anthropic|claude|dropbox|steam|xbox|playstation/i, "abos"],
  [/pharmac|docteur|medecin|médecin|dentiste|opticien|labo|mutuelle|harmonie|mgen|ameli/i, "sante"],
  [/assur|maif|macif|matmut|axa|allianz|gmf|luko|lovys/i, "assurance"],
  [/basic ?fit|fitness|neoness|gymlib|salle de sport|boxe|club/i, "sport"],
  [/escp|scolarit|école|universit|kedge|neoma|edhec|essec|hec|inscription/i, "ecole"],
  [/bar |pub |brasserie|cave|biere|bière|nightclub|discot/i, "sorties"],
  [/restaurant|resto|kebab|mcdo|burger|sushi|pizza|deliveroo|uber ?eats|just ?eat|boulanger|starbuck|subway|tacos/i, "resto"],
  [/zara|h&m|uniqlo|nike|adidas|decathlon|vinted|asos|zalando|shein|amazon|fnac|darty|leroy/i, "shopping"],
  [/hotel|hôtel|airbnb|booking|ryanair|easyjet|air ?france|voyage|sncf connect/i, "voyage"],
  [/frais|cotisation|commission|agios|banque|boursorama|revolut|n26|bnp|societe generale|société générale|credit|crédit ?agricole|lcl|caisse d/i, "banque"],
  [/pret|prêt|echeance|échéance|remboursement/i, "credit"],
  [/livret|epargne|épargne|pel|virement.*livret/i, "epargne"],
  [/salaire|paie|paye|remuneration|rémunération|alternance|stage|virement.*sal/i, "salaire"],
  [/caf |apl|allocation|bourse|crous/i, "aides"]
];
const devine = lib => { for (const [re, c] of REGLES) if (re.test(lib)) return c; return "divers"; };

function parseReleve(txt) {
  const out = [];
  const an = +today().slice(0, 4);
  for (let ligne of txt.split(/\r?\n/)) {
    ligne = ligne.replace(/\t/g, "  ").trim();
    if (ligne.length < 5) continue;
    const md = ligne.match(/(\d{1,2})[\/\.\-](\d{1,2})(?:[\/\.\-](\d{2,4}))?/);
    if (!md) continue;
    let [_, j, m, y] = md;
    y = y ? (y.length === 2 ? 2000 + +y : +y) : an;
    if (+m < 1 || +m > 12 || +j < 1 || +j > 31) continue;
    const date = `${y}-${String(+m).padStart(2, "0")}-${String(+j).padStart(2, "0")}`;
    const reste = ligne.slice(md.index + md[0].length);
    const nums = [...reste.matchAll(/(-|\+|−)?\s?(\d{1,3}(?:[ . ]\d{3})*|\d+)([,.]\d{1,2})?\s*(€|EUR)?/g)]
      .map(x => ({ s: x[0], i: x.index, v: (x[1] ? -1 : 1) * parseFloat((x[2] + (x[3] || "")).replace(/[ . ](?=\d{3})/g, "").replace(",", ".")), neg: !!x[1] && x[1] !== "+", euro: !!x[4] }))
      .filter(x => !isNaN(x.v) && x.v !== 0);
    if (!nums.length) continue;
    const mt = nums[nums.length - 1];
    let lib = reste.slice(0, mt.i)
      .replace(/^\s*(carte|cb|paiement cb|achat cb|prlv sepa|prlv|prelevement|prélèvement|vir sepa|vir inst|virement|vir|retrait|facture)\s*/i, "")
      .replace(/\b\d{1,2}[\/\.]\d{1,2}(?:[\/\.]\d{2,4})?\b/g, " ")
      .replace(/\s{2,}/g, " ").replace(/[|;,]+$/, "").trim() || "Opération";
    let v = Math.abs(mt.v);
    const credit = /\b(cr(e|é)dit|virement re(c|ç)u|salaire|remboursement)\b/i.test(lib) || (!mt.neg && /\+/.test(mt.s));
    out.push({ date, nom: lib.slice(0, 60), montant: credit ? v : -v, cat: devine(lib) });
  }
  return out;
}
function sheetImport(pre) {
  openSheet(`<h3>Coller un relevé</h3>
  <div class="sub">Copie les lignes de ton appli bancaire et colle-les ici. L&#39;app repère la date, le libellé,
    le montant, et devine la catégorie.</div>
  <div class="mini">Bon réflexe : importe ton relevé, <b>puis</b> mets à jour ton solde en haut de l&#39;écran.
    Tout ce qui est antérieur à ton solde est ignoré dans la projection — donc rien n&#39;est compté deux fois.
    Et si une opération correspond à un prélèvement prévu, l&#39;app la reconnaît toute seule.</div>
  <div class="f"><textarea id="rel-txt" placeholder="05/09  CARTE LIDL PARIS        -34,20
04/09  PRLV NETFLIX               -13,49
02/09  VIR SALAIRE ALTERNANCE    +1 245,60"></textarea></div>
  <button class="btn pri" data-a="rel-parse">Analyser</button>
  <div id="rel-out"></div>
  <button class="btn sm" style="margin-top:8px;border:none;color:var(--muted)" data-a="close">Fermer</button>`);
}
let IMP = [];
function analyseReleve() {
  const txt = (document.getElementById("rel-txt") || {}).value || "";
  IMP = parseReleve(txt);
  const dejaVu = new Set(S.reels.map(r => r.date + "|" + Math.round(r.montant * 100)));
  IMP = IMP.filter(x => !dejaVu.has(x.date + "|" + Math.round(x.montant * 100)));
  const out = document.getElementById("rel-out");
  if (!IMP.length) { out.innerHTML = '<div class="empty">Rien de reconnu (ou déjà importé).<br>Il faut au moins une date et un montant par ligne.</div>'; return; }
  const tot = IMP.reduce((s, x) => s + x.montant, 0);
  out.innerHTML = `<div class="sec"><div class="sec-h"><h2>${IMP.length} opérations</h2>
    <span class="num ${cls(tot)}" style="font-size:13px;font-weight:700">${fmt(tot, true)}</span></div>
    ${IMP.map((x, i) => `<div class="row"><div class="em">${cat(x.cat).e}</div>
      <div class="in"><div class="t">${esc(x.nom)}</div><div class="s">${jourCourt(x.date)} · ${cat(x.cat).n}</div></div>
      <div class="m ${cls(x.montant)} num">${fmt(x.montant, true)}</div></div>`).join("")}
    <button class="btn pri" style="margin-top:10px" data-a="rel-ok">Ajouter ces ${IMP.length} opérations</button></div>`;
}

/* ---------- détection des prélèvements récurrents ---------- */
const norm = s => String(s).toLowerCase().replace(/\d+/g, "").replace(/(carte|cb|prlv|prelevement|prélèvement|vir|virement|achat|paiement)/g, "")
  .replace(/[^a-zàâçéèêëîïôûùüÿñæœ ]/g, " ").replace(/\s+/g, " ").trim();
function detecte() {
  const grp = {};
  for (const r of S.reels) {
    const k = norm(r.nom).slice(0, 18);
    if (k.length < 3) continue;
    (grp[k] = grp[k] || []).push(r);
  }
  const prop = [];
  for (const k in grp) {
    const g = grp[k].sort((a, b) => a.date < b.date ? -1 : 1);
    const mois = new Set(g.map(r => moisDe(r.date)));
    if (g.length < 2 || mois.size < 2) continue;
    const mts = g.map(r => r.montant);
    const moy = mts.reduce((s, v) => s + v, 0) / mts.length;
    const stable = mts.every(v => Math.abs(v - moy) <= Math.max(2, Math.abs(moy) * .12));
    if (!stable) continue;
    const dejaFlux = S.flux.some(f => norm(f.nom).slice(0, 18) === k);
    if (dejaFlux) continue;
    const jours = g.map(r => +r.date.slice(8, 10)).sort((a, b) => a - b);
    prop.push({ nom: g[g.length - 1].nom, cat: g[0].cat, montant: Math.round(moy * 100) / 100, jour: jours[Math.floor(jours.length / 2)], n: g.length });
  }
  return prop.sort((a, b) => a.montant - b.montant);
}
let DET = [];
function sheetDetect() {
  DET = detecte();
  openSheet(`<h3>Prélèvements détectés</h3>
  <div class="sub">L&#39;app a cherché, dans tes dépenses notées, ce qui revient tous les mois au même montant.</div>
  ${DET.length ? DET.map((p, i) => `<div class="row tap" data-a="det-add" data-i="${i}">
      <div class="em">${cat(p.cat).e}</div>
      <div class="in"><div class="t">${esc(p.nom)}</div><div class="s">vu ${p.n} fois · vers le ${p.jour} du mois</div></div>
      <div class="m ${cls(p.montant)} num">${fmt(p.montant, true)}<small>＋ créer</small></div></div>`).join("") +
    `<button class="btn pri" style="margin-top:10px" data-a="det-all">Tout créer (${DET.length})</button>`
    : '<div class="empty">Rien de récurrent repéré pour l&#39;instant.<br>Il faut au moins deux mois de dépenses notées<br>avec le même libellé et le même montant.</div>'}
  <button class="btn sm" style="margin-top:8px;border:none;color:var(--muted)" data-a="close">Fermer</button>`);
}
function creeDepuisDetect(p) {
  const d = `${moisDe(today())}-${String(Math.min(p.jour, 28)).padStart(2, "0")}`;
  S.flux.push({
    id: uid(), nom: p.nom, montant: p.montant, cat: p.cat, actif: true, wk: "apres", enveloppe: false,
    freq: "mensuel", date: d, debut: d, fin: null, jour: p.jour, mois: +d.slice(5, 7)
  });
}

/* ---------- solde, matelas, données ---------- */
function sheetAncre() {
  const l = ligneAuj();
  openSheet(`<h3>Mon solde aujourd&#39;hui</h3>
  <div class="sub">Regarde ton appli bancaire et recopie le solde de ton compte courant.
    Tout le reste (calendrier, projection, reste à vivre) part de ce chiffre.</div>
  <div class="f"><label>Solde du compte (€)</label><input id="a-solde" type="number" inputmode="decimal" step="0.01"
    value="${S.ancre.solde || ""}" placeholder="0"></div>
  <div class="f"><label>À la date du</label><input id="a-date" type="date" value="${today()}"></div>
  ${l ? `<div class="mini">L&#39;app prévoyait ${fmt(l.solde)} pour aujourd&#39;hui. Si l&#39;écart est gros,
    c&#39;est qu&#39;il te manque des dépenses ou un prélèvement — regarde l&#39;onglet 💸.</div>` : ""}
  <button class="btn pri" data-a="a-save">Enregistrer</button>
  <button class="btn sm" style="margin-top:8px;border:none;color:var(--muted)" data-a="close">Annuler</button>`);
}
function sheetMatelas() {
  openSheet(`<h3>Matelas de sécurité</h3>
  <div class="sub">Le montant que tu ne veux jamais passer sous la barre. L&#39;app t&#39;alerte avant, pas après.</div>
  <div class="f"><label>Seuil (€)</label><input id="m-val" type="number" inputmode="decimal" step="10" value="${+S.matelas || 0}"></div>
  <div class="mini">Repère utile : un mois de charges fixes, soit ${fmt0(Math.abs(bilan(S).sortiesMois))}.</div>
  <button class="btn pri" data-a="m-save">Enregistrer</button>
  <button class="btn sm" style="margin-top:8px;border:none;color:var(--muted)" data-a="close">Annuler</button>`);
}
function exporte() {
  const blob = new Blob([JSON.stringify(S, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "echeancier-" + today() + ".json";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  toast("Fichier exporté");
}
function sheetImportJSON() {
  openSheet(`<h3>Importer mes données</h3>
  <div class="sub">Colle un export de L&#39;ÉCHÉANCIER (ou le bloc que je t&#39;ai préparé). Ça remplace tout.</div>
  <div class="f"><textarea id="j-txt" placeholder='{"v":1,"ancre":{...},"flux":[...]}'></textarea></div>
  <button class="btn pri" data-a="j-save">Remplacer mes données</button>
  <button class="btn sm" style="margin-top:8px;border:none;color:var(--muted)" data-a="close">Annuler</button>`);
}

/* ---------- routeur ---------- */
document.addEventListener("click", ev => {
  const el = ev.target.closest("[data-a]");
  if (!el) return;
  const a = el.dataset.a;
  const A = {
    close: closeSheet,
    "mois-": () => { MOIS = moisDe(addM(MOIS + "-01", -1)); render(); },
    "mois+": () => { MOIS = moisDe(addM(MOIS + "-01", 1)); render(); },
    jour: () => sheetJour(el.dataset.d),
    horizon: () => { S.reglages.horizon = +el.dataset.n; save(); render(); },
    "edit-flux": () => el.dataset.id && editFlux(el.dataset.id),
    "edit-reel": () => el.dataset.id && editReel(el.dataset.id),
    "new-reel": () => { editReel(null); if (el.dataset.d) { ER.date = el.dataset.d; dessineReel(); } },
    "new-flux": () => editFlux(null),
    modeles: sheetModeles,
    detect: sheetDetect,
    "import-releve": sheetImport,
    "rel-parse": analyseReleve,
    "rel-ok": () => {
      for (const x of IMP) S.reels.push({ id: uid(), date: x.date, montant: x.montant, cat: x.cat, nom: x.nom });
      save(); closeSheet(); recalc(); render(); toast(IMP.length + " opérations ajoutées ✓");
    },
    "det-add": () => { creeDepuisDetect(DET[+el.dataset.i]); save(); recalc(); sheetDetect(); render(); toast("Prélèvement créé ✓"); },
    "det-all": () => { DET.forEach(creeDepuisDetect); save(); closeSheet(); recalc(); render(); toast("Prélèvements créés ✓"); },
    modele: () => {
      const m = MODELES[+el.dataset.i];
      editFlux(null);
      ED.nom = m[0]; ED.cat = m[1]; ED.sens = m[2] > 0 ? 1 : -1; ED.type = m[3];
      if (m[3] === "rec" && m[2] > 0) ED.wk = "avant";
      dessineFlux();
    },
    "ed-sens": () => { lireFlux(); ED.sens = +el.dataset.v; ED.montant = Math.abs(ED.montant) * ED.sens; dessineFlux(); },
    "ed-type": () => { lireFlux(); ED.type = el.dataset.v; dessineFlux(); },
    "ed-cat": () => { lireFlux(); ED.cat = el.dataset.k; dessineFlux(); },
    "ed-save": saveFlux,
    "ed-pause": () => { lireFlux(); ED.actif = !ED.actif; const f = S.flux.find(x => x.id === ED.id); if (f) { f.actif = ED.actif; save(); recalc(); render(); } dessineFlux(); toast(ED.actif ? "Réactivé" : "En pause"); },
    "ed-del": () => { S.flux = S.flux.filter(x => x.id !== ED.id); save(); closeSheet(); recalc(); render(); toast("Supprimé"); },
    "er-sens": () => { ER.sens = +el.dataset.v; const g = k => (document.getElementById("r-" + k) || {}).value; ER.montant = Math.abs(parseFloat(String(g("montant") || 0).replace(",", ".")) || 0) * ER.sens; ER.nom = g("nom") || ""; ER.date = g("date") || ER.date; dessineReel(); },
    "er-cat": () => { const g = k => (document.getElementById("r-" + k) || {}).value; ER.montant = Math.abs(parseFloat(String(g("montant") || 0).replace(",", ".")) || 0) * ER.sens; ER.nom = g("nom") || ""; ER.date = g("date") || ER.date; ER.cat = el.dataset.k; dessineReel(); },
    "er-save": saveReel,
    "er-del": () => { S.reels = S.reels.filter(x => x.id !== ER.id); save(); closeSheet(); recalc(); render(); toast("Supprimé"); },
    ancre: sheetAncre,
    "a-save": () => {
      const v = parseFloat(String((document.getElementById("a-solde") || {}).value || "0").replace(",", "."));
      S.ancre = { date: (document.getElementById("a-date") || {}).value || today(), solde: isNaN(v) ? 0 : v };
      save(); closeSheet(); recalc(); render(); toast("Solde mis à jour ✓");
    },
    "set-matelas": sheetMatelas,
    "m-save": () => {
      S.matelas = parseFloat(String((document.getElementById("m-val") || {}).value || "0").replace(",", ".")) || 0;
      save(); closeSheet(); recalc(); render(); toast("Matelas enregistré");
    },
    export: exporte,
    import: sheetImportJSON,
    "j-save": () => {
      try {
        const o = JSON.parse((document.getElementById("j-txt") || {}).value);
        if (!o || typeof o !== "object" || !Array.isArray(o.flux)) throw 0;
        S = Object.assign(vide(), o);
        save(); closeSheet(); recalc(); render(); toast("Données importées ✓");
      } catch (e) { toast("JSON invalide"); }
    },
    raz: () => {
      if (!confirm("Effacer tous tes flux, dépenses et réglages ? C'est irréversible.")) return;
      S = vide(); save(); recalc(); render(); toast("Tout est effacé");
    }
  };
  if (A[a]) { ev.preventDefault(); A[a](); }
});
document.getElementById("sbg").addEventListener("click", closeSheet);
document.querySelectorAll("nav button").forEach(b => b.addEventListener("click", () => {
  VUE = b.dataset.v;
  document.querySelectorAll("nav button").forEach(x => x.classList.toggle("on", x === b));
  if (VUE === "mois" || VUE === "reel") MOIS = MOIS || moisDe(today());
  render(); window.scrollTo(0, 0);
}));
document.getElementById("btn-ancre").addEventListener("click", sheetAncre);
document.getElementById("fab").addEventListener("click", () => VUE === "reel" ? editReel(null) : editFlux(null));

/* ---------- rendu ---------- */
function render() {
  renderHeader();
  const vues = { mois: vueMois, cap: vueCap, flux: vueFlux, reel: vueReel, bilan: vueBilan };
  for (const k in vues) {
    const el = document.getElementById("v-" + k);
    el.classList.toggle("hidden", k !== VUE);
    if (k === VUE) el.innerHTML = vues[k]();
  }
  document.getElementById("fab").classList.toggle("hidden", !(VUE === "flux" || VUE === "reel"));
}

charge();
recalc();
render();
window.__S = () => S;

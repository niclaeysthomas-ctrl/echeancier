/* L'ÉCHÉANCIER — moteur de calcul (pur, sans DOM, testable)
   Tout est en dates locales "YYYY-MM-DD". Aucune UTC, aucun décalage. */

/* ---------- dates ---------- */
const d2s = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
const s2d = s => { const [y, m, j] = s.split("-").map(Number); return new Date(y, m - 1, j, 12, 0, 0); };
const addJ = (s, n) => { const d = s2d(s); d.setDate(d.getDate() + n); return d2s(d); };
const addM = (s, n) => { const d = s2d(s); const j = d.getDate(); d.setDate(1); d.setMonth(d.getMonth() + n); d.setDate(Math.min(j, dansMois(d.getFullYear(), d.getMonth() + 1))); return d2s(d); };
const dansMois = (y, m) => new Date(y, m, 0).getDate();          // m = 1-12
const today = () => d2s(new Date());
const diffJ = (a, b) => Math.round((s2d(b) - s2d(a)) / 86400000);
const jsem = s => s2d(s).getDay();                                // 0=dim
const moisDe = s => s.slice(0, 7);
const finDeMois = s => { const [y, m] = s.split("-").map(Number); return `${y}-${String(m).padStart(2, "0")}-${String(dansMois(y, m)).padStart(2, "0")}`; };
const debutDeMois = s => s.slice(0, 7) + "-01";

/* ---------- jours fériés France (calculés, pas de table) ---------- */
function paques(y) {                                              // Meeus/Jones/Butcher
  const a = y % 19, b = Math.floor(y / 100), c = y % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mois = Math.floor((h + l - 7 * m + 114) / 31), jour = ((h + l - 7 * m + 114) % 31) + 1;
  return `${y}-${String(mois).padStart(2, "0")}-${String(jour).padStart(2, "0")}`;
}
const _feriesCache = {};
function feries(y) {
  if (_feriesCache[y]) return _feriesCache[y];
  const p = paques(y);
  const s = new Set([`${y}-01-01`, addJ(p, 1), `${y}-05-01`, `${y}-05-08`, addJ(p, 39), addJ(p, 50),
    `${y}-07-14`, `${y}-08-15`, `${y}-11-01`, `${y}-11-11`, `${y}-12-25`]);
  return (_feriesCache[y] = s);
}
const ouvre = s => { const j = jsem(s); return j !== 0 && j !== 6 && !feries(+s.slice(0, 4)).has(s); };
function ajusteOuvre(s, mode) {                                   // "apres" | "avant" | "aucun"
  if (mode !== "apres" && mode !== "avant") return s;
  let d = s, n = 0;
  while (!ouvre(d) && n++ < 12) d = addJ(d, mode === "apres" ? 1 : -1);
  return d;
}

/* ---------- catégories ---------- */
const CATS = {
  logement:   { e: "🏠", n: "Logement",    c: "#7c9cff" },
  energie:    { e: "⚡", n: "Énergie",      c: "#f5c451" },
  telecom:    { e: "📱", n: "Télécom",      c: "#59c2e8" },
  courses:    { e: "🛒", n: "Courses",      c: "#4ec97e" },
  transport:  { e: "🚆", n: "Transport",    c: "#b48ef5" },
  abos:       { e: "📺", n: "Abonnements",  c: "#ef6fa8" },
  sante:      { e: "🩺", n: "Santé",        c: "#5be0c0" },
  assurance:  { e: "🛡", n: "Assurances",   c: "#8fa3bf" },
  ecole:      { e: "🎓", n: "Études",       c: "#e8956a" },
  sport:      { e: "🥊", n: "Sport",        c: "#e5484d" },
  sorties:    { e: "🍻", n: "Sorties",      c: "#f2a33c" },
  resto:      { e: "🍽", n: "Restos",       c: "#f5854a" },
  shopping:   { e: "👕", n: "Shopping",     c: "#c98ee0" },
  voyage:     { e: "✈️", n: "Voyages",      c: "#63b3ed" },
  banque:     { e: "🏦", n: "Banque/frais", c: "#8d95a5" },
  credit:     { e: "🧾", n: "Crédit",       c: "#d1657a" },
  epargne:    { e: "🐖", n: "Épargne",      c: "#3ddc97" },
  divers:     { e: "✳️", n: "Divers",       c: "#9aa3b2" },
  salaire:    { e: "💰", n: "Salaire",      c: "#3ddc97" },
  aides:      { e: "🤝", n: "Aides/APL",    c: "#5ec4a0" },
  famille:    { e: "👨‍👩‍👦", n: "Famille",  c: "#7fd6a8" }
};
const cat = k => CATS[k] || CATS.divers;

/* ---------- fréquences ---------- */
const FREQ = {
  mensuel:     { n: "Chaque mois",      pas: 1,  unite: "m", parAn: 12 },
  bimestriel:  { n: "Tous les 2 mois",  pas: 2,  unite: "m", parAn: 6 },
  trimestriel: { n: "Chaque trimestre", pas: 3,  unite: "m", parAn: 4 },
  semestriel:  { n: "Chaque semestre",  pas: 6,  unite: "m", parAn: 2 },
  annuel:      { n: "Chaque année",     pas: 12, unite: "m", parAn: 1 },
  hebdo:       { n: "Chaque semaine",   pas: 7,  unite: "j", parAn: 52.1786 },
  quinzaine:   { n: "Tous les 15 jours",pas: 14, unite: "j", parAn: 26.0893 },
  ponctuel:    { n: "Une seule fois",   pas: 0,  unite: "-", parAn: 0 }
};

/* Montant annualisé d'un flux (signé). */
function parAn(f) {
  if (f.freq === "ponctuel") return 0;
  return f.montant * (FREQ[f.freq] ? FREQ[f.freq].parAn : 0);
}
const parMois = f => parAn(f) / 12;

/* ---------- occurrences ----------
   Renvoie [{date, montant, f}] pour un flux entre a et b inclus. */
function occurrences(f, a, b) {
  if (!f.actif) return [];
  const out = [];
  const debut = f.debut || "1900-01-01";
  const fin = f.fin || "2999-12-31";
  const borneA = a > debut ? a : debut;
  const push = brut => {
    if (brut < debut || brut > fin) return;
    const d = ajusteOuvre(brut, f.wk || "aucun");
    if (d < a || d > b) return;
    out.push({ date: d, brut, montant: f.montant, f });
  };

  if (f.freq === "ponctuel") { push(f.date); return out; }

  if (FREQ[f.freq].unite === "j") {                               // hebdo / quinzaine
    const pas = FREQ[f.freq].pas;
    let d = f.debut || a;
    if (d < borneA) { const n = Math.floor(diffJ(d, borneA) / pas); d = addJ(d, Math.max(0, n - 1) * pas); }
    let garde = 0;
    while (d <= b && garde++ < 2000) { push(d); d = addJ(d, pas); }
    return out;
  }

  const pas = FREQ[f.freq].pas;                                   // mensuel & multiples
  const ancreM = f.debut || `${a.slice(0, 4)}-01-01`;
  const jour = f.jour || +(f.debut || a).slice(8, 10) || 1;
  let curseur = debutDeMois(ancreM);
  const finB = debutDeMois(b);
  if (curseur < debutDeMois(borneA)) {
    const ecart = (+borneA.slice(0, 4) - +curseur.slice(0, 4)) * 12 + (+borneA.slice(5, 7) - +curseur.slice(5, 7));
    // un pas de recul : une échéance de fin de mois peut être décalée sur le mois suivant
    curseur = addM(curseur, Math.max(0, Math.floor(ecart / pas) - 1) * pas);
  }
  let garde = 0;
  while (curseur <= addM(finB, pas) && garde++ < 2000) {
    const [y, m] = curseur.split("-").map(Number);
    if (f.freq === "annuel" && f.mois && m !== f.mois) { curseur = addM(curseur, pas); continue; }
    const jj = Math.min(jour, dansMois(y, m));
    push(`${y}-${String(m).padStart(2, "0")}-${String(jj).padStart(2, "0")}`);
    curseur = addM(curseur, pas);
  }
  return out.sort((x, y) => x.date < y.date ? -1 : 1);
}

/* Toutes les occurrences prévues (hors enveloppes lissées) entre a et b. */
function agenda(S, a, b) {
  const out = [];
  for (const f of S.flux) { if (f.enveloppe) continue; out.push(...occurrences(f, a, b)); }
  return out.sort((x, y) => x.date < y.date ? -1 : (x.date > y.date ? 1 : 0));
}

/* ---------- rapprochement prévu <-> réel ----------
   Si une dépense notée ressemble à une échéance prévue (même sens, montant proche, à quelques
   jours près), c'est la même opération : on marque la prévision comme "pointée" pour ne pas
   la compter deux fois. */
function pointage(S, occs, depuis) {
  const pris = new Set();
  const cand = S.reels.filter(r => r.date > depuis);
  for (const o of occs) {
    o.pointe = null;
    if (o.date <= depuis) continue;
    const c = cand.find(r => !pris.has(r.id)
      && (r.montant < 0) === (o.montant < 0)
      && Math.abs(Math.abs(r.montant) - Math.abs(o.montant)) <= Math.max(1.5, Math.abs(o.montant) * 0.04)
      && Math.abs(diffJ(o.date, r.date)) <= 4);
    if (c) { pris.add(c.id); o.pointe = c.id; }
  }
  return occs;
}

/* ---------- enveloppes (dépenses variables lissées) ----------
   Une enveloppe = budget mensuel. Les dépenses réelles de sa catégorie la consomment.
   Ce qui reste est étalé sur les jours restants du mois. */
function resteEnveloppe(S, f, mois, depuis) {
  const budget = Math.abs(f.montant);
  const depense = S.reels
    .filter(r => moisDe(r.date) === mois && r.cat === f.cat && r.montant < 0)
    .reduce((s, r) => s + Math.abs(r.montant), 0);
  const dernier = finDeMois(mois + "-01");
  const debutFen = depuis > mois + "-01" ? depuis : mois + "-01";
  if (debutFen > dernier) return { reste: 0, jours: 0, debut: debutFen, fin: dernier, budget, depense };
  const jours = diffJ(debutFen, dernier) + 1;
  return { reste: Math.max(0, budget - depense), jours, debut: debutFen, fin: dernier, budget, depense };
}

/* ---------- projection jour par jour ----------
   Départ : le solde ancré à sa date. Puis, strictement APRÈS cette date :
   + occurrences prévues  + dépenses réelles hors catégories-enveloppes
   + enveloppes lissées (leur reste du mois étalé sur les jours restants). */
function projection(S, jours = 120) {
  const a0 = S.ancre.date, dep = +S.ancre.solde || 0;
  const t = today();
  const debut = a0 < t ? a0 : t;                                   // on montre aussi le passé récent
  const fin = addJ(t, jours);
  const catsEnv = new Set(S.flux.filter(f => f.enveloppe && f.actif).map(f => f.cat));

  const evts = {};
  const push = (d, o) => { (evts[d] = evts[d] || []).push(o); };

  for (const o of pointage(S, agenda(S, addJ(a0, 1), fin), a0)) {
    if (o.pointe) continue;                                        // déjà passé sur le compte
    push(o.date, { nom: o.f.nom, cat: o.f.cat, montant: o.montant, type: "prevu", id: o.f.id, wk: o.brut !== o.date });
  }

  for (const r of S.reels) {
    if (r.date <= a0 || r.date > fin) continue;
    if (r.montant < 0 && catsEnv.has(r.cat)) continue;             // consommé par l'enveloppe
    push(r.date, { nom: r.nom || cat(r.cat).n, cat: r.cat, montant: r.montant, type: "reel", id: r.id });
  }

  // enveloppes : part quotidienne, mois par mois
  const parJourEnv = {};
  for (const f of S.flux.filter(x => x.enveloppe && x.actif)) {
    let m = moisDe(addJ(a0, 1) > t ? addJ(a0, 1) : t);
    const mFin = moisDe(fin);
    let garde = 0;
    while (m <= mFin && garde++ < 60) {
      const depuis = (addJ(a0, 1) > m + "-01") ? addJ(a0, 1) : m + "-01";
      const r = resteEnveloppe(S, f, m, depuis);
      if (r.jours > 0 && r.reste > 0) {
        const q = r.reste / r.jours;
        for (let i = 0; i < r.jours; i++) {
          const d = addJ(r.debut, i);
          if (d <= a0 || d > fin) continue;
          parJourEnv[d] = (parJourEnv[d] || 0) - q;
        }
      }
      m = moisDe(addM(m + "-01", 1));
    }
  }

  const lignes = [];
  let solde = dep;
  for (let d = debut; d <= fin; d = addJ(d, 1)) {
    const ev = (evts[d] || []).slice().sort((x, y) => x.montant - y.montant);
    const env = parJourEnv[d] || 0;
    const delta = ev.reduce((s, e) => s + e.montant, 0) + env;
    if (d > a0) solde += delta;
    lignes.push({
      date: d, solde: Math.round(solde * 100) / 100, evts: ev, env,
      entrees: ev.filter(e => e.montant > 0).reduce((s, e) => s + e.montant, 0),
      sorties: ev.filter(e => e.montant < 0).reduce((s, e) => s + e.montant, 0) + env
    });
  }
  return lignes;
}

/* ---------- lectures utiles ---------- */
function creux(lignes) {                                          // point le plus bas à venir
  const t = today();
  const fut = lignes.filter(l => l.date >= t);
  if (!fut.length) return null;
  return fut.reduce((m, l) => l.solde < m.solde ? l : m, fut[0]);
}
function passageSous(lignes, seuil = 0) {
  const t = today();
  return lignes.find(l => l.date >= t && l.solde < seuil) || null;
}
function prochaineEntree(S, apres, horizon = 70) {
  const o = agenda(S, addJ(apres, 1), addJ(apres, horizon)).filter(x => x.montant > 0);
  return o.length ? o[0] : null;
}
/* Reste à vivre : ce qui est libre d'ici la prochaine rentrée d'argent. */
function resteAVivre(S, lignes) {
  const t = today();
  const auj = lignes.find(l => l.date === t);
  if (!auj) return null;
  const pe = prochaineEntree(S, t);
  const cible = pe ? pe.date : finDeMois(t);
  const jours = Math.max(1, diffJ(t, cible));
  const obl = agenda(S, addJ(t, 1), cible).reduce((s, o) => s + Math.min(0, o.montant), 0);
  const env = lignes.filter(l => l.date > t && l.date <= cible).reduce((s, l) => s + l.env, 0);
  const libre = auj.solde + obl + env - (+S.matelas || 0);
  return { libre, jours, parJour: libre / jours, cible, obligations: -obl, enveloppes: -env, entree: pe };
}
/* Bilan : ce que chaque poste coûte par mois / par an. */
function bilan(S) {
  const postes = {};
  let inM = 0, outM = 0;
  for (const f of S.flux) {
    if (!f.actif || f.freq === "ponctuel") continue;
    const m = f.enveloppe ? f.montant : parMois(f);
    if (m > 0) inM += m; else outM += m;
    const k = f.cat;
    postes[k] = postes[k] || { cat: k, mois: 0, an: 0, n: 0, flux: [] };
    postes[k].mois += m; postes[k].an += m * 12; postes[k].n++; postes[k].flux.push({ f, mois: m });
  }
  const liste = Object.values(postes).sort((a, b) => a.mois - b.mois);
  return { postes: liste, entreesMois: inM, sortiesMois: outM, netMois: inM + outM, netAn: (inM + outM) * 12 };
}
/* Prévu vs réel d'un mois, par catégorie. */
function prevuReel(S, mois) {
  const a = mois + "-01", b = finDeMois(a);
  const m = {};
  const add = (k, champ, v) => { m[k] = m[k] || { cat: k, prevu: 0, reel: 0 }; m[k][champ] += v; };
  for (const f of S.flux.filter(x => x.actif)) {
    if (f.enveloppe) add(f.cat, "prevu", f.montant);
    else for (const o of occurrences(f, a, b)) add(f.cat, "prevu", o.montant);
  }
  void 0;
  for (const r of S.reels.filter(x => moisDe(x.date) === mois)) add(r.cat, "reel", r.montant);
  return Object.values(m).sort((x, y) => (x.prevu + x.reel) - (y.prevu + y.reel));
}

/* ============================================================
   AJOUTS — provisions, simulation, historique, objectif
   ============================================================ */

/* Les grosses échéances qui ne tombent pas tous les mois (assurance au trimestre,
   impôts à l'année…). Ce qu'il faudrait mettre de côté chaque mois pour ne pas
   les prendre dans la figure. */
function provisions(S) {
  const l = S.flux
    .filter(f => f.actif && !f.enveloppe && f.montant < 0 && f.freq !== "ponctuel" && FREQ[f.freq].parAn < 12)
    .map(f => ({ f, mois: -parMois(f), an: -parAn(f), prochaine: (occurrences(f, today(), addJ(today(), 800))[0] || {}).date }))
    .sort((a, b) => b.mois - a.mois);
  return { liste: l, mois: l.reduce((s, x) => s + x.mois, 0), an: l.reduce((s, x) => s + x.an, 0) };
}

/* Combien de jours tu tiens si tout s'arrête : solde ÷ dépenses moyennes par jour. */
function autonomie(S, lignes) {
  const l = lignes.find(x => x.date === today());
  const b = bilan(S);
  const parJour = Math.abs(b.sortiesMois) * 12 / 365;
  if (!l || parJour <= 0) return null;
  return { jours: Math.max(0, Math.floor((l.solde - (+S.matelas || 0)) / parJour)), parJour, solde: l.solde };
}

/* ---------- simulation « et si ? » ----------
   Une dépense ponctuelle décale tout le solde à partir de sa date : solde'(j) = solde(j) − M
   pour j ≥ d. On précalcule donc le minimum de fin de série (suffixe) : une seule projection
   suffit pour répondre à « ça passe ? » et « à partir de quand ça passerait ? ». */
function simule(S, montant, date, lignes) {
  const M = Math.abs(montant), seuil = +S.matelas || 0, t = today();
  const L = (lignes || projection(S, 400)).filter(l => l.date >= t);
  const sufMin = new Array(L.length);
  let m = Infinity;
  for (let i = L.length - 1; i >= 0; i--) { m = Math.min(m, L[i].solde); sufMin[i] = m; }
  const idx = L.findIndex(l => l.date >= date);
  if (idx < 0) return null;
  const avantMin = sufMin[0];
  const apresMin = sufMin[idx] - M;
  const iBas = L.slice(idx).reduce((best, l, k) => l.solde < L[idx + best].solde ? k : best, 0) + idx;
  let possible = null;
  for (let i = 0; i < L.length; i++) if (sufMin[i] - M >= seuil) { possible = L[i].date; break; }
  const soldeApres = L[L.length - 1].solde - M;
  return {
    montant: M, date, seuil,
    avantMin, apresMin,
    dateBas: L[iBas] ? L[iBas].date : null,
    ok: apresMin >= seuil,
    juste: apresMin >= seuil && apresMin < seuil + M * .5,
    manque: Math.max(0, seuil - apresMin),
    possible, soldeApres,
    courbe: L.map((l, i) => ({ date: l.date, solde: i >= idx ? l.solde - M : l.solde }))
  };
}

/* ---------- historique réel, mois par mois ---------- */
function histoMois(S, n = 6) {
  const out = [];
  let m = moisDe(today());
  for (let i = 0; i < n; i++) {
    const rs = S.reels.filter(r => moisDe(r.date) === m);
    const inn = rs.filter(r => r.montant > 0).reduce((s, r) => s + r.montant, 0);
    const out_ = rs.filter(r => r.montant < 0).reduce((s, r) => s + r.montant, 0);
    const parCat = {};
    for (const r of rs) if (r.montant < 0) parCat[r.cat] = (parCat[r.cat] || 0) + r.montant;
    out.push({
      mois: m, n: rs.length, entrees: inn, sorties: out_, net: inn + out_,
      cats: Object.entries(parCat).map(([cat, v]) => ({ cat, v })).sort((a, b) => a.v - b.v)
    });
    m = moisDe(addM(m + "-01", -1));
  }
  return out;
}

/* Moyenne mensuelle réelle par catégorie sur les mois COMPLETS précédents,
   comparée au mois en cours (projeté à l'échelle du mois entier). */
function tendances(S, n = 3) {
  const cour = moisDe(today());
  const hist = histoMois(S, n + 1).filter(h => h.mois !== cour && h.n > 0);
  const moy = {};
  for (const h of hist) for (const c of h.cats) moy[c.cat] = (moy[c.cat] || 0) + c.v / hist.length;
  const rsC = S.reels.filter(r => moisDe(r.date) === cour && r.montant < 0);
  const enCours = {};
  for (const r of rsC) enCours[r.cat] = (enCours[r.cat] || 0) + r.montant;
  const jr = +today().slice(8, 10), nj = dansMois(+cour.slice(0, 4), +cour.slice(5, 7));
  const out = [];
  for (const cat of new Set([...Object.keys(moy), ...Object.keys(enCours)])) {
    const ref = moy[cat] || 0, act = enCours[cat] || 0;
    const proj = act / Math.max(1, jr) * nj;
    out.push({ cat, moyenne: ref, actuel: act, projete: proj, ecart: ref ? (proj - ref) / Math.abs(ref) : null });
  }
  return { mois: hist.length, liste: out.sort((a, b) => a.projete - b.projete) };
}

/* ---------- objectif d'épargne ---------- */
function objectifEtat(S, lignes) {
  const o = S.objectif;
  if (!o || !o.montant || !o.date) return null;
  const t = today(), seuil = +S.matelas || 0;
  const L = lignes || projection(S, Math.max(400, diffJ(t, o.date) + 10));
  const l = L.find(x => x.date === o.date) || L[L.length - 1];
  const auj = L.find(x => x.date === t);
  const prevu = l ? l.solde : 0;
  const cible = +o.montant + seuil;
  const jours = Math.max(0, diffJ(t, o.date));
  const mois = Math.max(1, jours / 30.44);
  const creuxAvant = L.filter(x => x.date >= t && x.date <= o.date).reduce((m, x) => x.solde < m ? x.solde : m, Infinity);
  return {
    nom: o.nom || "Mon objectif", montant: +o.montant, date: o.date, jours,
    prevu, cible, manque: Math.max(0, cible - prevu), atteint: prevu >= cible,
    parMois: Math.max(0, cible - prevu) / mois, parJour: Math.max(0, cible - prevu) / Math.max(1, jours),
    aujourdhui: auj ? auj.solde : 0, creuxAvant: creuxAvant === Infinity ? null : creuxAvant,
    pct: cible > seuil ? Math.max(0, Math.min(100, ((prevu - seuil) / (cible - seuil)) * 100)) : 0
  };
}

/* ---------- épargne (livrets, hors compte courant) ---------- */
function epargne(S) {
  const l = (S.livrets || []).filter(x => x && +x.montant);
  const total = l.reduce((s, x) => s + (+x.montant || 0), 0);
  const interets = l.reduce((s, x) => s + (+x.montant || 0) * (+x.taux || 0) / 100, 0);
  return { liste: l, total, interets };
}
/* Si le train de vie est déficitaire, combien de temps l'épargne encaisse. */
function tenue(S) {
  const b = bilan(S), e = epargne(S);
  if (b.netMois >= 0) return { deficit: 0, mois: null, total: e.total };
  const mois = e.total / Math.abs(b.netMois);
  return {
    deficit: -b.netMois, mois, total: e.total,
    date: addM(today(), Math.floor(mois)),
    parAn: b.netMois * 12
  };
}

/* ---------- scénarios (« et si je faisais ça ? ») ----------
   Un scénario est un paquet d'hypothèses : des revenus ou des dépenses en plus,
   ponctuels ou récurrents, qu'on peut allumer et éteindre pour comparer. */
function ligneVersFlux(l, prefixe) {
  return {
    id: (prefixe || "") + l.id, nom: l.nom, montant: +l.montant || 0, cat: l.cat || "divers",
    actif: true, wk: "aucun", enveloppe: false,
    freq: l.freq === "ponctuel" ? "ponctuel" : "mensuel",
    date: l.date, debut: l.date, fin: l.fin || null,
    jour: +(l.date || today()).slice(8, 10), mois: +(l.date || today()).slice(5, 7)
  };
}
function fluxScenarios(S, ids) {
  const out = [];
  for (const sc of (S.scenarios || [])) {
    if (ids ? !ids.includes(sc.id) : !sc.actif) continue;
    for (const l of (sc.lignes || [])) out.push(ligneVersFlux(l, sc.id + "_"));
  }
  return out;
}
function projectionScen(S, jours, ids) {
  const add = fluxScenarios(S, ids);
  if (!add.length) return projection(S, jours);
  return projection(Object.assign({}, S, { flux: S.flux.concat(add) }), jours);
}
/* Ce qu'un jeu de scénarios change, chiffré. */
function impact(S, jours, ids) {
  const t = today();
  const A = projection(S, jours).filter(l => l.date >= t);
  const B = projectionScen(S, jours, ids).filter(l => l.date >= t);
  const fin = d => { const l = A.find(x => x.date === d) || A[A.length - 1]; return l ? l.solde : 0; };
  const finB = d => { const l = B.find(x => x.date === d) || B[B.length - 1]; return l ? l.solde : 0; };
  const seuil = +S.matelas || 0;
  const j = n => addJ(t, n);
  const minA = A.reduce((m, l) => Math.min(m, l.solde), Infinity);
  const minB = B.reduce((m, l) => Math.min(m, l.solde), Infinity);
  const decouvA = A.find(l => l.solde < seuil), decouvB = B.find(l => l.solde < seuil);
  const parMois = (B.length && A.length) ? (B[B.length - 1].solde - A[A.length - 1].solde) / (jours / 30.44) : 0;
  return {
    A, B, jours,
    sans: { m3: fin(j(90)), m6: fin(j(182)), an: fin(j(365)), min: minA, decouv: decouvA ? decouvA.date : null },
    avec: { m3: finB(j(90)), m6: finB(j(182)), an: finB(j(365)), min: minB, decouv: decouvB ? decouvB.date : null },
    diff: { m3: finB(j(90)) - fin(j(90)), m6: finB(j(182)) - fin(j(182)), an: finB(j(365)) - fin(j(365)) },
    parMois
  };
}
/* Résumé lisible d'un scénario : « +200 €/mois à partir d'octobre ». */
function resumeScenario(sc) {
  const l = sc.lignes || [];
  if (!l.length) return "Aucune ligne — à remplir";
  const rec = l.filter(x => x.freq !== "ponctuel"), pon = l.filter(x => x.freq === "ponctuel");
  const mm = rec.reduce((s, x) => s + (+x.montant || 0), 0);
  const pp = pon.reduce((s, x) => s + (+x.montant || 0), 0);
  const eur = v => (v > 0 ? "+" : "−") + Math.abs(Math.round(v)).toLocaleString("fr-FR") + " €";
  const bouts = [];
  if (mm) bouts.push(eur(mm) + "/mois");
  if (pp) bouts.push(eur(pp) + " en une fois");
  return bouts.join(" · ") + (l.length > 1 ? " · " + l.length + " lignes" : "");
}
/* Combien d'échéances restent sur un flux qui a une fin (prêt, abonnement engagé). */
function echeancesRestantes(f) {
  if (!f.fin || f.freq === "ponctuel") return null;
  const o = occurrences(f, today(), f.fin);
  return { n: o.length, total: o.reduce((s, x) => s + x.montant, 0), derniere: o.length ? o[o.length - 1].date : null };
}

/* Sur une longue période, un point par jour donne un peigne illisible.
   On regroupe alors par paquets en gardant le PIRE solde de chaque paquet :
   c'est le creux qui compte, pas le pic. */
function echantillonne(a, max, pasImpose) {
  const pas = pasImpose || (a.length <= max ? 1 : Math.ceil(a.length / max));
  if (pas <= 1) return { pts: a.slice(), pas: 1 };
  const out = [];
  for (let i = 0; i < a.length; i += pas) {
    const bloc = a.slice(i, i + pas);
    out.push(bloc.reduce((m, x) => x.solde < m.solde ? x : m, bloc[0]));
  }
  const der = a[a.length - 1];
  if (out[out.length - 1] !== der) out.push(der);
  return { pts: out, pas };
}

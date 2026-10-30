// AuthCost static generator. Node 20+, no dependencies.
import fs from 'node:fs';import path from 'node:path';
const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');const R=p=>path.join(root,p);const D=R('dist');
const PROD_URL='https://authcost.pages.dev';
const SITE=(process.env.SITE_URL||(process.env.PROD?PROD_URL:'http://localhost:4190')).replace(/\/$/,'');
// Kit (o11y-watch.kit.com) — form + Pro + founding sponsor
const FORM_ACTION='https://app.kit.com/forms/10121361/subscriptions';
const CHECKOUT_PRO_MONTHLY='https://o11y-watch.kit.com/products/authcost-pro';
const CHECKOUT_PRO_ANNUAL='https://o11y-watch.kit.com/products/authcost-pro';
const CHECKOUT_SPONSOR='https://o11y-watch.kit.com/products/authcost-founding-sponsor-slot';
const CONTACT='mailto:basileion.ops@gmail.com';
const AFFILIATES={clerk:'#pending',auth0:'#pending',workos:'#pending',stytch:'#pending',kinde:'#pending',logto:'#pending',supabase:'#pending',cognito:'#pending'}; // replace #pending when affiliate programs approved
const NAME='AuthCost';
const rd=f=>JSON.parse(fs.readFileSync(R('data/'+f),'utf8'));
const vendors=rd('vendors.json'),plans=rd('plans.json'),changes=rd('changes.json').sort((a,b)=>b.date.localeCompare(a.date));
const P=Object.fromEntries(vendors.map(v=>[v.id,v]));
const aff=id=>{const a=AFFILIATES[id];return (a&&a!=='#pending')?a:(P[id]?P[id].source:'#');};
const nVer=plans.filter(p=>p.status==='verified').length,lastChecked=plans.map(p=>p.checked).sort().at(-1);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const usd=v=>v==null||Number.isNaN(v)?'—':'$'+(Number.isInteger(v)?v.toFixed(0):v>=1?v.toFixed(2):v.toFixed(4));
const yr=v=>'$'+Math.round(v*12).toLocaleString('en-US');
const HEADSLOT='<!-- seo-meta-slot -->'+(fs.existsSync(R('seo/head-extra.html'))?fs.readFileSync(R('seo/head-extra.html'),'utf8'):'').replace(/<!--[\s\S]*?-->/g,'').trim();
const INDEXNOW_KEY=fs.existsSync(R('indexnow.key'))?fs.readFileSync(R('indexnow.key'),'utf8').trim():'';
const LEGAL_UPDATED='2026-10-30';const NOINDEX=['404.html','offline.html','checkout.html'];const ANY_AFF=Object.values(AFFILIATES).some(v=>v!=='#pending');
fs.rmSync(D,{recursive:true,force:true});const W=(p,s)=>{fs.mkdirSync(path.dirname(path.join(D,p)),{recursive:true});fs.writeFileSync(path.join(D,p),s)};
const mark=`<svg width="24" height="24" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="7" fill="var(--ink)"/><path d="M10 16a6 6 0 0 1 12 0v5a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2v-5z" fill="none" stroke="var(--bg)" stroke-width="2"/><circle cx="16" cy="16" r="2.2" fill="var(--acc)"/></svg>`;
const NAV=[['/','Ledger'],['/calculator/','Calculator'],['/compare/','Compare'],['/guides/','Guides'],['/changes.html','Price log'],['/vendors/','Vendors'],['/pro.html','Pro']];
const urls=[];
const WEBSITE_LD={'@context':'https://schema.org','@type':'WebSite','@id':SITE+'/#website',name:NAME,url:SITE+'/',description:'Auth and identity vendor list prices (MAU, MRU, SSO connections), sourced and dated.',inLanguage:'en',publisher:{'@id':SITE+'/#org'}};
const ORG_LD={'@context':'https://schema.org','@type':'Organization','@id':SITE+'/#org',name:NAME,url:SITE+'/',sameAs:['https://bsky.app/profile/o11ywatch.bsky.social']};
const cleanPath=f=>f.replace(/index\.html$/,'').replace(/\.html$/,'');
const page=({file,title,desc,body,og='home',ld=[]})=>{urls.push(cleanPath(file));const url=SITE+'/'+cleanPath(file);W(file,`<!doctype html><html lang="en" data-product="auth"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${url}"><meta name="robots" content="${NOINDEX.includes(file)?'noindex,follow':'index,follow'}">
<meta property="og:type" content="website"><meta property="og:site_name" content="${NAME}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${SITE}/assets/og/${og}.png"><meta name="twitter:card" content="summary_large_image">
${HEADSLOT}<link rel="manifest" href="/manifest.webmanifest"><meta name="theme-color" media="(prefers-color-scheme: light)" content="#f7f5f0"><meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0e1117"><meta name="color-scheme" content="light dark"><script>(function(){try{var q=/[?&]theme=(light|dark)/.exec(location.search),t=q?q[1]:localStorage.getItem("ac-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}})()</script>
<link rel="preload" href="/assets/fonts/serif.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/assets/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/assets/icon-192.png">
<link rel="alternate" type="application/rss+xml" title="${NAME} price log" href="/rss.xml"><link rel="stylesheet" href="/assets/style.css">
${(['404.html','offline.html'].includes(file)?[]:[...(file==='index.html'?[WEBSITE_LD]:[]),...(ld.length?ld:[{'@context':'https://schema.org','@type':'WebPage',name:title,description:desc,url,isPartOf:{'@id':SITE+'/#website'}}])]).map(x=>`<script type="application/ld+json">${JSON.stringify(x)}</script>`).join('')}</head><body><a class="skip" href="#main">Skip to content</a>
<header class="top"><div class="wrap"><a class="brand" href="/">${mark}${NAME}<small>Auth cost of ownership</small></a><nav class="main" aria-label="Main">${NAV.map(([h,l])=>`<a href="${h}"${('/'+file).replace(/index\.html$/,'' )===h?' aria-current="page"':''}>${l}</a>`).join('')}</nav>
<button class="tt" type="button" id="tt" aria-label="Switch color theme"><svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg><svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg></button>
<a class="btn cta" href="/#ledger-mail">Weekly ledger</a></div></header>
<main id="main" class="wrap">${body}</main>
<footer class="ds-foot"><div class="wrap"><div class="brand-blurb"><a class="brand" href="/" style="margin-bottom:12px">${mark}${NAME}</a><p>${NAME} — auth and identity list prices, normalized and sourced. Last check ${lastChecked}. Some outbound links may become affiliate links; they never affect ranking. Not affiliated with any vendor.</p></div>
<div class="col"><h3>Product</h3><nav aria-label="Product"><a href="/calculator/">Calculator</a><a href="/compare/">Compare</a><a href="/alternatives/">Alternatives</a><a href="/guides/">Guides</a><a href="/pro.html">Pro</a></nav></div>
<div class="col"><h3>Data</h3><nav aria-label="Data"><a href="/changes.html">Price log</a><a href="/methodology.html">Methodology</a><a href="/data.html">Data</a><a href="/api/plans.csv">CSV</a><a href="/rss.xml">RSS</a></nav></div>
<div class="col"><h3>Money</h3><nav aria-label="Money"><a href="/sponsor.html">Sponsor</a><a href="https://o11y-watch.pages.dev/audit">Observability audit</a></nav></div>
<div class="col"><h3>Legal</h3><nav aria-label="Legal"><a href="/about">About</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="${CONTACT}">Contact</a></nav></div>
<div class="portfolio" role="navigation" aria-label="More pricing ledgers"><div class="eyebrow">More pricing ledgers</div><ul><li><a href="https://o11y-watch.pages.dev/" rel="noopener">O11y Watch</a> — observability vendor free tiers and paid_from prices, sourced.</li><li><a href="https://vpsledger.pages.dev/" rel="noopener">VPSLedger</a> — VPS true monthly cost after promos, fees, and egress.</li><li><a href="https://ratecardai.pages.dev/" rel="noopener">Ratecard</a> — published AI API $/1M token rates with source dates.</li></ul></div><div class="legal">Verify prices on the vendor’s page before buying. <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a></div></div></footer>
<script>window.__GROW__={site:"authcost.pages.dev"/* dormant A/B: ,experiments:[{id:"design-standard-v1",arms:["control","v1"]}] */};</script>
<script src="/assets/grow.js" defer></script><script type="module" src="/assets/app.js"></script></body></html>`)};

/** Estimate monthly cost for a plan given MAU and SSO connection count. Returns null if unverifiable. */
export function estimate(plan, mau, sso=0, opts={}){
  if(plan.status!=='verified') return null;
  const out={base:0,users:0,sso:0,mfa:0,total:null,notes:[]};
  // Auth0 paid plans: only published at 500 MAU — refuse higher
  if(plan.vendor_id==='auth0' && plan.tier==='paid' && mau>plan.included_users){
    out.notes.push('Auth0 paid self-serve price published only at ≤500 MAU; higher tiers are custom — omitted.');
    return null;
  }
  if(plan.vendor_id==='auth0' && plan.tier==='free' && mau>plan.included_users) return null;
  if(plan.tier==='free' && plan.included_users!=null && mau>plan.included_users && plan.overage_per_user==null && !plan.overage_per_1m_mau) return null;
  // Omit when user count exceeds included allowance but no published per-user overage (e.g. Stytch)
  if(plan.included_users!=null && mau>plan.included_users && plan.overage_per_user==null && !plan.overage_bands && !plan.overage_per_1m_mau) return null;

  out.base=plan.base_mo??0;

  // User / MAU / MRU cost
  if(plan.overage_per_1m_mau!=null){
    const extra=Math.max(0, mau - (plan.included_users||0));
    out.users=Math.ceil(extra/1e6)*plan.overage_per_1m_mau;
  } else if(plan.overage_bands && plan.included_users!=null){
    let rem=Math.max(0, mau - plan.included_users);
    let cursor=plan.included_users;
    for(const b of plan.overage_bands){
      if(rem<=0) break;
      const cap=b.to==null?Infinity:b.to;
      const room=Math.max(0, cap - cursor);
      const take=Math.min(rem, room);
      out.users+=take*b.rate; rem-=take; cursor+=take;
    }
  } else if(plan.overage_per_user!=null && plan.included_users!=null){
    out.users=Math.max(0, mau - plan.included_users)*plan.overage_per_user;
  } else if(plan.user_unit==='token'){
    out.notes.push('Logto bills access tokens; MAU estimate uses base + SSO only.');
  }

  // SSO connections
  const need=Math.max(0, sso|0);
  if(plan.sso_unlimited){ out.sso=0; }
  else if(need===0){ out.sso=0; }
  else if(plan.sso_included==null && plan.sso_extra_mo==null && !plan.sso_bands){
    // Cognito / Supabase SAML MAU model
    if(plan.federated_per_mau!=null){
      const fedFree=plan.federated_free??0;
      // Treat all `sso` as "enterprise customers"; assume ~200 users each for federated MAU estimate only when opts.federated_mau set
      const fedMau=opts.federated_mau??(need*200);
      out.sso=Math.max(0, fedMau - fedFree)*plan.federated_per_mau;
      out.notes.push(`Federated cost uses ${fedMau} federated MAU (default 200×connections); adjust in calculator.`);
    } else if(plan.sso_saml_per_mau!=null){
      const fedMau=opts.federated_mau??(need*200);
      const incl=plan.sso_saml_included_mau??0;
      out.sso=Math.max(0, fedMau - incl)*plan.sso_saml_per_mau;
      out.notes.push(`Supabase SAML priced per federated MAU (${fedMau} assumed).`);
    } else {
      out.notes.push('SSO pricing not modeled for this plan.');
    }
  } else {
    const included=plan.sso_included||0;
    let extra=Math.max(0, need - included);
    if(extra===0) out.sso=0;
    else if(plan.sso_bands){
      // WorkOS / Clerk ladder: charge each connection at its band rate
      let cost=0;
      for(let i=1;i<=need;i++){
        if(i<=included) continue;
        const band=plan.sso_bands.find(b=>i>=b.from && i<=b.to) || plan.sso_bands.at(-1);
        cost+=band.rate;
      }
      // For Clerk, included is 1 and bands start at 2 — WorkOS bands start at 1 with no included
      if(plan.vendor_id==='workos'){
        cost=0;
        for(let i=1;i<=need;i++){
          const band=plan.sso_bands.find(b=>i>=b.from && i<=b.to) || plan.sso_bands.at(-1);
          cost+=band.rate;
        }
      }
      out.sso=cost;
    } else if(plan.sso_extra_mo!=null){
      out.sso=extra*plan.sso_extra_mo;
    } else {
      return null; // need SSO but no published price
    }
  }

  // Free plans with SSO needed but sso_included 0 and no price
  if(need>0 && (plan.sso_included||0)<need && plan.sso_extra_mo==null && !plan.sso_bands && !plan.sso_unlimited && plan.federated_per_mau==null && plan.sso_saml_per_mau==null){
    return null;
  }

  // MFA: only add verified mfa_extra_mo; omit plans that publish no MFA when required
  out.mfa=0;
  if(opts.mfa){
    if(plan.mfa_available===false){
      out.notes.push('Plan publishes no MFA — omitted when MFA required.');
      return null;
    }
    if(plan.mfa_extra_mo!=null){
      out.mfa=plan.mfa_extra_mo;
      out.notes.push(`MFA add-on ${plan.mfa_extra_mo}/mo (verified).`);
    }
  }

  out.total=out.base+out.users+out.sso+out.mfa;
  return out;
}

const tag=s=>s==='verified'?'<span class="tag">Verified</span>':'<span class="tag u">Unverified</span>';
const faq=[
  ['What does AuthCost compare?','Published list prices for auth and identity vendors: base plan fees, MAU/MRU allowances and overages, and enterprise SSO / Directory Sync connection fees. Every row links the vendor’s own pricing page and the date we checked it.'],
  ['MAU vs MRU — why does it matter?','Most vendors bill Monthly Active Users (any activity that month). Clerk bills Monthly Retained Users — a user who returns at least one day after signup. MRU is often lower than MAU for apps with many one-time signups, so a raw MAU-to-MAU comparison understates Clerk’s relative price.'],
  ['Why are some rows blank?','We never invent a number. If a rate is “contact sales,” custom, or not printed as a fixed figure on the official page, we leave it blank and mark the gap.'],
  ['How is the calculator’s cost computed?','Monthly ≈ base + max(0, users − included) × overage + SSO fees from the published ladder + verified MFA add-ons when MFA is required. Cognito/Supabase SAML uses a federated-MAU assumption you can change. Token-based plans (Logto) use base + SSO (+ MFA add-on if required) only unless noted. We never invent an MFA price.'],
  ['Do affiliate links change rankings?','No. Ranking is by computed cost only. Affiliate links are labeled when active.']
];
const faqLd={'@context':'https://schema.org','@type':'FAQPage',mainEntity:faq.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))};
const asOf=`As of ${lastChecked}, from ${nVer} verified plan rows`;
const meth=`<a href="/methodology.html">How we calculate this</a>`;
const SCENARIOS=[{mau:1000,sso:0,label:'1k users · no SSO'},{mau:10000,sso:1,label:'10k users · 1 SSO'},{mau:50000,sso:5,label:'50k users · 5 SSO'},{mau:100000,sso:10,label:'100k users · 10 SSO'}];

function rankScenario(mau,sso){
  return plans.map(p=>{const e=estimate(p,mau,sso);return e&&e.total!=null?{p,e}:null}).filter(Boolean).sort((a,b)=>a.e.total-b.e.total);
}
const heroSc=SCENARIOS[2];
const heroRank=rankScenario(heroSc.mau,heroSc.sso);
const heroGap=heroRank.length>=2?heroRank.at(-1).e.total-heroRank[0].e.total:0;

const signup=(id='s',hook='Get the weekly auth ledger')=>`<form class="signup" action="${FORM_ACTION}" method="post" data-form="kit"><label for="${id}-e" class="skip">Email</label><input id="${id}-e" type="email" name="email_address" required placeholder="you@company.com" autocomplete="email"><button class="btn" type="submit">${esc(hook)}</button></form><p class="note">Weekly: every auth price change we confirmed, SSO fee moves, and the cheapest verified plan for 10k and 50k users. Free; unsubscribe in one click. Sent via Kit · <a href="/privacy">Privacy</a>.</p>`;
const mailBox=(id,h,hook)=>`<section class="mail" id="ledger-mail"><div><div class="eyebrow">Free weekly ledger</div><h2 class="h3">${esc(h)}</h2></div><div>${signup(id,hook)}</div></section>`;
const trust=`<ul class="trust"><li><b>Source-linked</b> every price links the vendor’s own page</li><li><b>Independent</b> no vendor pays for placement</li><li><b>Checked weekly</b> a script diffs every source page</li><li><b>No paid rankings</b> ordered by computed cost only</li></ul>`;

// ---- Home
page({file:'index.html',title:`${NAME} — auth pricing that scales without the surprise bill`,desc:`Founders say Clerk/Auth0 pricing scales horribly past free tiers. At ${heroSc.label}, verified plans in our ledger differ by up to ${yr(heroGap)} a year once MAU/MRU and SSO fees are counted — every price sourced.`,ld:[ORG_LD,faqLd,{'@context':'https://schema.org','@type':'Dataset',name:`${NAME} auth price ledger`,description:'Auth and identity list prices with source URL, check date and verification status per row.',url:SITE+'/',dateModified:lastChecked,license:'https://creativecommons.org/licenses/by/4.0/',creator:{'@id':SITE+'/#org'},distribution:[{'@type':'DataDownload',encodingFormat:'application/json',contentUrl:SITE+'/api/plans.json'},{'@type':'DataDownload',encodingFormat:'text/csv',contentUrl:SITE+'/api/plans.csv'}]}],body:`
<section class="hero"><div class="hero-grid"><div><div class="eyebrow">${asOf} · built for the “pricing scales horribly” moment</div><h1>When auth costs more than hosting, verified plans still differ by up to <span class="acc">${yr(heroGap)} a year</span>.</h1>
<p class="lede">Indie and B2B teams hit this after ~10k–50k users: Clerk/Auth0 bills climb on MAU/MRU, then SSO per-connection fees stack on top. ${NAME} ranks ${vendors.length} vendors on base + overage + SSO from each vendor’s own pricing page — so you see the cheaper stack before the invoice does.</p>
<div class="cta-row"><a class="btn" href="/calculator/">Rank plans for my MAU + SSO</a><a class="btn ghost" href="/pro.html">See Pro</a></div>
<p class="micro">Free · no signup · no card. List prices only — we never invent a number.</p></div>
<aside class="check" id="check" aria-labelledby="check-h"><div class="eyebrow">Instant check · live data</div><h2 id="check-h" class="h3">What will auth cost?</h2>
<div class="filters"><label>Monthly users (MAU/MRU)<input id="k-mau" type="number" min="0" step="1000" value="50000"></label>
<label>SSO connections<input id="k-sso" type="number" min="0" step="1" value="5"></label></div>
<div id="k-out" class="kout" aria-live="polite"></div>
<form class="signup inline" action="${FORM_ACTION}" method="post" data-form="kit"><label for="k-e" class="skip">Email</label><input id="k-e" type="email" name="email_address" required placeholder="you@company.com" autocomplete="email"><button class="btn ghost" type="submit">Email me weekly</button></form>
<p class="note" style="margin:0">Weekly price changes for your scenario. Unsubscribe in one click · <a href="/privacy">Privacy</a>.</p></aside></div>
${trust}</section>
<section class="proof" aria-label="What backs these numbers"><div><b>${nVer}</b><span>plan rows verified on official pages</span></div><div><b>${vendors.length}</b><span>vendors, every row source-linked</span></div><div><b>${changes.length}</b><span>dated entries in the <a href="/changes.html">price log</a></span></div><div><b>${lastChecked}</b><span>last full check · <a href="/methodology.html">method</a></span></div></section>
<div class="kpis">${SCENARIOS.map(s=>{const r=rankScenario(s.mau,s.sso);const gap=r.length>=2?r.at(-1).e.total-r[0].e.total:0;return `<div><b>${yr(gap)}</b><span>yearly gap · ${esc(s.label)} (${r.length} ranked)</span></div>`}).join('')}</div>
<p class="note">${asOf}. Gaps use verified rows only; plans that cannot price the scenario are omitted. ${meth}.</p>
<section class="essential"><h2>Auth bills hide in the unit.</h2><div class="grid3">
<div><h3>MAU vs MRU</h3><p>Clerk’s MRU skips one-day users. Comparing it to Auth0 MAU without adjusting understates or overstates the gap.</p></div>
<div><h3>Per-connection SSO</h3><p>WorkOS and Stytch charge per enterprise connection ($125 entry). Clerk includes one on Pro then $75. Kinde Plus includes unlimited SSO in the base.</p></div>
<div><h3>Silent fee starts</h3><p>Clerk Directory Sync billing begins 2027-01-01 — logged in our <a href="/changes.html">price log</a> before it hits invoices.</p></div>
</div></section>
<h2>The ledger</h2><p class="mut">Monthly USD list prices. Sorted by base fee; use the calculator for your MAU + SSO scenario.</p>
<div class="filters"><label>Search<input id="q" type="search" placeholder="Vendor or plan"></label>
<label class="chk"><input id="vo" type="checkbox" checked> Verified only</label>
<span id="count" class="note" style="margin-left:auto"></span></div>
<div class="tbl" style="max-height:620px"><table id="plans"><thead><tr>
<th>Vendor</th><th>Plan</th><th class="n">Base / mo</th><th class="n">Included users</th><th>Unit</th><th class="n">Overage</th><th class="n">SSO incl.</th><th class="n">SSO extra</th><th>Status</th><th>Source · checked</th>
</tr></thead><tbody>${plans.map(p=>`<tr data-q="${esc((p.vendor+' '+p.plan).toLowerCase())}" data-status="${p.status}"><td>${esc(p.vendor)}</td><td>${esc(p.plan)}</td><td class="n">${usd(p.base_mo)}${p.base_mo_annual!=null?`<br><span class="src">$${p.base_mo_annual} annual</span>`:''}</td><td class="n">${p.included_users??'—'}</td><td>${esc(p.user_unit||'—')}</td><td class="n">${p.overage_per_user!=null?usd(p.overage_per_user):(p.overage_per_1m_mau!=null?usd(p.overage_per_1m_mau)+'/1M':'—')}</td><td class="n">${p.sso_unlimited?'∞':(p.sso_included??'—')}</td><td class="n">${p.sso_extra_mo!=null?usd(p.sso_extra_mo):(p.sso_unlimited?'$0':'—')}</td><td>${tag(p.status)}</td><td class="src"><a href="${p.source}">source</a> · ${p.checked}</td></tr>`).join('')}</tbody></table></div>
${mailBox('h','Know the week an auth price changes','Send me the weekly ledger')}
<h2>Questions</h2>${faq.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('')}`});

// ---- Calculator
page({file:'calculator/index.html',og:'calculator',title:`Auth cost calculator — MAU, MFA and SSO | ${NAME}`,desc:'Pick MAU, MFA, and enterprise SSO connections. See every verifiable plan ranked by monthly cost. Shareable URL and embed snippet.',body:`
<section class="hero"><div class="eyebrow">Cost calculator · ${asOf}</div><h1>Your MAU, MFA, and SSO count in — your bill out.</h1>
<p class="lede">Rank verified plans by estimated monthly cost from published list prices only. The URL updates as you type; copy it or embed the calculator.</p></section>
<div class="panel" id="calc"><div class="filters" style="margin:0">
<label>Monthly users (MAU/MRU)<input id="c-mau" type="number" min="0" step="1000" value="50000"></label>
<label>SSO connections<input id="c-sso" type="number" min="0" step="1" value="5"></label>
<label>Federated MAU (Cognito/Supabase SAML)<input id="c-fed" type="number" min="0" step="100" value="1000"></label>
<label class="chk"><input id="c-mfa" type="checkbox"> Require MFA</label>
<label class="chk"><input id="c-vo" type="checkbox" checked> Verified only</label>
</div>
<p class="note" style="margin:12px 0 0">MFA adds a fee only when the vendor publishes one (e.g. Logto $48/mo). Plans that publish “no MFA” are omitted when MFA is required — we never invent an MFA price.</p></div>
<div class="save" id="c-save" aria-live="polite"></div>
<div class="tbl" style="margin-top:14px"><table><thead><tr><th class="n">#</th><th>Plan</th><th class="n">Base</th><th class="n">Users</th><th class="n">SSO</th><th class="n">MFA</th><th class="n">Monthly</th><th class="n">Annual</th><th>Notes</th><th scope="col"><span class="skip">Link</span></th></tr></thead><tbody id="rank"><tr><td colspan="10">Loading…</td></tr></tbody></table></div>
<p class="note">Excludes SMS, custom domains, M2M token overages, taxes and negotiated discounts. Plans that cannot price the scenario (e.g. Auth0 above 500 MAU on self-serve) are omitted. ${meth}.</p>
<div class="panel calc-share" id="c-share-box">
<h2 class="h3" style="margin-top:0">Share or embed this scenario</h2>
<div class="row"><button class="btn" type="button" id="c-copy" data-grow="calculator_share">Copy share link</button> <button class="btn ghost" type="button" id="c-copy-embed" data-grow="calculator_embed">Copy embed snippet</button> <span class="note" id="c-sh" role="status"></span></div>
<label>Shareable URL<textarea id="c-url" readonly rows="2" aria-label="Shareable calculator URL"></textarea></label>
<label>Embed iframe<textarea id="c-embed" readonly rows="3" aria-label="Embeddable iframe snippet"></textarea></label>
<p class="note"><a id="c-back" href="/calculator/">Open full calculator</a> · <a href="/">Back to the AuthCost ledger</a></p>
</div>
<div class="panel"><h2 class="h3">Keep this estimate</h2><p>Pro watches the plans in this result and emails you when one moves, plus CSV export. <a href="/pro.html">See Pro</a>.</p></div>
<script>try{if(new URLSearchParams(location.search).get('embed')==='1')document.body.classList.add('embed')}catch(e){}</script>`});

// ---- Shared MAU-tier helpers (search/GEO pages)
const MAJOR=['clerk','auth0','cognito','workos','stytch','kinde','supabase','logto'];
const MAU_TIERS=[10000,50000,100000];
const kfmt=n=>n>=1e6?(n/1e6)+'M':(n/1000)+'k';
const cmpSlug=(x,y)=>MAJOR.indexOf(x)<MAJOR.indexOf(y)?`${x}-vs-${y}`:`${y}-vs-${x}`;
const bestFor=(vid,mau,sso=0)=>rankScenario(mau,sso).find(z=>z.p.vendor_id===vid)||null;
const star=p=>p.user_unit==='token'?'*':'';
const cell=(z,hl)=>z?`<td class="n"${hl?' style="font-weight:600"':''}>${usd(z.e.total)}${star(z.p)}<br><span class="src">${esc(z.p.plan)}</span></td>`:'<td class="n" title="No verifiable published price for this scenario">—</td>';
const tokNote='* Logto Pro bills access tokens, not MAU (50k tokens included, then $0.08 per 100) — the figure is base fee only; token overage depends on your usage.';
const ctaRow=(mau=50000,sso=0)=>`<div class="cta-row"><a class="btn" href="/calculator/?mau=${mau}&sso=${sso}" data-grow="seo_calc_cta">Price my exact MAU + SSO</a><a class="btn ghost" href="/pro.html" data-grow="seo_pro_cta">Get alerts when prices move (Pro)</a></div>`;
const vLinks=v=>`<p class="note">More on ${esc(v.name)}: <a href="/vendors/${v.id}.html">${esc(v.name)} pricing</a> · <a href="/alternatives/${v.id}.html">cheaper ${esc(v.name)} alternatives</a> · ${MAJOR.filter(x=>x!==v.id&&P[x]).map(x=>`<a href="/compare/${cmpSlug(v.id,x)}.html">vs ${esc(P[x].name)}</a>`).join(' · ')}</p>`;

// ---- Vendors
for(const v of vendors){
  const ps=plans.filter(p=>p.vendor_id===v.id);
  const ranks=SCENARIOS.map(s=>{const r=rankScenario(s.mau,s.sso);const mine=r.filter(x=>x.p.vendor_id===v.id);const best=mine[0];const overall=r[0];
    if(!best) return `<li>${esc(s.label)}: no verifiable plan for this scenario.</li>`;
    const i=r.findIndex(x=>x.p.id===best.p.id);
    return `<li><b>${esc(s.label)}:</b> ${esc(best.p.plan)} at ${usd(best.e.total)}/mo ranks #${i+1} of ${r.length}${overall&&overall.p.id!==best.p.id?` — ${yr(best.e.total-overall.e.total)}/yr more than ${esc(overall.p.vendor)} ${esc(overall.p.plan)}`:''}.</li>`;
  }).join('');
  page({file:`vendors/${v.id}.html`,og:'home',title:`${v.name} pricing — auth cost | ${NAME}`,desc:`${v.name} auth pricing with MAU/MRU and SSO fees, ranked against ${vendors.length-1} other vendors. Source checked ${v.checked}.`,body:`
<section class="hero"><div class="eyebrow">Vendor</div><h1>${esc(v.name)}</h1>
<p class="lede">Billing unit: <b>${esc(v.billing_unit)}</b> — ${esc(v.billing_unit_note)} Source: <a href="${v.source}" rel="noopener">${esc(v.source.replace(/^https?:\/\//,''))}</a>, checked ${v.checked}. <a href="${aff(v.id)}" rel="noopener">Visit ${esc(v.name)}</a></p></section>
<div class="verdict"><div class="eyebrow">Answer · ${esc(v.name)} cost by MAU (no SSO)</div><p>${MAU_TIERS.map(m=>{const b=bestFor(v.id,m);return b?`<b>${kfmt(m)} users:</b> ${usd(b.e.total)}/mo${star(b.p)} on ${esc(b.p.plan)}`:`<b>${kfmt(m)} users:</b> no published self-serve price`}).join(' · ')}.</p><ul>${ranks}</ul><p class="note">${asOf}. ${meth}.</p>${ctaRow()}</div>
<p>${esc(v.summary)}</p>
<h2>${esc(v.name)} cost at 10k, 50k and 100k users</h2>
<div class="tbl"><table><thead><tr><th>Plan</th>${MAU_TIERS.map(m=>`<th class="n">${kfmt(m)} users</th>`).join('')}</tr></thead><tbody>${ps.map(p=>`<tr><td>${esc(p.plan)}</td>${MAU_TIERS.map(m=>{const e=estimate(p,m,0);return e&&e.total!=null?`<td class="n">${usd(e.total)}${star(p)}</td>`:'<td class="n" title="Not priceable from published figures">—</td>'}).join('')}</tr>`).join('')}</tbody></table></div>
<p class="note">Monthly USD, no SSO, list price. “—” = the vendor publishes no fixed self-serve price for that volume (custom / contact sales) or the plan caps below it. ${ps.some(p=>p.user_unit==='token')?tokNote:''}</p>
${vLinks(v)}
<div class="tbl"><table><thead><tr><th>Plan</th><th class="n">Base</th><th class="n">Included</th><th>Unit</th><th class="n">Overage</th><th class="n">SSO</th><th>Status</th><th>Notes</th></tr></thead>
<tbody>${ps.map(p=>`<tr><td>${esc(p.plan)}</td><td class="n">${usd(p.base_mo)}</td><td class="n">${p.included_users??'—'}</td><td>${esc(p.user_unit||'—')}</td><td class="n">${p.overage_per_user!=null?usd(p.overage_per_user):'—'}</td><td class="n">${p.sso_unlimited?'unlimited':(p.sso_included!=null?p.sso_included+' incl.':'—')}${p.sso_extra_mo!=null?' · +'+usd(p.sso_extra_mo):''}</td><td>${tag(p.status)}</td><td style="white-space:normal;min-width:220px" class="src">${esc(p.notes)}</td></tr>`).join('')}</tbody></table></div>
${mailBox('v'+v.id,`Get alerted if ${v.name} changes prices`,`Watch ${v.name} for me`)}`});
}
page({file:'vendors/index.html',title:`Auth vendors tracked | ${NAME}`,desc:`All ${vendors.length} auth vendors in ${NAME} with plan counts and sources.`,body:`<section class="hero"><div class="eyebrow">Vendors</div><h1>${vendors.length} vendors</h1></section>
<div class="tbl"><table><thead><tr><th>Vendor</th><th>Unit</th><th class="n">Plans</th><th class="n">Verified</th><th>Source · checked</th></tr></thead>
<tbody>${vendors.map(v=>{const ps=plans.filter(p=>p.vendor_id===v.id);return `<tr><td><a href="/vendors/${v.id}.html">${esc(v.name)}</a></td><td>${esc(v.billing_unit)}</td><td class="n">${ps.length}</td><td class="n">${ps.filter(p=>p.status==='verified').length}</td><td class="src"><a href="${v.source}">source</a> · ${v.checked}</td></tr>`}).join('')}</tbody></table></div>`});

// ---- Compare pairs (major)
const pairs=[];
for(let i=0;i<MAJOR.length;i++)for(let j=i+1;j<MAJOR.length;j++)if(P[MAJOR[i]]&&P[MAJOR[j]])pairs.push([P[MAJOR[i]],P[MAJOR[j]]]);
for(const [a,b] of pairs){
  const slug=`${a.id}-vs-${b.id}`;
  const bits=SCENARIOS.map(s=>{
    const r=rankScenario(s.mau,s.sso);
    const x=r.find(z=>z.p.vendor_id===a.id),y=r.find(z=>z.p.vendor_id===b.id);
    if(!x||!y) return null;
    const [w,l]=x.e.total<=y.e.total?[x,y]:[y,x];
    return `${w.p.vendor} wins ${s.label} at ${usd(w.e.total)}/mo (${yr(l.e.total-w.e.total)}/yr less than ${l.p.vendor})`;
  }).filter(Boolean);
  const answer=bits.length?`As of ${lastChecked}: ${bits.join('; ')}.`:`As of ${lastChecked}, one or both lack a verifiable plan for headline scenarios.`;
  const rows=SCENARIOS.map(s=>{
    const r=rankScenario(s.mau,s.sso);
    const x=r.find(z=>z.p.vendor_id===a.id),y=r.find(z=>z.p.vendor_id===b.id);
    const cell=z=>z?`<td class="n">${usd(z.e.total)}<br><span class="src">${esc(z.p.plan)}</span></td>`:'<td class="n">—</td>';
    return `<tr><td>${esc(s.label)}</td>${cell(x)}${cell(y)}</tr>`;
  }).join('');
  page({file:`compare/${slug}.html`,og:'compare',title:`${a.name} vs ${b.name} pricing (${lastChecked.slice(0,4)}) — cost at 10k/50k/100k users | ${NAME}`,desc:`${a.name} vs ${b.name} pricing: which is cheaper at 10k, 50k and 100k users, with and without enterprise SSO, and by how much per year. Sourced list prices.`,ld:[ORG_LD,{'@context':'https://schema.org','@type':'FAQPage',mainEntity:[{'@type':'Question',name:'Which is cheaper?',acceptedAnswer:{'@type':'Answer',text:answer}},{'@type':'Question',name:'Last verified?',acceptedAnswer:{'@type':'Answer',text:lastChecked}}]}],body:`
<section class="hero"><div class="eyebrow"><a href="/compare/">Compare</a> · last verified ${lastChecked}</div><h1>${esc(a.name)} vs ${esc(b.name)}</h1>
<p class="lede"><b>Answer:</b> ${esc(answer)}</p></section>
${ctaRow()}
<h2>Cost by MAU (no SSO)</h2>
<div class="tbl"><table><thead><tr><th>Monthly users</th><th class="n">${esc(a.name)}</th><th class="n">${esc(b.name)}</th></tr></thead><tbody>${MAU_TIERS.map(m=>`<tr><td>${kfmt(m)} users</td>${cell(bestFor(a.id,m))}${cell(bestFor(b.id,m))}</tr>`).join('')}</tbody></table></div>
<h2>With enterprise SSO</h2>
<div class="tbl"><table><thead><tr><th>Scenario</th><th class="n">${esc(a.name)}</th><th class="n">${esc(b.name)}</th></tr></thead><tbody>${rows}</tbody></table></div>
<p class="note">Cheapest verified plan per vendor, monthly USD list price. ${[a,b].some(x=>x.id==='logto')?tokNote:''} ${meth}.</p>
<div class="grid2">${[a,b].map(x=>`<div class="panel"><h3><a href="/vendors/${x.id}.html">${esc(x.name)}</a></h3><p>${esc(x.summary)}</p><p class="src">Source: <a href="${x.source}">${esc(x.source.replace(/^https?:\/\//,''))}</a> · ${x.checked}</p></div>`).join('')}</div>
<p class="note">Also see: <a href="/alternatives/${a.id}.html">${esc(a.name)} alternatives</a> · <a href="/alternatives/${b.id}.html">${esc(b.name)} alternatives</a> · <a href="/guides/auth-cost-by-mau.html">all vendors by MAU</a></p>
${mailBox('c',`Watch ${a.name} vs ${b.name}`,'Watch this pair for me')}`});
}
page({file:'compare/index.html',og:'compare',title:`Auth vendor comparisons — ${pairs.length} head-to-heads | ${NAME}`,desc:'Head-to-head auth pricing for major identity vendors.',body:`<section class="hero"><div class="eyebrow">Compare</div><h1>Head to head, on the whole auth bill.</h1><p class="lede">${pairs.length} pairings across ${MAJOR.length} vendors.</p></section>
<div class="pairs">${pairs.map(([a,b])=>`<a href="/compare/${a.id}-vs-${b.id}.html">${esc(a.name)} vs ${esc(b.name)}</a>`).join('')}</div>
${mailBox('ci','The cheapest auth plan for your MAU, weekly','Send me the weekly ledger')}`});


// ---- Alternatives (search/GEO)
const altOrder=(vid)=>vendors.filter(x=>x.id!==vid).map(x=>({v:x,c:MAU_TIERS.map(m=>bestFor(x.id,m)),s:bestFor(x.id,50000,5)})).sort((A,B)=>(A.c[1]?.e.total??1e12)-(B.c[1]?.e.total??1e12)||(A.c[0]?.e.total??1e12)-(B.c[0]?.e.total??1e12));
for(const v of vendors){
  const me=MAU_TIERS.map(m=>bestFor(v.id,m)), meS=bestFor(v.id,50000,5);
  const alts=altOrder(v.id);
  const lines=MAU_TIERS.map((m,i)=>{
    const others=alts.map(a=>a.c[i]).filter(Boolean).sort((x,y)=>x.e.total-y.e.total);const top=others[0];
    if(!top) return null;
    if(!me[i]) return `at ${kfmt(m)} users ${v.name} publishes no fixed self-serve price; the cheapest verified alternative is ${top.p.vendor} ${top.p.plan} at ${usd(top.e.total)}/mo${star(top.p)}`;
    const cheaper=others.filter(x=>x.e.total<me[i].e.total).length;
    return `at ${kfmt(m)} users ${v.name} ${me[i].p.plan} costs ${usd(me[i].e.total)}/mo${star(me[i].p)} and ${cheaper} of ${others.length} priceable alternatives are cheaper${cheaper?` (cheapest: ${top.p.vendor} ${top.p.plan} at ${usd(top.e.total)}/mo${star(top.p)}, ${yr(me[i].e.total-top.e.total)}/yr less)`:''}`;
  }).filter(Boolean);
  const answer=`As of ${lastChecked}: ${lines.join('; ')}.`;
  page({file:`alternatives/${v.id}.html`,og:'compare',title:`${v.name} alternatives — cheaper auth at 10k/50k/100k users | ${NAME}`,desc:`Cheaper ${v.name} alternatives ranked by real monthly cost at 10k, 50k and 100k users and with 5 SSO connections. ${vendors.length-1} vendors, sourced list prices.`,ld:[ORG_LD,{'@context':'https://schema.org','@type':'FAQPage',mainEntity:[{'@type':'Question',name:`What is the cheapest ${v.name} alternative?`,acceptedAnswer:{'@type':'Answer',text:answer}},{'@type':'Question',name:'Where do the prices come from?',acceptedAnswer:{'@type':'Answer',text:'Each vendor’s own pricing page; every row in the AuthCost ledger links its source and check date. Scenarios a vendor does not publish a price for are left blank.'}}]}],body:`
<section class="hero"><div class="eyebrow"><a href="/alternatives/">Alternatives</a> · last verified ${lastChecked}</div><h1>${esc(v.name)} alternatives, ranked by what you’d actually pay</h1>
<p class="lede"><b>Answer:</b> ${esc(answer)}</p>${ctaRow()}</section>
<div class="tbl"><table><thead><tr><th>Vendor (cheapest verified plan)</th>${MAU_TIERS.map(m=>`<th class="n">${kfmt(m)} users</th>`).join('')}<th class="n">50k + 5 SSO</th><th scope="col">Head to head</th></tr></thead><tbody>
<tr style="background:var(--surface-2,rgba(0,0,0,.03))"><td><b><a href="/vendors/${v.id}.html">${esc(v.name)}</a></b> <span class="src">(current)</span></td>${me.map(z=>cell(z,true)).join('')}${cell(meS,true)}<td></td></tr>
${alts.map(a=>`<tr><td><a href="/vendors/${a.v.id}.html">${esc(a.v.name)}</a></td>${a.c.map(z=>cell(z)).join('')}${cell(a.s)}<td><a href="/compare/${cmpSlug(v.id,a.v.id)}.html">${esc(v.name)} vs ${esc(a.v.name)}</a></td></tr>`).join('')}</tbody></table></div>
<p class="note">Monthly USD list prices, cheapest verified plan per vendor for each scenario, sorted by 50k-user cost. “—” = no fixed published price for that volume (custom / contact sales, or overage not printed). Billing units differ: Clerk counts retained users (MRU), most others MAU. ${tokNote} ${meth}.</p>
<div class="grid2"><div class="panel"><h3>Why teams leave ${esc(v.name)}</h3><p>${esc(v.summary)}</p><p class="src">Source: <a href="${v.source}" rel="noopener">${esc(v.source.replace(/^https?:\/\//,''))}</a> · ${v.checked}</p></div>
<div class="panel"><h3>Check before you switch</h3><p>Unit (${esc(v.billing_unit)}), SSO per-connection fees, and MFA availability change the ranking more than the headline price. Run your exact numbers in the <a href="/calculator/">calculator</a> and read <a href="/guides/mau-vs-mru.html">MAU vs MRU</a>.</p></div></div>
${mailBox('a'+v.id,`Hear when ${v.name} or its alternatives change prices`,'Send me the weekly ledger')}`});
}
page({file:'alternatives/index.html',og:'compare',title:`Cheaper auth alternatives — ${vendors.length} vendors ranked | ${NAME}`,desc:`Cheaper alternatives to Clerk, Auth0, Cognito, WorkOS, Stytch, Kinde, Supabase Auth and Logto, ranked by monthly cost at 10k/50k/100k users.`,body:`<section class="hero"><div class="eyebrow">Alternatives · ${asOf}</div><h1>Paying too much for auth? Find the cheaper alternative.</h1><p class="lede">Each page ranks every other tracked vendor by real monthly cost at 10k, 50k and 100k users — sourced list prices only.</p>${ctaRow()}</section>
<div class="pairs">${vendors.map(v=>`<a href="/alternatives/${v.id}.html">${esc(v.name)} alternatives</a>`).join('')}</div>
${mailBox('ai','The cheapest auth plan for your MAU, weekly','Send me the weekly ledger')}`});

// ---- Data guides (tables computed from the ledger)
const T1M=[...MAU_TIERS,1000000];
const allRows=T1M.map(m=>rankScenario(m,0));
const DATA_GUIDES=[];
{ // cost by MAU, every vendor
  const slug='auth-cost-by-mau';DATA_GUIDES.push({slug,title:'Auth pricing by MAU: every vendor at 10k, 50k, 100k and 1M users'});
  const ans=T1M.map((m,i)=>{const r=allRows[i];return r[0]?`${kfmt(m)} users: cheapest ${r[0].p.vendor} ${r[0].p.plan} ${usd(r[0].e.total)}/mo${star(r[0].p)}`:null}).filter(Boolean).join('; ');
  page({file:`guides/${slug}.html`,title:`Auth pricing by MAU (10k, 50k, 100k, 1M users) — ${vendors.length} vendors | ${NAME}`,desc:`Monthly auth cost for Clerk, Auth0, Cognito, WorkOS, Stytch, Kinde, Supabase Auth and Logto at 10k, 50k, 100k and 1M users. Sourced, checked ${lastChecked}.`,ld:[ORG_LD,{'@context':'https://schema.org','@type':'FAQPage',mainEntity:[{'@type':'Question',name:'What is the cheapest auth provider by MAU?',acceptedAnswer:{'@type':'Answer',text:`As of ${lastChecked}: ${ans}.`}}]}],body:`
<section class="hero"><div class="eyebrow"><a href="/guides/">Guides</a> · ${asOf}</div><h1>Auth pricing by MAU, every vendor</h1><p class="lede"><b>Answer (no SSO):</b> ${esc(ans)}.</p>${ctaRow(100000,0)}</section>
<div class="tbl"><table><thead><tr><th>Vendor</th>${T1M.map(m=>`<th class="n">${kfmt(m)} users</th>`).join('')}<th scope="col">Alternatives</th></tr></thead><tbody>${vendors.map(v=>`<tr><td><a href="/vendors/${v.id}.html">${esc(v.name)}</a></td>${T1M.map(m=>cell(bestFor(v.id,m))).join('')}<td><a href="/alternatives/${v.id}.html">cheaper?</a></td></tr>`).join('')}</tbody></table></div>
<p class="note">Cheapest verified plan per vendor, monthly USD list price, no SSO / MFA / SMS. “—” = no fixed published price at that volume. ${tokNote} ${meth}.</p>
${mailBox('gm','Get auth price changes weekly','Send me the weekly ledger')}`});
}
{ // 100k
  const slug='cheapest-auth-100k';DATA_GUIDES.push({slug,title:'Cheapest auth at 100k users'});
  const r=rankScenario(100000,0),rs=rankScenario(100000,10);
  const tb=rr=>`<div class="tbl"><table><thead><tr><th class="n">#</th><th>Plan</th><th class="n">Monthly</th><th class="n">Annual</th></tr></thead><tbody>${rr.map((x,i)=>`<tr><td class="n">${i+1}</td><td><a href="/vendors/${x.p.vendor_id}.html">${esc(x.p.vendor)}</a> ${esc(x.p.plan)}</td><td class="n">${usd(x.e.total)}${star(x.p)}</td><td class="n">${yr(x.e.total)}</td></tr>`).join('')}</tbody></table></div>`;
  const ans=r.length>=2?`At 100k users with no SSO, ${r[0].p.vendor} ${r[0].p.plan} is cheapest at ${usd(r[0].e.total)}/mo${star(r[0].p)}; the most expensive verified plan is ${r.at(-1).p.vendor} ${r.at(-1).p.plan} at ${usd(r.at(-1).e.total)}/mo — a ${yr(r.at(-1).e.total-r[0].e.total)}/yr gap.`:'';
  page({file:`guides/${slug}.html`,title:`Cheapest auth provider at 100k users (${lastChecked.slice(0,4)}) | ${NAME}`,desc:`Every verified auth plan ranked by monthly cost at 100,000 users, with and without 10 SSO connections. Sourced list prices.`,ld:[ORG_LD,{'@context':'https://schema.org','@type':'FAQPage',mainEntity:[{'@type':'Question',name:'What is the cheapest auth at 100k users?',acceptedAnswer:{'@type':'Answer',text:ans}}]}],body:`
<section class="hero"><div class="eyebrow"><a href="/guides/">Guides</a> · ${asOf}</div><h1>Cheapest auth at 100k users</h1><p class="lede"><b>Answer:</b> ${esc(ans)}</p>${ctaRow(100000,0)}</section>
<h2>100k users, no SSO (${r.length} plans priceable)</h2>${tb(r)}
<h2>100k users, 10 SSO connections (${rs.length} plans priceable)</h2>${tb(rs)}
<p class="note">Plans without a published price at this volume are omitted (e.g. Auth0 paid tiers above 500 MAU, Stytch MAU overage). SSO for Cognito/Supabase assumes 200 federated MAU per connection. ${tokNote} ${meth}.</p>
${mailBox('g100','Get auth price changes weekly','Send me the weekly ledger')}`});
}
{ // free tiers
  const slug='auth-free-tiers-compared';DATA_GUIDES.push({slug,title:'Auth free tiers compared'});
  const fr=plans.filter(p=>p.tier==='free'||(p.base_mo===0&&p.included_users)).sort((a,b)=>(b.included_users||0)-(a.included_users||0));
  const ans=`Largest free allowances as of ${lastChecked}: ${fr.slice(0,4).map(p=>`${p.vendor} ${p.plan} ${Number(p.included_users).toLocaleString('en-US')} ${p.user_unit}`).join(', ')}.`;
  page({file:`guides/${slug}.html`,title:`Auth free tiers compared — MAU limits and free SSO | ${NAME}`,desc:`Free MAU/MRU allowances and included SSO connections for ${vendors.length} auth vendors, from official pricing pages.`,ld:[ORG_LD,{'@context':'https://schema.org','@type':'FAQPage',mainEntity:[{'@type':'Question',name:'Which auth provider has the biggest free tier?',acceptedAnswer:{'@type':'Answer',text:ans}}]}],body:`
<section class="hero"><div class="eyebrow"><a href="/guides/">Guides</a> · ${asOf}</div><h1>Auth free tiers, compared</h1><p class="lede"><b>Answer:</b> ${esc(ans)}</p>${ctaRow(10000,0)}</section>
<div class="tbl"><table><thead><tr><th>Plan</th><th class="n">Free users</th><th>Unit</th><th class="n">SSO incl.</th><th>Notes</th><th>Source</th></tr></thead><tbody>${fr.map(p=>`<tr><td><a href="/vendors/${p.vendor_id}.html">${esc(p.vendor)}</a> ${esc(p.plan)}</td><td class="n">${Number(p.included_users).toLocaleString('en-US')}</td><td>${esc(p.user_unit)}</td><td class="n">${p.sso_included??'—'}</td><td style="white-space:normal;min-width:240px" class="src">${esc(p.notes)}</td><td class="src"><a href="${p.source}">source</a> · ${p.checked}</td></tr>`).join('')}</tbody></table></div>
<p class="note">Includes $0-base plans with a free allowance (e.g. Cognito, WorkOS AuthKit, Stytch pay-as-you-go). ${meth}.</p>
${mailBox('gft','Hear when a free tier shrinks','Send me the weekly ledger')}`});
}

// ---- Changes + RSS
page({file:'changes.html',og:'changes',title:`Auth price-change log | ${NAME}`,desc:'Dated, sourced auth and identity price changes.',body:`<section class="hero"><div class="eyebrow">Price log · <a href="/rss.xml">RSS</a></div><h1>Every change, dated and sourced.</h1></section>
<div class="tbl"><table><thead><tr><th>Effective</th><th>Vendor</th><th>Kind</th><th>Detail</th><th>Source · observed</th></tr></thead>
<tbody>${changes.map(c=>`<tr><td class="n">${c.date}</td><td>${esc(c.vendor)}</td><td>${esc(c.kind)}</td><td style="white-space:normal">${esc(c.summary)}</td><td class="src"><a href="${c.source}">source</a> · ${c.observed}</td></tr>`).join('')}</tbody></table></div>`});
W('rss.xml',`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${NAME} — auth price log</title><link>${SITE}/changes.html</link><description>Dated, sourced auth price changes.</description>${changes.map(c=>`<item><title>${esc(c.vendor+': '+c.kind+' ('+c.date+')')}</title><link>${esc(c.source)}</link><guid isPermaLink="false">${esc(c.vendor+c.date+c.kind)}</guid><pubDate>${new Date(c.observed+'T12:00:00Z').toUTCString()}</pubDate><description>${esc(c.summary)}</description></item>`).join('')}</channel></rss>`);

// ---- Pro / sponsor / methodology / data
const proFaq=[['What triggers an alert?','A confirmed change on a source page for a plan or vendor you watch: base fee, overage, or SSO ladder.'],['Is Pro available now?','Yes — checkout via Kit. Free ledger stays free.'],['Cancel?','Yes, anytime. Access lasts through the paid period.'],['Monthly or annual?','Both: $9/mo or $90/yr. You pick the plan on the Kit checkout page.']];
page({file:'pro.html',og:'pro',title:`${NAME} Pro — auth price alerts ($9/mo)`,desc:`$90/yr for alerts on the auth plans you watch plus CSV export. Founding price — cancel anytime via Kit.`,ld:[{'@context':'https://schema.org','@type':'Product',name:`${NAME} Pro`,offers:[{'@type':'Offer',price:'9.00',priceCurrency:'USD'},{'@type':'Offer',price:'90.00',priceCurrency:'USD'}]}],body:`
<section class="hero"><div class="eyebrow">${NAME} Pro</div><h1>$90 a year for alerts before the auth invoice moves.</h1>
<p class="lede">Watch the vendors and plans you run. Pro emails you when published prices change.</p></section>
<div class="pricing"><div class="plan"><h2 class="h3">Free</h2><div class="price">$0</div><ul><li>Ledger, calculator, comparisons</li><li>Weekly email of price changes</li></ul>${signup('pf','Get the free weekly ledger')}</div>
<div class="plan feat"><div class="ribbon">Recommended</div><h2 class="h3">Pro</h2><div class="price">$90<small> / year</small></div><p class="mut">or $9/mo billed monthly — pick either on Kit checkout</p>
<ul><li><b>Alerts</b> for vendors you watch</li><li><b>CSV export</b> of scenarios and history</li><li>Everything in Free</li></ul>
<a class="btn" href="${CHECKOUT_PRO_ANNUAL}" rel="noopener">Get Pro — $9/mo or $90/yr</a>
<p class="micro">Founding price $9/mo or $90/yr — cancel anytime via Kit</p></div></div>
<h2>Questions</h2>${proFaq.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('')}`});
page({file:'checkout.html',og:'pro',title:`Review your order — ${NAME} Pro`,desc:'Summary before secure checkout.',body:`
<section class="hero narrow"><div class="eyebrow">Review</div><h1>Review AuthCost Pro</h1><p class="lede">Payment is handled by Kit on the next page. Pick $9/mo or $90/yr there.</p></section>
<div class="panel"><dl class="sum"><dt>Plan</dt><dd>Pro · $90/yr or $9/mo</dd><dt>What you get</dt><dd>Watched-vendor alerts + CSV export + Free</dd><dt>Cancel</dt><dd>Anytime</dd></dl>
<a class="btn wide" href="${CHECKOUT_PRO_ANNUAL}" rel="noopener">Continue to secure checkout</a>
<p class="micro">You choose monthly or annual on Kit’s checkout page.</p></div>`});
page({file:'sponsor.html',og:'sponsor',title:`Sponsor ${NAME}`,desc:'Reach founders choosing an auth stack. Founding rates.',body:`
<section class="hero"><div class="eyebrow">Sponsorship · founding rates</div><h1>Reach buyers at the moment they pick auth.</h1></section>
<div class="grid3"><div class="plan feat"><h2 class="h3">Founding newsletter slot</h2><div class="price">$49<small class="note"> / placement</small></div>
<ul><li>One labeled sponsor placement</li><li>Never affects rankings</li></ul>
<a class="btn" href="${CHECKOUT_SPONSOR}" rel="noopener">Reserve a founding slot — $49</a>
<p class="micro">One labeled placement · never affects rankings</p></div>
<div class="plan"><h2 class="h3">Rules</h2><ul><li>Sponsors never affect data</li><li>Always labeled</li><li>Auth / identity / security-adjacent only</li></ul>
<a class="btn ghost" href="${CONTACT}">Contact</a></div></div>`});
page({file:'methodology.html',title:`Methodology | ${NAME}`,desc:'How AuthCost reads and normalizes auth prices.',body:`<section class="hero"><div class="eyebrow">Methodology</div><h1>How the ledger is kept.</h1></section>
<ol class="lede">
<li>Prices come only from each vendor’s own pricing page. Each row stores the source URL and check date.</li>
<li>A row is <b>verified</b> when the figure was read on that date. We never estimate a missing price.</li>
<li>Estimated monthly cost = base + user overage (MAU/MRU bands) + SSO connection fees from the published ladder. Cognito/Supabase SAML uses a federated-MAU input. Logto token overage is noted but not assumed from MAU.</li>
<li>Auth0 paid self-serve prices are published at ≤500 MAU; scenarios above that omit Auth0 paid rows rather than invent a tier.</li>
<li>Stytch MAU overage rate was not printed as a fixed USD figure on the checked page — left blank.</li>
<li>A weekly script diffs every source page; confirmed changes enter the price log.</li>
</ol>`});
page({file:'data.html',title:`${NAME} data — JSON & CSV`,desc:'Free JSON and CSV of auth plan prices with sources. CC BY 4.0.',ld:[ORG_LD,{'@context':'https://schema.org','@type':'Dataset',name:`${NAME} auth price ledger`,url:SITE+'/data.html',license:'https://creativecommons.org/licenses/by/4.0/',dateModified:lastChecked,distribution:[{'@type':'DataDownload',encodingFormat:'application/json',contentUrl:SITE+'/api/plans.json'},{'@type':'DataDownload',encodingFormat:'text/csv',contentUrl:SITE+'/api/plans.csv'}]}],body:`
<section class="hero"><div class="eyebrow">Data · CC BY 4.0</div><h1>Machine-readable ledger.</h1></section>
<dl class="kv"><dt>Plans + vendors (JSON)</dt><dd><a href="/api/plans.json">/api/plans.json</a></dd>
<dt>Plans (CSV)</dt><dd><a href="/api/plans.csv">/api/plans.csv</a></dd>
<dt>Price log</dt><dd><a href="/api/changes.json">/api/changes.json</a></dd>
<dt>LLM summary</dt><dd><a href="/llms.txt">/llms.txt</a> · <a href="/llms-full.txt">/llms-full.txt</a></dd></dl>`});

// ---- Guides (GEO flywheel)
const guides=[
  {slug:'clerk-vs-auth0',title:'Clerk vs Auth0 pricing',body:'Compare MRU vs MAU and SSO connection fees using AuthCost scenarios.'},
  {slug:'workos-sso-pricing',title:'WorkOS SSO pricing explained',body:'Per-connection ladder $125→$65 and how it compares to Clerk and Stytch.'},
  {slug:'cognito-essentials-vs-plus',title:'Cognito Essentials vs Plus cost',body:'$0.015 vs $0.020 per MAU and when Plus threat protection is worth it.'},
  {slug:'mau-vs-mru',title:'MAU vs MRU billing',body:'Why Clerk’s retained-user unit changes the effective price vs Auth0 and Cognito.'},
  {slug:'cheapest-auth-10k',title:'Cheapest auth at 10k users',body:'Ranked verified plans at 10k MAU with and without one SSO connection.'},
  {slug:'cheapest-auth-50k-sso',title:'Cheapest auth at 50k users with SSO',body:'Scenario table for 50k users and 5 enterprise connections.'},
  {slug:'stytch-pricing',title:'Stytch B2B pricing',body:'Free 10k MAU and 5 SSO/SCIM connections; $125 per extra connection.'},
  {slug:'kinde-unlimited-sso',title:'Kinde Plus unlimited SSO',body:'How $75/mo with unlimited SSO compares to per-connection vendors.'},
  {slug:'supabase-auth-cost',title:'Supabase Auth cost (with platform plan)',body:'Auth MAU inside the $25 Pro plan and SAML at $0.015/MAU.'},
  {slug:'logto-token-pricing',title:'Logto token-based pricing',body:'Why token billing differs from MAU and what $24 Pro includes.'},
  {slug:'auth0-free-tier',title:'Auth0 free tier limits',body:'25k MAU, 1 Enterprise Connection, and when Essentials $35 applies.'},
  {slug:'enterprise-sso-cost',title:'What enterprise SSO really costs',body:'Per-connection vs included-unlimited vs federated-MAU models across eight vendors.'}
];
page({file:'guides/index.html',title:`Auth pricing guides | ${NAME}`,desc:`${guides.length+DATA_GUIDES.length} guides, ${vendors.length} vendor pricing pages, alternatives and ${pairs.length} head-to-heads on auth cost, MAU vs MRU and SSO fees.`,body:`<section class="hero"><div class="eyebrow">Guides</div><h1>Auth cost, explained.</h1></section>
<h2>Data tables</h2><ul class="pairs" style="display:grid;gap:8px">${DATA_GUIDES.map(g=>`<li><a href="/guides/${g.slug}.html">${esc(g.title)}</a></li>`).join('')}</ul>
<h2>Guides</h2><ul class="pairs" style="display:grid;gap:8px">${guides.map(g=>`<li><a href="/guides/${g.slug}.html">${esc(g.title)}</a></li>`).join('')}</ul>
<h2>Pricing by vendor</h2><div class="pairs">${vendors.map(v=>`<a href="/vendors/${v.id}.html">${esc(v.name)} pricing</a>`).join('')}</div>
<h2>Cheaper alternatives</h2><div class="pairs">${vendors.map(v=>`<a href="/alternatives/${v.id}.html">${esc(v.name)} alternatives</a>`).join('')}</div>
<h2>Head to head</h2><div class="pairs">${pairs.map(([a,b])=>`<a href="/compare/${a.id}-vs-${b.id}.html">${esc(a.name)} vs ${esc(b.name)} pricing</a>`).join('')}</div>
${ctaRow()}`});
for(const g of guides){
  const r10=rankScenario(10000,1),r50=rankScenario(50000,5);
  page({file:`guides/${g.slug}.html`,title:`${g.title} | ${NAME}`,desc:g.body,body:`
<section class="hero"><div class="eyebrow"><a href="/guides/">Guides</a> · checked ${lastChecked}</div><h1>${esc(g.title)}</h1>
<p class="lede">${esc(g.body)}</p></section>
<div class="panel"><div class="eyebrow">Live ledger snapshot</div>
<p><b>10k users · 1 SSO:</b> ${r10.slice(0,3).map(x=>`${esc(x.p.vendor)} ${esc(x.p.plan)} ${usd(x.e.total)}/mo`).join(' · ')||'—'}</p>
<p><b>50k users · 5 SSO:</b> ${r50.slice(0,3).map(x=>`${esc(x.p.vendor)} ${esc(x.p.plan)} ${usd(x.e.total)}/mo`).join(' · ')||'—'}</p>
<p class="note">${asOf}. ${meth}.</p></div>
<p><a class="btn" href="/calculator/">Run your own scenario</a></p>
${mailBox('g'+g.slug,'Get auth price changes weekly','Send me the weekly ledger')}`});
}

// ---- API dumps
const meta={generated:new Date().toISOString(),site:SITE,license:'CC-BY-4.0'};
W('api/plans.json',JSON.stringify({...meta,affiliates:Object.fromEntries(Object.entries(AFFILIATES).filter(([,v])=>v!=='#pending')),vendors,plans},null,2));
W('api/changes.json',JSON.stringify({...meta,changes},null,2));
const csvEscape=v=>{const s=String(v??'');return /["',\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s};
W('api/plans.csv',['id,vendor,plan,base_mo,included_users,user_unit,overage_per_user,sso_included,sso_extra_mo,status,source,checked',
  ...plans.map(p=>[p.id,p.vendor,p.plan,p.base_mo,p.included_users,p.user_unit,p.overage_per_user,p.sso_included,p.sso_extra_mo,p.status,p.source,p.checked].map(csvEscape).join(','))].join('\n'));
W('api/changes.csv',['date,vendor,kind,summary,source,observed',...changes.map(c=>[c.date,c.vendor,c.kind,c.summary,c.source,c.observed].map(csvEscape).join(','))].join('\n'));

W('llms.txt',`# ${NAME}\n\n> Auth and identity list prices (base + MAU/MRU + SSO), ${plans.length} plan rows, ${nVer} verified, ${vendors.length} vendors, checked ${lastChecked}.\n\n## Methodology\nPrices from each vendor's own pricing page only. Verified rows were read on the date shown. We never invent a price. Details: ${SITE}/methodology.html\n\n## Data (CC BY 4.0 — attribute \"AuthCost\" + link ${SITE}/)\n- [Plans JSON](${SITE}/api/plans.json)\n- [Plans CSV](${SITE}/api/plans.csv)\n- [Changes JSON](${SITE}/api/changes.json)\n- [Full dump](${SITE}/llms-full.txt)\n\n## Key pages\n- [Calculator (MAU / MFA / SSO)](${SITE}/calculator/)\n- [Calculator pretty URL](${SITE}/calculator)\n- [Compare hub](${SITE}/compare/)\n- [Guides](${SITE}/guides/)\n- [Alternatives](${SITE}/alternatives/)\n- [Auth pricing by MAU](${SITE}/guides/auth-cost-by-mau.html)\n- [Methodology](${SITE}/methodology.html)\n- [About](${SITE}/about)\n- [Privacy](${SITE}/privacy)\n- [Terms](${SITE}/terms)\n`);
W('llms-full.txt',`# ${NAME} — full ledger\n\n## Calculator\nInteractive MAU / MFA / SSO cost ranking: ${SITE}/calculator/?mau=50000&sso=5&mfa=0\nShare via query params: mau, sso, mfa (0|1), fed (federated MAU), vo (verified-only 0|1), embed=1 for chrome-free iframe.\nEmbed: <iframe src=\"${SITE}/calculator/?embed=1&mau=50000&sso=5\" title=\"AuthCost calculator\" width=\"100%\" height=\"720\" loading=\"lazy\"></iframe>\n\n${plans.length} plans, ${nVer} verified, ${vendors.length} vendors. Checked through ${lastChecked}.\n\n## Vendors\n${vendors.map(v=>`### ${v.name}\n- id: ${v.id}\n- source: ${v.source}\n- checked: ${v.checked}\n- unit: ${v.billing_unit}\n- summary: ${v.summary}`).join('\n\n')}\n\n## Plans\n${plans.map(p=>`### ${p.vendor} ${p.plan}\n- id: ${p.id}\n- base_mo: ${p.base_mo}\n- included_users: ${p.included_users}\n- unit: ${p.user_unit}\n- overage: ${p.overage_per_user}\n- sso_included: ${p.sso_included}\n- sso_extra_mo: ${p.sso_extra_mo}\n- status: ${p.status}\n- source: ${p.source} (${p.checked})\n- notes: ${p.notes||''}`).join('\n\n')}\n\n## Cost by MAU (cheapest verified plan per vendor, USD/month, no SSO)\n| Vendor | ${T1M.map(kfmt).join(' | ')} |\n|---|${T1M.map(()=>'---').join('|')}|\n${vendors.map(v=>`| ${v.name} | ${T1M.map(m=>{const b=bestFor(v.id,m);return b?usd(b.e.total)+star(b.p)+' ('+b.p.plan+')':'n/a'}).join(' | ')} |`).join('\n')}\n${tokNote}\n\n## Search pages\n${vendors.map(v=>`- ${v.name} pricing: ${SITE}/vendors/${v.id}.html\n- ${v.name} alternatives: ${SITE}/alternatives/${v.id}.html`).join('\n')}\n${DATA_GUIDES.map(g=>`- ${g.title}: ${SITE}/guides/${g.slug}.html`).join('\n')}\n${pairs.map(([a,b])=>`- ${a.name} vs ${b.name} pricing: ${SITE}/compare/${a.id}-vs-${b.id}.html`).join('\n')}\n\n## Changes\n${changes.map(c=>`- ${c.date} ${c.vendor} (${c.kind}): ${c.summary} [${c.source}]`).join('\n')}\n`);

W('manifest.webmanifest',JSON.stringify({name:`${NAME} — Auth cost of ownership`,short_name:NAME,start_url:'/?source=pwa',scope:'/',display:'standalone',background_color:'#f7f5f0',theme_color:'#141821',icons:[{src:'/assets/icon-192.png',sizes:'192x192',type:'image/png'},{src:'/assets/icon-512.png',sizes:'512x512',type:'image/png'}]}));
const V='ac-'+Date.now().toString(36),pre=['/','/calculator/','/compare/','/changes.html','/pro.html','/assets/style.css','/assets/app.js','/api/plans.json','/offline.html'];
W('sw.js',`const V='${V}',PRE=${JSON.stringify(pre)};self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>c.addAll(PRE)).then(()=>self.skipWaiting())));self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put(r,c));return res}).catch(()=>caches.match(r).then(m=>m||(r.mode==='navigate'?caches.match('/offline.html'):undefined))))});`);
// ---- Legal + about (RT-20261030-55). Facts only: Kit email + checkout, cookieless first-party events (assets/grow.js -> growth-ingest Worker -> Cloudflare Analytics Engine), Cloudflare hosting.
const MAIL=CONTACT.replace(/^mailto:/,'');const legalHero=(eb,h,lede)=>`<section class="hero narrow"><div class="eyebrow">${eb} · updated ${LEGAL_UPDATED}</div><h1>${h}</h1><p class="lede">${lede}</p></section>`;
const prose=b=>`<div class="panel legal-prose" style="max-width:760px">${b}</div>`;
page({file:'privacy.html',title:`Privacy | ${NAME}`,desc:`What ${NAME} collects (your email if you subscribe, anonymous cookieless page events), who processes it (Kit, Stripe via Kit, Cloudflare) and how to get it deleted.`,body:`${legalHero('Privacy','Privacy, in plain words.',`${NAME} is a free auth and identity price ledger. We collect as little as we can: your email only if you give it to us, and anonymous page events with no cookies.`)}
${prose(`<h2 class="h3">What we collect and why</h2><ul>
<li><b>Email newsletter.</b> If you subscribe, your email address goes to <a href="https://kit.com/privacy" rel="noopener">Kit</a> (ConvertKit), our email provider. Kit stores it and standard email data (opens, clicks) so we can send the weekly ledger. Every email has a one-click unsubscribe. Legal basis: your consent.</li>
<li><b>Purchases (Pro, sponsor slot).</b> Checkout runs on Kit’s hosted pages (o11y-watch.kit.com); card payments are processed by Kit’s payment processor, Stripe. We never see or store your card number. We receive the order record (name, email, product, amount) from Kit. Legal basis: performing the contract, plus tax and accounting duties.</li>
<li><b>Anonymous usage events, no cookies.</b> A small first-party script (<a href="/assets/grow.js">/assets/grow.js</a>) sends events such as page view, clicks on checkout or signup buttons and form submits to our own Cloudflare Worker, which stores them in Cloudflare Workers Analytics Engine. Each event holds the site, page path, button label, UTM campaign tags, referring domain and an A/B test label. It does <b>not</b> include your IP address, the email you type, or any cookie or user ID. Legal basis: legitimate interest in knowing which pages help people.</li>
<li><b>On your device.</b> We use your browser’s local storage (not cookies) for your theme choice (<code>ac-theme</code>), UTM tags for up to 7 days (<code>grow:utm</code>) and A/B test assignment (<code>grow:ab:*</code>). A service worker caches pages so the site works offline. Clearing site data removes all of it.</li>
<li><b>Hosting.</b> The site is served by Cloudflare Pages. Like any web host, Cloudflare processes your IP address to deliver pages and block abuse, under <a href="https://www.cloudflare.com/privacypolicy/" rel="noopener">Cloudflare’s privacy policy</a>.</li></ul>
<h2 class="h3">What we don’t do</h2><ul><li>No advertising trackers, no third-party analytics cookies, no selling or renting your data.</li><li>Sponsors never receive subscriber emails.</li></ul>
<h2 class="h3">How long we keep it</h2><ul><li>Email: until you unsubscribe or ask us to delete it.</li><li>Order records: as long as tax and accounting rules require.</li><li>Anonymous events: as long as Cloudflare Analytics Engine retains them (about three months).</li></ul>
<h2 class="h3">Your rights and deleting your data</h2><p>You can unsubscribe from any email in one click. To see, correct or delete what we hold about you, email <a href="${CONTACT}">${MAIL}</a> from the address concerned with the subject “Delete my data” (or “Access my data”). We remove you from Kit and delete what we are not legally required to keep, and confirm by email. If you are in the EU/UK you also have the right to object, restrict processing, data portability, and to complain to your local data-protection authority.</p>
<h2 class="h3">Changes and contact</h2><p>If this page changes, the date at the top changes. Questions: <a href="${CONTACT}">${MAIL}</a>. See also our <a href="/terms">terms</a>.</p>`)}`});
page({file:'terms.html',title:`Terms | ${NAME}`,desc:`Terms for using ${NAME}: information only, verify prices before buying, CC BY 4.0 data, how Pro and sponsor slots are billed via Kit and how to cancel.`,body:`${legalHero('Terms','Terms of use.',`Short version: the ledger is free information, read from providers’ own pages. Check the provider’s page before you buy. Paid extras are billed through Kit and you can cancel anytime.`)}
${prose(`<h2 class="h3">The information</h2><ul><li>Prices, MAU/MRU and SSO fees come from each vendor’s public pricing page, with the source and check date on every row (<a href="/methodology.html">methodology</a>). Vendors change prices without notice, so data can be wrong or out of date. Always confirm on the vendor’s page before buying.</li><li>Nothing here is financial, legal or procurement advice. The site is provided “as is”, without warranties.</li><li>${NAME} is not affiliated with any vendor. Trademarks belong to their owners. ${ANY_AFF?'Some outbound links are affiliate links; they are labeled and never affect ranking.':'There are no affiliate links today; if we add any they will be labeled and will not affect ranking.'}</li></ul>
<h2 class="h3">Using the data</h2><p>The ledger data (JSON/CSV on <a href="/data.html">/data</a>) is licensed <a href="https://creativecommons.org/licenses/by/4.0/" rel="noopener">CC BY 4.0</a>: reuse it freely with attribution to “${NAME}” and a link to ${SITE}/. Please don’t scrape the site at a rate that degrades it; use the files instead.</p>
<h2 class="h3">Pro</h2><ul><li>Pro costs $9/month or $90/year and is sold through Kit’s hosted checkout; payments are processed by Stripe via Kit. Prices are in USD; taxes may apply.</li><li>Pro is sold at a founding price. You get what the <a href="/pro.html">Pro page</a> describes; anything not live yet is delivered when it ships, and nothing is promised before then.</li><li>Cancel anytime from your Kit receipt or by emailing us; you keep access until the end of the period you paid for. For refund requests, email <a href="${CONTACT}">${MAIL}</a>; we also honor any refund rights your local consumer law gives you.</li></ul>
<h2 class="h3">Sponsor slots</h2><ul><li>A founding newsletter slot is $49 per placement, sold through Kit. Sponsors are always labeled “Sponsor” and never affect data or ranking. We accept auth, identity and security-adjacent sponsors only; if we can’t run a placement you paid for, we refund it.</li></ul>
<h2 class="h3">Liability</h2><p>To the extent the law allows, our total liability for any claim about the site or a paid product is limited to what you paid us in the 12 months before the claim. Nothing here limits rights you have under consumer law that can’t be waived.</p>
<h2 class="h3">Changes and contact</h2><p>We may update these terms; the date at the top shows the latest version. Questions: <a href="${CONTACT}">${MAIL}</a>. Privacy: <a href="/privacy">how we handle data</a>.</p>`)}`});
page({file:'about.html',title:`About | ${NAME}`,desc:`${NAME} is an independent auth pricing ledger: Clerk, Auth0, Cognito, WorkOS and more, every price sourced and dated. How it is kept, how it makes money, and how to reach us.`,body:`${legalHero('About',`About ${NAME}`,`An independent ledger of auth and identity pricing: base plan plus MAU/MRU and SSO fees, with the source and check date on every row.`)}
${prose(`<ul><li><b>How it’s kept.</b> Prices are read only from vendors’ own pricing pages, re-checked by a script and logged when they change. Unknowns stay blank; we never estimate a price. Details: <a href="/methodology.html">methodology</a>.</li><li><b>How it’s paid for.</b> The ledger, calculator, comparisons and data are free. Revenue comes from optional <a href="/pro.html">Pro</a> alerts and labeled <a href="/sponsor.html">newsletter sponsor slots</a>. ${ANY_AFF?'Some outbound links are affiliate links.':'There are no affiliate links today.'} No one pays for placement.</li><li><b>Who runs it.</b> ${NAME} is published by the same independent operator as the pricing ledgers <a href="https://o11y-watch.pages.dev/" rel="noopener">O11y Watch</a>, <a href="https://ratecardai.pages.dev/" rel="noopener">Ratecard</a> and <a href="https://vpsledger.pages.dev/" rel="noopener">VPSLedger</a>. Source code: <a href="https://github.com/Basileion/authcost" rel="noopener">github.com/Basileion/authcost</a>.</li><li><b>Contact.</b> Corrections, sponsor questions or data requests: <a href="${CONTACT}">${MAIL}</a>.</li></ul>`)}`});
page({file:'offline.html',title:`Offline | ${NAME}`,desc:'Offline',body:`<section class="hero"><h1>You are offline.</h1><a class="btn" href="/">Open the ledger</a></section>`});
page({file:'404.html',title:`Not found | ${NAME}`,desc:'Not found',body:`<section class="hero"><h1>Page not found.</h1><a class="btn" href="/">Back to the ledger</a></section>`});

if(INDEXNOW_KEY)W(INDEXNOW_KEY+'.txt',INDEXNOW_KEY);
const sm=urls.filter(u=>!NOINDEX.map(cleanPath).includes(u));
W('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sm.map(u=>`<url><loc>${SITE}/${u}</loc><lastmod>${['privacy','terms','about'].includes(u)?LEGAL_UPDATED:lastChecked}</lastmod></url>`).join('')}</urlset>`);
W('robots.txt',`User-agent: *\nAllow: /\n\n${['GPTBot','OAI-SearchBot','ChatGPT-User','PerplexityBot','ClaudeBot','Google-Extended','Applebot-Extended','Bingbot'].map(b=>`User-agent: ${b}\nAllow: /`).join('\n\n')}\n\nSitemap: ${SITE}/sitemap.xml\n`);
W('_headers',`/sw.js\n  Cache-Control: no-cache\n/api/*\n  Access-Control-Allow-Origin: *\n`);

// Client data blob for app.js
W('api/estimate-meta.json',JSON.stringify({scenarios:SCENARIOS,lastChecked,nVer}));

for(const f of ['style.css','app.js'])W('assets/'+f,fs.readFileSync(R('src/'+f)));
if(fs.existsSync(R('assets')))fs.cpSync(R('assets'),path.join(D,'assets'),{recursive:true});

W('_redirects','/calculator.html /calculator/ 301\n');
console.log(`built ${urls.length} pages (${sm.length} in sitemap) → dist/ (${plans.length} plans, ${nVer} verified, ${vendors.length} vendors)`);

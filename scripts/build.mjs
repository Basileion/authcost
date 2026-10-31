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
const AFFILIATES={clerk:'#pending',auth0:'#pending',workos:'#pending',stytch:'#pending',kinde:'#pending',logto:'#pending',supabase:'#pending',cognito:'#pending',firebase:'#pending',descope:'#pending'}; // replace #pending when affiliate programs approved
const NAME='AuthCost';
const rd=f=>JSON.parse(fs.readFileSync(R('data/'+f),'utf8'));
const vendors=rd('vendors.json'),plans=rd('plans.json'),changes=rd('changes.json').sort((a,b)=>b.date.localeCompare(a.date));
const P=Object.fromEntries(vendors.map(v=>[v.id,v]));
const aff=id=>{const a=AFFILIATES[id];return (a&&a!=='#pending')?a:(P[id]?P[id].source:'#');};
const nVer=plans.filter(p=>p.status==='verified').length,lastChecked=plans.map(p=>p.checked).sort().at(-1);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
// RT-20261031-60: sub-$1 rates keep their published precision (e.g. Supabase $0.00325), never rounded to 4 places.
const usd=v=>v==null||Number.isNaN(v)?'—':'$'+(Number.isInteger(v)?v.toLocaleString('en-US'):v>=1?v.toFixed(2):String(+v.toFixed(5)).replace(/^(\d+\.\d)$/,'$10'));
const yr=v=>'$'+Math.round(v*12).toLocaleString('en-US');
const HEADSLOT='<!-- seo-meta-slot -->'+(fs.existsSync(R('seo/head-extra.html'))?fs.readFileSync(R('seo/head-extra.html'),'utf8'):'').replace(/<!--[\s\S]*?-->/g,'').trim();
const INDEXNOW_KEY=fs.existsSync(R('indexnow.key'))?fs.readFileSync(R('indexnow.key'),'utf8').trim():'';
const LEGAL_UPDATED='2026-10-30';const NOINDEX=['404.html','offline.html','checkout.html'];const ANY_AFF=Object.values(AFFILIATES).some(v=>v!=='#pending');
fs.rmSync(D,{recursive:true,force:true});const W=(p,s)=>{fs.mkdirSync(path.dirname(path.join(D,p)),{recursive:true});fs.writeFileSync(path.join(D,p),s)};
const mark=`<svg width="24" height="24" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="7" fill="var(--ink)"/><path d="M10 16a6 6 0 0 1 12 0v5a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2v-5z" fill="none" stroke="var(--bg)" stroke-width="2"/><circle cx="16" cy="16" r="2.2" fill="var(--acc)"/></svg>`;
const NAV=[['/','Ledger'],['/calculator/','Calculator'],['/compare/','Compare'],['/guides/','Guides'],['/changes','Price log'],['/vendors/','Vendors'],['/pro','Pro']];
const urls=[];
const WEBSITE_LD={'@context':'https://schema.org','@type':'WebSite','@id':SITE+'/#website',name:NAME,url:SITE+'/',description:'Auth and identity vendor list prices (MAU, MRU, SSO connections), sourced and dated.',inLanguage:'en',publisher:{'@id':SITE+'/#org'}};
const ORG_LD={'@context':'https://schema.org','@type':'Organization','@id':SITE+'/#org',name:NAME,url:SITE+'/',sameAs:['https://bsky.app/profile/o11ywatch.bsky.social']};
const cleanPath=f=>f.replace(/index\.html$/,'').replace(/\.html$/,'');
const NOSITEMAP=[];const page=({file,title,desc,body,og='home',ld=[],canonical})=>{urls.push(cleanPath(file));if(canonical)NOSITEMAP.push(cleanPath(file));const url=SITE+'/'+cleanPath(file);W(file,`<!doctype html><html lang="en" data-product="auth"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${canonical?SITE+canonical:url}"><meta name="robots" content="${NOINDEX.includes(file)?'noindex,follow':'index,follow'}">
<meta property="og:type" content="website"><meta property="og:site_name" content="${NAME}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${SITE}/assets/og/${og}.png"><meta name="twitter:card" content="summary_large_image">
${HEADSLOT}<link rel="manifest" href="/manifest.webmanifest"><meta name="theme-color" media="(prefers-color-scheme: light)" content="#f7f5f0"><meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0e1117"><meta name="color-scheme" content="light dark"><script>(function(){try{var q=/[?&]theme=(light|dark)/.exec(location.search),t=q?q[1]:localStorage.getItem("ac-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}})()</script>
<link rel="preload" href="/assets/fonts/serif.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/assets/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/assets/icon-192.png">
<link rel="alternate" type="application/rss+xml" title="${NAME} price log" href="/rss.xml"><link rel="stylesheet" href="/assets/style.css">
${(['404.html','offline.html'].includes(file)?[]:[...(file==='index.html'?[WEBSITE_LD]:[]),...(ld.length?ld:[{'@context':'https://schema.org','@type':'WebPage',name:title,description:desc,url,isPartOf:{'@id':SITE+'/#website'}}])]).map(x=>`<script type="application/ld+json">${JSON.stringify(x)}</script>`).join('')}</head><body><a class="skip" href="#main">Skip to content</a>
<header class="top"><div class="wrap"><a class="brand" href="/">${mark}${NAME}<small>Auth cost of ownership</small></a><nav class="main" aria-label="Main">${NAV.map(([h,l])=>`<a href="${h}"${'/'+cleanPath(file)===h?' aria-current="page"':''}>${l}</a>`).join('')}</nav>
<button class="tt" type="button" id="tt" aria-label="Switch color theme"><svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg><svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg></button>
<a class="btn cta" href="/#ledger-mail">Weekly ledger</a></div></header>
<main id="main" class="wrap">${body}</main>
<footer class="ds-foot"><div class="wrap"><div class="brand-blurb"><a class="brand" href="/" style="margin-bottom:12px">${mark}${NAME}</a><p>${NAME} — auth and identity list prices, normalized and sourced. Last check ${lastChecked}. Some outbound links may become affiliate links; they never affect ranking. Not affiliated with any vendor.</p></div>
<div class="col"><h3>Product</h3><nav aria-label="Product"><a href="/calculator/">Calculator</a><a href="/compare/">Compare</a><a href="/alternatives/">Alternatives</a><a href="/guides/">Guides</a><a href="/pro">Pro</a></nav></div>
<div class="col"><h3>Data</h3><nav aria-label="Data"><a href="/changes">Price log</a><a href="/methodology">Methodology</a><a href="/data">Data</a><a href="/api/plans.csv">CSV</a><a href="/rss.xml">RSS</a></nav></div>
<div class="col"><h3>Money</h3><nav aria-label="Money"><a href="/sponsor">Sponsor</a><a href="https://o11y-watch.pages.dev/audit">Observability audit</a></nav></div>
<div class="col"><h3>Legal</h3><nav aria-label="Legal"><a href="/about">About</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="${CONTACT}">Contact</a></nav></div>
<div class="portfolio" role="navigation" aria-label="More pricing ledgers"><div class="eyebrow">More pricing ledgers</div><ul><li><a href="https://o11y-watch.pages.dev/" rel="noopener">O11y Watch</a> — observability vendor free tiers and paid_from prices, sourced.</li><li><a href="https://vpsledger.pages.dev/" rel="noopener">VPSLedger</a> — VPS true monthly cost after promos, fees, and egress.</li><li><a href="https://ratecardai.pages.dev/" rel="noopener">Ratecard</a> — published AI API $/1M token rates with source dates.</li></ul></div><div class="legal">Verify prices on the vendor’s page before buying. <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a></div></div></footer>
<script>window.__GROW__={site:"authcost.pages.dev"/* dormant A/B: ,experiments:[{id:"design-standard-v1",arms:["control","v1"]}] */};</script>
<script src="/assets/grow.js" defer></script><script type="module" src="/assets/app.js"></script></body></html>`)};

// RT-20261031-57: per-federated-user SSO vendors (Firebase / Identity Platform, Supabase, Cognito) need an SSO-user count.
// Default = FED_PER_CONN SSO users per connection. Every page that publishes an SSO result must disclose it (build guard below).
export const FED_PER_CONN=200;
// RT-20261031-56: B2B organizations / tenants. SSO implies at least 1 customer organization per SSO connection.
// Members per org default to the SSO-users-per-connection figure (FED_PER_CONN), capped at users ÷ orgs.
// Returns null when the plan cannot hold that many orgs (published cap, or a required add-on we cannot price on it).
export function orgCost(plan, mau, sso=0, opts={}){
  const need=Math.max(0, sso|0);
  const orgs=Math.max(Math.max(0, Math.floor(+opts.orgs||0)), need);
  const r={fee:0,orgs,label:'',note:''};
  if(!orgs) return r;
  const m$=v=>'$'+(Number.isInteger(v)?v.toLocaleString('en-US'):v.toFixed(2));
  const pl=(n,w)=>n+' '+w+(n===1?'':'s');
  let mem=(opts.org_members!=null&&opts.org_members!=='')?Math.max(0,+opts.org_members||0):(need>0&&opts.federated_mau!=null?opts.federated_mau/need:FED_PER_CONN);
  if(mau>0) mem=Math.min(mem, Math.ceil(mau/orgs));
  const counted=(plan.org_counts&&mem<2)?0:orgs; // Clerk MROs, Kinde MAOs and Descope active tenants skip orgs with fewer than 2 members
  const unit=plan.org_counts||'organization';
  if(!plan.org_model&&plan.org_max==null&&plan.org_included==null&&!plan.org_unlimited&&plan.org_addon_mo==null) plan={...plan,org_model:'none'};
  if(plan.org_model==='none'){ r.note=`No per-organization fee published (${pl(orgs,'org')} add $0).`; return r; }
  if(plan.org_max!=null && counted>plan.org_max) return null;
  if(plan.org_max!=null && plan.org_extra_mo==null && plan.org_addon_mo==null){ r.note=`${pl(orgs,'org')} within the ${plan.org_max}-${unit} cap.`; return r; }
  if(plan.org_member_limit!=null){
    const incl=plan.org_included??0;
    if(counted<=incl && mem<=plan.org_member_limit){ r.note=`${pl(orgs,'org')} within the free ${incl} ${unit}s and ${plan.org_member_limit} members per org.`; return r; }
    if(plan.org_addon_mo==null || plan.org_addon_available===false) return null;
    let extra=0; for(const b of plan.org_bands||[]){ const hi=b.to==null?Infinity:b.to; extra+=Math.max(0, Math.min(counted,hi)-b.from+1)*b.rate; }
    r.fee=plan.org_addon_mo+extra; r.label=plan.org_addon_name+(extra>0?` + ${pl(counted-incl,'extra '+unit)}`:'');
    r.note=`${plan.org_addon_name} ${m$(plan.org_addon_mo)}/mo required (${counted>incl?`${counted} ${unit}s > ${incl} free`:`${Math.round(mem)} members per org > ${plan.org_member_limit}`})${extra>0?` + ${m$(extra)}/mo for ${pl(counted-incl,'extra '+unit)}`:''}.`;
    return r;
  }
  if(plan.org_extra_mo!=null){
    const x=Math.max(0, counted-(plan.org_included||0)); r.fee=x*plan.org_extra_mo;
    if(r.fee>0){ r.label=`${pl(x,'extra '+unit)} × ${m$(plan.org_extra_mo)}`; r.note=`${counted} ${unit}s: ${plan.org_included} included, ${x} × ${m$(plan.org_extra_mo)} = ${m$(r.fee)}/mo.`; }
    else r.note=`${pl(counted,unit)} within the ${plan.org_included} included.`;
    return r;
  }
  if(plan.org_addon_mo!=null){ r.fee=plan.org_addon_mo; r.label=plan.org_addon_name; r.note=`${plan.org_addon_name} ${m$(plan.org_addon_mo)}/mo.`; return r; }
  r.note=plan.org_published===false?'No organization fee printed on the pricing page.':`Unlimited organizations (${pl(orgs,'org')} add $0).`;
  return r;
}
// RT-20261031-93: SCIM / Directory Sync. `scim` = SSO customers that also need SCIM (capped at the SSO connection count).
// Models (plans.json scim_model): separate ladder (WorkOS, Clerk), pooled with SSO (Stytch), included (Auth0 B2B/Free, Descope Growth).
// Returns null when the plan has no published SCIM price (none / not_published / coming_soon), so it drops out of SCIM scenarios.
export function scimCost(plan, sso=0, scim=0){
  const need=Math.max(0, sso|0), n=Math.min(Math.max(0, Math.floor(+scim||0)), need);
  const r={fee:0,n,note:''};
  if(!n) return r;
  const m=plan.scim_model, f$=v=>'$'+v.toLocaleString('en-US'), pl=(k,w)=>k+' '+w+(k===1?'':'s');
  if(m==='included'){ r.note=`SCIM: ${pl(n,'customer')} on included SCIM, no separate fee printed.`; return r; }
  if(m==='pooled'){ const inc=plan.scim_included||0, before=Math.max(0,need-inc), after=Math.max(0,need+n-inc); r.fee=(after-before)*plan.scim_extra_mo; r.note=`SCIM shares the ${inc} included SSO-or-SCIM connections: ${need} SSO + ${n} SCIM = ${need+n}; SCIM adds ${f$(r.fee)}/mo.`; return r; }
  if(m==='separate'){ const inc=plan.scim_included||0; let c=0; for(let i=inc+1;i<=n;i++){ const b=(plan.scim_bands||[]).find(x=>i>=x.from&&i<=x.to); if(!b) return null; c+=b.rate; } r.fee=c; r.note=`SCIM / Directory Sync is a separate connection: ${pl(n,'connection')} (${inc} included) = ${f$(c)}/mo${plan.scim_billing_starts?`, billed from ${plan.scim_billing_starts} ($0 before)`:''}.`; return r; }
  return null;
}
/** Estimate monthly cost for a plan given MAU and SSO connection count. Returns null if unverifiable. */
export function estimate(plan, mau, sso=0, opts={}){
  if(plan.status!=='verified') return null;
  const out={base:0,users:0,sso:0,scim:0,scimN:0,mfa:0,org:0,orgs:0,orgLabel:'',total:null,notes:[]};
  // Step-tier plans (e.g. Auth0): billed at the first published MAU tier >= usage; above the top tier = contact sales -> omit
  const tierRow=plan.price_tiers?plan.price_tiers.find(t=>mau<=t.mau):null;
  if(plan.price_tiers && !tierRow) return null;
  if(plan.sso_max!=null && (sso|0)>plan.sso_max) return null;
  if(!plan.price_tiers){
  if(plan.tier==='free' && plan.included_users!=null && mau>plan.included_users && plan.overage_per_user==null && !plan.overage_per_1m_mau) return null;
  // Omit when user count exceeds included allowance but no published per-user overage (e.g. Stytch)
  if(plan.included_users!=null && mau>plan.included_users && plan.overage_per_user==null && !plan.overage_bands && !plan.overage_per_1m_mau) return null;
  }

  out.base=tierRow?tierRow.mo:(plan.base_mo??0);
  if(tierRow) out.notes.push(`Published tier: up to ${tierRow.mau.toLocaleString('en-US')} MAU at $${tierRow.mo.toLocaleString('en-US')}/mo (billed at next tier up).`);

  // User / MAU / MRU cost
  if(tierRow){ /* MAU priced by tier */ }
  else if(plan.overage_per_1m_mau!=null){
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
      // Treat each `sso` connection as one enterprise customer with FED_PER_CONN SSO users unless opts.federated_mau is set
      const fedMau=opts.federated_mau??(need*FED_PER_CONN);
      out.sso=Math.max(0, fedMau - fedFree)*plan.federated_per_mau;
      out.notes.push(`SAML/OIDC billed per SSO user: ${fedMau} SSO users assumed (${FED_PER_CONN} per connection by default); change it in the calculator.`);
    } else if(plan.sso_saml_per_mau!=null){
      const fedMau=opts.federated_mau??(need*FED_PER_CONN);
      const incl=plan.sso_saml_included_mau??0;
      out.sso=Math.max(0, fedMau - incl)*plan.sso_saml_per_mau;
      out.notes.push(`Supabase SAML billed per SSO user: ${fedMau} SSO users assumed (${FED_PER_CONN} per connection by default).`);
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

  // RT-20261031-93: SCIM / Directory Sync for SSO customers that need it
  const sc=scimCost(plan, need, opts.scim);
  if(sc==null) return null;
  out.scim=sc.fee; out.scimN=sc.n; if(sc.n) out.notes.push(sc.note);

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

  // RT-20261031-56: organization / tenant fees and caps
  const oc=orgCost(plan, mau, need, opts);
  if(oc==null) return null;
  out.org=oc.fee; out.orgs=oc.orgs; out.orgLabel=oc.label; if(oc.orgs) out.notes.push(oc.note);
  out.total=out.base+out.users+out.sso+out.scim+out.mfa+out.org;
  return out;
}

const kfmt=n=>n>=1e6?(n/1e6)+'M':(n/1000)+'k';
const tag=s=>s==='verified'?'<span class="tag">Verified</span>':'<span class="tag u">Unverified</span>';
const faq=[
  ['What does AuthCost compare?','Published list prices for auth and identity vendors: base plan fees, MAU/MRU allowances and overages, and enterprise SSO / Directory Sync connection fees. Every row links the vendor’s own pricing page and the date we checked it.'],
  ['MAU vs MRU — why does it matter?','Most vendors bill Monthly Active Users (any activity that month). Clerk bills Monthly Retained Users — a user who returns at least one day after signup. MRU is never higher than MAU for the same app, so pricing Clerk on your MAU count overstates Clerk’s bill unless you count only retained users.'],
  ['Why are some rows blank?','We never invent a number. If a rate is “contact sales,” custom, or not printed as a fixed figure on the official page, we leave it blank and mark the gap.'],
  ['How is the calculator’s cost computed?',`Monthly ≈ base + max(0, users − included) × overage + SSO fees from the published ladder + SCIM / Directory Sync fees for the SSO customers you say need it (separate connection, shared pool or included, per the vendor’s page) + verified MFA add-ons when MFA is required. Firebase / Identity Platform, Supabase and Cognito bill SAML/OIDC per SSO user, not per connection, so we assume ${FED_PER_CONN} SSO users per connection by default (change it in the calculator; see the sensitivity table in the methodology). B2B organization fees are added where the vendor publishes them (Clerk’s B2B Authentication add-on and per-org fees, Descope and Kinde per-tenant/org fees, Logto’s Organizations add-on), and plans over a published org cap (Auth0 Free 5, Auth0 B2C 10, Descope Free 10 tenants, Kinde Free 5) are left out. Every SSO connection counts as at least one customer organization. Token-based plans (Logto) use base + SSO (+ MFA add-on if required) only unless noted. We never invent an MFA price.`],
  ['Do affiliate links change rankings?','No. Ranking is by computed cost only. Affiliate links are labeled when active.']
];
const faqLd={'@context':'https://schema.org','@type':'FAQPage',mainEntity:faq.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))};
const asOf=`As of ${lastChecked}, from ${nVer} verified plan rows`;
const meth=`<a href="/methodology">How we calculate this</a>`;
const SCENARIOS=[{mau:1000,sso:0,label:'1k users · no SSO'},{mau:10000,sso:1,label:'10k users · 1 SSO'},{mau:50000,sso:5,label:'50k users · 5 SSO'},{mau:100000,sso:10,label:'100k users · 10 SSO'}];

function rankScenario(mau,sso,opts={}){
  return plans.map(p=>{const e=estimate(p,mau,sso,opts);return e&&e.total!=null?{p,e}:null}).filter(Boolean).sort((a,b)=>a.e.total-b.e.total);
}
// RT-20261031-60: competition ranking. Equal totals share a rank; a plan is never "#N" or "$0/yr more" against a plan at the same price.
const EPS=1e-9;
const rankPos=(r,z)=>1+r.filter(x=>x.e.total<z.e.total-EPS).length;
const tieCount=(r,z)=>r.filter(x=>Math.abs(x.e.total-z.e.total)<EPS).length;
// RT-20261031-57: per-SSO-user vendors and the disclosure that must accompany every SSO result
const isFed=p=>p.federated_per_mau!=null||p.sso_saml_per_mau!=null;
const FED_PLANS=plans.filter(p=>p.status==='verified'&&isFed(p));
const FED_VIDS=[...new Set(FED_PLANS.map(p=>p.vendor_id))];
const FED_NAMES=FED_VIDS.map(id=>P[id].name);
const FED_RATES=[...new Set(FED_PLANS.map(p=>p.federated_per_mau??p.sso_saml_per_mau))];
const FED_FREE=[...new Set(FED_PLANS.map(p=>p.federated_free??p.sso_saml_included_mau??0))];
const FED_SHORT=`assumes ${FED_PER_CONN} SSO users per connection`;
const FED_SENS=[1000,2000];
const listJoin=a=>a.length<2?a.join(''):a.slice(0,-1).join(', ')+' and '+a.at(-1);
const FED_NOTE=`<span class="fed-note" data-fed-assumption>SSO users: ${esc(listJoin(FED_NAMES))} bill SAML/OIDC per SSO user, not per connection (first ${FED_FREE.join('/')} free, then ${FED_RATES.map(usd).join('/')} per SSO user a month). Their SSO results here assume ${FED_PER_CONN} SSO users per connection (5 connections = ${(5*FED_PER_CONN).toLocaleString('en-US')} SSO users). <a href="/methodology#sso-users">See how 1,000 or 2,000 per connection changes the result</a> or <a href="/calculator/">set your own</a>.</span>`;
// RT-20261031-56: B2B organizations / tenants. Every SSO answer states the org assumption; org fees are printed where they change a total.
const ORG_SHORT='assumes 1 customer organization per SSO connection';
const SCIM_SHORT='assumes every SCIM customer is also an SSO customer';
const orgPublishes=p=>p.status==='verified'&&(p.org_max!=null||p.org_extra_mo!=null||p.org_addon_mo!=null||p.org_member_limit!=null);
const ORG_VIDS=[...new Set(plans.filter(orgPublishes).map(p=>p.vendor_id))];
const ORG_NAMES=ORG_VIDS.map(id=>P[id].name);
const pid=id=>plans.find(p=>p.id===id)||{};
const CK=pid('clerk-pro'),A0F=pid('auth0-free'),A0E=pid('auth0-essentials'),DSF=pid('descope-free'),DSP=pid('descope-pro'),DSG=pid('descope-growth'),KF=pid('kinde-free'),KP=pid('kinde-pro'),KS=pid('kinde-scale'),LP=pid('logto-pro');
const ORG_TERMS=`Clerk: ${CK.org_included} retained orgs and ${CK.org_member_limit} members per org free, then the ${CK.org_addon_name} at ${usd(CK.org_addon_mo)}/mo (${usd(CK.org_addon_mo_annual)} billed annually) plus ${usd(CK.org_bands[0].rate)}→${usd(CK.org_bands.at(-1).rate)} per extra org; Auth0: Free ${A0F.org_max} and B2C plans ${A0E.org_max} organizations, B2B plans unlimited; Descope: ${DSF.org_max} / ${DSP.org_included} / ${DSG.org_included} active tenants, then ${usd(DSP.org_extra_mo)} per tenant on Pro and Growth (Free has no overage); Kinde: ${KF.org_max} orgs on Free, ${KP.org_included} included on paid plans then ${usd(KP.org_extra_mo)}→${usd(KS.org_extra_mo)} per org; Logto: Organizations add-on ${usd(LP.org_addon_mo)}/mo`;
const ORG_NOTE=`<span class="org-note" data-org-assumption>B2B: every SSO result ${ORG_SHORT} (members = its SSO users, ${FED_PER_CONN} by default). Published org caps and fees are applied, e.g. Clerk’s ${usd(CK.org_addon_mo)}/mo ${esc(CK.org_addon_name)} above ${CK.org_member_limit} members or ${CK.org_included} orgs, Auth0 Free’s ${A0F.org_max}-org cap, Descope ${usd(DSP.org_extra_mo)}/tenant over ${DSP.org_included}; plans over a cap are left out. <a href="/methodology#b2b-orgs">All org terms</a> · <a href="/calculator/">set your org count</a>.</span>`;
const NEGTEST_ORG=process.env.NEGTEST_ORG==='1'; // build-guard negative test: drops org text from answers, the build must fail
const ORG_AUDIT=[]; // {where,text,zs}: every SSO answer clause and the results it prices
const NEGTEST_ORG_FEE=process.env.NEGTEST_ORG==='fee'; // negative test 2: keeps the assumption, drops the fee amounts
const orgBits=zs=>NEGTEST_ORG_FEE?'':zs.filter(z=>z&&z.e.org>EPS).map(z=>`${z.p.vendor} ${z.p.plan} ${usd(z.e.total)}/mo includes ${usd(z.e.org)}/mo ${z.e.orgLabel}`).join(', ');
const orgClause=(zs,sso)=>{if(NEGTEST_ORG||!sso||!zs.some(z=>z&&ORG_VIDS.includes(z.p.vendor_id)))return '';const b=orgBits(zs);return ` (${ORG_SHORT}${b?': '+b:''})`};
const auditOrg=(where,text,zs,sso)=>{if(sso)ORG_AUDIT.push({where,text,zs:zs.filter(Boolean)});return text};
/** Sensitivity of a vendor's cheapest plan to the SSO-users-per-connection assumption, computed from the ledger. */
const fedSens=(vid,mau,sso)=>FED_SENS.map(per=>{const r=rankScenario(mau,sso,{federated_mau:sso*per});const z=r.find(x=>x.p.vendor_id===vid);return z?{per,z,pos:rankPos(r,z),n:r.length}:null}).filter(Boolean);
const fedSensText=(vid,mau,sso)=>fedSens(vid,mau,sso).map(x=>`at ${x.per.toLocaleString('en-US')} per connection ${usd(x.z.e.total)}/mo, #${x.pos} of ${x.n}`).join('; ');
const heroSc=SCENARIOS[2];
const heroRank=rankScenario(heroSc.mau,heroSc.sso);
// Max-minus-min spread across all plans: methodology only (RT-20261031-59). Nobody chooses between the priciest and cheapest plan.
const spreadGap=heroRank.length>=2?heroRank.at(-1).e.total-heroRank[0].e.total:0;
// RT-20261031-59: the hero is a capturable number. A named popular plan (Clerk Pro) vs the cheapest verified plan that
// publishes MFA (mfa_available===true, read on the vendor's page) at the same 100k users, MFA required, no SSO.
const HERO={pop:'clerk-pro',mau:100000};
const heroPopPlan=plans.find(p=>p.id===HERO.pop),heroPop=estimate(heroPopPlan,HERO.mau,0,{mfa:true});
const heroAlts=rankScenario(HERO.mau,0,{mfa:true}).filter(x=>x.p.mfa_available===true&&x.p.vendor_id!==heroPopPlan.vendor_id);
const heroCheap=heroAlts[0];
const heroGap=heroPop.total-heroCheap.e.total;
if(!(heroGap>0)){console.error('Hero guard: popular plan is not dearer than the cheapest MFA plan; rewrite the hero');process.exit(1)}
const heroCheapCaveat=heroCheap.p.sso_bands?`; SSO is billed separately from ${usd(heroCheap.p.sso_bands[0].rate)} per connection`:'';
const heroCheapPrice=heroCheap.e.total===0?'$0':`${usd(heroCheap.e.total)}/mo`;
const heroSentence=`At ${kfmt(HERO.mau)} users, ${heroPopPlan.vendor} ${heroPopPlan.plan} lists ${usd(heroPop.total)}/mo; ${heroCheap.p.vendor} ${heroCheap.p.plan}, the cheapest verified plan that includes MFA at that size, lists ${heroCheapPrice} (${yr(heroGap)}/yr less)`;

const signup=(id='s',hook='Get the weekly auth ledger')=>`<form class="signup" action="${FORM_ACTION}" method="post" data-form="kit"><label for="${id}-e" class="skip">Email</label><input id="${id}-e" type="email" name="email_address" required placeholder="you@company.com" autocomplete="email"><button class="btn" type="submit">${esc(hook)}</button></form><p class="note">Weekly: every auth price change we confirmed, SSO fee moves, and the cheapest verified plan for 10k and 50k users. Free; unsubscribe in one click. Sent via Kit · <a href="/privacy">Privacy</a>.</p>`;
const mailBox=(id,h,hook)=>`<section class="mail" id="ledger-mail"><div><div class="eyebrow">Free weekly ledger</div><h2 class="h3">${esc(h)}</h2></div><div>${signup(id,hook)}</div></section>`;
const trust=`<ul class="trust"><li><b>Source-linked</b> every price links the vendor’s own page</li><li><b>Independent</b> no vendor pays for placement</li><li><b>Checked weekly</b> a script diffs every source page</li><li><b>No paid rankings</b> ordered by computed cost only</li></ul>`;

// ---- Home
page({file:'index.html',title:`${NAME} — auth pricing that scales without the surprise bill`,desc:`${heroSentence}. Updated ${lastChecked}: ${vendors.length} vendors, ${nVer} verified plans, MAU/MRU and SSO fees counted, every price sourced.`,ld:[ORG_LD,faqLd,{'@context':'https://schema.org','@type':'Dataset',name:`${NAME} auth price ledger`,description:'Auth and identity list prices with source URL, check date and verification status per row.',url:SITE+'/',dateModified:lastChecked,license:'https://creativecommons.org/licenses/by/4.0/',creator:{'@id':SITE+'/#org'},distribution:[{'@type':'DataDownload',encodingFormat:'application/json',contentUrl:SITE+'/api/plans.json'},{'@type':'DataDownload',encodingFormat:'text/csv',contentUrl:SITE+'/api/plans.csv'}]}],body:`
<section class="hero"><div class="hero-grid"><div><div class="eyebrow">${asOf} · for the “Clerk seems pricey once you scale” moment</div><h1>${esc(heroPopPlan.vendor)} ${esc(heroPopPlan.plan)} lists ${usd(heroPop.total)}/mo at ${kfmt(HERO.mau)} users. The cheapest verified plan with MFA lists ${heroCheapPrice}: <span class="acc">${yr(heroGap)} a year</span> you could keep.</h1>
<p class="lede" data-hero-method>That plan is <a href="/vendors/${heroCheap.p.vendor_id}">${esc(heroCheap.p.vendor)} ${esc(heroCheap.p.plan)}</a> (${esc(heroCheap.p.notes.split('.')[0])}${heroCheapCaveat}). Same ${HERO.mau.toLocaleString('en-US')} users, MFA required, no SSO; ${esc(heroPopPlan.vendor)} counts retained users (MRU). Then SSO per-connection fees stack on top: ${NAME} ranks ${vendors.length} vendors on base + overage + SSO from each vendor’s own pricing page, so you see the cheaper stack before the invoice does. <a href="/methodology#hero">How this number is computed</a>.</p>
<div class="cta-row"><a class="btn" href="/calculator/">Rank plans for my MAU + SSO</a><a class="btn ghost" href="/pro">See Pro</a></div>
<p class="micro">Free · no signup · no card. List prices only — we never invent a number.</p></div>
<aside class="check" id="check" aria-labelledby="check-h"><div class="eyebrow">Instant check · live data</div><h2 id="check-h" class="h3">What will auth cost?</h2>
<div class="filters"><label>Monthly users (MAU/MRU)<input id="k-mau" type="number" min="0" step="1000" value="50000"></label>
<label>SSO connections<input id="k-sso" type="number" min="0" step="1" value="5"></label></div>
<div id="k-out" class="kout" aria-live="polite"></div>
<form class="signup inline" action="${FORM_ACTION}" method="post" data-form="kit"><label for="k-e" class="skip">Email</label><input id="k-e" type="email" name="email_address" required placeholder="you@company.com" autocomplete="email"><button class="btn ghost" type="submit">Email me weekly</button></form>
<p class="note" style="margin:0">Weekly price changes for your scenario. Unsubscribe in one click · <a href="/privacy">Privacy</a>.</p></aside></div>
${trust}</section>
<section class="proof" aria-label="What backs these numbers"><div><b>${nVer}</b><span>plan rows verified on official pages</span></div><div><b>${vendors.length}</b><span>vendors, every row source-linked</span></div><div><b>${changes.length}</b><span>dated entries in the <a href="/changes">price log</a></span></div><div><b>${lastChecked}</b><span>last full check · <a href="/methodology">method</a></span></div></section>
<div class="kpis">${SCENARIOS.map(s=>{const r=rankScenario(s.mau,s.sso);const z=r[0];if(!z)return '';const t=tieCount(r,z);const fed=s.sso&&isFed(z.p);return `<div><b>${z.e.total===0?'$0':usd(z.e.total)+'/mo'}${fed?'†':''}</b><span>cheapest · ${esc(s.label)}: ${t>1?`${z.e.total===0?`${t} plans tie at $0`:`${t} plans tie`}`:`${esc(z.p.vendor)} ${esc(z.p.plan)}`} (${r.length} ranked)</span></div>`}).join('')}</div>
<p class="note">${asOf}. Verified rows only; plans that cannot price the scenario are omitted. † ${FED_NOTE} ${ORG_NOTE} ${meth}.</p>
<section class="essential"><h2>Auth bills hide in the unit.</h2><div class="grid3">
<div><h3>MAU vs MRU</h3><p>Clerk’s MRU skips one-day users, so it is never higher than your MAU. Pricing Clerk on your MAU count overstates its bill unless you count only retained users.</p></div>
<div><h3>Per-connection SSO</h3><p>WorkOS and Stytch charge per enterprise connection ($125 entry). Clerk includes one on Pro then $75. Kinde Plus includes unlimited SSO in the base.</p></div>
<div><h3>Silent fee starts</h3><p>Clerk Directory Sync billing begins 2027-01-01 — logged in our <a href="/changes">price log</a> before it hits invoices.</p></div>
</div></section>
<h2>The ledger</h2><p class="mut">Monthly USD list prices. Sorted by base fee; use the calculator for your MAU + SSO scenario.</p>
<div class="filters"><label>Search<input id="q" type="search" placeholder="Vendor or plan"></label>
<label class="chk"><input id="vo" type="checkbox" checked> Verified only</label>
<span id="count" class="note" style="margin-left:auto"></span></div>
<div class="tbl" style="max-height:620px"><table id="plans"><thead><tr>
<th>Vendor</th><th>Plan</th><th class="n">Base / mo</th><th class="n">Included users</th><th>Unit</th><th class="n">Overage</th><th class="n">SSO incl.</th><th class="n">SSO extra</th><th>Status</th><th>Source · checked</th>
</tr></thead><tbody>${plans.map(p=>`<tr data-q="${esc((p.vendor+' '+p.plan).toLowerCase())}" data-status="${p.status}"><td>${esc(p.vendor)}</td><td>${esc(p.plan)}</td><td class="n">${usd(p.base_mo)}${p.base_mo_annual!=null?`<br><span class="src">$${p.base_mo_annual} annual</span>`:''}</td><td class="n">${p.price_tiers?`tiers to ${kfmt(p.price_tiers.at(-1).mau)}`:(p.included_users??'—')}</td><td>${esc(p.user_unit||'—')}</td><td class="n">${p.price_tiers?'next tier':(p.overage_per_user!=null?usd(p.overage_per_user):(p.overage_per_1m_mau!=null?usd(p.overage_per_1m_mau)+'/1M':'—'))}</td><td class="n">${p.sso_unlimited?'∞':(p.sso_included??'—')}</td><td class="n">${p.sso_extra_mo!=null?usd(p.sso_extra_mo):(p.sso_unlimited?'$0':'—')}</td><td>${tag(p.status)}</td><td class="src"><a href="${p.source}">source</a> · ${p.checked}</td></tr>`).join('')}</tbody></table></div>
${mailBox('h','Know the week an auth price changes','Send me the weekly ledger')}
<h2>Questions</h2>${faq.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('')}`});

// ---- Calculator
page({file:'calculator/index.html',og:'calculator',title:`Auth cost calculator — MAU, MFA, SSO and SCIM | ${NAME}`,desc:'Pick MAU, MFA, enterprise SSO connections and SCIM / Directory Sync customers. See every verifiable plan ranked by monthly cost. Shareable URL and embed snippet.',body:`
<section class="hero"><div class="eyebrow">Cost calculator · ${asOf}</div><h1>Your MAU, MFA, and SSO count in — your bill out.</h1>
<p class="lede">Rank verified plans by estimated monthly cost from published list prices only. The URL updates as you type; copy it or embed the calculator.</p></section>
<div class="panel" id="calc"><div class="filters" style="margin:0">
<label>Monthly users (MAU/MRU)<input id="c-mau" type="number" min="0" step="1000" value="50000"></label>
<label>SSO connections<input id="c-sso" type="number" min="0" step="1" value="5"></label>
<label>SSO users per connection (Firebase / Identity Platform, Supabase, Cognito bill per SSO user)<input id="c-fpc" type="number" min="0" step="50" value="${FED_PER_CONN}"></label>
<label>Customers needing SCIM / Directory Sync (of your SSO customers)<input id="c-scim" type="number" min="0" step="1" value="0"></label>
<label>Organizations / tenants (0 = B2C; at least 1 per SSO connection)<input id="c-org" type="number" min="0" step="1" value="0"></label>
<label>Members per organization (blank = SSO users per connection)<input id="c-mpo" type="number" min="0" step="1" placeholder="${FED_PER_CONN}"></label>
<label class="chk"><input id="c-mfa" type="checkbox"> Require MFA</label>
<label class="chk"><input id="c-vo" type="checkbox" checked> Verified only</label>
</div>
<p class="note" style="margin:12px 0 0">${FED_NOTE} ${ORG_NOTE}</p>
<p class="note" style="margin:8px 0 0">MFA adds a fee only when the vendor publishes one (e.g. Logto $48/mo). Plans that publish “no MFA” are omitted when MFA is required — we never invent an MFA price.</p></div>
<div class="save" id="c-save" aria-live="polite"></div>
<div class="tbl" style="margin-top:14px"><table><thead><tr><th class="n">#</th><th>Plan</th><th class="n">Base</th><th class="n">Users</th><th class="n">SSO</th><th class="n">SCIM</th><th class="n">MFA</th><th class="n">Orgs</th><th class="n">Monthly</th><th class="n">Annual</th><th>Notes</th><th scope="col"><span class="skip">Link</span></th></tr></thead><tbody id="rank"><tr><td colspan="12">Loading…</td></tr></tbody></table></div>
<p class="note">SCIM column: SCIM / Directory Sync fees for the SSO customers that need it (${SCIM_SHORT}): WorkOS and Clerk bill it as a separate connection (Clerk from ${pid('clerk-pro').scim_billing_starts}), Stytch shares its ${pid('stytch-payg').scim_included} included connections between SSO and SCIM, Auth0 (Free and B2B) and Descope Growth include it. Plans without a published SCIM price drop out when SCIM &gt; 0. <a href="/guides/enterprise-sso-cost#scim">SCIM by vendor</a>.</p>
<p class="note">Orgs column: B2B organization / tenant fees where published (Clerk B2B Authentication add-on + per-MRO bands, Descope and Kinde per-tenant fees, Logto Organizations add-on); plans over a published org cap are left out. Excludes SMS, custom domains, M2M token overages, taxes and negotiated discounts. Plans that cannot price the scenario (e.g. Auth0 above its top published MAU tier — 50k B2C, 20k B2B — which is Enterprise / contact sales) are omitted. ${meth}.</p>
<div class="panel calc-share" id="c-share-box">
<h2 class="h3" style="margin-top:0">Share or embed this scenario</h2>
<div class="row"><button class="btn" type="button" id="c-copy" data-grow="calculator_share">Copy share link</button> <button class="btn ghost" type="button" id="c-copy-embed" data-grow="calculator_embed">Copy embed snippet</button> <span class="note" id="c-sh" role="status"></span></div>
<label>Shareable URL<textarea id="c-url" readonly rows="2" aria-label="Shareable calculator URL"></textarea></label>
<label>Embed iframe<textarea id="c-embed" readonly rows="3" aria-label="Embeddable iframe snippet"></textarea></label>
<p class="note"><a id="c-back" href="/calculator/">Open full calculator</a> · <a href="/">Back to the AuthCost ledger</a></p>
</div>
<div class="panel"><h2 class="h3">Keep this estimate</h2><p>Pro watches the plans in this result and emails you when one moves, plus CSV export. <a href="/pro">See Pro</a>.</p></div>
<script>try{if(new URLSearchParams(location.search).get('embed')==='1')document.body.classList.add('embed')}catch(e){}</script>`});

// ---- Shared MAU-tier helpers (search/GEO pages)
const MAJOR=['clerk','auth0','cognito','workos','stytch','kinde','supabase','logto','firebase','descope'];
const MAU_TIERS=[10000,50000,100000];
const cmpSlug=(x,y)=>MAJOR.indexOf(x)<MAJOR.indexOf(y)?`${x}-vs-${y}`:`${y}-vs-${x}`;
const bestFor=(vid,mau,sso=0)=>rankScenario(mau,sso).find(z=>z.p.vendor_id===vid)||null;
const star=p=>p.user_unit==='token'?'*':'';
const cell=(z,hl)=>z?`<td class="n"${hl?' style="font-weight:600"':''}>${usd(z.e.total)}${star(z.p)}<br><span class="src">${esc(z.p.plan)}</span></td>`:'<td class="n" title="No verifiable published price for this scenario">—</td>';
const tokNote='* Logto Pro bills access tokens, not MAU (50k tokens included, then $0.08 per 100) — the figure is base fee only; token overage depends on your usage.';
const ctaRow=(mau=50000,sso=0)=>`<div class="cta-row"><a class="btn" href="/calculator/?mau=${mau}&sso=${sso}" data-grow="seo_calc_cta">Price my exact MAU + SSO</a><a class="btn ghost" href="/pro" data-grow="seo_pro_cta">Get alerts when prices move (Pro)</a></div>`;
const SH='/guides/self-hosted-auth-cost';const shLink=`<a href="${SH}">self-hosting Better Auth / Auth.js instead</a>`;
const vLinks=v=>`<p class="note">More on ${esc(v.name)}: <a href="/vendors/${v.id}">${esc(v.name)} pricing</a> · <a href="/alternatives/${v.id}">cheaper ${esc(v.name)} alternatives</a> · ${shLink} · ${MAJOR.filter(x=>x!==v.id&&P[x]).map(x=>`<a href="/compare/${cmpSlug(v.id,x)}">vs ${esc(P[x].name)}</a>`).join(' · ')}</p>`;

// RT-20261031-56: org/tenant terms table + worked example, shared by /methodology and /guides/enterprise-sso-cost
const orgTermTxt=p=>{if(p.org_member_limit!=null)return p.org_addon_mo!=null&&p.org_addon_available!==false?`${p.org_included} ${p.org_counts}s and ${p.org_member_limit} members per org free; above either, ${p.org_addon_name} ${usd(p.org_addon_mo)}/mo (${usd(p.org_addon_mo_annual)} annual) with ${p.org_included} included, then ${p.org_bands.map(b=>`${usd(b.rate)} (${b.from.toLocaleString('en-US')}${b.to?'–'+b.to.toLocaleString('en-US'):'+'})`).join(', ')} per org`:`${p.org_included} ${p.org_counts}s and ${p.org_member_limit} members per org; beyond that the paid add-on is needed (priced on Pro)`;
  if(p.org_max!=null)return `Cap: ${p.org_max} ${p.org_counts||'organization'}s${p.org_max===0?' (not available)':''}`;
  if(p.org_extra_mo!=null)return `${p.org_included} ${p.org_counts}s included, then ${usd(p.org_extra_mo)} each`;
  if(p.org_addon_mo!=null)return `${p.org_addon_name} ${usd(p.org_addon_mo)}/mo, unlimited organizations`;
  return p.org_published===false?'No organization fee or cap printed':'Unlimited organizations'};
const ORG_PLANS=plans.filter(p=>p.status==='verified'&&p.org_source);
const orgTable=()=>`<div class="tbl"><table><thead><tr><th>Plan</th><th>Organizations / tenants (published)</th><th>Source · checked</th></tr></thead><tbody>${ORG_PLANS.map(p=>`<tr><td><a href="/vendors/${p.vendor_id}">${esc(p.vendor)}</a> ${esc(p.plan)}</td><td style="white-space:normal">${esc(orgTermTxt(p))}</td><td class="src"><a href="${p.org_source}" rel="noopener">source</a> · ${p.org_checked}</td></tr>`).join('')}</tbody></table></div><p class="note">Clerk counts monthly retained organizations (2+ members, one a retained user that month); Descope counts active tenants (2+ users, one logs in that month); Kinde counts monthly active organizations (orgs with a single active user are not counted). Cognito, Firebase / Identity Platform and Supabase Auth publish no per-organization fee, so orgs add $0 there.</p>`;
const ORG_EX=[{mau:10000,sso:1,org:0,label:'10k users · 1 SSO (1 org, 200 members)'},{mau:10000,sso:1,org:0,mpo:20,label:'10k users · 1 SSO, 20 members per org'},{mau:10000,sso:0,org:150,label:'10k users · 150 orgs, no SSO'},{mau:50000,sso:5,org:150,label:'50k users · 5 SSO · 150 orgs'}];
const ORG_EX_V=['clerk','auth0','descope','kinde','workos','stytch'];
const orgExTable=()=>`<div class="tbl"><table><thead><tr><th>Scenario</th>${ORG_EX_V.map(v=>`<th class="n">${esc(P[v].name)}</th>`).join('')}</tr></thead><tbody>${ORG_EX.map(x=>{const r=rankScenario(x.mau,x.sso,{orgs:x.org,org_members:x.mpo});return `<tr><td>${esc(x.label)}</td>${ORG_EX_V.map(v=>{const z=r.find(y=>y.p.vendor_id===v);return z?`<td class="n">${usd(z.e.total)}${z.e.org>EPS?`<br><span class="src">incl. ${usd(z.e.org)} org</span>`:''}<br><span class="src">${esc(z.p.plan)}</span></td>`:'<td class="n" title="No verified plan fits this many orgs / users / SSO connections">—</td>'}).join('')}</tr>`}).join('')}</tbody></table></div><p class="note">Cheapest verified plan per vendor, monthly USD list price incl. org fees. “—” = no verified self-serve plan can hold the scenario (org cap, MAU tier or SSO limit). Members per org default to ${FED_PER_CONN} (the SSO-users-per-connection figure), capped at users ÷ orgs. <a href="/calculator/?mau=10000&sso=0&org=150">Try 150 orgs in the calculator</a>.</p>`;
const B2B_ANS=(()=>{const a=rankScenario(10000,1),c=a.find(z=>z.p.vendor_id==='clerk'),o=a.find(z=>z.p.vendor_id==='auth0');const c20=rankScenario(10000,1,{org_members:20}).find(z=>z.p.vendor_id==='clerk');const r150=rankScenario(10000,0,{orgs:150});const pick=v=>r150.find(z=>z.p.vendor_id===v);const ck=pick('clerk'),ds=pick('descope'),kn=pick('kinde');
  return `Yes for Clerk, Auth0, Descope, Kinde and Logto. At 10k users with 1 SSO customer (${ORG_SHORT}, ${FED_PER_CONN} members), Clerk Pro is ${usd(c.e.total)}/mo because more than ${CK.org_member_limit} members per org needs the ${CK.org_addon_name} (${usd(CK.org_addon_mo)}/mo); with ${CK.org_member_limit} or fewer members it is ${usd(c20.e.total)}/mo. Auth0 ${o.p.plan} lists ${o.e.total<EPS?'$0':usd(o.e.total)+'/mo'} but caps at ${A0F.org_max} organizations. At 10k users and 150 organizations (no SSO): Clerk ${ck.p.plan} ${usd(ck.e.total)}/mo (incl. ${usd(ck.e.org)} org fees), Descope ${ds.p.plan} ${usd(ds.e.total)}/mo (incl. ${usd(ds.e.org)}), Kinde ${kn.p.plan} ${usd(kn.e.total)}/mo (incl. ${usd(kn.e.org)}); Auth0 Free and B2C plans are out (${A0F.org_max} and ${A0E.org_max}-org caps).`})();

// RT-20261031-94: Auth0 for Startups (auth0.com/startups, read 2026-10-31; snapshot snapshots/auth0/startups-2026-10-31.txt).
// A note, never a ranking input: list prices stay in every table. Month-13 figures come from the plans.json B2B tiers.
const A0S={src:'https://auth0.com/startups',checked:'2026-10-31',plan:'B2B Professional',mau:100000,conns:5,months:12,
  elig:['Venture-backed with less than $5M in funding','Less than $1M in annual recurring revenue','Less than two years from the date of incorporation'],
  excl:'Offer not valid for existing paid Auth0/Okta customers (including both enterprise and paid self service plans) or startups that have previously been members of the Auth0 for Startups program.'};
const A0S_SSO=3,A0S_MAUS=[1000,5000,10000,20000,100000];
const A0S_ROWS=(()=>{const bp=pid('auth0-b2b-professional'),be=pid('auth0-b2b-essentials');return A0S_MAUS.map(m=>{const p=bp.status==='verified'?estimate(bp,m,A0S_SSO):null,e=be.status==='verified'?estimate(be,m,A0S_SSO):null;return {m,pro:p&&p.total,ess:e&&e.total,proYr:p?(bp.price_tiers.find(t=>m<=t.mau)||{}).yr:null}})})();
const a0sCliff=A0S_ROWS.filter(r=>r.pro!=null);const a0sTop=pid('auth0-b2b-professional').tier_max_mau;
const A0S_TXT=`Auth0 for Startups (${A0S.src.replace('https://','')}, read ${A0S.checked}) gives eligible startups one year of the ${A0S.plan} plan free, up to ${A0S.mau.toLocaleString('en-US')} MAU, with ${A0S.conns} Enterprise Connections, Enterprise MFA and inbound SCIM. Eligibility (Auth0’s words): ${A0S.elig.map(x=>x.replace(/^./,c=>c.toLowerCase())).join('; ')}; not valid for existing paid Auth0/Okta customers or past program members. When the ${A0S.months} months end, list price applies: ${A0S.plan} with ${A0S_SSO} SSO connections is ${a0sCliff.map(r=>`${usd(r.pro)}/mo at ${r.m.toLocaleString('en-US')} MAU`).join(', ')}; above ${a0sTop.toLocaleString('en-US')} MAU Auth0 publishes no ${A0S.plan} price (contact sales). Not eligible? Nothing changes: list prices apply from month 1. Our rankings always use list prices.`;
const a0sBox=(h='Auth0 for Startups: year 1 free if eligible, then the list-price cliff')=>`<section class="panel a0s" id="auth0-startups"><h2 class="h3">${esc(h)}</h2><p>${esc(A0S_TXT)}</p><div class="tbl"><table><thead><tr><th class="n">Your MAU</th><th class="n">Months 1–12 (eligible only)</th><th class="n">Month 13+: ${esc(A0S.plan)}, ${A0S_SSO} SSO</th><th class="n">Month 13+: B2B Essentials, ${A0S_SSO} SSO</th></tr></thead><tbody>${A0S_ROWS.map(r=>`<tr><td class="n">${r.m.toLocaleString('en-US')}</td><td class="n">$0</td><td class="n">${r.pro!=null?`${usd(r.pro)}/mo${r.proYr?`<br><span class="src">${usd(r.proYr)}/yr billed yearly</span>`:''}`:'Contact sales'}</td><td class="n">${r.ess!=null?usd(r.ess)+'/mo':'Contact sales'}</td></tr>`).join('')}</tbody></table></div><p class="note">Eligibility, quoted from <a href="${A0S.src}" rel="noopener">auth0.com/startups</a> (read ${A0S.checked}): ${A0S.elig.map(esc).join(' · ')}. ${esc(A0S.excl)} Month-13 figures are Auth0’s published B2B MAU tiers (billed at the next tier up; yearly = 11× monthly) from our <a href="/vendors/auth0">Auth0 ledger</a>. This is a promotion, not a list price: it never changes our rankings.</p></section>`;
// RT-20261031-93: SCIM / Directory Sync. Terms read on each vendor's pricing page 2026-10-31 (snapshots/scim/).
const NEGTEST_SCIM=process.env.NEGTEST_SCIM==='1'; // build-guard negative test: prints the SSO-only figure as the SCIM answer, the build must fail
const SCIM_AUDIT=[]; // {where,mau,sso,scim,zs}: every answer clause that states a SCIM figure
const SC={mau:10000,sso:3,scim:3,label:'10k users · 3 SSO + 3 SCIM'};
const scimBit=z=>{const fee=NEGTEST_SCIM?0:z.e.scim,tot=NEGTEST_SCIM?z.e.total-z.e.scim:z.e.total;return `${z.p.vendor} ${z.p.plan} ${usd(tot)}/mo incl. ${usd(fee)}/mo SCIM${z.p.scim_billing_starts?` (Directory Sync billed from ${z.p.scim_billing_starts}, $0 before)`:''}${z.e.org>EPS?` and ${usd(z.e.org)}/mo ${z.e.orgLabel}`:''}`};
const auditScim=(where,mau,sso,scim,zs,text)=>{SCIM_AUDIT.push({where,mau,sso,scim,zs:zs.filter(Boolean),text});ORG_AUDIT.push({where,text,zs:zs.filter(Boolean)});return text};
const scimTermTxt=p=>{const m=p.scim_model,inc=p.scim_included||0;
  if(m==='separate')return `Separate from SSO: ${inc} included, then ${p.scim_bands.map(b=>`${usd(b.rate)} (${b.from}–${b.to})`).join(', ')} per connection${p.scim_billing_starts?`; billed from ${p.scim_billing_starts}`:''}`;
  if(m==='pooled')return `Shared with SSO: ${inc} SSO-or-SCIM connections included, then ${usd(p.scim_extra_mo)} each`;
  if(m==='included')return p.vendor_id==='auth0'?'Inbound SCIM included (uses the customer’s enterprise connection), no separate fee':'Included, no per-connection SCIM fee printed';
  if(m==='coming_soon')return 'Coming soon (not priced)';
  if(m==='not_published')return 'Not on the pricing page';
  return 'Not offered on this plan'};
const scimModelOf=vid=>{const ms=plans.filter(p=>p.vendor_id===vid&&p.status==='verified').map(p=>p.scim_model);for(const m of ['separate','pooled','included','coming_soon','none','not_published'])if(ms.includes(m))return m;return 'not_published'};
const SCIM_MODEL_LBL={separate:'Separate connection (2nd fee per customer)',pooled:'Pooled with SSO connections',included:'Included with enterprise SSO',coming_soon:'Coming soon',none:'Higher plan only / not offered',not_published:'Not published'};
const SCIM_PLANS=plans.filter(p=>p.status==='verified'&&p.scim_source);
const scimTable=()=>`<div class="tbl"><table><thead><tr><th>Plan</th><th>SCIM / Directory Sync (published)</th><th>Source · checked</th></tr></thead><tbody>${SCIM_PLANS.map(p=>`<tr><td><a href="/vendors/${p.vendor_id}">${esc(p.vendor)}</a> ${esc(p.plan)}</td><td style="white-space:normal">${esc(scimTermTxt(p))}. <span class="src">${esc(p.scim_note)}</span></td><td class="src"><a href="${p.scim_source}" rel="noopener">source</a> · ${p.scim_checked}</td></tr>`).join('')}</tbody></table></div>`;
// Scalekit (SSO + SCIM vendor, not a full ledger row yet): reference figures from scalekit.com/pricing/auth-for-saas read 2026-10-31
const SK={src:'https://www.scalekit.com/pricing/auth-for-saas',checked:'2026-10-31',freeMau:25000,freeOrgs:25,growth:99,growthMau:100000,perUser:0.05,orgIncl:100,perOrg:1,bands:[{from:2,to:15,rate:60},{from:16,to:30,rate:45},{from:31,to:50,rate:35},{from:51,to:100,rate:30}]};
const skLadder=n=>{let c=0;for(let i=2;i<=n;i++){const b=SK.bands.find(x=>i>=x.from&&i<=x.to);if(!b)return null;c+=b.rate}return c};
const skCost=(mau,sso,scim=0)=>{scim=Math.min(scim,sso);if(mau<=SK.freeMau&&sso<=1&&scim<=1&&sso<=SK.freeOrgs)return {plan:'Free',total:0,scim:0};const a=skLadder(sso),b=skLadder(scim);if(a==null||b==null)return null;const users=Math.max(0,mau-SK.growthMau)*SK.perUser,orgs=Math.max(0,sso-SK.orgIncl)*SK.perOrg;return {plan:'Growth',total:SK.growth+users+orgs+a+b,scim:b}};
const scimRank=(mau=SC.mau,sso=SC.sso,scim=SC.scim)=>rankScenario(mau,sso,{scim});
const scimBest=(mau=SC.mau,sso=SC.sso,scim=SC.scim)=>{const r=scimRank(mau,sso,scim);const seen=new Set(),out=[];for(const z of r){if(seen.has(z.p.vendor_id))continue;seen.add(z.p.vendor_id);out.push(z)}return out};
const SCIM_NOPRICE=()=>{const have=new Set(scimBest().map(z=>z.p.vendor_id));return vendors.filter(v=>!have.has(v.id))};
const scimWhy=v=>{const m=scimModelOf(v.id);return m==='not_published'?'no SCIM on the pricing page':m==='coming_soon'?'SCIM coming soon':m==='none'?'SCIM not on a plan that fits':'no plan fits'};
const scimPair=(where,ids)=>{const b=scimBest();const zs=ids.map(id=>b.find(z=>z.p.vendor_id===id)||null);const bits=ids.map((id,i)=>zs[i]?scimBit(zs[i]):`${P[id].name}: no SCIM price (${scimWhy(P[id])})`);return auditScim(where,SC.mau,SC.sso,SC.scim,zs,`At ${SC.label} customers (${SCIM_SHORT}; ${ORG_SHORT}): ${bits.join('; ')}.`)};
const SCIM_ANS=(where)=>{const b=scimBest();const sk=skCost(SC.mau,SC.sso,SC.scim);const no=SCIM_NOPRICE();
  return auditScim(where,SC.mau,SC.sso,SC.scim,b,`At ${SC.label} customers (${SCIM_SHORT}; ${ORG_SHORT}), cheapest verified plan per vendor: ${b.map(scimBit).join('; ')}. WorkOS bills SSO and Directory Sync as separate connections, so a customer on both is two connections; Stytch’s ${pid('stytch-payg').scim_included} included connections are shared between SSO and SCIM. Not priceable with SCIM: ${no.map(v=>`${v.name} (${scimWhy(v)})`).join(', ')}.${sk?` Reference, not in the ledger: Scalekit ${sk.plan} ${usd(sk.total)}/mo with ${usd(sk.scim)}/mo for SCIM (first SSO and first SCIM connection free, then ${usd(SK.bands[0].rate)} each; read ${SK.checked}).`:''}`)};
// ---- Vendors
const topTier=vid=>{const t=plans.filter(p=>p.vendor_id===vid&&p.price_tiers).map(p=>p.tier_max_mau);return t.length?Math.max(...t):null};
const noPrice=(v,m)=>{const t=topTier(v.id);return t&&m>t?`Enterprise only (contact sales) — top published tier is ${kfmt(t)} MAU`:'no published self-serve price'};
const tierTables=ps=>{const tp=ps.filter(p=>p.price_tiers);if(!tp.length)return '';const ms=[...new Set(tp.flatMap(p=>p.price_tiers.map(t=>t.mau)))].sort((a,b)=>a-b);
  return `<h2>Published MAU tiers (monthly / yearly)</h2><div class="tbl"><table><thead><tr><th class="n">MAU up to</th>${tp.map(p=>`<th class="n">${esc(p.plan)}</th>`).join('')}</tr></thead><tbody>${ms.map(m=>`<tr><td class="n">${m.toLocaleString('en-US')}</td>${tp.map(p=>{const t=p.price_tiers.find(x=>x.mau===m);return t?`<td class="n">$${t.mo.toLocaleString('en-US')}/mo<br><span class="src">$${t.yr.toLocaleString('en-US')}/yr</span></td>`:`<td class="n" title="Not offered at this tier">${p.tier_unavailable_from&&m>=p.tier_unavailable_from?'Not available':(m>p.tier_max_mau?'Contact sales':'—')}</td>`}).join('')}</tr>`).join('')}</tbody></table></div><p class="note">Usage between tiers is billed at the next tier up. Above the last tier: Enterprise, contact sales. Source: ${[...new Set(tp.map(p=>p.source))].map(u=>`<a href="${u}" rel="noopener">${esc(u.replace(/^https?:\/\//,''))}</a>`).join(', ')}, checked ${tp[0].checked}.</p>`};
for(const v of vendors){
  const ps=plans.filter(p=>p.vendor_id===v.id);
  const ranks=SCENARIOS.map(s=>{const r=rankScenario(s.mau,s.sso);const best=r.find(x=>x.p.vendor_id===v.id);const overall=r[0];
    if(!best) return `<li>${esc(s.label)}: no verifiable plan for this scenario.</li>`;
    const pos=rankPos(r,best),t=tieCount(r,best);
    let txt;
    if(best.e.total<EPS) txt=t>1?`${esc(best.p.plan)} lists $0/mo: tie at $0 with ${t-1} other plan${t-1>1?'s':''}`:`${esc(best.p.plan)} lists $0/mo, the only free plan of ${r.length}`;
    else if(pos===1) txt=`${esc(best.p.plan)} at ${usd(best.e.total)}/mo is the cheapest of ${r.length}${t>1?` (tied with ${t-1} other plan${t-1>1?'s':''})`:''}`;
    else txt=`${esc(best.p.plan)} at ${usd(best.e.total)}/mo ranks #${pos}${t>1?' (tied)':''} of ${r.length}, ${yr(best.e.total-overall.e.total)}/yr more than ${esc(overall.p.vendor)} ${esc(overall.p.plan)}`;
    txt+=orgClause([best,overall],s.sso);
    if(s.sso&&isFed(best.p)) txt+=` (${FED_SHORT}; ${fedSensText(v.id,s.mau,s.sso)})`;
    else if(s.sso&&isFed(overall.p)&&pos>1) txt+=` (${esc(overall.p.vendor)}’s SSO ${FED_SHORT})`;
    auditOrg(`vendors/${v.id}`,txt,[best,overall],s.sso);
    return `<li><b>${esc(s.label)}:</b> ${txt}.</li>`;
  }).join('');
  page({file:`vendors/${v.id}.html`,og:'home',title:`${v.name} pricing — auth cost | ${NAME}`,desc:`${v.name} auth pricing with MAU/MRU and SSO fees, ranked against ${vendors.length-1} other vendors. Source checked ${v.checked}.`,body:`
<section class="hero"><div class="eyebrow">Vendor</div><h1>${esc(v.name)}</h1>
<p class="lede">Billing unit: <b>${esc(v.billing_unit)}</b> — ${esc(v.billing_unit_note)} Source: <a href="${v.source}" rel="noopener">${esc(v.source.replace(/^https?:\/\//,''))}</a>, checked ${v.checked}. <a href="${aff(v.id)}" rel="noopener">Visit ${esc(v.name)}</a></p></section>
<div class="verdict"><div class="eyebrow">Answer · ${esc(v.name)} cost by MAU (no SSO)</div><p>${MAU_TIERS.map(m=>{const b=bestFor(v.id,m);return b?`<b>${kfmt(m)} users:</b> ${usd(b.e.total)}/mo${star(b.p)} on ${esc(b.p.plan)}`:`<b>${kfmt(m)} users:</b> ${noPrice(v,m)}`}).join(' · ')}.</p><ul>${ranks}</ul><p class="note">${asOf}. ${FED_NOTE} ${ORG_NOTE} ${meth}.</p>${ctaRow()}</div>${v.id==='auth0'?'\n<p class="note" data-a0-pricing-link><b>Full bracket table:</b> <a href="/guides/auth0-pricing">Auth0 pricing 2026: what you’ll actually pay at 1k–100k MAU</a> (every plan, cost cliffs, SSO and Startups month 13).</p>\n'+a0sBox():''}
<p>${esc(v.summary)}</p>
<h2>${esc(v.name)} cost at 10k, 50k and 100k users</h2>
<div class="tbl"><table><thead><tr><th>Plan</th>${MAU_TIERS.map(m=>`<th class="n">${kfmt(m)} users</th>`).join('')}</tr></thead><tbody>${ps.map(p=>`<tr><td>${esc(p.plan)}</td>${MAU_TIERS.map(m=>{const e=estimate(p,m,0);return e&&e.total!=null?`<td class="n">${usd(e.total)}${star(p)}</td>`:'<td class="n" title="Not priceable from published figures">—</td>'}).join('')}</tr>`).join('')}</tbody></table></div>
<p class="note">Monthly USD, no SSO, list price. “—” = the vendor publishes no fixed self-serve price for that volume (custom / contact sales) or the plan caps below it. ${ps.some(p=>p.user_unit==='token')?tokNote:''}</p>
${tierTables(ps)}
${ps.some(p=>p.org_source)?`<h2>${esc(v.name)} B2B organizations / tenants</h2><ul>${ps.filter(p=>p.org_source).map(p=>`<li><b>${esc(p.plan)}:</b> ${esc(orgTermTxt(p))}. <span class="src"><a href="${p.org_source}" rel="noopener">source</a> · ${p.org_checked}</span></li>`).join('')}</ul><p class="note">SSO scenarios on this page ${ORG_SHORT}. <a href="/methodology#b2b-orgs">How org fees change the answer</a>.</p>`:''}
<h2 id="scim">${esc(v.name)} SCIM / Directory Sync</h2><ul>${ps.filter(p=>p.scim_source).map(p=>`<li><b>${esc(p.plan)}:</b> ${esc(scimTermTxt(p))}. <span class="src">${esc(p.scim_note)} <a href="${p.scim_source}" rel="noopener">source</a> · ${p.scim_checked}</span></li>`).join('')}</ul><p>${esc(scimPair(`vendors/${v.id}`,[v.id]))} <a href="/guides/enterprise-sso-cost#scim">Every vendor with SSO + SCIM</a> · <a href="/calculator/?mau=${SC.mau}&sso=${SC.sso}&scim=${SC.scim}">price your mix</a>.</p>
${vLinks(v)}
<div class="tbl"><table><thead><tr><th>Plan</th><th class="n">Base</th><th class="n">Included</th><th>Unit</th><th class="n">Overage</th><th class="n">SSO</th><th>Status</th><th>Notes</th></tr></thead>
<tbody>${ps.map(p=>`<tr><td>${esc(p.plan)}</td><td class="n">${usd(p.base_mo)}</td><td class="n">${p.included_users??'—'}</td><td>${esc(p.user_unit||'—')}</td><td class="n">${p.overage_per_user!=null?usd(p.overage_per_user):'—'}</td><td class="n">${p.sso_unlimited?'unlimited':(p.sso_included!=null?p.sso_included+' incl.':'—')}${p.sso_extra_mo!=null?' · +'+usd(p.sso_extra_mo):''}</td><td>${tag(p.status)}</td><td style="white-space:normal;min-width:220px" class="src">${esc(p.notes)}</td></tr>`).join('')}</tbody></table></div>
${mailBox('v'+v.id,`Get alerted if ${v.name} changes prices`,`Watch ${v.name} for me`)}`});
}
page({file:'vendors/index.html',title:`Auth vendors tracked | ${NAME}`,desc:`All ${vendors.length} auth vendors in ${NAME} with plan counts and sources.`,body:`<section class="hero"><div class="eyebrow">Vendors</div><h1>${vendors.length} vendors</h1></section>
<div class="tbl"><table><thead><tr><th>Vendor</th><th>Unit</th><th class="n">Plans</th><th class="n">Verified</th><th>Source · checked</th></tr></thead>
<tbody>${vendors.map(v=>{const ps=plans.filter(p=>p.vendor_id===v.id);return `<tr><td><a href="/vendors/${v.id}">${esc(v.name)}</a></td><td>${esc(v.billing_unit)}</td><td class="n">${ps.length}</td><td class="n">${ps.filter(p=>p.status==='verified').length}</td><td class="src"><a href="${v.source}">source</a> · ${v.checked}</td></tr>`}).join('')}</tbody></table></div>`});

// ---- Compare pairs (major)
const pairs=[];
for(let i=0;i<MAJOR.length;i++)for(let j=i+1;j<MAJOR.length;j++)if(P[MAJOR[i]]&&P[MAJOR[j]])pairs.push([P[MAJOR[i]],P[MAJOR[j]]]);
for(const [a,b] of pairs){
  const slug=`${a.id}-vs-${b.id}`;const b2=b;
  const bits=SCENARIOS.map(s=>{
    const r=rankScenario(s.mau,s.sso);
    const x=r.find(z=>z.p.vendor_id===a.id),y=r.find(z=>z.p.vendor_id===b.id);
    if(!x||!y) return null;
    const fz=s.sso?[x,y].find(z=>isFed(z.p)):null;
    let fedTxt='';
    if(fz){const per=FED_SENS.at(-1),rh=rankScenario(s.mau,s.sso,{federated_mau:s.sso*per});const xh=rh.find(z=>z.p.vendor_id===a.id),yh=rh.find(z=>z.p.vendor_id===b.id);
      const fv=[x,y].filter(z=>isFed(z.p)).map(z=>z.p.vendor);
      if(xh&&yh){const sign=(p,q)=>Math.abs(p-q)<EPS?0:(p<q?-1:1);const flip=sign(x.e.total,y.e.total)!==sign(xh.e.total,yh.e.total);const hw=xh.e.total<yh.e.total?xh:yh;
        fedTxt=` [${listJoin(fv)} SSO ${FED_SHORT}; at ${per.toLocaleString('en-US')} per connection: ${a.name} ${usd(xh.e.total)}/mo, ${b.name} ${usd(yh.e.total)}/mo${flip?`, so ${Math.abs(xh.e.total-yh.e.total)<EPS?'they tie':hw.p.vendor+' becomes cheaper'}`:''}]`}}
    const oTxt=orgClause([x,y],s.sso);
    if(Math.abs(x.e.total-y.e.total)<EPS) return auditOrg(`compare/${slug}`,`${a.name} and ${b.name} tie at ${x.e.total<EPS?'$0':usd(x.e.total)+'/mo'} for ${s.label}${oTxt}${fedTxt}`,[x,y],s.sso);
    const [w,l]=x.e.total<y.e.total?[x,y]:[y,x];
    return auditOrg(`compare/${slug}`,`${w.p.vendor} wins ${s.label} at ${usd(w.e.total)}/mo (${yr(l.e.total-w.e.total)}/yr less than ${l.p.vendor})${oTxt}${fedTxt}`,[x,y],s.sso);
  }).filter(Boolean);
  const answer=bits.length?`As of ${lastChecked}: ${bits.join('; ')}.`:`As of ${lastChecked}, one or both lack a verifiable plan for headline scenarios.`;
  const rows=SCENARIOS.map(s=>{
    const r=rankScenario(s.mau,s.sso);
    const x=r.find(z=>z.p.vendor_id===a.id),y=r.find(z=>z.p.vendor_id===b.id);
    const cell=z=>z?`<td class="n">${usd(z.e.total)}<br><span class="src">${esc(z.p.plan)}</span></td>`:'<td class="n">—</td>';
    return `<tr><td>${esc(s.label)}</td>${cell(x)}${cell(y)}</tr>`;
  }).join('')+(()=>{const b=scimBest();const cs=z=>z?`<td class="n">${usd(z.e.total)}<br><span class="src">${esc(z.p.plan)} · SCIM ${usd(z.e.scim)}</span></td>`:'<td class="n" title="No published SCIM price on a plan that fits">—</td>';return `<tr><td>${esc(SC.label)}</td>${cs(b.find(z=>z.p.vendor_id===a.id))}${cs(b.find(z=>z.p.vendor_id===b2.id))}</tr>`})();
  const scimTxt=scimPair(`compare/${slug}`,[a.id,b2.id]);
  page({file:`compare/${slug}.html`,og:'compare',title:`${a.name} vs ${b.name} pricing (${lastChecked.slice(0,4)}) — cost at 10k/50k/100k users | ${NAME}`,desc:`${a.name} vs ${b.name} pricing: which is cheaper at 10k, 50k and 100k users, with and without enterprise SSO, and by how much per year. Sourced list prices.`,ld:[ORG_LD,{'@context':'https://schema.org','@type':'FAQPage',mainEntity:[{'@type':'Question',name:'Which is cheaper?',acceptedAnswer:{'@type':'Answer',text:answer}},{'@type':'Question',name:'What if my SSO customers also need SCIM / Directory Sync?',acceptedAnswer:{'@type':'Answer',text:scimTxt}},{'@type':'Question',name:'Last verified?',acceptedAnswer:{'@type':'Answer',text:lastChecked}},...([a,b].some(x=>x.id==='auth0')?[{'@type':'Question',name:'Is Auth0 free for startups?',acceptedAnswer:{'@type':'Answer',text:A0S_TXT}}]:[])]}],body:`
<section class="hero"><div class="eyebrow"><a href="/compare/">Compare</a> · ${esc(a.name)} checked ${a.checked} · ${esc(b.name)} checked ${b.checked}</div><h1>${esc(a.name)} vs ${esc(b.name)}</h1>
<p class="lede"><b>Answer:</b> ${esc(answer)}</p></section>
${ctaRow()}
<h2>Cost by MAU (no SSO)</h2>
<div class="tbl"><table><thead><tr><th>Monthly users</th><th class="n">${esc(a.name)}</th><th class="n">${esc(b.name)}</th></tr></thead><tbody>${MAU_TIERS.map(m=>`<tr><td>${kfmt(m)} users</td>${cell(bestFor(a.id,m))}${cell(bestFor(b.id,m))}</tr>`).join('')}</tbody></table></div>
<h2>With enterprise SSO</h2>
<div class="tbl"><table><thead><tr><th>Scenario</th><th class="n">${esc(a.name)}</th><th class="n">${esc(b.name)}</th></tr></thead><tbody>${rows}</tbody></table></div>
<p><b>Also need SCIM?</b> ${esc(scimTxt)} <a href="/guides/enterprise-sso-cost#scim">How each vendor bills SCIM</a>.</p>
<p class="note">Cheapest verified plan per vendor, monthly USD list price. ${FED_NOTE} ${ORG_NOTE} ${[a,b].some(x=>x.id==='logto')?tokNote:''} ${meth}.</p>${[a,b].some(x=>x.id==='auth0')?'\n'+a0sBox('“Auth0 wants $800/month”? Funded startups may get year 1 free, then the cliff'):''}
${[a,b].map(x=>{const t=tierTables(plans.filter(p=>p.vendor_id===x.id));return t?t.replace('<h2>Published MAU tiers',`<h2>${esc(x.name)} paid plans: published MAU tiers`):''}).join('')}
<div class="grid2">${[a,b].map(x=>`<div class="panel"><h3><a href="/vendors/${x.id}">${esc(x.name)}</a></h3><p>${esc(x.summary)}</p><p class="src">Source: <a href="${x.source}">${esc(x.source.replace(/^https?:\/\//,''))}</a> · ${x.checked}</p></div>`).join('')}</div>
<p class="note">Also see: <a href="/alternatives/${a.id}">${esc(a.name)} alternatives</a> · <a href="/alternatives/${b.id}">${esc(b.name)} alternatives</a> · <a href="/guides/auth-cost-by-mau">all vendors by MAU</a> · <a href="${SH}">vs self-hosting (Better Auth / Auth.js)</a></p>
${mailBox('c',`Watch ${a.name} vs ${b.name}`,'Watch this pair for me')}`});
}
page({file:'compare/index.html',og:'compare',title:`Auth vendor comparisons — ${pairs.length} head-to-heads | ${NAME}`,desc:'Head-to-head auth pricing for major identity vendors.',body:`<section class="hero"><div class="eyebrow">Compare</div><h1>Head to head, on the whole auth bill.</h1><p class="lede">${pairs.length} pairings across ${MAJOR.length} vendors.</p></section>
<div class="pairs">${pairs.map(([a,b])=>`<a href="/compare/${a.id}-vs-${b.id}">${esc(a.name)} vs ${esc(b.name)}</a>`).join('')}</div>
${mailBox('ci','The cheapest auth plan for your MAU, weekly','Send me the weekly ledger')}`});


// ---- Alternatives (search/GEO)
const altOrder=(vid)=>vendors.filter(x=>x.id!==vid).map(x=>({v:x,c:MAU_TIERS.map(m=>bestFor(x.id,m)),s:bestFor(x.id,50000,5)})).sort((A,B)=>(A.c[1]?.e.total??1e12)-(B.c[1]?.e.total??1e12)||(A.c[0]?.e.total??1e12)-(B.c[0]?.e.total??1e12));
for(const v of vendors){
  const me=MAU_TIERS.map(m=>bestFor(v.id,m)), meS=bestFor(v.id,50000,5);
  const alts=altOrder(v.id);
  const lines=MAU_TIERS.map((m,i)=>{
    const others=alts.map(a=>a.c[i]).filter(Boolean).sort((x,y)=>x.e.total-y.e.total);const top=others[0];
    if(!top) return null;
    if(!me[i]) return `at ${kfmt(m)} users ${topTier(v.id)&&m>topTier(v.id)?`${v.name} is Enterprise-only (contact sales; top published tier ${kfmt(topTier(v.id))} MAU)`:`${v.name} publishes no fixed self-serve price`}; the cheapest verified alternative is ${top.p.vendor} ${top.p.plan} at ${usd(top.e.total)}/mo${star(top.p)}`;
    const cheaper=others.filter(x=>x.e.total<me[i].e.total).length;
    return `at ${kfmt(m)} users ${v.name} ${me[i].p.plan} costs ${usd(me[i].e.total)}/mo${star(me[i].p)} and ${cheaper} of ${others.length} priceable alternatives are cheaper${cheaper?` (cheapest: ${top.p.vendor} ${top.p.plan} at ${usd(top.e.total)}/mo${star(top.p)}, ${yr(me[i].e.total-top.e.total)}/yr less)`:''}`;
  }).filter(Boolean);
  const answer=`As of ${lastChecked}: ${lines.join('; ')}.`;
  page({file:`alternatives/${v.id}.html`,og:'compare',title:`${v.name} alternatives — cheaper auth at 10k/50k/100k users | ${NAME}`,desc:`Cheaper ${v.name} alternatives ranked by real monthly cost at 10k, 50k and 100k users and with 5 SSO connections. ${vendors.length-1} vendors, sourced list prices.`,ld:[ORG_LD,{'@context':'https://schema.org','@type':'FAQPage',mainEntity:[{'@type':'Question',name:`What is the cheapest ${v.name} alternative?`,acceptedAnswer:{'@type':'Answer',text:answer}},{'@type':'Question',name:'Where do the prices come from?',acceptedAnswer:{'@type':'Answer',text:'Each vendor’s own pricing page; every row in the AuthCost ledger links its source and check date. Scenarios a vendor does not publish a price for are left blank.'}}]}],body:`
<section class="hero"><div class="eyebrow"><a href="/alternatives/">Alternatives</a> · last verified ${lastChecked}</div><h1>${esc(v.name)} alternatives, ranked by what you’d actually pay</h1>
<p class="lede"><b>Answer:</b> ${esc(answer)}</p>${ctaRow()}</section>
<div class="tbl"><table><thead><tr><th>Vendor (cheapest verified plan)</th>${MAU_TIERS.map(m=>`<th class="n">${kfmt(m)} users</th>`).join('')}<th class="n">50k + 5 SSO</th><th scope="col">Head to head</th></tr></thead><tbody>
<tr style="background:var(--surface-2,rgba(0,0,0,.03))"><td><b><a href="/vendors/${v.id}">${esc(v.name)}</a></b> <span class="src">(current)</span></td>${me.map(z=>cell(z,true)).join('')}${cell(meS,true)}<td></td></tr>
${alts.map(a=>`<tr><td><a href="/vendors/${a.v.id}">${esc(a.v.name)}</a></td>${a.c.map(z=>cell(z)).join('')}${cell(a.s)}<td><a href="/compare/${cmpSlug(v.id,a.v.id)}">${esc(v.name)} vs ${esc(a.v.name)}</a></td></tr>`).join('')}</tbody></table></div>
<p class="note">Monthly USD list prices, cheapest verified plan per vendor for each scenario, sorted by 50k-user cost. “—” = no fixed published price for that volume (custom / contact sales, or overage not printed). Billing units differ: Clerk counts retained users (MRU), most others MAU. “50k + 5 SSO”: ${FED_NOTE} ${ORG_NOTE} ${tokNote} ${meth}.</p>
<div class="grid2"><div class="panel"><h3>Why teams leave ${esc(v.name)}</h3><p>${esc(v.summary)}</p><p class="src">Source: <a href="${v.source}" rel="noopener">${esc(v.source.replace(/^https?:\/\//,''))}</a> · ${v.checked}</p></div>
<div class="panel"><h3>Check before you switch</h3><p>Unit (${esc(v.billing_unit)}), SSO per-connection fees, and MFA availability change the ranking more than the headline price. Run your exact numbers in the <a href="/calculator/">calculator</a> and read <a href="/guides/mau-vs-mru">MAU vs MRU</a>.</p></div></div>
<div class="panel"><h3>Or skip the vendor: self-host Better Auth / Auth.js</h3><p>$0 per user, but you pay in database, email, SMS and engineer hours. <a href="${SH}">See what self-hosting costs instead of ${esc(v.name)}</a>, with the break-even math at 10k/50k/100k users.</p></div>
${mailBox('a'+v.id,`Hear when ${v.name} or its alternatives change prices`,'Send me the weekly ledger')}`});
}
page({file:'alternatives/index.html',og:'compare',title:`Cheaper auth alternatives — ${vendors.length} vendors ranked | ${NAME}`,desc:`Cheaper alternatives to ${vendors.map(v=>v.name).join(', ')}, ranked by monthly cost at 10k/50k/100k users, plus the self-host (Better Auth / Auth.js) option.`,body:`<section class="hero"><div class="eyebrow">Alternatives · ${asOf}</div><h1>Paying too much for auth? Find the cheaper alternative.</h1><p class="lede">Each page ranks every other tracked vendor by real monthly cost at 10k, 50k and 100k users — sourced list prices only.</p>${ctaRow()}</section>
<div class="pairs">${vendors.map(v=>`<a href="/alternatives/${v.id}">${esc(v.name)} alternatives</a>`).join('')}</div>
<div class="panel"><h2 class="h3" style="margin-top:0">Or build it yourself?</h2><p>“Do teams still build authentication from scratch or is there a fair indie alternative?” Open-source Better Auth and Auth.js cost $0 per user, but not $0. <a href="${SH}">What you pay instead: database, email, SMS and engineer hours, vs Clerk and Auth0 at 10k/50k/100k users</a>.</p></div>
${mailBox('ai','The cheapest auth plan for your MAU, weekly','Send me the weekly ledger')}`});

// ---- Data guides (tables computed from the ledger)
const T1M=[...MAU_TIERS,1000000];
const allRows=T1M.map(m=>rankScenario(m,0));
const DATA_GUIDES=[];
{ // cost by MAU, every vendor
  const slug='auth-cost-by-mau';DATA_GUIDES.push({slug,title:'Auth pricing by MAU: every vendor at 10k, 50k, 100k and 1M users'});
  const ans=T1M.map((m,i)=>{const r=allRows[i];return r[0]?`${kfmt(m)} users: cheapest ${r[0].p.vendor} ${r[0].p.plan} ${usd(r[0].e.total)}/mo${star(r[0].p)}`:null}).filter(Boolean).join('; ');
  page({file:`guides/${slug}.html`,title:`Auth pricing by MAU (10k, 50k, 100k, 1M users) — ${vendors.length} vendors | ${NAME}`,desc:`Monthly auth cost for ${vendors.map(v=>v.name).join(', ')} at 10k, 50k, 100k and 1M users. Sourced, checked ${lastChecked}.`,ld:[ORG_LD,{'@context':'https://schema.org','@type':'FAQPage',mainEntity:[{'@type':'Question',name:'What is the cheapest auth provider by MAU?',acceptedAnswer:{'@type':'Answer',text:`As of ${lastChecked}: ${ans}.`}}]}],body:`
<section class="hero"><div class="eyebrow"><a href="/guides/">Guides</a> · ${asOf}</div><h1>Auth pricing by MAU, every vendor</h1><p class="lede"><b>Answer (no SSO):</b> ${esc(ans)}.</p>${ctaRow(100000,0)}</section>
<div class="tbl"><table><thead><tr><th>Vendor</th>${T1M.map(m=>`<th class="n">${kfmt(m)} users</th>`).join('')}<th scope="col">Alternatives</th></tr></thead><tbody>${vendors.map(v=>`<tr><td><a href="/vendors/${v.id}">${esc(v.name)}</a></td>${T1M.map(m=>cell(bestFor(v.id,m))).join('')}<td><a href="/alternatives/${v.id}">cheaper?</a></td></tr>`).join('')}</tbody></table></div>
<p class="note">Cheapest verified plan per vendor, monthly USD list price, no SSO / MFA / SMS. “—” = no fixed published price at that volume. ${tokNote} ${meth}.</p>
${mailBox('gm','Get auth price changes weekly','Send me the weekly ledger')}`});
}
{ // 100k
  const slug='cheapest-auth-100k';DATA_GUIDES.push({slug,title:'Cheapest auth at 100k users'});
  const r=rankScenario(100000,0),rs=rankScenario(100000,10);
  const tb=rr=>`<div class="tbl"><table><thead><tr><th class="n">#</th><th>Plan</th><th class="n">Monthly</th><th class="n">Annual</th></tr></thead><tbody>${rr.map((x,i)=>`<tr><td class="n">${rankPos(rr,x)}${tieCount(rr,x)>1?'=':''}</td><td><a href="/vendors/${x.p.vendor_id}">${esc(x.p.vendor)}</a> ${esc(x.p.plan)}</td><td class="n">${usd(x.e.total)}${star(x.p)}</td><td class="n">${yr(x.e.total)}</td></tr>`).join('')}</tbody></table></div>`;
  const ans=r.length>=2?`At 100k users with no SSO, ${r[0].p.vendor} ${r[0].p.plan} is cheapest at ${usd(r[0].e.total)}/mo${star(r[0].p)}; the most expensive verified plan is ${r.at(-1).p.vendor} ${r.at(-1).p.plan} at ${usd(r.at(-1).e.total)}/mo — a ${yr(r.at(-1).e.total-r[0].e.total)}/yr gap.`:'';
  page({file:`guides/${slug}.html`,title:`Cheapest auth provider at 100k users (${lastChecked.slice(0,4)}) | ${NAME}`,desc:`Every verified auth plan ranked by monthly cost at 100,000 users, with and without 10 SSO connections. Sourced list prices.`,ld:[ORG_LD,{'@context':'https://schema.org','@type':'FAQPage',mainEntity:[{'@type':'Question',name:'What is the cheapest auth at 100k users?',acceptedAnswer:{'@type':'Answer',text:ans}}]}],body:`
<section class="hero"><div class="eyebrow"><a href="/guides/">Guides</a> · ${asOf}</div><h1>Cheapest auth at 100k users</h1><p class="lede"><b>Answer:</b> ${esc(ans)}</p>${ctaRow(100000,0)}</section>
<h2>100k users, no SSO (${r.length} plans priceable)</h2>${tb(r)}
<h2>100k users, 10 SSO connections (${rs.length} plans priceable)</h2>${tb(rs)}
<p class="note">Plans without a published price at this volume are omitted (e.g. Auth0 above 50k MAU, where only Enterprise / contact sales remains; Stytch MAU overage). ${FED_NOTE} ${ORG_NOTE} ${tokNote} ${meth}.</p>
${mailBox('g100','Get auth price changes weekly','Send me the weekly ledger')}`});
}
{ // free tiers
  const slug='auth-free-tiers-compared';DATA_GUIDES.push({slug,title:'Auth free tiers compared'});
  const fr=plans.filter(p=>p.tier==='free'||(p.base_mo===0&&p.included_users)).sort((a,b)=>(b.included_users||0)-(a.included_users||0));
  const ans=`Largest free allowances as of ${lastChecked}: ${fr.slice(0,4).map(p=>`${p.vendor} ${p.plan} ${Number(p.included_users).toLocaleString('en-US')} ${p.user_unit}`).join(', ')}.`;
  page({file:`guides/${slug}.html`,title:`Auth free tiers compared — MAU limits and free SSO | ${NAME}`,desc:`Free MAU/MRU allowances and included SSO connections for ${vendors.length} auth vendors, from official pricing pages.`,ld:[ORG_LD,{'@context':'https://schema.org','@type':'FAQPage',mainEntity:[{'@type':'Question',name:'Which auth provider has the biggest free tier?',acceptedAnswer:{'@type':'Answer',text:ans}}]}],body:`
<section class="hero"><div class="eyebrow"><a href="/guides/">Guides</a> · ${asOf}</div><h1>Auth free tiers, compared</h1><p class="lede"><b>Answer:</b> ${esc(ans)}</p>${ctaRow(10000,0)}</section>
<div class="tbl"><table><thead><tr><th>Plan</th><th class="n">Free users</th><th>Unit</th><th class="n">SSO incl.</th><th>Notes</th><th>Source</th></tr></thead><tbody>${fr.map(p=>`<tr><td><a href="/vendors/${p.vendor_id}">${esc(p.vendor)}</a> ${esc(p.plan)}</td><td class="n">${Number(p.included_users).toLocaleString('en-US')}</td><td>${esc(p.user_unit)}</td><td class="n">${p.sso_included??'—'}</td><td style="white-space:normal;min-width:240px" class="src">${esc(p.notes)}</td><td class="src"><a href="${p.source}">source</a> · ${p.checked}</td></tr>`).join('')}</tbody></table></div>
<p class="note">Includes $0-base plans with a free allowance (e.g. Cognito, WorkOS AuthKit, Stytch pay-as-you-go). ${meth}.</p>
${mailBox('gft','Hear when a free tier shrinks','Send me the weekly ledger')}`});
}

{ // Self-hosted auth cost (RT-20261031-06): Better Auth / Auth.js vs hosted, sourced rates + labelled assumptions
  const slug='self-hosted-auth-cost';DATA_GUIDES.push({slug,title:'Self-hosted auth cost: Better Auth / Auth.js vs Clerk and Auth0'});
  const SRC={ba:'https://github.com/better-auth/better-auth',authjs:'https://authjs.dev/',bainfra:'https://www.better-auth.com/pricing',basso:'https://www.better-auth.com/docs/plugins/sso',ses:'https://aws.amazon.com/ses/pricing/',idp:'https://cloud.google.com/identity-platform/pricing'};
  const SHC='2026-10-31';
  const RATE={ses1k:0.10,smsUS:0.01,baEmail:0.001,baSms:0.09,baPro:20,baSso:50};
  const A={emails:1,sms:0,infra:0,hours:4,rate:100}; // assumptions, editable in the widget below
  const pl=id=>plans.find(p=>p.id===id);
  const est=(id,m,s=0)=>{const p=pl(id);const e=p&&estimate(p,m,s);return e&&e.total!=null?e.total:null};
  const hard=m=>m*A.emails/1000*RATE.ses1k+A.sms*RATE.smsUS+A.infra;
  const money=v=>v==null?'—':usd(Math.round(v*100)/100);
  const rows=MAU_TIERS.map(m=>{const ch=rankScenario(m,0)[0];return {m,ch,clerk:bestFor('clerk',m),clerkPro:est('clerk-pro',m),auth0:bestFor('auth0',m),a0e:est('auth0-essentials',m),fb:est('firebase-identity-platform',m),hard:hard(m)}});
  const be=(cost,h)=>cost==null?'—':(cost-h<=0?'0 h (hosted is cheaper)':`${((cost-h)/A.rate).toFixed(1)} h/mo`);
  const r100=rows[2],r10=rows[0];
  const ans=`Better Auth (MIT) and Auth.js (ISC) charge $0 per user, but you pay for email, SMS, database/hosting and engineer time. With our stated assumptions (1 transactional email per user per month on Amazon SES at $0.10 per 1,000, no SMS, existing database), the cash cost is ${money(r10.hard)}/mo at 10k users and ${money(r100.hard)}/mo at 100k. The cheapest hosted plan in our ledger lists ${money(r10.ch.e.total)}/mo at 10k (${r10.ch.p.vendor} ${r10.ch.p.plan}) and ${money(r100.ch.e.total)}/mo at 100k (${r100.ch.p.vendor} ${r100.ch.p.plan}), so on cash alone self-hosting does not beat free tiers. Against paid plans it can: at 100k users Clerk Pro lists ${money(r100.clerkPro)}/mo and Firebase / Identity Platform ${money(r100.fb)}/mo, so at an assumed $${A.rate}/hour self-hosting saves money only while upkeep stays under ${be(r100.clerkPro,r100.hard)} (vs Clerk Pro) or ${be(r100.fb,r100.hard)} (vs Firebase).`;
  const sso=['clerk-pro','auth0-b2b-essentials','workos-authkit','descope-pro'].map(pl).filter(Boolean);
  const Q=[
    ['Do teams still build authentication from scratch, or is there a fair indie alternative?',`Few write it from scratch. Open-source libraries run inside your app and database with no per-user fee: Better Auth (MIT license) and Auth.js (ISC license; the Auth.js project is now part of Better Auth). The fair trade: no MAU bill, but you own the email, SMS, database and upkeep costs below.`],
    ['“$0 per user”: what do you pay instead?',`Transactional email (Amazon SES lists $0.10 per 1,000 outbound emails), SMS if you use phone OTP or SMS MFA (Google Identity Platform lists $0.01 per US SMS, as one published reference), database rows and hosting you may already run, and engineer hours for upgrades, security patches and support. Better Auth also sells optional managed infrastructure (Pro $20/mo; email $0.001, SMS $0.09). We don’t estimate engineer time for you; the calculator below makes it an input.`],
    ['Clerk vs Better Auth: when does self-hosting actually save money?',ans],
    ['Every auth provider raises prices if you require SSO. Does self-hosting avoid the SSO tax?',`Better Auth’s SSO plugin supports OIDC, OAuth2 and SAML 2.0, so there is no per-connection license fee when you self-host; you still carry setup and support for each customer’s IdP. Its optional managed infrastructure lists self-service SSO at 1 connection, then $${RATE.baSso}/month per connection (on the $${RATE.baPro}/mo Infrastructure Pro plan). Hosted per-connection list prices in our ledger: ${sso.map(p=>`${p.vendor} ${p.plan} ${p.sso_bands?usd(p.sso_bands[0].rate):usd(p.sso_extra_mo)}`).join(', ')}.`]
  ];
  const ld=[ORG_LD,{'@context':'https://schema.org','@type':'Article',headline:'Self-hosted auth cost: $0 per user, but what you pay instead',description:'Better Auth / Auth.js self-hosting vs Clerk, Auth0 and Firebase at 10k, 50k and 100k users: sourced rates, labelled assumptions and break-even engineer hours.',datePublished:SHC,dateModified:lastChecked,author:{'@id':SITE+'/#org'},publisher:{'@id':SITE+'/#org'},mainEntityOfPage:SITE+'/guides/'+slug,citation:Object.values(SRC)},{'@context':'https://schema.org','@type':'FAQPage',mainEntity:Q.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))}];
  const srcA=(k,t)=>`<a href="${SRC[k]}" rel="noopener">${t}</a>`;
  page({file:`guides/${slug}.html`,og:'compare',title:`Self-hosted auth cost: Better Auth / Auth.js vs Clerk & Auth0 at 10k–100k users | ${NAME}`,desc:`$0 per user, but not $0: what self-hosting Better Auth or Auth.js costs in email, SMS, database and engineer hours, vs Clerk, Auth0 and Firebase at 10k, 50k and 100k users. Sourced rates, editable assumptions.`,ld,body:`
<section class="hero"><div class="eyebrow"><a href="/guides/">Guides</a> · <a href="/alternatives/">Alternatives</a> · rates checked ${SHC}</div><h1>Self-hosted auth: $0 per user, but what you pay instead</h1>
<p class="lede"><b>Answer:</b> ${esc(ans)}</p>${ctaRow(100000,0)}</section>
<h2>${esc(Q[0][0])}</h2><p>${esc(Q[0][1])} Sources: ${srcA('ba','Better Auth on GitHub (MIT)')}, ${srcA('authjs','authjs.dev')}.</p>
<h2>${esc(Q[1][0])}</h2>
<div class="tbl"><table><thead><tr><th>Line item</th><th>Published rate (source)</th><th>How we count it</th></tr></thead><tbody>
<tr><td>License / per-user fee</td><td class="src">$0: Better Auth MIT, Auth.js ISC (${srcA('ba','GitHub')})</td><td>$0</td></tr>
<tr><td>Transactional email (verify, reset, magic link)</td><td class="src">Amazon SES $0.10 / 1,000 outbound (${srcA('ses','aws.amazon.com/ses/pricing')}) · Better Auth infra $0.001/email (${srcA('bainfra','better-auth.com/pricing')})</td><td>users × emails per user × rate. <b>Assumption:</b> ${A.emails} email per user per month</td></tr>
<tr><td>SMS OTP / SMS MFA</td><td class="src">Identity Platform US $0.01/SMS, first 10/day not billed (${srcA('idp','cloud.google.com/identity-platform/pricing')}) · Better Auth infra $0.09/SMS. Rates vary widely by country.</td><td>SMS per month × rate. <b>Assumption:</b> ${A.sms} (email, passkeys or social only)</td></tr>
<tr><td>Database + hosting</td><td class="src">Not a published auth price: depends on your stack</td><td><b>Assumption:</b> $${A.infra} extra (user/session tables in a database you already run)</td></tr>
<tr><td>Engineer hours (upgrades, security patches, support)</td><td class="src">Not published anywhere: yours to estimate</td><td>Shown as <b>break-even hours</b> at an assumed $${A.rate}/hour, not added to the cash cost</td></tr>
</tbody></table></div>
<h2>Auth0 / Clerk pricing “scales horribly”: the numbers at 10k, 50k and 100k users</h2>
<div class="tbl"><table><thead><tr><th>Monthly users</th><th class="n">Self-host cash cost*</th><th class="n">Cheapest hosted</th><th class="n">Clerk (cheapest · Pro)</th><th class="n">Auth0 (cheapest · B2C Essentials)</th><th class="n">Firebase / Identity Platform</th><th class="n">Break-even upkeep vs Clerk Pro · vs Firebase</th></tr></thead><tbody>
${rows.map(r=>`<tr><td>${kfmt(r.m)} users</td><td class="n"><b>${money(r.hard)}</b></td><td class="n">${money(r.ch.e.total)}<br><span class="src">${esc(r.ch.p.vendor)} ${esc(r.ch.p.plan)}</span></td><td class="n">${r.clerk?money(r.clerk.e.total):'—'} · ${money(r.clerkPro)}</td><td class="n">${r.auth0?money(r.auth0.e.total):'—'} · ${r.a0e==null?'Enterprise (contact sales)':money(r.a0e)}</td><td class="n">${money(r.fb)}</td><td class="n">${be(r.clerkPro,r.hard)} · ${be(r.fb,r.hard)}</td></tr>`).join('')}
</tbody></table></div>
<p class="note">* Cash cost = email + SMS + extra infrastructure using the assumptions above; engineer time excluded. Hosted columns: monthly USD list price from the <a href="/">AuthCost ledger</a> (no SSO, no MFA), checked ${lastChecked}. Break-even = (hosted − self-host cash cost) ÷ $${A.rate}/h: the monthly upkeep hours at which self-hosting stops saving money. Free hosted tiers have feature limits (e.g. Clerk Hobby has no MFA), so we also show Clerk Pro and Auth0 B2C Essentials. ${meth}.</p>
<h2>${esc(Q[2][0])}</h2><p>Up to 25k–50k users, Clerk Hobby (50k MRU), Auth0 Free (25k MAU) and Firebase (50k MAU) all list $0, and WorkOS AuthKit lists free to 1M MAU (SSO billed per connection), so self-hosting can’t save cash there. Its case is control, data location, and free-tier feature limits (e.g. Clerk Hobby lists no MFA). Once you need a paid plan, the gap opens: Clerk Pro goes from ${money(rows[1].clerkPro)}/mo at 50k to ${money(r100.clerkPro)}/mo at 100k, and Auth0 B2C Essentials lists ${money(rows[1].a0e)}/mo at 50k. That is where self-hosting can earn its upkeep, if your team’s hours stay under the break-even in the table. Compare: <a href="/vendors/clerk">Clerk pricing</a> · <a href="/vendors/auth0">Auth0 pricing</a> · <a href="/vendors/firebase">Firebase / Identity Platform pricing</a> · <a href="/vendors/descope">Descope pricing</a>.</p>
<h2>${esc(Q[3][0])}</h2><p>${esc(Q[3][1])} Sources: ${srcA('basso','Better Auth SSO plugin docs')}, ${srcA('bainfra','better-auth.com/pricing')}; hosted rates from each vendor’s page via our <a href="/guides/enterprise-sso-cost">SSO cost guide</a>.</p>
<h2>Run your own numbers</h2>
<div class="panel" id="sh-calc"><div class="filters" style="margin:0">
<label>Monthly users<input id="sh-mau" type="number" min="0" step="1000" value="100000"></label>
<label>Emails per user / month (assumption)<input id="sh-em" type="number" min="0" step="0.5" value="${A.emails}"></label>
<label>Email $ per 1,000 (SES list)<input id="sh-emr" type="number" min="0" step="0.01" value="${RATE.ses1k}"></label>
<label>SMS per month<input id="sh-sms" type="number" min="0" step="100" value="${A.sms}"></label>
<label>$ per SMS (US ref.)<input id="sh-smr" type="number" min="0" step="0.01" value="${RATE.smsUS}"></label>
<label>Extra DB + hosting $/mo (assumption)<input id="sh-inf" type="number" min="0" step="5" value="${A.infra}"></label>
<label>Upkeep hours / month (assumption)<input id="sh-h" type="number" min="0" step="1" value="${A.hours}"></label>
<label>Engineer $/hour (assumption)<input id="sh-r" type="number" min="0" step="5" value="${A.rate}"></label>
</div><div id="sh-out" class="kout" aria-live="polite" style="margin-top:12px"><p class="note">Loading ledger…</p></div>
<p class="note">Every default marked “assumption” is ours, not a published price: change it to your numbers. Hosted prices are live from <a href="/api/plans.json">/api/plans.json</a>.</p></div>
<h2>What this page doesn’t price</h2><p>Security incident response, compliance audits (e.g. SOC 2 evidence for your auth layer), migrations between libraries, and bot/abuse protection are real costs with no published rate, so we leave them out rather than guess. Hosted vendors bundle some of these; check each vendor’s page.</p>
<p class="note">See also: <a href="/alternatives/">cheaper hosted alternatives</a> · <a href="/guides/auth-cost-by-mau">every vendor by MAU</a> · <a href="/calculator/?mau=100000&sso=0">calculator</a> · <a href="/compare/clerk-vs-auth0">Clerk vs Auth0</a></p>
${mailBox('gsh','Hear when hosted auth prices move','Send me the weekly ledger')}`});
}

{ // Enterprise SSO cost (RT-20261031-58): canonical SSO-tax page, every number from plans.json (+ Better Auth infra read 2026-10-31)
  const slug='enterprise-sso-cost';DATA_GUIDES.push({slug,title:'Enterprise SSO cost: every vendor at 1, 3, 5, 10 and 25 connections'});
  const CONN=[1,3,5,10,25],GM=10000;
  const BA={name:'Better Auth Infrastructure Pro',base:20,incl:1,per:50,src:'https://www.better-auth.com/pricing',checked:'2026-10-31'}; // read 2026-10-31: Pro $20/mo, self-service SSO 1 connection then $50/month per connection
  const baCost=n=>BA.base+Math.max(0,n-BA.incl)*BA.per;
  const vp=vid=>plans.filter(p=>p.vendor_id===vid&&p.status==='verified');
  const model=vid=>{const ps=vp(vid);if(ps.some(isFed))return 'Per SSO user';if(ps.some(p=>p.sso_unlimited))return 'Unlimited in base (paid tiers)';if(ps.some(p=>p.sso_extra_mo!=null||p.sso_bands))return 'Per connection';return 'Included count only'};
  const ladder=p=>{if(isFed(p))return `${(p.federated_free??p.sso_saml_included_mau??0)} SSO users free, then ${usd(p.federated_per_mau??p.sso_saml_per_mau)} per SSO user / mo`;
    if(p.sso_unlimited)return 'Unlimited connections, no per-connection fee';
    const inc=p.sso_included||0;
    if(p.sso_bands)return `${inc} incl., then ${p.sso_bands.map(b=>`${usd(b.rate)} (${b.from}–${b.to})`).join(', ')}${p.sso_note?'; '+p.sso_note:''}`;
    if(p.sso_extra_mo!=null)return `${inc} incl., then ${usd(p.sso_extra_mo)} each${p.sso_max?` (max ${p.sso_max})`:''}`;
    return inc?`${inc} incl., no extra connections on this plan`:'No enterprise SSO'};
  const scim=p=>scimTermTxt(p);
  const skCell=(n,sc)=>{const k=skCost(GM,n,sc?n:0);return k?`<td class="n">${usd(k.total)}${sc?`<br><span class="src">SCIM ${usd(k.scim)}</span>`:''}<br><span class="src">${k.plan}</span></td>`:'<td class="n">—</td>'};
  const cellS=(vid,n)=>{const z=scimBest(GM,n,n).find(y=>y.p.vendor_id===vid);return z?`<td class="n">${usd(z.e.total)}<br><span class="src">SCIM ${usd(z.e.scim)}${z.p.scim_billing_starts?'‡':''}</span><br><span class="src">${esc(z.p.plan)}</span></td>`:`<td class="n" title="${esc(scimWhy(P[vid]))}">—</td>`};
  const dag=(z)=>z?`${z.p.vendor} ${z.p.plan} ${z.e.total<EPS?'$0':usd(z.e.total)+'/mo'}${!NEGTEST_ORG&&!NEGTEST_ORG_FEE&&z.e.org>EPS?` incl. ${usd(z.e.org)}/mo ${z.e.orgLabel}`:''}${isFed(z.p)?` (${FED_SHORT}; ${fedSensText(z.p.vendor_id,z._m,z._n).split('; ').at(-1)})`:''}`:'';
  const topList=(m,n)=>{const r=rankScenario(m,n).map(z=>Object.assign(z,{_m:m,_n:n}));const zero=r.filter(z=>z.e.total<EPS);const rest=r.filter(z=>z.e.total>=EPS);
    const seen=new Set(zero.map(z=>z.p.vendor_id));const nxt=[];for(const z of rest){if(seen.has(z.p.vendor_id))continue;seen.add(z.p.vendor_id);nxt.push(z);if(nxt.length===3)break}
    const txt=(zero.length?`${listJoin(zero.map(z=>`${z.p.vendor} ${z.p.plan}`))} (tie at $0)`+(nxt.length?', then ':''):'')+nxt.map(dag).join(', ')+(NEGTEST_ORG?'':` (${ORG_SHORT})`);return auditOrg('guides/enterprise-sso-cost',txt,[...zero,...nxt],n)};
  const scimTop=()=>{const b=scimBest().slice(0,3);return auditScim('guides/enterprise-sso-cost',GM,3,3,b,` If all 3 also need SCIM / Directory Sync (${SCIM_SHORT}; ${ORG_SHORT}): ${b.map(scimBit).join(', ')}.`)};
  const pc=(m,n)=>rankScenario(m,n).find(z=>!isFed(z.p)&&z.e.total>=EPS);
  const pc10=pc(GM,3);
  const a0p=plans.find(p=>p.id==='auth0-b2b-professional'),a0e=plans.find(p=>p.id==='auth0-b2b-essentials');
  const a0pT=a0p&&estimate(a0p,1000,3),a0eT=a0e&&estimate(a0e,1000,3),a0e5=a0e&&estimate(a0e,5000,3);
  const ans=`For 2–3 enterprise customers (3 SSO connections), as of ${lastChecked}: at 5k users the cheapest verified plans are ${topList(5000,3)}. At 10k users: ${topList(GM,3)}. The cheapest paid plan whose SSO price does not depend on SSO-user counts at 10k users is ${pc10?`${pc10.p.vendor} ${pc10.p.plan} at ${usd(pc10.e.total)}/mo${pc10.e.org>EPS?` incl. ${usd(pc10.e.org)}/mo ${pc10.e.orgLabel}`:''}`:'n/a'}.`+scimTop();
  const a0ans=a0pT&&a0eT?`Auth0 B2B Professional lists ${usd(a0pT.total)}/mo at its 1,000-MAU tier with ${a0p.sso_included} enterprise connections included; B2B Essentials lists ${usd(a0eT.total)}/mo at 1,000 MAU (${usd(a0e5.total)}/mo at 5,000) with ${a0e.sso_included} included. Extra connections are ${usd(a0e.sso_extra_mo)}/mo each, up to ${a0e.sso_max}. Auth0 Free includes 1 enterprise connection up to 25,000 MAU. Eligible venture-backed startups can get year 1 of B2B Professional at $0 through Auth0 for Startups (up to ${A0S.mau.toLocaleString('en-US')} MAU, ${A0S.conns} Enterprise Connections); from month 13 the list prices above apply, and buyers who are not eligible pay list price from month 1.`:'';
  const fedV=FED_VIDS.map(id=>P[id].name);
  const mPer=vendors.filter(v=>model(v.id)==='Per connection').map(v=>v.name),mUnl=vendors.filter(v=>model(v.id).startsWith('Unlimited')).map(v=>v.name);
  const modelsTxt=`1) Per connection: ${listJoin(mPer)} charge a monthly fee per enterprise SSO connection, often after a few included (e.g. WorkOS ${usd(plans.find(p=>p.id==='workos-authkit').sso_bands[0].rate)} each from the first, Clerk Pro 1 included then ${usd(plans.find(p=>p.id==='clerk-pro').sso_bands[0].rate)}). 2) Unlimited in the base fee: ${listJoin(mUnl)} include unlimited SSO on paid tiers, so cost tracks users, not customers. 3) Per SSO user: ${listJoin(fedV)} bill each SAML/OIDC user a month (first 50 free, then ${FED_RATES.map(usd).join('/')}), so a big enterprise customer costs more than a small one.`;
  const sensRows=FED_VIDS.map(vid=>{const cells=[3,10,25].map(n=>{const base=bestFor(vid,GM,n);const s2=fedSens(vid,GM,n);return base?`${usd(base.e.total)} · ${s2.map(x=>usd(x.z.e.total)).join(' · ')}`:'—'});return `<tr><td>${esc(P[vid].name)}</td>${cells.map(c=>`<td class="n">${c}</td>`).join('')}</tr>`}).join('');
  const fedQ=`Because ${listJoin(fedV)} bill SAML/OIDC per SSO user, their SSO cost depends on how many people each enterprise customer signs in. We assume ${FED_PER_CONN} SSO users per connection unless you change it. At ${kfmt(GM)} users with 3 connections: ${FED_VIDS.map(vid=>{const b=bestFor(vid,GM,3);return b?`${P[vid].name} ${usd(b.e.total)}/mo (${fedSensText(vid,GM,3)})`:null}).filter(Boolean).join('; ')}.`;
  const shQ=`Self-hosting an open-source library such as Better Auth (SSO plugin: SAML 2.0 and OIDC) has no per-connection license fee; you carry setup and support. Better Auth’s optional managed infrastructure lists self-service SSO at 1 connection, then $${BA.per}/month per connection (on the $${BA.base}/mo Infrastructure Pro plan, ${BA.src.replace('https://www.','')}, read ${BA.checked}).`;
  const Q=[['What is the cheapest auth for 2–3 enterprise SSO customers?',ans],['“Auth0 wants $800/month for SSO”: is that right?',a0ans],['What are the 3 ways auth vendors charge for enterprise SSO?',modelsTxt],['Why do Firebase, Supabase and Cognito SSO prices depend on user counts?',fedQ],['Is Auth0 free for startups, and what happens after year 1?',A0S_TXT],['What does SCIM / Directory Sync add for 3 enterprise customers?',SCIM_ANS('guides/enterprise-sso-cost')],['Does self-hosting avoid the SSO tax?',shQ],['I’m B2B with organizations: does that change the SSO bill?',B2B_ANS]];
  const ld=[ORG_LD,{'@context':'https://schema.org','@type':'FAQPage',mainEntity:Q.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))}];
  const cellN=(vid,n)=>{const z=bestFor(vid,GM,n);return z?`<td class="n">${usd(z.e.total)}${isFed(z.p)?'†':''}${star(z.p)}<br><span class="src">${esc(z.p.plan)}</span></td>`:'<td class="n" title="No verified plan can price this many connections at this size">—</td>'};
  page({file:`guides/${slug}.html`,og:'compare',title:`Enterprise SSO cost (${lastChecked.slice(0,4)}): ${vendors.length} auth vendors at 1, 3, 5, 10, 25 connections | ${NAME}`,desc:`What enterprise SSO really costs for your first 2–3 enterprise customers: ${vendors.length} auth vendors priced at 1, 3, 5, 10 and 25 SAML/OIDC connections, the 3 SSO pricing models, SCIM, and the Auth0 $800/month question. Sourced, checked ${lastChecked}.`,ld,body:`
<section class="hero"><div class="eyebrow"><a href="/guides/">Guides</a> · ${asOf}</div><h1>Enterprise SSO cost: what your first enterprise customers will really cost</h1>
<p class="lede"><b>Answer:</b> ${esc(ans)}</p>${ctaRow(GM,3)}</section>
<blockquote class="panel"><p>“Lost 3 enterprise deals because we didn't have SSO. Auth0 wants $800/month — too expensive for my 2–3 small enterprise customers”</p><p class="src">— founder on <a href="https://www.reddit.com/r/SaaS/comments/1nxo74u/" rel="noopener nofollow">r/SaaS</a>. “Every auth provider like Auth0, Clerk, WorkOS etc. increases their prices tremendously if you require SSO” — <a href="https://news.ycombinator.com/item?id=44955457" rel="noopener nofollow">Hacker News</a>.</p></blockquote>
<h2>Monthly cost at ${kfmt(GM)} users by number of SSO connections</h2>
<div class="tbl"><table><thead><tr><th>Vendor</th><th>SSO pricing model</th>${CONN.map(n=>`<th class="n">${n} connection${n>1?'s':''}</th>`).join('')}</tr></thead><tbody>
${vendors.map(v=>`<tr><td><a href="/vendors/${v.id}">${esc(v.name)}</a></td><td>${esc(model(v.id))}</td>${CONN.map(n=>cellN(v.id,n)).join('')}</tr>`).join('')}
<tr><td><a href="${BA.src}" rel="noopener">Better Auth</a> (self-hosted library)</td><td>Per connection (managed infra)</td>${CONN.map(n=>`<td class="n">${usd(baCost(n))}<br><span class="src">Infra Pro + SSO, excl. hosting</span></td>`).join('')}</tr>
<tr><td><a href="${SK.src}" rel="noopener">Scalekit</a> (reference, read ${SK.checked})</td><td>Per connection (first free)</td>${CONN.map(n=>skCell(n,false)).join('')}</tr>
</tbody></table></div>
<p class="note">Cheapest verified plan per vendor, total monthly USD list price (base + ${kfmt(GM)} users + SSO), no MFA/SMS add-ons. “—” = no verified plan can price that many connections at ${kfmt(GM)} users (e.g. a free tier caps below it, or the plan has no SSO). † ${FED_NOTE} ${ORG_NOTE} Better Auth row: Infrastructure Pro $${BA.base}/mo plus $${BA.per} per connection after the first (<a href="${BA.src}" rel="noopener">better-auth.com/pricing</a>, read ${BA.checked}); hosting your app and database is extra. ${tokNote} ${meth}.</p>
<h2 id="scim">SCIM is often billed as a second connection</h2>
<p>Enterprise customers who ask for SSO usually ask for SCIM / Directory Sync next (automatic user provisioning and deprovisioning from Okta, Entra ID or Google Workspace). Vendors bill it 3 ways: <b>a separate connection</b> (WorkOS ${usd(pid('workos-authkit').scim_bands[0].rate)} and Clerk ${usd(pid('clerk-pro').scim_bands[0].rate)} after 1 included, so one customer on both is two connections), <b>a shared pool</b> (Stytch: ${pid('stytch-payg').scim_included} “SSO or SCIM” connections, then ${usd(pid('stytch-payg').scim_extra_mo)}), or <b>included</b> (Auth0 inbound SCIM on Free and B2B plans; Descope Growth). ${esc(listJoin(SCIM_NOPRICE().map(v=>`${v.name} (${scimWhy(v)})`)))} can’t be priced with SCIM. Below: the same table when every SSO customer also needs SCIM (${SCIM_SHORT}).</p>
<div class="tbl"><table><thead><tr><th>Vendor</th><th>SCIM billing</th>${CONN.map(n=>`<th class="n">${n} SSO + ${n} SCIM</th>`).join('')}</tr></thead><tbody>
${vendors.map(v=>`<tr><td><a href="/vendors/${v.id}">${esc(v.name)}</a></td><td>${esc((()=>{const ps=plans.filter(p=>p.vendor_id===v.id&&p.status==='verified');const inc=ps.filter(p=>p.scim_model==='included');return inc.length&&inc.length<ps.length&&!ps.some(p=>p.scim_model==='separate'||p.scim_model==='pooled')?`Included on ${inc.map(p=>p.plan).join(', ')}`:SCIM_MODEL_LBL[scimModelOf(v.id)]})())}</td>${CONN.map(n=>cellS(v.id,n)).join('')}</tr>`).join('')}
<tr><td><a href="${SK.src}" rel="noopener">Scalekit</a> (reference, read ${SK.checked})</td><td>Separate connection (first of each free)</td>${CONN.map(n=>skCell(n,true)).join('')}</tr>
<tr><td><a href="${BA.src}" rel="noopener">Better Auth</a> (self-hosted library)</td><td>Not yet checked</td>${CONN.map(()=>'<td class="n">—</td>').join('')}</tr>
</tbody></table></div>
<p class="note">Total monthly USD list price at ${kfmt(GM)} users (base + users + SSO + SCIM + org fees), cheapest verified plan per vendor; “SCIM” = the part of the total that SCIM adds. “—” = no published SCIM price on a plan that fits (${esc(SCIM_NOPRICE().map(v=>v.name).join(', '))}). ‡ Clerk: Directory Sync “billing … starts January 1, 2027”; until then extra connections are $0, the column shows the list price from that date. SCIM terms per plan, with sources: <a href="/methodology#scim">methodology</a>. Scalekit is a reference row (not yet a full ledger vendor), from <a href="${SK.src}" rel="noopener">its pricing page</a>. <a href="/calculator/?mau=${GM}&sso=3&scim=3">Price your own SSO + SCIM mix</a>.</p>
<h2>“Auth0 wants $800/month”: the Auth0 SSO math</h2><p>${esc(a0ans)} Compare <a href="/vendors/auth0">Auth0 pricing tiers</a> and <a href="/compare/clerk-vs-auth0">Clerk vs Auth0</a>.</p>
${a0sBox()}
<h2>The 3 ways vendors charge for enterprise SSO</h2>
<div class="grid3"><div class="panel"><h3>Per connection</h3><p>${esc(listJoin(mPer))}. Each enterprise customer’s IdP (Okta, Entra ID, Google Workspace) is one connection with a monthly fee, usually after a few included. Cheap for 1–3 customers, expensive at 25.</p></div>
<div class="panel"><h3>Unlimited in the base fee</h3><p>${esc(listJoin(mUnl))}. Paid tiers include unlimited SSO, so the bill tracks users, not customers. Best when you expect many small enterprise customers.</p></div>
<div class="panel"><h3>Per SSO user</h3><p>${esc(listJoin(fedV))}. Each SAML/OIDC user is billed per month (first ${FED_FREE.join('/')} free, then ${FED_RATES.map(usd).join('/')}). Cheapest for small customers; grows with every seat they bring.</p></div></div>
<h2>How the per-SSO-user vendors move with customer size</h2>
<div class="tbl"><table><thead><tr><th>Vendor (cheapest plan, ${kfmt(GM)} users)</th><th class="n">3 connections</th><th class="n">10 connections</th><th class="n">25 connections</th></tr></thead><tbody>${sensRows}</tbody></table></div>
<p class="note">Each cell: monthly cost at ${FED_PER_CONN} · ${FED_SENS.map(x=>x.toLocaleString('en-US')).join(' · ')} SSO users per connection, computed from the same ledger rows. Per-connection vendors don’t change with customer size.</p>
<h2>SSO and SCIM / Directory Sync list prices, plan by plan</h2>
<div class="tbl"><table><thead><tr><th>Plan</th><th class="n">Base / mo</th><th>Enterprise SSO</th><th>SCIM / Directory Sync</th><th>Source · checked</th></tr></thead><tbody>
${plans.filter(p=>p.status==='verified'&&(p.sso_included||p.sso_extra_mo!=null||p.sso_bands||p.sso_unlimited||isFed(p))).map(p=>`<tr><td><a href="/vendors/${p.vendor_id}">${esc(p.vendor)}</a> ${esc(p.plan)}</td><td class="n">${p.price_tiers?`from ${usd(p.price_tiers[0].mo)}`:usd(p.base_mo)}</td><td style="white-space:normal">${esc(ladder(p))}</td><td style="white-space:normal">${esc(scim(p))}</td><td class="src"><a href="${p.source}" rel="noopener">source</a> · ${p.checked}</td></tr>`).join('')}
</tbody></table></div>
<p class="note">SCIM terms read on each vendor’s pricing page on 2026-10-31 (source per plan in the <a href="/methodology#scim">methodology</a>). Stytch’s included connections are shared between SSO and SCIM; WorkOS and Clerk count SCIM / Directory Sync as separate connections. Descope Free also caps at 10 monthly active tenants. B2B organization/tenant fees and caps are included: see <a href="#b2b-orgs">B2B org fees</a>.</p>
<h2 id="b2b-orgs">B2B org fees: does my organization count change the bill?</h2><p>${esc(B2B_ANS)}</p>${orgExTable()}${orgTable()}
<h2>“Migrating SSO/SCIM sounds like it might be a bit of a pain”</h2><p>It is per customer: each connection means re-configuring that customer’s IdP. If you expect more than a handful of enterprise customers, compare the 10- and 25-connection columns before you pick, not just the free tier. Self-hosting? ${esc(shQ)} See <a href="${SH}">self-hosted auth cost</a>.</p>
<p class="note">Scalekit appears above as a reference row from its pricing page (read ${SK.checked}); it is not yet a full ledger vendor, so the calculator doesn’t rank it. Not in the ledger yet: SSOJet. We add a vendor only after reading its pricing page; until then we don’t quote it.</p>
<h2>Questions</h2>${Q.map(([q,a])=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}
${mailBox('gsso','Hear when an SSO price moves','Send me the weekly ledger')}`});
}

{ // Auth0 pricing (RT-20261031-11 / RT-20261031-97): head-query page, every number from plans.json via estimate()
  const slug='auth0-pricing';DATA_GUIDES.push({slug,title:'Auth0 pricing 2026: what you’ll actually pay at 1k–100k MAU'});
  // auth0.com/pricing.md re-read 2026-10-31 15:13 ET: byte-identical to snapshots/auth0/pricing-2026-10-31.md (see snapshots/auth0/pricing-2026-10-31-recheck.txt)
  const RECHECK='2026-10-31 3:13 PM ET';
  const A0_IDS=['auth0-free','auth0-essentials','auth0-professional','auth0-b2b-essentials','auth0-b2b-professional'];
  const A0=A0_IDS.map(pid).filter(p=>p.id&&p.status==='verified');
  const A0C=A0.map(p=>p.checked).sort().at(-1);
  const BR=[1000,5000,10000,25000,50000,100000];
  const m$=n=>n.toLocaleString('en-US');
  const a0e=(p,m,s=0)=>{const e=estimate(p,m,s);return e&&e.total!=null?e.total:null};
  const tierAt=(p,m)=>p.price_tiers?p.price_tiers.find(t=>m<=t.mau):null;
  // Why a plan has no price at m: never a number we invented
  const why=(p,m)=>{if(p.tier==='free')return `Over the ${m$(p.included_users)}-MAU free cap`;if(p.tier_unavailable_from&&m>=p.tier_unavailable_from)return 'Not available';const nx=p.price_tiers&&p.price_tiers.at(-1).mau;return m>nx?'Contact sales':'—'};
  const why2=(p,m)=>{const w=why(p,m);return w==='Contact sales'&&p.tier_unavailable_from?`Contact sales (${m$(p.price_tiers.at(-1).mau+10000)} tier); ${m$(p.tier_unavailable_from)}+ not available`:w};
  const pcell=(p,m)=>{const v=a0e(p,m);const t=tierAt(p,m);if(v==null)return `<td class="n" data-label="${esc(p.plan)}"><span>${esc(why(p,m))}</span></td>`;return `<td class="n" data-label="${esc(p.plan)}"><span>${v===0?'$0':usd(v)+'/mo'}${t?`<br><span class="src">${m$(t.mau)} tier${t.mau!==m?' (next tier up)':''} · ${usd(t.yr)}/yr</span>`:`<br><span class="src">free to ${m$(p.included_users)}</span>`}</span></td>`};
  const cheapA0=m=>{const r=A0.map(p=>({p,v:a0e(p,m)})).filter(x=>x.v!=null).sort((a,b)=>a.v-b.v);return r[0]||null};
  const F=pid('auth0-free'),BE=pid('auth0-essentials'),BP=pid('auth0-professional'),E=pid('auth0-b2b-essentials'),PR=pid('auth0-b2b-professional');
  const over=F.included_users+1,essOver=a0e(BE,over),essOverT=tierAt(BE,over);
  const lastPaid=Math.max(...A0.filter(p=>p.price_tiers).map(p=>p.tier_max_mau));
  // Answer-first: two sentences, dated, computed
  const ans=`As of ${A0C} (auth0.com/pricing.md), Auth0 is $0 up to ${m$(F.included_users)} MAU on Free; past that the cheapest self-serve plan is B2C Essentials at ${usd(essOver)}/mo (billed at the ${m$(essOverT.mau)}-MAU tier) and ${usd(a0e(BE,50000))}/mo at 50,000 MAU, and above ${m$(lastPaid)} MAU (B2C) or ${m$(E.tier_max_mau)} MAU (B2B) Auth0 publishes no price: Enterprise, contact sales. With enterprise SSO, B2B Essentials starts at ${usd(a0e(E,1000,E.sso_included))}/mo (1,000 MAU, ${E.sso_included} connections) and B2B Professional at ${usd(a0e(PR,1000,PR.sso_included))}/mo (${PR.sso_included} connections), then ${usd(E.sso_extra_mo)}/mo per extra connection up to ${E.sso_max}.`;
  // Cost cliffs: every published tier step, priced 1 MAU past each tier
  const steps=p=>p.price_tiers.slice(0,-1).map((t,i)=>{const nx=p.price_tiers[i+1];if(nx.mo===t.mo)return null;const a=a0e(p,t.mau),b=a0e(p,t.mau+1);return a!=null&&b!=null?{p,at:t.mau,a,b,d:b-a,nx:nx.mau}:null}).filter(Boolean);
  const topStep=p=>{const t=p.price_tiers.at(-1);return {p,at:t.mau,a:a0e(p,t.mau),b:null,txt:why2(p,t.mau+1)}};
  const CL=[BE,BP,E,PR].filter(p=>p.price_tiers);
  const allSteps=CL.flatMap(steps);const big=allSteps.slice().sort((x,y)=>y.d-x.d)[0];
  const cliffRows=CL.map(p=>[...steps(p),topStep(p)].map(s=>`<tr><td data-label="Plan">${esc(p.plan)}</td><td class="n" data-label="At"><span>${m$(s.at)} MAU: ${usd(s.a)}/mo</span></td><td class="n" data-label="1 MAU more"><span>${s.b!=null?`${m$(s.at+1)} MAU: ${usd(s.b)}/mo`:esc(s.txt)}</span></td><td class="n" data-label="Jump"><span>${s.b!=null?`+${usd(s.d)}/mo<br><span class="src">+${usd(s.d*12)}/yr monthly billing</span>`:'—'}</span></td></tr>`).join('')).join('');
  const freeCliff=`At ${m$(F.included_users)} MAU Auth0 Free is $0. At ${m$(over)} MAU you must be on a paid plan: B2C Essentials ${usd(essOver)}/mo (the ${m$(essOverT.mau)} tier), B2C Professional contact sales (its ${m$(BP.tier_max_mau+10000)} tier is “Contact us”), B2B Essentials and B2B Professional contact sales (their top published tiers are ${m$(E.tier_max_mau)} and ${m$(PR.tier_max_mau)} MAU).`;
  // SSO cliff at 5k MAU on the B2B plans (and Free at 1 connection)
  const SM=5000,SS=[0,1,3,4,5,6,10,E.sso_max,E.sso_max+1];
  const ssoCell=(p,n)=>{const v=a0e(p,SM,n);return `<td class="n" data-label="${esc(p.plan)}"><span>${v==null?(p.sso_max!=null&&n>p.sso_max?`Over the ${p.sso_max}-connection max`:(p.tier==='free'&&n>(p.sso_included||0)?`Free includes ${p.sso_included}`:(p.sso_included===0?'No enterprise SSO (B2C)':'—'))):(v===0?'$0':usd(v)+'/mo')}</span></td>`};
  const SSOP=[F,BE,E,PR];
  const ssoRows=SS.map(n=>`<tr><td class="n" data-label="SSO connections">${n}</td>${SSOP.map(p=>ssoCell(p,n)).join('')}</tr>`).join('');
  const e3=a0e(E,SM,3),e4=a0e(E,SM,4),p5=a0e(PR,SM,5),p6=a0e(PR,SM,6),e6=a0e(E,SM,6);
  const ssoTxt=auditOrg('guides/auth0-pricing',`At ${m$(SM)} MAU (${ORG_SHORT}): B2B Essentials is ${usd(e3)}/mo with its ${E.sso_included} included connections and ${usd(e4)}/mo with a 4th (+${usd(e4-e3)}); B2B Professional includes ${PR.sso_included}, so it is ${usd(p5)}/mo at 5 and ${usd(p6)}/mo at 6. ${Math.abs(e6-p6)<EPS?`From 5 connections up both cost the same (${usd(e6)}/mo at 6), so Professional’s extra features come at no extra list price there.`:`With 6 connections Essentials is ${usd(e6)}/mo vs Professional ${usd(p6)}/mo.`} Auth0 caps both at ${E.sso_max} connections; B2C plans have no enterprise connections, and Free includes ${F.sso_included}.`,[E,PR].map(p=>({p,e:estimate(p,SM,3)})).filter(z=>z.e),3);
  // Compare: cheapest verified plan per vendor at each bracket, no SSO
  const CV=['auth0','clerk','stytch','workos','cognito'].filter(v=>P[v]);
  const cmpCell=(vid,m)=>{const z=bestFor(vid,m);return `<td class="n" data-label="${esc(P[vid].name)}"><span>${z?`${z.e.total===0?'$0':usd(z.e.total)+'/mo'}${star(z.p)}<br><span class="src">${esc(z.p.plan)}</span>`:esc(vid==='auth0'?'Contact sales':noPrice(P[vid],m))}</span></td>`};
  const cmpRows=BR.map(m=>`<tr><td class="n" data-label="MAU">${m$(m)}</td>${CV.map(v=>cmpCell(v,m)).join('')}<td data-label="Price it"><a href="/calculator/?mau=${m}&sso=0">calculator</a></td></tr>`).join('');
  // With 3 enterprise SSO customers at 10k MAU (per-vendor cheapest), audited
  const S3=10000,r3=rankScenario(S3,3);const b3=CV.map(v=>r3.find(z=>z.p.vendor_id===v)||null);
  const s3Txt=auditOrg('guides/auth0-pricing',`At 10k MAU · 3 SSO (${ORG_SHORT}; ${FED_SHORT} for Cognito): ${b3.map((z,i)=>z?`${z.p.vendor} ${z.p.plan} ${usd(z.e.total)}/mo${z.e.org>EPS?` incl. ${usd(z.e.org)}/mo ${z.e.orgLabel}`:''}`:`${P[CV[i]].name}: no verified plan fits`).join('; ')}`,b3,3);
  const c10=bestFor('clerk',10000),a10=bestFor('auth0',10000),c50=bestFor('clerk',50000),a50=bestFor('auth0',50000),w50=bestFor('workos',50000),g50=bestFor('cognito',50000);
  const cmpTxt=`No SSO, cheapest verified plan per vendor: at 10,000 users Auth0 ${a10.p.plan} ${a10.e.total===0?'$0':usd(a10.e.total)+'/mo'}, Clerk ${c10.p.plan} ${c10.e.total===0?'$0':usd(c10.e.total)+'/mo'} (Clerk bills retained users, MRU); at 50,000 Auth0 ${a50.p.plan} ${usd(a50.e.total)}/mo, Clerk ${c50.p.plan} ${c50.e.total===0?'$0':usd(c50.e.total)+'/mo'}, WorkOS ${w50.p.plan} ${w50.e.total===0?'$0':usd(w50.e.total)+'/mo'}, Cognito ${g50.p.plan} ${usd(g50.e.total)}/mo. At 100,000 Auth0 has no published price (contact sales).`;
  const a800=`Yes, for B2B Professional: ${usd(a0e(PR,1000))}/mo at its 1,000-MAU tier (500 and 1,000 MAU cost the same) with ${PR.sso_included} enterprise connections and Enterprise MFA included, ${usd(a0e(PR,10000))}/mo at 10,000 MAU, contact sales above ${m$(PR.tier_max_mau)}. If you only need ${E.sso_included} or fewer connections, B2B Essentials is ${usd(a0e(E,1000,E.sso_included))}/mo at 1,000 MAU and ${usd(a0e(E,5000,E.sso_included))}/mo at 5,000. Auth0 Free includes ${F.sso_included} enterprise connection up to ${m$(F.included_users)} MAU.`;
  const Q=[
    ['How much does Auth0 cost at 1k, 5k, 10k, 25k, 50k and 100k MAU?',`As of ${A0C}, monthly list price, no SSO: ${BR.map(m=>{const c=cheapA0(m);return `${m$(m)} MAU ${c?`${c.v===0?'$0':usd(c.v)} on ${c.p.plan}`:'contact sales'}`}).join('; ')}. B2C Essentials: ${BR.map(m=>`${m$(m)} ${a0e(BE,m)!=null?usd(a0e(BE,m)):why(BE,m).toLowerCase()}`).join(', ')}. Paid plans bill at the next published tier up; yearly billing is 11× monthly.`],
    ['What happens when I pass 25,000 MAU on Auth0 Free?',freeCliff],
    ['“Auth0 wants $800/month”: is that right?',a800],
    ['What does Auth0 charge per extra enterprise SSO connection?',ssoTxt],
    ['Where does the biggest Auth0 price jump happen?',`One MAU past a published tier bills the next tier. The biggest single step in Auth0’s self-serve tables is ${big.p.plan} at ${m$(big.at)} MAU: ${usd(big.a)}/mo becomes ${usd(big.b)}/mo at ${m$(big.at+1)} MAU (+${usd(big.d)}/mo). ${freeCliff}`],
    ['Is Auth0 free for startups, and what happens in month 13?',A0S_TXT],
    ['How does Auth0 compare with Clerk, Stytch, WorkOS and Cognito at the same MAU?',cmpTxt+' '+s3Txt+'.'],
    ['Is Auth0 cheaper billed yearly?',`Yes: Auth0’s yearly price is 11× the monthly price (one month free), e.g. B2C Essentials at 10,000 MAU is ${usd(tierAt(BE,10000).mo)}/mo or ${usd(tierAt(BE,10000).yr)}/yr, and B2B Professional at 10,000 MAU ${usd(tierAt(PR,10000).mo)}/mo or ${usd(tierAt(PR,10000).yr)}/yr.`]
  ];
  const url=SITE+'/guides/'+slug;
  const ld=[ORG_LD,{'@context':'https://schema.org','@type':'WebPage','@id':url+'#webpage',url,name:'Auth0 pricing 2026: what you’ll actually pay at 1k–100k MAU',description:ans,inLanguage:'en',isPartOf:{'@id':SITE+'/#website'},datePublished:'2026-10-31',dateModified:A0C,lastReviewed:A0C,publisher:{'@id':SITE+'/#org'},about:{'@type':'Organization',name:'Auth0'},citation:[F.source,A0S.src]},{'@context':'https://schema.org','@type':'FAQPage',mainEntity:Q.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))}];
  const hdr=cols=>`<thead><tr>${cols.map(([c,n])=>`<th${n?' class="n"':''}>${esc(c)}</th>`).join('')}</tr></thead>`;
  page({file:`guides/${slug}.html`,og:'compare',title:`Auth0 pricing 2026: what you’ll actually pay at 1k–100k MAU | ${NAME}`,desc:`Auth0 Free, Essentials and Professional (B2C and B2B) priced at 1k, 5k, 10k, 25k, 50k and 100k MAU from auth0.com/pricing.md, checked ${A0C}: tier cost cliffs, SSO connection fees, the Auth0 for Startups month-13 cliff, and Clerk / Stytch / WorkOS / Cognito at the same MAU.`,ld,body:`
<section class="hero"><div class="eyebrow"><a href="/guides/">Guides</a> · <a href="/vendors/auth0">Auth0</a> · Prices checked ${A0C}</div><h1>Auth0 pricing 2026: what you’ll actually pay at 1k–100k MAU</h1>
<p class="lede"><b>Answer:</b> ${esc(ans)}</p>
<div class="cta-row"><a class="btn" href="/calculator/?mau=25000&sso=0" data-grow="seo_calc_cta">Price my exact MAU + SSO</a></div>
<p class="micro" data-prices-checked>Prices checked ${A0C} on <a href="${F.source}" rel="noopener">auth0.com/pricing.md</a> (re-read ${RECHECK}: unchanged). Every figure below is computed by the same engine as our <a href="/calculator/">calculator</a> from our <a href="/vendors/auth0">Auth0 ledger rows</a>; blanks say why, we never invent a number.</p></section>
<blockquote class="panel"><p>“auth0 / clerk pricing scales horribly”</p><p class="src">— <a href="https://www.reddit.com/r/ChoosingVendors/comments/1uxf64c/" rel="noopener nofollow">r/ChoosingVendors</a>. “Auth0 wants $800/month — too expensive for my 2–3 small enterprise customers” — <a href="https://www.reddit.com/r/SaaS/comments/1nxo74u/" rel="noopener nofollow">r/SaaS</a>. Below: what it actually costs, bracket by bracket.</p></blockquote>
<h2 id="brackets">Auth0 cost by MAU, every plan (no SSO)</h2>
<div class="tbl cards"><table>${hdr([['MAU',1],...A0.map(p=>[p.plan,1])])}<tbody>${BR.map(m=>`<tr><td class="n" data-label="MAU">${m$(m)}</td>${A0.map(p=>pcell(p,m)).join('')}</tr>`).join('')}</tbody></table></div>
<p class="note">Monthly USD list price; small print = the Auth0 tier you are billed at and the yearly price (11× monthly). Auth0 sells paid plans only at published MAU tiers and bills usage between tiers at the next tier up, so 25,000 MAU is billed at the 30,000 tier. Where Auth0 goes contact sales: B2C Essentials above ${m$(BE.tier_max_mau)} MAU, B2C Professional above ${m$(BP.tier_max_mau)} (the 30,000 tier is “Contact us”, ${m$(BP.tier_unavailable_from)}+ “Not available”), B2B Essentials above ${m$(E.tier_max_mau)}, B2B Professional above ${m$(PR.tier_max_mau)}. Free is the same for B2C and B2B (up to ${m$(F.included_users)} MAU, ${F.sso_included} enterprise connection, ${F.org_max} organizations). Not included: Auth0 for AI Agents, extra M2M tokens, Enterprise MFA on Essentials (${usd(100)}/mo per auth0.com/pricing.md), taxes and negotiated discounts. Source: <a href="${F.source}" rel="noopener">auth0.com/pricing.md</a>, checked ${A0C}.</p>
<h2 id="cost-cliff">The Auth0 cost cliff: one more user, the next tier</h2>
<div class="verdict"><div class="eyebrow">Free → paid</div><p>${esc(freeCliff)}</p><p class="note">“At 25k users, you’re paying $300-500/month just for auth” (<a href="https://www.reddit.com/r/Supabase/comments/1qorpy2/" rel="noopener nofollow">r/Supabase</a>): on Auth0 it is $0 at exactly ${m$(F.included_users)} MAU and ${usd(essOver)}/mo one user later, if Free’s features are enough for you up to then.</p></div>
<p>Biggest single tier step in Auth0’s self-serve tables: <b>${esc(big.p.plan)} at ${m$(big.at)} MAU, ${usd(big.a)}/mo → ${usd(big.b)}/mo</b> (+${usd(big.d)}/mo, +${usd(big.d*12)}/yr on monthly billing). Every step:</p>
<div class="tbl cards"><table>${hdr([['Plan'],['At the tier',1],['1 MAU more',1],['Jump',1]])}<tbody>${cliffRows}</tbody></table></div>
<p class="note">Computed with our engine at each published tier and one MAU above it. Steps where two tiers share a price (e.g. Professional at 500 and 1,000 MAU) are skipped. Last row per plan: where the published table ends.</p>
<h2 id="sso">The SSO cliff: enterprise connections at ${m$(SM)} MAU</h2>
<p>${esc(ssoTxt)}</p>
<div class="tbl cards"><table>${hdr([['SSO connections',1],...SSOP.map(p=>[p.plan,1])])}<tbody>${ssoRows}</tbody></table></div>
<p class="note">Monthly USD list price at ${m$(SM)} MAU: base tier + ${usd(E.sso_extra_mo)}/mo per connection over the included count (${E.sso_included} on B2B Essentials, ${PR.sso_included} on B2B Professional, max ${E.sso_max}), from <a href="${E.source}" rel="noopener">auth0.com/pricing.md</a>. Inbound SCIM is included on Free and B2B plans (it uses the customer’s enterprise connection, no separate fee). ${ORG_NOTE} <a href="/calculator/?mau=${SM}&sso=4">Price 4 connections in the calculator</a> · <a href="/guides/enterprise-sso-cost">every vendor’s SSO cost</a>.</p>
${a0sBox('Auth0 for Startups: year 1 free if eligible, then the month-13 cliff')}
<h2 id="compare">Auth0 vs Clerk, Stytch, WorkOS and Cognito at the same MAU</h2>
<p>${esc(cmpTxt)}</p>
<div class="tbl cards"><table>${hdr([['MAU',1],...CV.map(v=>[P[v].name,1]),['Price it']])}<tbody>${cmpRows}</tbody></table></div>
<p class="note">Cheapest verified plan per vendor, monthly USD list price, no SSO / MFA / SMS. Clerk bills monthly retained users (MRU), never more than your MAU, so these Clerk figures are an upper bound (<a href="/guides/mau-vs-mru">MAU vs MRU</a>). “No published self-serve price” = the vendor prints no fixed rate at that volume (e.g. Stytch MAU overage). ${tokNote}</p>
<p><b>With 3 enterprise SSO customers:</b> ${esc(s3Txt)}. ${FED_NOTE}</p>
<p class="note">Head to head: ${CV.filter(v=>v!=='auth0').map(v=>`<a href="/compare/${cmpSlug('auth0',v)}">Auth0 vs ${esc(P[v].name)}</a>`).join(' · ')} · <a href="/alternatives/auth0">cheaper Auth0 alternatives</a> · ${CV.filter(v=>v!=='auth0').map(v=>`<a href="/vendors/${v}">${esc(P[v].name)} pricing</a>`).join(' · ')} · <a href="/guides/auth0-free-tier">Auth0 free tier limits</a> · <a href="/calculator/?mau=10000&sso=3">calculator: 10k MAU, 3 SSO</a>.</p>
<h2>Questions</h2>${Q.map(([q,a])=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}
<p class="note">${asOf}. Method: <a href="/methodology">how we calculate this</a> · <a href="/changes">price log</a> · data <a href="/api/plans.json">JSON</a> / <a href="/api/plans.csv">CSV</a>.</p>
${mailBox('ga0p','Hear the week Auth0 changes a price','Send me the weekly ledger')}`});
}

// ---- Changes + RSS
page({file:'changes.html',og:'changes',title:`Auth price-change log | ${NAME}`,desc:'Dated, sourced auth and identity price changes.',body:`<section class="hero"><div class="eyebrow">Price log · <a href="/rss.xml">RSS</a></div><h1>Every change, dated and sourced.</h1></section>
<div class="tbl"><table><thead><tr><th>Effective</th><th>Vendor</th><th>Kind</th><th>Detail</th><th>Source · observed</th></tr></thead>
<tbody>${changes.map(c=>`<tr><td class="n">${c.date}</td><td>${esc(c.vendor)}</td><td>${esc(c.kind)}</td><td style="white-space:normal">${esc(c.summary)}</td><td class="src"><a href="${c.source}">source</a> · ${c.observed}</td></tr>`).join('')}</tbody></table></div>`});
W('rss.xml',`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${NAME} — auth price log</title><link>${SITE}/changes</link><description>Dated, sourced auth price changes.</description>${changes.map(c=>`<item><title>${esc(c.vendor+': '+c.kind+' ('+c.date+')')}</title><link>${esc(c.source)}</link><guid isPermaLink="false">${esc(c.vendor+c.date+c.kind)}</guid><pubDate>${new Date(c.observed+'T12:00:00Z').toUTCString()}</pubDate><description>${esc(c.summary)}</description></item>`).join('')}</channel></rss>`);

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
<li>Estimated monthly cost = base + user overage (MAU/MRU bands) + SSO connection fees from the published ladder + published B2B organization fees (see below). Logto token overage is noted but not assumed from MAU.</li>
<li id="sso-users"><b>SSO users per connection (assumption).</b> ${esc(listJoin(FED_NAMES))} bill SAML/OIDC per SSO user, not per connection (first ${FED_FREE.join('/')} free, then ${FED_RATES.map(usd).join('/')} per SSO user a month). To compare them with per-connection vendors we assume <b>${FED_PER_CONN} SSO users per connection</b> by default; you can change it in the <a href="/calculator/">calculator</a>. We also count those users inside your total MAU, which can slightly overstate these vendors above their free direct-user allowance; we keep the higher figure. Sensitivity, computed from the same ledger rows (cheapest plan, monthly, rank among all priceable plans):
<div class="tbl"><table><thead><tr><th>Scenario</th><th>Vendor</th>${[FED_PER_CONN,...FED_SENS].map(x=>`<th class="n">${x.toLocaleString('en-US')} per connection</th>`).join('')}</tr></thead><tbody>${SCENARIOS.filter(s=>s.sso).flatMap(s=>FED_VIDS.map(vid=>{const cs=[FED_PER_CONN,...FED_SENS].map(per=>{const r=rankScenario(s.mau,s.sso,{federated_mau:s.sso*per});const z=r.find(x=>x.p.vendor_id===vid);return z?`${usd(z.e.total)}/mo · #${rankPos(r,z)} of ${r.length}`:'—'});return `<tr><td>${esc(s.label)}</td><td>${esc(P[vid].name)}</td>${cs.map(c=>`<td class="n">${c}</td>`).join('')}</tr>`})).join('')}</tbody></table></div></li>
<li id="b2b-orgs"><b>B2B organizations / tenants.</b> Vendors price customer organizations differently, so the calculator takes an organization count (default 0 = B2C). Every SSO connection counts as at least one customer organization (we ${ORG_SHORT}), with as many members as its SSO users (${FED_PER_CONN} by default, capped at users ÷ orgs). We add published org fees to the total and leave out plans over a published org cap. ${esc(B2B_ANS)} Correction 2026-10-31: before that date SSO answers ignored org fees, so for example Clerk vs Auth0 at 10k users · 1 SSO read “$300/yr less than Clerk” instead of $1,500/yr.${orgExTable()}${orgTable()}</li>
<li id="scim"><b>SCIM / Directory Sync.</b> The calculator takes the number of SSO customers that also need SCIM (default 0; we ${SCIM_SHORT}, so it is capped at the SSO connection count). We add each vendor’s published SCIM fee: a separate connection ladder (WorkOS; Clerk, billed from ${pid('clerk-pro').scim_billing_starts}), a pool shared with SSO connections (Stytch), or included (Auth0 inbound SCIM on Free and B2B plans, Descope Growth). Plans with no published SCIM price, SCIM “coming soon”, or SCIM only on another plan drop out of SCIM scenarios rather than show an invented figure. ${esc(SCIM_ANS('methodology'))} Addition 2026-10-31: before that date SCIM was listed per plan but never added to totals, so WorkOS at 3 SSO + SCIM customers read $375/mo instead of $750/mo.${scimTable()}</li>
<li id="hero"><b>Headline number.</b> ${esc(heroSentence)}. We compare a named, popular plan with the cheapest verified plan that includes MFA at the same user count (no SSO), because that is a saving a team can actually capture. The max-minus-min spread across all ${heroRank.length} plans priced at ${esc(heroSc.label)} is ${yr(spreadGap)}/yr (${esc(heroRank.at(-1).p.vendor)} ${esc(heroRank.at(-1).p.plan)} vs ${esc(heroRank[0].p.vendor)} ${esc(heroRank[0].p.plan)}, the latter ${FED_SHORT}); we keep it here only, since nobody chooses between those two.</li>
<li><b>Ties and precision.</b> Plans at the same price are shown as ties (for example “tie at $0”), never as wins or ordinal ranks. Rates show the precision the vendor publishes (for example Supabase ${usd(plans.find(p=>p.id==='supabase-pro').overage_per_user)} per MAU).</li>
<li>Auth0 sells paid plans in published MAU tiers (B2C to 50k, B2B to 20k, from <a href="https://auth0.com/pricing.md">auth0.com/pricing.md</a>); usage between tiers is priced at the next tier up, as Auth0 bills it. Above the top tier only Enterprise (contact sales) remains, so we omit Auth0 there rather than invent a number. Correction 2026-10-31: before that date we wrongly treated tiers above 500 MAU as custom.</li>
<li>Stytch MAU overage rate was not printed as a fixed USD figure on the checked page — left blank.</li>
<li>A weekly script diffs every source page; confirmed changes enter the price log.</li>
</ol>`});
page({file:'data.html',title:`${NAME} data — JSON & CSV`,desc:'Free JSON and CSV of auth plan prices with sources. CC BY 4.0.',ld:[ORG_LD,{'@context':'https://schema.org','@type':'Dataset',name:`${NAME} auth price ledger`,url:SITE+'/data',license:'https://creativecommons.org/licenses/by/4.0/',dateModified:lastChecked,distribution:[{'@type':'DataDownload',encodingFormat:'application/json',contentUrl:SITE+'/api/plans.json'},{'@type':'DataDownload',encodingFormat:'text/csv',contentUrl:SITE+'/api/plans.csv'}]}],body:`
<section class="hero"><div class="eyebrow">Data · CC BY 4.0</div><h1>Machine-readable ledger.</h1></section>
<dl class="kv"><dt>Plans + vendors (JSON)</dt><dd><a href="/api/plans.json">/api/plans.json</a></dd>
<dt>Plans (CSV)</dt><dd><a href="/api/plans.csv">/api/plans.csv</a></dd>
<dt>Price log</dt><dd><a href="/api/changes.json">/api/changes.json</a></dd>
<dt>LLM summary</dt><dd><a href="/llms.txt">/llms.txt</a> · <a href="/llms-full.txt">/llms-full.txt</a></dd></dl>`});

// ---- Guides (GEO flywheel)
const guides=[
  {slug:'clerk-vs-auth0',canonical:'/compare/clerk-vs-auth0',title:'Clerk vs Auth0 pricing',body:'Compare MRU vs MAU and SSO connection fees using AuthCost scenarios.'},
  {slug:'workos-sso-pricing',title:'WorkOS SSO pricing explained',body:'Per-connection ladder $125→$65 and how it compares to Clerk and Stytch.'},
  {slug:'cognito-essentials-vs-plus',title:'Cognito Essentials vs Plus cost',body:'$0.015 vs $0.020 per MAU and when Plus threat protection is worth it.'},
  {slug:'mau-vs-mru',title:'MAU vs MRU billing',body:'Why Clerk’s retained-user unit changes the effective price vs Auth0 and Cognito.'},
  {slug:'cheapest-auth-10k',title:'Cheapest auth at 10k users',body:'Ranked verified plans at 10k MAU with and without one SSO connection.'},
  {slug:'cheapest-auth-50k-sso',title:'Cheapest auth at 50k users with SSO',body:'Scenario table for 50k users and 5 enterprise connections.'},
  {slug:'stytch-pricing',title:'Stytch B2B pricing',body:'Free 10k MAU and 5 SSO/SCIM connections; $125 per extra connection.'},
  {slug:'kinde-unlimited-sso',title:'Kinde Plus unlimited SSO',body:'How $75/mo with unlimited SSO compares to per-connection vendors.'},
  {slug:'supabase-auth-cost',title:'Supabase Auth cost (with platform plan)',body:'Auth MAU inside the $25 Pro plan and SAML at $0.015/MAU.'},
  {slug:'logto-token-pricing',title:'Logto token-based pricing',body:'Why token billing differs from MAU and what $24 Pro includes.'},
  {slug:'auth0-free-tier',title:'Auth0 free tier limits',body:'Free covers 25k MAU and 1 Enterprise Connection; past that, B2C Essentials runs $35 (500 MAU) to $3,500 (50k) a month and B2B Essentials $150 to $3,800 (20k).'}
];
page({file:'guides/index.html',title:`Auth pricing guides | ${NAME}`,desc:`${guides.length+DATA_GUIDES.length} guides, ${vendors.length} vendor pricing pages, alternatives and ${pairs.length} head-to-heads on auth cost, MAU vs MRU and SSO fees.`,body:`<section class="hero"><div class="eyebrow">Guides</div><h1>Auth cost, explained.</h1></section>
<h2>Data tables</h2><ul class="pairs" style="display:grid;gap:8px">${DATA_GUIDES.map(g=>`<li><a href="/guides/${g.slug}">${esc(g.title)}</a></li>`).join('')}</ul>
<h2>Guides</h2><ul class="pairs" style="display:grid;gap:8px">${guides.map(g=>`<li><a href="/guides/${g.slug}">${esc(g.title)}</a></li>`).join('')}</ul>
<h2>Pricing by vendor</h2><div class="pairs">${vendors.map(v=>`<a href="/vendors/${v.id}">${esc(v.name)} pricing</a>`).join('')}</div>
<h2>Cheaper alternatives</h2><div class="pairs">${vendors.map(v=>`<a href="/alternatives/${v.id}">${esc(v.name)} alternatives</a>`).join('')}</div>
<h2>Head to head</h2><div class="pairs">${pairs.map(([a,b])=>`<a href="/compare/${a.id}-vs-${b.id}">${esc(a.name)} vs ${esc(b.name)} pricing</a>`).join('')}</div>
${ctaRow()}`});
for(const g of guides){
  const r10=rankScenario(10000,1),r50=rankScenario(50000,5);
  page({file:`guides/${g.slug}.html`,canonical:g.canonical,title:`${g.title} | ${NAME}`,desc:g.body,body:`
<section class="hero"><div class="eyebrow"><a href="/guides/">Guides</a> · checked ${lastChecked}</div><h1>${esc(g.title)}</h1>
<p class="lede">${esc(g.body)}</p></section>${g.slug==='auth0-free-tier'?'\n<p><b>Past the free tier?</b> <a href="/guides/auth0-pricing">Auth0 pricing at 1k–100k MAU</a>: every plan, the 25,001-MAU cliff and SSO fees.</p>':''}
<div class="panel"><div class="eyebrow">Live ledger snapshot</div>
<p><b>10k users · 1 SSO:</b> ${r10.slice(0,3).map(x=>`${esc(x.p.vendor)} ${esc(x.p.plan)} ${usd(x.e.total)}/mo`).join(' · ')||'—'}</p>
<p><b>50k users · 5 SSO:</b> ${r50.slice(0,3).map(x=>`${esc(x.p.vendor)} ${esc(x.p.plan)} ${usd(x.e.total)}/mo`).join(' · ')||'—'}</p>
<p class="note">${asOf}. ${FED_NOTE} ${ORG_NOTE} ${meth}.</p></div>
<p><a class="btn" href="/calculator/">Run your own scenario</a></p>
${mailBox('g'+g.slug,'Get auth price changes weekly','Send me the weekly ledger')}`});
}

// ---- API dumps
const meta={generated:new Date().toISOString(),site:SITE,license:'CC-BY-4.0'};
W('api/plans.json',JSON.stringify({...meta,affiliates:Object.fromEntries(Object.entries(AFFILIATES).filter(([,v])=>v!=='#pending')),vendors,plans},null,2));
W('api/changes.json',JSON.stringify({...meta,changes},null,2));
const csvEscape=v=>{const s=String(v??'');return /["',\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s};
W('api/plans.csv',['id,vendor,plan,base_mo,included_users,user_unit,overage_per_user,sso_included,sso_extra_mo,status,source,checked,mau_tiers_mo,org_included,org_max,org_extra_mo,org_addon_mo,org_member_limit,scim_model,scim_included,scim_first_band_mo,scim_billing_starts,scim_source,scim_checked',
  ...plans.map(p=>[p.id,p.vendor,p.plan,p.base_mo,p.included_users,p.user_unit,p.overage_per_user,p.sso_included,p.sso_extra_mo,p.status,p.source,p.checked,p.price_tiers?p.price_tiers.map(t=>t.mau+':'+t.mo).join('|'):'',p.org_included,p.org_max,p.org_extra_mo,p.org_addon_mo,p.org_member_limit,p.scim_model,p.scim_included,p.scim_bands?p.scim_bands[0].rate:p.scim_extra_mo,p.scim_billing_starts,p.scim_source,p.scim_checked].map(csvEscape).join(','))].join('\n'));
W('api/changes.csv',['date,vendor,kind,summary,source,observed',...changes.map(c=>[c.date,c.vendor,c.kind,c.summary,c.source,c.observed].map(csvEscape).join(','))].join('\n'));

W('llms.txt',`# ${NAME}\n\n> Auth and identity list prices (base + MAU/MRU + SSO), ${plans.length} plan rows, ${nVer} verified, ${vendors.length} vendors, checked ${lastChecked}.\n\n## Methodology\nPrices from each vendor's own pricing page only. Verified rows were read on the date shown. We never invent a price. Details: ${SITE}/methodology\n\n## Data (CC BY 4.0 — attribute \"AuthCost\" + link ${SITE}/)\n- [Plans JSON](${SITE}/api/plans.json)\n- [Plans CSV](${SITE}/api/plans.csv)\n- [Changes JSON](${SITE}/api/changes.json)\n- [Full dump](${SITE}/llms-full.txt)\n\n## Key pages\n- [Calculator (MAU / MFA / SSO)](${SITE}/calculator/)\n- [Compare hub](${SITE}/compare/)\n- [Guides](${SITE}/guides/)\n- [Alternatives](${SITE}/alternatives/)\n- [Auth pricing by MAU](${SITE}/guides/auth-cost-by-mau)\n- [Self-hosted auth cost: Better Auth / Auth.js vs Clerk, Auth0, Firebase](${SITE}/guides/self-hosted-auth-cost)\n- [Enterprise SSO cost at 1/3/5/10/25 connections](${SITE}/guides/enterprise-sso-cost)\n- [Auth0 pricing 2026 at 1k–100k MAU (all plans, cost cliffs, SSO, Startups month 13)](${SITE}/guides/auth0-pricing)\n\n## Assumptions\n- SSO results for ${listJoin(FED_NAMES)} (billed per SSO user) assume ${FED_PER_CONN} SSO users per connection; sensitivity at ${FED_SENS.join(' and ')}: ${SITE}/methodology#sso-users\n- B2B: SSO results ${ORG_SHORT}; org fees/caps applied (Clerk B2B add-on, Auth0 org caps, Descope/Kinde per-tenant fees): ${SITE}/methodology#b2b-orgs\n- Headline: ${heroSentence}.\n- [Methodology](${SITE}/methodology)\n- [About](${SITE}/about)\n- [Privacy](${SITE}/privacy)\n- [Terms](${SITE}/terms)\n`);
W('llms-full.txt',`# ${NAME} — full ledger\n\n## Calculator\nInteractive MAU / MFA / SSO cost ranking: ${SITE}/calculator/?mau=50000&sso=5&mfa=0\nShare via query params: mau, sso, scim (SSO customers that also need SCIM / Directory Sync, default 0), org (organizations / tenants, default 0 = B2C; each SSO connection counts as at least 1), mpo (members per organization, default = fpc), mfa (0|1), fpc (SSO users per connection for per-SSO-user vendors, default ${FED_PER_CONN}), vo (verified-only 0|1), embed=1 for chrome-free iframe.\nEmbed: <iframe src=\"${SITE}/calculator/?embed=1&mau=50000&sso=5\" title=\"AuthCost calculator\" width=\"100%\" height=\"720\" loading=\"lazy\"></iframe>\n\n${plans.length} plans, ${nVer} verified, ${vendors.length} vendors. Checked through ${lastChecked}.\n\n## Vendors\n${vendors.map(v=>`### ${v.name}\n- id: ${v.id}\n- source: ${v.source}\n- checked: ${v.checked}\n- unit: ${v.billing_unit}\n- summary: ${v.summary}`).join('\n\n')}\n\n## Plans\n${plans.map(p=>`### ${p.vendor} ${p.plan}\n- id: ${p.id}\n- base_mo: ${p.base_mo}\n- included_users: ${p.included_users}\n- unit: ${p.user_unit}\n- overage: ${p.overage_per_user}\n- sso_included: ${p.sso_included}\n- sso_extra_mo: ${p.sso_extra_mo}\n${p.price_tiers?`- mau_tiers (billed at next tier up; monthly / yearly USD): ${p.price_tiers.map(t=>`${t.mau.toLocaleString('en-US')} MAU $${t.mo.toLocaleString('en-US')}/$${t.yr.toLocaleString('en-US')}`).join('; ')}; above ${p.tier_max_mau.toLocaleString('en-US')} MAU: contact sales\n`:''}${p.org_source?`- organizations: ${orgTermTxt(p)} (${p.org_source}, ${p.org_checked})\n`:''}${p.scim_source?`- scim: ${scimTermTxt(p)}. ${p.scim_note} (${p.scim_source}, ${p.scim_checked})\n`:''}- status: ${p.status}\n- source: ${p.source} (${p.checked})\n- notes: ${p.notes||''}`).join('\n\n')}\n\n## Cost by MAU (cheapest verified plan per vendor, USD/month, no SSO)\n| Vendor | ${T1M.map(kfmt).join(' | ')} |\n|---|${T1M.map(()=>'---').join('|')}|\n${vendors.map(v=>`| ${v.name} | ${T1M.map(m=>{const b=bestFor(v.id,m);return b?usd(b.e.total)+star(b.p)+' ('+b.p.plan+')':'n/a'}).join(' | ')} |`).join('\n')}\n${tokNote}\n\n## B2B organizations / tenants\nSSO results ${ORG_SHORT} (members per org = SSO users per connection, default ${FED_PER_CONN}). ${ORG_TERMS}. Plans over a published cap are excluded. ${B2B_ANS} Details: ${SITE}/methodology#b2b-orgs\n\n## SCIM / Directory Sync\nCalculator param scim = SSO customers that also need SCIM (default 0, capped at sso). ${SCIM_ANS('llms-full')} Details: ${SITE}/guides/enterprise-sso-cost#scim${process.env.NEGTEST_SCIM==='orphan'?'\nNegative test: WorkOS AuthKit $375/mo incl. $0/mo SCIM':''}\n\n## Auth0 for Startups (promotion, not used in rankings)\n${A0S_TXT} Source: ${A0S.src} (read ${A0S.checked}).\n\n## Self-hosting (Better Auth / Auth.js)\nOpen-source libraries (Better Auth MIT, Auth.js ISC; Auth.js is now part of Better Auth) have no per-user fee. Costs instead: transactional email (Amazon SES $0.10/1,000 outbound), SMS (Identity Platform US $0.01/SMS reference), database/hosting and engineer hours (user-supplied assumptions). Optional Better Auth managed infrastructure: Pro $20/mo, SSO 1 connection then $50/mo each, email $0.001, SMS $0.09 (better-auth.com/pricing, checked 2026-10-31). Break-even math vs Clerk/Auth0/Firebase at 10k/50k/100k: ${SITE}/guides/self-hosted-auth-cost\n\n## Search pages\n${vendors.map(v=>`- ${v.name} pricing: ${SITE}/vendors/${v.id}\n- ${v.name} alternatives: ${SITE}/alternatives/${v.id}`).join('\n')}\n${DATA_GUIDES.map(g=>`- ${g.title}: ${SITE}/guides/${g.slug}`).join('\n')}\n${pairs.map(([a,b])=>`- ${a.name} vs ${b.name} pricing: ${SITE}/compare/${a.id}-vs-${b.id}`).join('\n')}\n\n## Changes\n${changes.map(c=>`- ${c.date} ${c.vendor} (${c.kind}): ${c.summary} [${c.source}]`).join('\n')}\n`);

W('manifest.webmanifest',JSON.stringify({name:`${NAME} — Auth cost of ownership`,short_name:NAME,start_url:'/?source=pwa',scope:'/',display:'standalone',background_color:'#f7f5f0',theme_color:'#141821',icons:[{src:'/assets/icon-192.png',sizes:'192x192',type:'image/png'},{src:'/assets/icon-512.png',sizes:'512x512',type:'image/png'}]}));
const V='ac-'+Date.now().toString(36),pre=['/','/calculator/','/compare/','/changes','/pro','/assets/style.css','/assets/app.js','/api/plans.json','/offline'];
W('sw.js',`const V='${V}',PRE=${JSON.stringify(pre)};self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>c.addAll(PRE)).then(()=>self.skipWaiting())));self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put(r,c));return res}).catch(()=>caches.match(r).then(m=>m||(r.mode==='navigate'?caches.match('/offline'):undefined))))});`);
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
${prose(`<h2 class="h3">The information</h2><ul><li>Prices, MAU/MRU and SSO fees come from each vendor’s public pricing page, with the source and check date on every row (<a href="/methodology">methodology</a>). Vendors change prices without notice, so data can be wrong or out of date. Always confirm on the vendor’s page before buying.</li><li>Nothing here is financial, legal or procurement advice. The site is provided “as is”, without warranties.</li><li>${NAME} is not affiliated with any vendor. Trademarks belong to their owners. ${ANY_AFF?'Some outbound links are affiliate links; they are labeled and never affect ranking.':'There are no affiliate links today; if we add any they will be labeled and will not affect ranking.'}</li></ul>
<h2 class="h3">Using the data</h2><p>The ledger data (JSON/CSV on <a href="/data">/data</a>) is licensed <a href="https://creativecommons.org/licenses/by/4.0/" rel="noopener">CC BY 4.0</a>: reuse it freely with attribution to “${NAME}” and a link to ${SITE}/. Please don’t scrape the site at a rate that degrades it; use the files instead.</p>
<h2 class="h3">Pro</h2><ul><li>Pro costs $9/month or $90/year and is sold through Kit’s hosted checkout; payments are processed by Stripe via Kit. Prices are in USD; taxes may apply.</li><li>Pro is sold at a founding price. You get what the <a href="/pro">Pro page</a> describes; anything not live yet is delivered when it ships, and nothing is promised before then.</li><li>Cancel anytime from your Kit receipt or by emailing us; you keep access until the end of the period you paid for. For refund requests, email <a href="${CONTACT}">${MAIL}</a>; we also honor any refund rights your local consumer law gives you.</li></ul>
<h2 class="h3">Sponsor slots</h2><ul><li>A founding newsletter slot is $49 per placement, sold through Kit. Sponsors are always labeled “Sponsor” and never affect data or ranking. We accept auth, identity and security-adjacent sponsors only; if we can’t run a placement you paid for, we refund it.</li></ul>
<h2 class="h3">Liability</h2><p>To the extent the law allows, our total liability for any claim about the site or a paid product is limited to what you paid us in the 12 months before the claim. Nothing here limits rights you have under consumer law that can’t be waived.</p>
<h2 class="h3">Changes and contact</h2><p>We may update these terms; the date at the top shows the latest version. Questions: <a href="${CONTACT}">${MAIL}</a>. Privacy: <a href="/privacy">how we handle data</a>.</p>`)}`});
page({file:'about.html',title:`About | ${NAME}`,desc:`${NAME} is an independent auth pricing ledger: Clerk, Auth0, Cognito, WorkOS and more, every price sourced and dated. How it is kept, how it makes money, and how to reach us.`,body:`${legalHero('About',`About ${NAME}`,`An independent ledger of auth and identity pricing: base plan plus MAU/MRU and SSO fees, with the source and check date on every row.`)}
${prose(`<ul><li><b>How it’s kept.</b> Prices are read only from vendors’ own pricing pages, re-checked by a script and logged when they change. Unknowns stay blank; we never estimate a price. Details: <a href="/methodology">methodology</a>.</li><li><b>How it’s paid for.</b> The ledger, calculator, comparisons and data are free. Revenue comes from optional <a href="/pro">Pro</a> alerts and labeled <a href="/sponsor">newsletter sponsor slots</a>. ${ANY_AFF?'Some outbound links are affiliate links.':'There are no affiliate links today.'} No one pays for placement.</li><li><b>Who runs it.</b> ${NAME} is published by the same independent operator as the pricing ledgers <a href="https://o11y-watch.pages.dev/" rel="noopener">O11y Watch</a>, <a href="https://ratecardai.pages.dev/" rel="noopener">Ratecard</a> and <a href="https://vpsledger.pages.dev/" rel="noopener">VPSLedger</a>. Source code: <a href="https://github.com/Basileion/authcost" rel="noopener">github.com/Basileion/authcost</a>.</li><li><b>Contact.</b> Corrections, sponsor questions or data requests: <a href="${CONTACT}">${MAIL}</a>.</li></ul>`)}`});
page({file:'offline.html',title:`Offline | ${NAME}`,desc:'Offline',body:`<section class="hero"><h1>You are offline.</h1><a class="btn" href="/">Open the ledger</a></section>`});
page({file:'404.html',title:`Not found | ${NAME}`,desc:'Not found',body:`<section class="hero"><h1>Page not found.</h1><a class="btn" href="/">Back to the ledger</a></section>`});

if(INDEXNOW_KEY)W(INDEXNOW_KEY+'.txt',INDEXNOW_KEY);
const sm=urls.filter(u=>!NOINDEX.map(cleanPath).includes(u)&&!NOSITEMAP.includes(u));
W('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sm.map(u=>`<url><loc>${SITE}/${u}</loc><lastmod>${['privacy','terms','about'].includes(u)?LEGAL_UPDATED:lastChecked}</lastmod></url>`).join('')}</urlset>`);
W('robots.txt',`User-agent: *\nAllow: /\n\n${['GPTBot','OAI-SearchBot','ChatGPT-User','PerplexityBot','ClaudeBot','Google-Extended','Applebot-Extended','Bingbot'].map(b=>`User-agent: ${b}\nAllow: /`).join('\n\n')}\n\nSitemap: ${SITE}/sitemap.xml\n`);
W('_headers',`/sw.js\n  Cache-Control: no-cache\n/api/*\n  Access-Control-Allow-Origin: *\n`);

// Client data blob for app.js
W('api/estimate-meta.json',JSON.stringify({scenarios:SCENARIOS,lastChecked,nVer}));

for(const f of ['style.css','app.js'])W('assets/'+f,fs.readFileSync(R('src/'+f)));
if(fs.existsSync(R('assets')))fs.cpSync(R('assets'),path.join(D,'assets'),{recursive:true});

W('_redirects','/calculator.html /calculator/ 301\n');
// Guard (RT-20261031-02): internal links must use clean URLs (Cloudflare Pages 308s /x.html -> /x and /dir -> /dir/).
{const bad=[];const walk=d=>{for(const f of fs.readdirSync(d)){const p=path.join(d,f);if(fs.statSync(p).isDirectory())walk(p);else if(/\.(html|txt|xml|js|json|webmanifest)$/.test(f)){const s=fs.readFileSync(p,'utf8');const re=/(?:href=["']|src=["']|\(|["'`]|https?:\/\/authcost\.pages\.dev|localhost:4190)\/[^"'`\s)<>]*\.html\b/g;let x;while((x=re.exec(s)))bad.push(path.relative(D,p)+': '+x[0]);for(const dir of ['calculator','compare','guides','vendors','alternatives']){const r2=new RegExp('(?:href="|'+SITE.replace(/[.\/]/g,'\\$&')+')/'+dir+'(?=["\\s)#?])','g');let y;while((y=r2.exec(s)))bad.push(path.relative(D,p)+': '+y[0]+' (missing trailing slash)')}}}};walk(D);if(bad.length){console.error('Internal .html / redirecting links found ('+bad.length+'):\n'+bad.slice(0,30).join('\n'));process.exit(1)}}
// Guards RT-20261031-57/59/60. Never disable: fix the cause.
{const files=[];const walk=d=>{for(const f of fs.readdirSync(d)){const p=path.join(d,f);if(fs.statSync(p).isDirectory())walk(p);else if(/\.(html|txt)$/.test(f))files.push(p)}};walk(D);
 const bad=[];const ASSUME=`${FED_PER_CONN} SSO users per connection`;
 const SSO_RESULT=/· [1-9]\d* SSO\b|\+ [1-9]\d* SSO<|\b[1-9]\d* SSO connections \(\d+ plans|\b[1-9]\d* connections?<\/th>|id="c-fpc"/; // scenario-result markers, not plan descriptions
 const ORGRE=new RegExp(ORG_NAMES.join('|'));
 const FEDRE=new RegExp(FED_NAMES.map(n=>n.split(/[ /]/)[0]).join('|'));
 for(const p of files){const rel=path.relative(D,p);const s=fs.readFileSync(p,'utf8');
  // RT-57: any page publishing an SSO scenario result must carry the SSO-users-per-connection disclosure
  if(rel.endsWith('.html')&&!['404.html','offline.html'].includes(rel)&&SSO_RESULT.test(s)&&!s.includes(ASSUME))bad.push(`RT-57 ${rel}: SSO scenario result without "${ASSUME}" disclosure`);
  // RT-57 inline: every answer clause that prices an SSO scenario for a per-SSO-user vendor states the assumption
  for(const m of s.matchAll(/"text":"([^"]*)"/g))for(const seg of m[1].split(/; |\. /))if(/· [1-9]\d* SSO\b/.test(seg)&&FEDRE.test(seg)&&!seg.includes(ASSUME)&&/(wins|tie)/.test(seg))bad.push(`RT-57 ${rel}: JSON-LD answer clause prices a per-SSO-user vendor without the assumption: ${seg.slice(0,120)}`);
  // RT-56: any page publishing an SSO scenario result states the org assumption; JSON-LD SSO clauses naming an org-pricing vendor too
  if(rel.endsWith('.html')&&!['404.html','offline.html'].includes(rel)&&SSO_RESULT.test(s)&&!s.includes(ORG_SHORT))bad.push(`RT-56 ${rel}: SSO scenario result without "${ORG_SHORT}" disclosure`);
  for(const m of s.matchAll(/"text":"([^"]*)"/g))for(const seg of m[1].split(/; |\. /))if(/· [1-9]\d* SSO\b/.test(seg)&&ORGRE.test(seg)&&/(wins|tie)/.test(seg)&&!seg.includes(ORG_SHORT))bad.push(`RT-56 ${rel}: JSON-LD SSO answer names an org-pricing vendor without the org assumption: ${seg.slice(0,120)}`);
  // RT-60 lint: ties are ties, never "$0/yr less|more" or a ranked $0
  const t=s.match(/\$0\/yr (?:less|more)|\$0(?:\.00)?\/mo ranks #|\$0(?:\.00)?\/mo \(\$0\/yr/g);if(t)bad.push(`RT-60 ${rel}: tie rendered as a win/rank (${t[0]})`);
  if(/understates Clerk/.test(s))bad.push(`RT-60 ${rel}: backwards MAU/MRU sentence`);
  // RT-59: the inflated max-min headline must not come back on the home page
  if(rel==='index.html'&&/differ by up to/.test(s))bad.push('RT-59 index.html: max-minus-min "differ by up to" headline');
 }
 // RT-56: every SSO answer clause that prices a vendor with a published org fee states that fee (and the org assumption)
 for(const a of ORG_AUDIT){if(a.zs.some(z=>ORG_VIDS.includes(z.p.vendor_id))&&!a.text.includes(ORG_SHORT))bad.push(`RT-56 ${a.where}: SSO answer omits the org assumption: ${a.text.slice(0,140)}`);for(const z of a.zs)if(z.e.org>EPS&&!a.text.includes(usd(z.e.org)))bad.push(`RT-56 ${a.where}: SSO answer prices ${z.p.vendor} ${z.p.plan} at ${usd(z.e.total)}/mo without its ${usd(z.e.org)}/mo org fee`)}
 if(!ORG_AUDIT.length)bad.push('RT-56: no SSO answers audited (audit hook missing)');
 // RT-60 precision: every published per-user rate renders at its published precision
 for(const p of plans)for(const v of [p.overage_per_user,...(p.overage_bands||[]).map(b=>b.rate)].filter(x=>x!=null))if(Math.abs(parseFloat(usd(v).replace(/[$,]/g,''))-v)>1e-12)bad.push(`RT-60 precision: ${p.id} rate ${v} renders as ${usd(v)}`);
 const home=fs.readFileSync(path.join(D,'index.html'),'utf8');for(const p of plans)if(p.overage_per_user!=null&&!home.includes(usd(p.overage_per_user)))bad.push(`RT-60 precision: ledger lacks ${p.id} overage ${usd(p.overage_per_user)}`);
 // RT-20261031-93: every answer that states a SCIM figure matches the ledger (recomputed here), and no page prints an unaudited SCIM figure
 const scimExpect=new Set();
 for(const a of SCIM_AUDIT){for(const z of a.zs){const e=estimate(z.p,a.mau,a.sso,{scim:a.scim});if(!e||e.total==null){bad.push(`RT-93 ${a.where}: ${z.p.id} cannot price ${a.sso} SSO + ${a.scim} SCIM`);continue}
   const want=`${z.p.vendor} ${z.p.plan} ${usd(e.total)}/mo incl. ${usd(e.scim)}/mo SCIM`;scimExpect.add(want);if(!a.text.includes(want))bad.push(`RT-93 ${a.where}: SCIM answer should read "${want}": ${a.text.slice(0,140)}`)}
  if(!a.text.includes(SCIM_SHORT))bad.push(`RT-93 ${a.where}: SCIM answer omits "${SCIM_SHORT}"`);
  if(/Scalekit/.test(a.text)){const k=skCost(a.mau,a.sso,a.scim);if(!k||!a.text.includes(`Scalekit ${k.plan} ${usd(k.total)}/mo with ${usd(k.scim)}/mo for SCIM`))bad.push(`RT-93 ${a.where}: Scalekit SCIM reference does not match its published ladder`)}}
 if(!SCIM_AUDIT.length)bad.push('RT-93: no SCIM answers audited (audit hook missing)');
 for(const p of plans)if(p.status==='verified'&&(!p.scim_model||!p.scim_source||!p.scim_checked))bad.push(`RT-93 data: ${p.id} lacks scim_model / scim_source / scim_checked`);
 let scimSeen=0;for(const p of files){const s=fs.readFileSync(p,'utf8').replace(/&amp;/g,'&');for(const m of s.matchAll(/\$[\d,.]+\/mo incl\. \$[\d,.]+\/mo SCIM/g)){scimSeen++;const end=m.index+m[0].length;if(![...scimExpect].some(w=>s.slice(end-w.length,end)===w))bad.push(`RT-93 ${path.relative(D,p)}: SCIM figure not matching the ledger: "${s.slice(Math.max(0,m.index-70),end)}"`)}}
 if(bad.length){console.error('Build guards failed ('+bad.length+'):\n'+bad.slice(0,40).join('\n'));process.exit(1)}
 console.log(`guards ok: RT-93 SCIM figures in ${SCIM_AUDIT.length} answers (${scimSeen} printed), RT-56 org fees in ${ORG_AUDIT.length} SSO answers, RT-57 SSO-assumption disclosure, RT-59 hero, RT-60 ties/precision/MAU-MRU`);}
console.log(`built ${urls.length} pages (${sm.length} in sitemap) → dist/ (${plans.length} plans, ${nVer} verified, ${vendors.length} vendors)`);

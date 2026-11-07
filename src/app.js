const $=(s,r=document)=>r.querySelector(s); const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const usd=v=>v==null||Number.isNaN(v)?'—':'$'+Number(v).toLocaleString('en-US',{minimumFractionDigits:v%1?2:0,maximumFractionDigits:2});
const yr=v=>'$'+Math.round(v*12).toLocaleString('en-US');

// Theme toggle
const tt=$('#tt');
if(tt) tt.addEventListener('click',()=>{
  const cur=document.documentElement.dataset.theme||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
  const next=cur==='dark'?'light':'dark';
  document.documentElement.dataset.theme=next;
  try{localStorage.setItem('ac-theme',next)}catch(e){}
});

// RT-20261031-57: per-SSO-user vendors (Firebase / Identity Platform, Supabase, Cognito) need SSO users; default 200 per connection.
const FED_PER_CONN=200;
const isFed=p=>p.federated_per_mau!=null||p.sso_saml_per_mau!=null;
// RT-20261031-56: B2B organizations / tenants. SSO implies at least 1 customer organization per SSO connection.
// Members per org default to the SSO-users-per-connection figure (FED_PER_CONN), capped at users ÷ orgs.
// Returns null when the plan cannot hold that many orgs (published cap, or a required add-on we cannot price on it).
function orgCost(plan, mau, sso=0, opts={}){
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
function volumeConnCost(n, bands){
  if(n<=0) return 0;
  if(!bands||!bands.length) return null;
  const band=bands.find(b=>n>=b.from&&n<=b.to); if(!band) return null;
  let cost=n*band.rate;
  const next=bands.find(b=>b.from>band.to)||bands.find(b=>b.from>n);
  if(next) cost=Math.min(cost, next.from*next.rate);
  return cost;
}
function scimCost(plan, sso=0, scim=0){
  const need=Math.max(0, sso|0), n=Math.min(Math.max(0, Math.floor(+scim||0)), need);
  const r={fee:0,n,note:''};
  if(!n) return r;
  const m=plan.scim_model, f$=v=>'$'+v.toLocaleString('en-US'), pl=(k,w)=>k+' '+w+(k===1?'':'s');
  if(m==='included'){ r.note=`SCIM: ${pl(n,'customer')} on included SCIM, no separate fee printed.`; return r; }
  if(m==='pooled'){
    const bands=plan.scim_bands||plan.sso_bands;
    if(bands&&bands.length){
      const ladder=tot=>{
        if(plan.sso_bands_all) return volumeConnCost(tot, bands);
        let c=0;for(let i=1;i<=tot;i++){const b=bands.find(x=>i>=x.from&&i<=x.to);if(!b)return null;c+=b.rate}return c;
      };
      const before=ladder(need), after=ladder(need+n);
      if(before==null||after==null) return null;
      r.fee=after-before;
      r.note=`SCIM shares the SSO connection ladder: ${need} SSO + ${n} SCIM = ${need+n} connections; SCIM adds ${f$(r.fee)}/mo.`;
      return r;
    }
    const inc=plan.scim_included||0, before=Math.max(0,need-inc), after=Math.max(0,need+n-inc); r.fee=(after-before)*plan.scim_extra_mo; r.note=`SCIM shares the ${inc} included SSO-or-SCIM connections: ${need} SSO + ${n} SCIM = ${need+n}; SCIM adds ${f$(r.fee)}/mo.`; return r;
  }
  if(m==='separate'){ const inc=plan.scim_included||0; let c=0; for(let i=inc+1;i<=n;i++){ const b=(plan.scim_bands||[]).find(x=>i>=x.from&&i<=x.to); if(!b) return null; c+=b.rate; } r.fee=c; r.note=`SCIM / Directory Sync is a separate connection: ${pl(n,'connection')} (${inc} included) = ${f$(c)}/mo${plan.scim_billing_starts?`, billed from ${plan.scim_billing_starts} ($0 before)`:''}.`; return r; }
  return null;
}
function estimate(plan, mau, sso=0, opts={}){
  if(plan.status!=='verified') return null;
  const out={base:0,users:0,sso:0,scim:0,scimN:0,mfa:0,org:0,orgs:0,orgLabel:'',total:null,notes:[]};
  const tierRow=plan.price_tiers?plan.price_tiers.find(t=>mau<=t.mau):null;
  if(plan.price_tiers && !tierRow) return null;
  if(plan.sso_max!=null && (sso|0)>plan.sso_max) return null;
  if(!plan.price_tiers){
  if(plan.tier==='free' && plan.included_users!=null && mau>plan.included_users && plan.overage_per_user==null && !plan.overage_per_1m_mau) return null;
  if(plan.included_users!=null && mau>plan.included_users && plan.overage_per_user==null && !plan.overage_bands && !plan.overage_per_1m_mau) return null;
  }
  out.base=tierRow?tierRow.mo:(plan.base_mo??0);
  if(tierRow) out.notes.push('Tier up to '+tierRow.mau.toLocaleString('en-US')+' MAU');
  if(tierRow){}
  else if(plan.overage_per_1m_mau!=null){
    const extra=Math.max(0, mau - (plan.included_users||0));
    out.users=Math.ceil(extra/1e6)*plan.overage_per_1m_mau;
  } else if(plan.overage_bands && plan.included_users!=null){
    let rem=Math.max(0, mau - plan.included_users), cursor=plan.included_users;
    for(const b of plan.overage_bands){
      if(rem<=0) break;
      const cap=b.to==null?Infinity:b.to;
      const take=Math.min(rem, Math.max(0, cap - cursor));
      out.users+=take*b.rate; rem-=take; cursor+=take;
    }
  } else if(plan.overage_per_user!=null && plan.included_users!=null){
    out.users=Math.max(0, mau - plan.included_users)*plan.overage_per_user;
  } else if(plan.user_unit==='token'){ out.notes.push('Token billing: base + SSO only'); }

  const need=Math.max(0, sso|0);
  if(plan.sso_unlimited){ out.sso=0; }
  else if(need===0){ out.sso=0; }
  else if(plan.sso_bands){
    const included=plan.sso_included||0;
    if(plan.sso_bands_all){
      const full=volumeConnCost(need, plan.sso_bands);
      if(full==null) return null;
      if(included<=0) out.sso=full;
      else { const free=volumeConnCost(Math.min(included, need), plan.sso_bands); out.sso=full-(free||0); }
    } else {
    let cost=0;
    if(plan.vendor_id==='workos'){
      for(let i=1;i<=need;i++){ const band=plan.sso_bands.find(b=>i>=b.from&&i<=b.to)||plan.sso_bands.at(-1); cost+=band.rate; }
    } else {
      for(let i=1;i<=need;i++){ if(i<=included) continue; const band=plan.sso_bands.find(b=>i>=b.from&&i<=b.to)||plan.sso_bands.at(-1); cost+=band.rate; }
    }
    out.sso=cost;
    }
  } else if(plan.federated_per_mau!=null){
    const fedMau=opts.federated_mau??(need*FED_PER_CONN);
    out.sso=Math.max(0, fedMau-(plan.federated_free??0))*plan.federated_per_mau;
    out.notes.push(`SSO billed per SSO user: ${need} connection${need>1?'s':''} × ${Math.round(fedMau/need).toLocaleString('en-US')} = ${fedMau.toLocaleString('en-US')} SSO users (${plan.federated_free??0} free, then $${plan.federated_per_mau}/user).`);
  } else if(plan.sso_saml_per_mau!=null){
    const fedMau=opts.federated_mau??(need*FED_PER_CONN);
    out.sso=Math.max(0, fedMau-(plan.sso_saml_included_mau??0))*plan.sso_saml_per_mau;
    out.notes.push(`SAML billed per SSO user: ${need} connection${need>1?'s':''} × ${Math.round(fedMau/need).toLocaleString('en-US')} = ${fedMau.toLocaleString('en-US')} SSO users (${plan.sso_saml_included_mau??0} free, then $${plan.sso_saml_per_mau}/user).`);
  } else if(plan.sso_extra_mo!=null){
    out.sso=Math.max(0, need-(plan.sso_included||0))*plan.sso_extra_mo;
  } else if(need>(plan.sso_included||0)){
    return null;
  }
  const sc=scimCost(plan, need, opts.scim);
  if(sc==null) return null;
  out.scim=sc.fee; out.scimN=sc.n; if(sc.n) out.notes.push(sc.note);
  out.mfa=0;
  if(opts.mfa){
    if(plan.mfa_available===false){
      out.notes.push('Plan publishes no MFA — omitted when MFA required.');
      return null;
    }
    if(plan.mfa_extra_mo!=null){
      out.mfa=plan.mfa_extra_mo;
      out.notes.push('MFA add-on $'+plan.mfa_extra_mo+'/mo (verified).');
    }
  }
  const oc=orgCost(plan, mau, need, opts);
  if(oc==null) return null;
  out.org=oc.fee; out.orgs=oc.orgs; out.orgLabel=oc.label; if(oc.orgs) out.notes.push(oc.note);
  out.total=out.base+out.users+out.sso+out.scim+out.mfa+out.org;
  return out;
}

async function loadPlans(){
  const j=await fetch('/api/plans.json').then(r=>r.json());
  return j.plans;
}

// Home mini-check
const kOut=$('#k-out'), kMau=$('#k-mau'), kSso=$('#k-sso');
async function renderHome(){
  if(!kOut) return;
  const plans=await loadPlans();
  const mau=+kMau.value||0, sso=+kSso.value||0;
  const ranked=plans.map(p=>{const e=estimate(p,mau,sso);return e&&e.total!=null?{p,e}:null}).filter(Boolean).sort((a,b)=>a.e.total-b.e.total);
  if(!ranked.length){ kOut.innerHTML='<p class="note">No verified plan can price this scenario (e.g. Auth0 above its top published tier — 50k B2C / 20k B2B — is Enterprise, contact sales).</p>'; return; }
  const top=ranked.slice(0,5);
  const ties=ranked.filter(x=>Math.abs(x.e.total-top[0].e.total)<1e-9).length;
  const fedShown=sso>0&&top.some(x=>isFed(x.p));
  kOut.innerHTML=`<p><b>Cheapest:</b> ${ties>1?`${ties} plans tie at <b>${usd(top[0].e.total)}/mo</b>, e.g. ${top[0].p.vendor} ${top[0].p.plan}`:`${top[0].p.vendor} ${top[0].p.plan} at <b>${usd(top[0].e.total)}/mo</b> (${yr(top[0].e.total)}/yr)`}</p>
  <ol style="margin:8px 0 0;padding-left:18px">${top.map(x=>`<li>${x.p.vendor} ${x.p.plan}: ${usd(x.e.total)}/mo${sso>0&&isFed(x.p)?'†':''}${x.e.org>0?'‡':''}</li>`).join('')}</ol>
  ${fedShown?`<p class="note">† Bills SSO per SSO user: assumes ${FED_PER_CONN} SSO users per connection. <a href="/calculator/?mau=${mau}&sso=${sso}&fpc=${FED_PER_CONN}">Change it</a>.</p>`:''}
  ${top.some(x=>x.e.org>0)?`<p class="note">‡ Includes B2B organization fees: assumes 1 customer organization per SSO connection (e.g. Clerk’s $100/mo B2B Authentication add-on above 20 members per org). <a href="/calculator/?mau=${mau}&sso=${sso}&org=${sso}">Set your org count</a>.</p>`:''}
  <p class="note">${ranked.length} plans ranked · <a href="/calculator/?mau=${mau}&sso=${sso}&mfa=0">Open full calculator</a></p>`;
  const pro=$('#k-pro');
  if(pro) pro.href=`/pro?mau=${mau}&sso=${sso}`;
}
if(kOut){ [kMau,kSso].forEach(el=>el&&el.addEventListener('input',renderHome)); renderHome(); }

// Home table filter
const q=$('#q'), vo=$('#vo'), count=$('#count');
function filterTable(){
  const rows=$$('#plans tbody tr'); if(!rows.length) return;
  const qq=(q?.value||'').toLowerCase(), only=vo?.checked;
  let n=0;
  rows.forEach(tr=>{
    const okQ=!qq||(tr.dataset.q||'').includes(qq);
    const okV=!only||tr.dataset.status==='verified';
    const show=okQ&&okV; tr.hidden=!show; if(show) n++;
  });
  if(count) count.textContent=n+' shown';
}
if($('#plans')){ [q,vo].forEach(el=>el&&el.addEventListener('input',filterTable)); vo&&vo.addEventListener('change',filterTable); filterTable(); }

// Calculator
const rank=$('#rank'), cMau=$('#c-mau'), cSso=$('#c-sso'), cFed=$('#c-fpc'), cOrg=$('#c-org'), cScim=$('#c-scim'), cMpo=$('#c-mpo'), cMfa=$('#c-mfa'), cVo=$('#c-vo'), cSave=$('#c-save');
const cUrl=$('#c-url'), cEmbed=$('#c-embed'), cSh=$('#c-sh'), cBack=$('#c-back');
let calcTracked=false, calcPlans=null;

function calcParams(){
  const mau=+cMau?.value||0, sso=+cSso?.value||0;
  const fpc=cFed&&cFed.value!==''?Math.max(0,+cFed.value||0):FED_PER_CONN;
  const mfa=!!cMfa?.checked, vo=cVo?!!cVo.checked:true;
  const org=Math.max(0,Math.floor(+cOrg?.value||0)), mpo=cMpo&&cMpo.value!==''?Math.max(0,+cMpo.value||0):null;
  const scim=Math.max(0,Math.floor(+cScim?.value||0)); // RT-20261031-93; old links without scim= read as 0
  return {mau,sso,fpc,fed:sso*fpc,mfa,vo,org,mpo,scim};
}

function shareUrl(opts={}){
  const {mau,sso,fpc,mfa,vo,org,mpo,scim}=calcParams();
  const u=new URL(location.origin+'/calculator/');
  u.searchParams.set('mau',String(mau));
  u.searchParams.set('sso',String(sso));
  u.searchParams.set('fpc',String(fpc));
  if(scim>0) u.searchParams.set('scim',String(scim));
  u.searchParams.set('org',String(org)); // RT-20261031-56; old links without org= read as 0 (B2C; SSO still implies 1 org per connection)
  if(mpo!=null) u.searchParams.set('mpo',String(mpo));
  u.searchParams.set('mfa',mfa?'1':'0');
  u.searchParams.set('vo',vo?'1':'0');
  if(opts.embed) u.searchParams.set('embed','1');
  return u;
}

function syncShareUI(){
  const full=shareUrl();
  const emb=shareUrl({embed:true});
  if(cUrl) cUrl.value=full.toString();
  if(cEmbed) cEmbed.value=`<iframe src="${emb.toString()}" title="AuthCost MAU cost calculator" width="100%" height="720" style="border:1px solid #e6e2d9;border-radius:10px" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
  if(cBack){ cBack.href=full.pathname+full.search; }
}

async function renderCalc(){
  if(!rank) return;
  if(new URLSearchParams(location.search).get('embed')==='1') document.body.classList.add('embed');
  const params=new URLSearchParams(location.search);
  if(params.has('mau')&&cMau&&!cMau.dataset.touched) cMau.value=params.get('mau');
  if(params.has('sso')&&cSso&&!cSso.dataset.touched) cSso.value=params.get('sso');
  if(cFed&&!cFed.dataset.touched){
    if(params.has('fpc')) cFed.value=params.get('fpc');
    else if(params.has('fed')){ const s0=+(params.get('sso')||0); if(s0>0) cFed.value=String(Math.round((+params.get('fed')||0)/s0)); } // legacy total federated MAU links
  }
  if(params.has('org')&&cOrg&&!cOrg.dataset.touched) cOrg.value=params.get('org');
  if(params.has('scim')&&cScim&&!cScim.dataset.touched) cScim.value=params.get('scim');
  if(params.has('mpo')&&cMpo&&!cMpo.dataset.touched) cMpo.value=params.get('mpo');
  if(params.has('mfa')&&cMfa&&!cMfa.dataset.touched) cMfa.checked=params.get('mfa')==='1';
  if(params.has('vo')&&cVo&&!cVo.dataset.touched) cVo.checked=params.get('vo')!=='0';
  if(!calcPlans) calcPlans=await loadPlans();
  const {mau,sso,fpc,fed,mfa,vo,org,mpo,scim}=calcParams();
  const effScim=Math.min(scim,sso);
  const effOrg=Math.max(org,sso);
  const ranked=calcPlans.map(p=>{const e=estimate(p,mau,sso,{federated_mau:fed,mfa,orgs:org,org_members:mpo,scim});return e&&e.total!=null?{p,e}:null}).filter(Boolean)
    .filter(x=>!vo||x.p.status==='verified').sort((a,b)=>a.e.total-b.e.total);
  const cheapest=ranked[0];
  const nTie=cheapest?ranked.filter(y=>Math.abs(y.e.total-cheapest.e.total)<1e-9).length:0;
  if(cSave) cSave.innerHTML=cheapest?(nTie>1?`<b>Lowest estimate:</b> ${nTie} plans tie at ${usd(cheapest.e.total)}/mo among ${ranked.length} plans.`:`<b>Lowest estimate:</b> ${cheapest.p.vendor} ${cheapest.p.plan} at ${usd(cheapest.e.total)}/mo (${yr(cheapest.e.total)}/yr) among ${ranked.length} plans.`)+(sso>0&&isFed(cheapest.p)?` Bills SSO per SSO user, at ${fpc.toLocaleString('en-US')} SSO users per connection.`:''):'No verifiable plans for this scenario.';
  if(cSave&&effOrg>0) cSave.innerHTML+=` <span class="note" data-org-calc>B2B: priced for ${effOrg.toLocaleString('en-US')} organization${effOrg>1?'s':''}${org<sso?' (1 per SSO connection)':''} with ${Math.round(Math.min(mpo!=null?mpo:(sso>0?fpc:FED_PER_CONN),mau>0?Math.ceil(mau/effOrg):Infinity)).toLocaleString('en-US')} members each${mpo==null?' (default: SSO users per connection, capped at users ÷ orgs)':''}; plans over a published org cap are left out.</span>`;
  if(cSave&&scim>0) cSave.innerHTML+=` <span class="note" data-scim-calc>SCIM: priced for ${effScim} customer${effScim===1?'':'s'}${scim>sso?` (capped at your ${sso} SSO connection${sso===1?'':'s'}: every SCIM customer is also an SSO customer)`:''}; plans without a published SCIM price are left out.</span>`;
  const pos=x=>1+ranked.filter(y=>y.e.total<x.e.total-1e-9).length, tie=x=>ranked.filter(y=>Math.abs(y.e.total-x.e.total)<1e-9).length>1;
  rank.innerHTML=ranked.map((x,i)=>`<tr><td class="n">${pos(x)}${tie(x)?'=':''}</td><td><a href="/vendors/${x.p.vendor_id}">${x.p.vendor}</a> · ${x.p.plan}</td>
    <td class="n">${usd(x.e.base)}</td><td class="n">${usd(x.e.users)}</td><td class="n">${usd(x.e.sso)}</td><td class="n">${usd(x.e.scim||0)}</td><td class="n">${usd(x.e.mfa||0)}</td><td class="n">${usd(x.e.org||0)}</td>
    <td class="n"><b>${usd(x.e.total)}</b></td><td class="n">${yr(x.e.total)}</td>
    <td class="src" style="white-space:normal">${(x.e.notes||[]).join(' ')||'—'}</td>
    <td><a class="btn ghost" style="padding:4px 8px;font-size:12px" href="${x.p.source}" rel="noopener">Source</a></td></tr>`).join('')||'<tr><td colspan="12">No results</td></tr>';
  const u=shareUrl();
  if(params.get('embed')==='1') u.searchParams.set('embed','1');
  history.replaceState(null,'',u.pathname+u.search+(location.hash||''));
  syncShareUI();
  if(!calcTracked && window.grow&&window.grow.track){
    calcTracked=true;
    window.grow.track('cta_click',{cta:'calculator_use'});
  }
}

async function copyText(text, okMsg){
  try{ await navigator.clipboard.writeText(text); if(cSh) cSh.textContent=okMsg; }
  catch(e){ if(cSh) cSh.textContent=text; }
}

if(rank){
  [cMau,cSso,cFed,cScim,cOrg,cMpo].forEach(el=>el&&el.addEventListener('input',()=>{el.dataset.touched='1';renderCalc()}));
  [cMfa,cVo].forEach(el=>el&&el.addEventListener('change',()=>{el.dataset.touched='1';renderCalc()}));
  $('#c-copy')?.addEventListener('click',()=>{copyText(shareUrl().toString(),'Share link copied'); window.grow?.track('cta_click',{cta:'calculator_share'});});
  $('#c-copy-embed')?.addEventListener('click',()=>{copyText(cEmbed?.value||'','Embed snippet copied'); window.grow?.track('cta_click',{cta:'calculator_embed'});});
  renderCalc();
}

// Self-hosted auth cost widget (/guides/self-hosted-auth-cost)
const shOut=$('#sh-out');
if(shOut){
  const ids=['sh-mau','sh-em','sh-emr','sh-sms','sh-smr','sh-inf','sh-h','sh-r'];
  let shPlans=null;
  const renderSH=async()=>{
    if(!shPlans) shPlans=await loadPlans();
    const [mau,em,emr,sms,smr,inf,h,r]=ids.map(i=>Math.max(0,+$('#'+i).value||0));
    const cash=mau*em/1000*emr+sms*smr+inf, labor=h*r, total=cash+labor;
    const ranked=shPlans.map(p=>{const e=estimate(p,mau,0);return e&&e.total!=null?{p,e}:null}).filter(Boolean).sort((a,b)=>a.e.total-b.e.total);
    const pick=vid=>ranked.find(x=>x.p.vendor_id===vid);
    const rows=[['Cheapest hosted',ranked[0]],['Clerk',pick('clerk')],['Auth0',pick('auth0')],['Firebase / Identity Platform',pick('firebase')],['Descope',pick('descope')]];
    const verdict=x=>{if(!x)return 'no published self-serve price at this volume';const d=x.e.total-total;const be=r>0?Math.max(0,(x.e.total-cash)/r):null;
      return `${usd(x.e.total)}/mo (${x.p.vendor} ${x.p.plan}): self-host is ${d>=0?'<b>'+usd(Math.round(d))+'/mo cheaper</b>':'<b>'+usd(Math.round(-d))+'/mo dearer</b>'}${be!=null?` · break-even at ${be.toFixed(1)} upkeep h/mo`:''}`};
    shOut.innerHTML=`<p><b>Self-host:</b> ${usd(Math.round(cash*100)/100)}/mo cash + ${usd(Math.round(labor))}/mo engineer time = <b>${usd(Math.round(total))}/mo</b> (${yr(total)}/yr)</p><ul style="margin:8px 0 0;padding-left:18px">${rows.map(([l,x])=>`<li>${l}: ${verdict(x)}</li>`).join('')}</ul><p class="note">${ranked.length} hosted plans priced at ${mau.toLocaleString('en-US')} users, no SSO/MFA · <a href="/calculator/?mau=${mau}&sso=0">open calculator</a></p>`;
  };
  ids.forEach(i=>$('#'+i)?.addEventListener('input',renderSH));
  renderSH();
}

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

function estimate(plan, mau, sso=0, opts={}){
  if(plan.status!=='verified') return null;
  const out={base:0,users:0,sso:0,mfa:0,total:null,notes:[]};
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
    let cost=0;
    const included=plan.sso_included||0;
    if(plan.vendor_id==='workos'){
      for(let i=1;i<=need;i++){ const band=plan.sso_bands.find(b=>i>=b.from&&i<=b.to)||plan.sso_bands.at(-1); cost+=band.rate; }
    } else {
      for(let i=1;i<=need;i++){ if(i<=included) continue; const band=plan.sso_bands.find(b=>i>=b.from&&i<=b.to)||plan.sso_bands.at(-1); cost+=band.rate; }
    }
    out.sso=cost;
  } else if(plan.federated_per_mau!=null){
    const fedMau=opts.federated_mau??(need*200);
    out.sso=Math.max(0, fedMau-(plan.federated_free??0))*plan.federated_per_mau;
  } else if(plan.sso_saml_per_mau!=null){
    const fedMau=opts.federated_mau??(need*200);
    out.sso=Math.max(0, fedMau-(plan.sso_saml_included_mau??0))*plan.sso_saml_per_mau;
  } else if(plan.sso_extra_mo!=null){
    out.sso=Math.max(0, need-(plan.sso_included||0))*plan.sso_extra_mo;
  } else if(need>(plan.sso_included||0)){
    return null;
  }
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
  out.total=out.base+out.users+out.sso+out.mfa;
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
  kOut.innerHTML=`<p><b>Cheapest:</b> ${top[0].p.vendor} ${top[0].p.plan} at <b>${usd(top[0].e.total)}/mo</b> (${yr(top[0].e.total)}/yr)</p>
  <ol style="margin:8px 0 0;padding-left:18px">${top.map(x=>`<li>${x.p.vendor} ${x.p.plan}: ${usd(x.e.total)}/mo</li>`).join('')}</ol>
  <p class="note">${ranked.length} plans ranked · <a href="/calculator/?mau=${mau}&sso=${sso}&mfa=0">Open full calculator</a></p>`;
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
const rank=$('#rank'), cMau=$('#c-mau'), cSso=$('#c-sso'), cFed=$('#c-fed'), cMfa=$('#c-mfa'), cVo=$('#c-vo'), cSave=$('#c-save');
const cUrl=$('#c-url'), cEmbed=$('#c-embed'), cSh=$('#c-sh'), cBack=$('#c-back');
let calcTracked=false, calcPlans=null;

function calcParams(){
  const mau=+cMau?.value||0, sso=+cSso?.value||0, fed=+cFed?.value||0;
  const mfa=!!cMfa?.checked, vo=cVo?!!cVo.checked:true;
  return {mau,sso,fed,mfa,vo};
}

function shareUrl(opts={}){
  const {mau,sso,fed,mfa,vo}=calcParams();
  const u=new URL(location.origin+'/calculator/');
  u.searchParams.set('mau',String(mau));
  u.searchParams.set('sso',String(sso));
  u.searchParams.set('fed',String(fed));
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
  if(params.has('fed')&&cFed&&!cFed.dataset.touched) cFed.value=params.get('fed');
  if(params.has('mfa')&&cMfa&&!cMfa.dataset.touched) cMfa.checked=params.get('mfa')==='1';
  if(params.has('vo')&&cVo&&!cVo.dataset.touched) cVo.checked=params.get('vo')!=='0';
  if(!calcPlans) calcPlans=await loadPlans();
  const {mau,sso,fed,mfa,vo}=calcParams();
  const ranked=calcPlans.map(p=>{const e=estimate(p,mau,sso,{federated_mau:fed,mfa});return e&&e.total!=null?{p,e}:null}).filter(Boolean)
    .filter(x=>!vo||x.p.status==='verified').sort((a,b)=>a.e.total-b.e.total);
  const cheapest=ranked[0];
  if(cSave) cSave.innerHTML=cheapest?`<b>Lowest estimate:</b> ${cheapest.p.vendor} ${cheapest.p.plan} at ${usd(cheapest.e.total)}/mo (${yr(cheapest.e.total)}/yr) among ${ranked.length} plans.`:'No verifiable plans for this scenario.';
  rank.innerHTML=ranked.map((x,i)=>`<tr><td class="n">${i+1}</td><td><a href="/vendors/${x.p.vendor_id}">${x.p.vendor}</a> · ${x.p.plan}</td>
    <td class="n">${usd(x.e.base)}</td><td class="n">${usd(x.e.users)}</td><td class="n">${usd(x.e.sso)}</td><td class="n">${usd(x.e.mfa||0)}</td>
    <td class="n"><b>${usd(x.e.total)}</b></td><td class="n">${yr(x.e.total)}</td>
    <td class="src" style="white-space:normal">${(x.e.notes||[]).join(' ')||'—'}</td>
    <td><a class="btn ghost" style="padding:4px 8px;font-size:12px" href="${x.p.source}" rel="noopener">Source</a></td></tr>`).join('')||'<tr><td colspan="10">No results</td></tr>';
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
  [cMau,cSso,cFed].forEach(el=>el&&el.addEventListener('input',()=>{el.dataset.touched='1';renderCalc()}));
  [cMfa,cVo].forEach(el=>el&&el.addEventListener('change',()=>{el.dataset.touched='1';renderCalc()}));
  $('#c-copy')?.addEventListener('click',()=>{copyText(shareUrl().toString(),'Share link copied'); window.grow?.track('cta_click',{cta:'calculator_share'});});
  $('#c-copy-embed')?.addEventListener('click',()=>{copyText(cEmbed?.value||'','Embed snippet copied'); window.grow?.track('cta_click',{cta:'calculator_embed'});});
  renderCalc();
}

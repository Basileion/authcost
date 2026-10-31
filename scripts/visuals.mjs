// Renders AuthCost OG images (1200x630) into assets/og/ with headless Chrome. Run: node scripts/visuals.mjs && PROD=1 node scripts/build.mjs
// Replaces OG images that had been copied from the sister VPS site (wrong brand and a Pro-only CSV claim). Figures come from data/*.json only.
import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import {execFileSync} from 'node:child_process';
const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');const A=p=>path.join(root,'assets',p);fs.mkdirSync(A('og'),{recursive:true});
const CH=process.env.CHROME_BIN||'/usr/bin/google-chrome';const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'ac-'));
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const rd=f=>JSON.parse(fs.readFileSync(path.join(root,'data',f),'utf8'));const plans=rd('plans.json'),vendors=rd('vendors.json'),changes=rd('changes.json');
const pid=id=>plans.find(p=>p.id===id);const usd=v=>'$'+v.toLocaleString('en-US');
const render=(body,out,w=1200,h=630)=>{const f=path.join(tmp,'p.html');fs.writeFileSync(f,`<!doctype html><meta charset=utf-8><style>@font-face{font-family:SS;src:url(file://${root}/assets/fonts/serif.woff2)}@font-face{font-family:IN;src:url(file://${root}/assets/fonts/inter.woff2)}*{box-sizing:border-box;margin:0}body{width:${w}px;height:${h}px;overflow:hidden;font-family:IN,ui-sans-serif,Arial,sans-serif;font-variant-numeric:tabular-nums}.s{font-family:SS,Georgia,serif;letter-spacing:-.02em}.m{font-family:ui-monospace,Menlo,"DejaVu Sans Mono",monospace}</style>${body}`);execFileSync(CH,['--headless=new','--no-sandbox','--disable-gpu','--hide-scrollbars','--force-device-scale-factor=1',`--window-size=${w},${h}`,`--screenshot=${out}`,'file://'+f],{stdio:'ignore'})};
const mark=fs.readFileSync(A('favicon.svg'),'utf8').replace('<svg ','<svg width="40" height="40" ');
const nVer=plans.filter(p=>p.status==='verified').length,last=plans.map(p=>p.checked).sort().at(-1);
const og=(eyebrow,title,sub,right='')=>`<div style="width:1200px;height:630px;background:#f7f5f0;color:#141821;padding:60px 72px;display:flex;flex-direction:column;border-top:10px solid #5b6cff">
<div style="display:flex;align-items:center;gap:14px;font-size:30px;font-weight:600" class="s">${mark}AuthCost</div>
<div style="display:flex;gap:48px;flex:1;align-items:center"><div style="flex:1"><div class="m" style="font-size:17px;letter-spacing:.14em;text-transform:uppercase;color:#3b47c4;font-weight:600">${esc(eyebrow)}</div>
<div class="s" style="font-size:${title.length>40?50:60}px;font-weight:600;line-height:1.08;margin:14px 0 18px">${esc(title)}</div><div style="font-size:24px;line-height:1.4;color:#3b4250">${esc(sub)}</div></div>${right}</div>
<div class="m" style="font-size:17px;color:#6b7180;border-top:1px solid #e4e1da;padding-top:16px">${vendors.length} vendors · ${nVer} verified plans · MAU + SSO + SCIM counted · every price sourced · checked ${last}</div></div>`;
const card=(h,rows)=>`<div style="width:430px;border:1px solid #e4e1da;background:#fff"><div class="m" style="display:flex;justify-content:space-between;padding:10px 16px;background:#f6f4ef;font-size:13px;letter-spacing:.08em;color:#6b7180"><span>${h[0]}</span><span>${h[1]}</span></div>${rows.map(([a,b])=>`<div style="display:flex;justify-content:space-between;gap:12px;padding:11px 16px;border-top:1px solid #efece6;font-size:18px"><span>${esc(a)}</span><span class="m">${esc(b)}</span></div>`).join('')}</div>`;
const paid=plans.filter(p=>p.status==='verified'&&p.tier==='paid'&&p.base_mo>0).sort((a,b)=>a.base_mo-b.base_mo).slice(0,6).map(p=>[`${p.vendor} ${p.plan}`,usd(p.base_mo)]);
// Pro proof (same facts as /pro; the build guard re-checks og/pro.txt against estimate())
const ck=pid('clerk-pro'),ds=changes.find(c=>c.vendor_id==='clerk'&&c.kind==='fee-start'),dsFee=ck.scim_bands[0].rate*(3-(ck.scim_included||0));
const be=pid('auth0-b2b-essentials'),t10=be.price_tiers.find(t=>t.mau===10000),t11=be.price_tiers.find(t=>t.mau>10000),a0Jump=t11.mo-t10.mo;
const proTxt=`Clerk Directory Sync billing starts ${ds.date}: +${usd(dsFee)}/mo for 3 SSO+SCIM customers. Auth0 B2B Essentials 10,000 -> 10,001 MAU: +${usd(a0Jump)}/mo.`;
fs.writeFileSync(A('og/pro.txt'),proTxt+'\n');
render(og('Auth price ledger',`Auth pricing without the surprise bill.`,'Base fee, MAU/MRU, SSO and SCIM added up for your user count. Every price linked to the vendor’s own page.',card(['PAID PLAN','FROM / MO'],paid)),A('og/home.png'));
render(og('Auth cost calculator','Your MAU, SSO and SCIM in. Every plan ranked.','Monthly and yearly list price per vendor, with the assumptions shown.',card(['PAID PLAN','FROM / MO'],paid.slice(0,4))),A('og/calculator.png'));
render(og('Compare',`Clerk vs Auth0 vs ${vendors.length-2} more, on the whole bill.`,'Head to head at 10k, 50k and 100k users, with and without enterprise SSO.'),A('og/compare.png'));
render(og('Price log','Every auth price change, dated and sourced.','Fee starts, new tiers and our own corrections, from official pricing pages.'),A('og/changes.png'));
render(og('AuthCost Pro · $9/mo or $90/yr','The SSO tax change for your scenario, by email.','When a vendor changes a price, you get the before/after $/mo for your MAU, SSO and SCIM.',card(['LOGGED CHANGE / CLIFF','$ / MO'],[[`Clerk Pro · 3 SSO+SCIM · from ${ds.date.slice(0,7)}`,`+${usd(dsFee)}`],['Auth0 B2B Essentials 10,001 MAU',`+${usd(a0Jump)}`],['Ledger CSV / JSON','free']])),A('og/pro.png'));
render(og('Sponsorship','Reach founders picking an auth stack.','One labeled sponsor per newsletter. Never affects rankings. Founding rates.'),A('og/sponsor.png'));
fs.rmSync(tmp,{recursive:true,force:true});console.log('visuals done: '+proTxt);

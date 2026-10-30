import fs from 'node:fs'; import path from 'node:path';
const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
const key=fs.readFileSync(path.join(root,'indexnow.key'),'utf8').trim();
const site=(process.env.SITE_URL||'https://authcost.pages.dev').replace(/\/$/,'');
const sm=fs.readFileSync(path.join(root,'dist/sitemap.xml'),'utf8');
const urls=[...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
const body={host:new URL(site).host,key,keyLocation:`${site}/${key}.txt`,urlList:urls.slice(0,10000)};
const r=await fetch('https://api.indexnow.org/indexnow',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
console.log(r.status, await r.text());

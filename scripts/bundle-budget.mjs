#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const DIST=process.env.DIST || "dist";
const MAX_ENTRY_JS=Number(process.env.MAX_ENTRY_JS || 270_000);
const MAX_ENTRY_CSS=Number(process.env.MAX_ENTRY_CSS || 110_000);

const htmlPath=path.join(DIST,"index.html");
if(!fs.existsSync(htmlPath)) throw new Error("dist/index.html missing; run npm run build first");
const html=fs.readFileSync(htmlPath,"utf8");

const jsMatch=html.match(/<script[^>]+type=["']module["'][^>]+src=["']([^"']+)["']/i) ||
  html.match(/<script[^>]+src=["']([^"']+)["'][^>]+type=["']module["']/i);
const cssMatches=[...html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/gi)];

if(!jsMatch) throw new Error("entry module script missing from dist/index.html");
if(!cssMatches.length) throw new Error("entry stylesheet missing from dist/index.html");

const normalize=(url)=>url.replace(/^https?:\/\/[^/]+/,"").replace(/^\/+/,"");
const resolveAsset=(url)=>{
  const rel=normalize(url);
  const candidates=[
    path.join(DIST,rel),
    path.join(DIST,rel.replace(/^ace\/(?:nightly\/|dev\/)?/,"")),
  ];
  return candidates.find(fs.existsSync);
};

const jsPath=resolveAsset(jsMatch[1]);
if(!jsPath) throw new Error("entry JS asset not found: "+jsMatch[1]);
const cssPaths=cssMatches.map((m)=>resolveAsset(m[1])).filter(Boolean);
if(!cssPaths.length) throw new Error("entry CSS assets not found");

const jsBytes=fs.statSync(jsPath).size;
const cssBytes=cssPaths.reduce((sum,p)=>sum+fs.statSync(p).size,0);
const assets=fs.readdirSync(path.join(DIST,"assets"));
const pascal=assets.find((name)=>/^PascalFacility-.*\.js$/.test(name));
const system=assets.find((name)=>/^AtlasProduct-.*\.js$/.test(name));
const chat=assets.find((name)=>/^AIChat-.*\.js$/.test(name));

const failures=[];
if(jsBytes>MAX_ENTRY_JS) failures.push(`entry JS ${jsBytes} > budget ${MAX_ENTRY_JS}`);
if(cssBytes>MAX_ENTRY_CSS) failures.push(`entry CSS ${cssBytes} > budget ${MAX_ENTRY_CSS}`);
if(!pascal) failures.push("PascalFacility must remain a split chunk");
if(!system) failures.push("AtlasProduct/System must remain a split chunk");
if(!chat) failures.push("AIChat must remain a split chunk");
if(/PascalFacility-.*\.js/.test(html)) failures.push("PascalFacility must not be referenced by initial HTML");
if(/AIChat-.*\.js/.test(html)) failures.push("AIChat must not be referenced by initial HTML");

const receipt={
  entryJs:{file:path.basename(jsPath),bytes:jsBytes,budget:MAX_ENTRY_JS},
  entryCss:{files:cssPaths.map(path.basename),bytes:cssBytes,budget:MAX_ENTRY_CSS},
  split:{pascal,system,chat},
  result:failures.length?"FAIL":"PASS",
  failures,
};
console.log(JSON.stringify(receipt,null,2));
if(failures.length) process.exit(1);

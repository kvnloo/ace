#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import WebSocket from "ws";

const BASE=process.env.BASE_URL || "http://127.0.0.1:4173";
const OUT=process.env.ARTIFACTS || "artifacts/visual-smoke";
const CHROME=process.env.CHROME ||
  ["/usr/bin/google-chrome-stable","/usr/bin/google-chrome","/usr/bin/chromium","/usr/bin/chromium-browser"].find((p)=>fs.existsSync(p));

const sleep=(ms)=>new Promise((resolve)=>setTimeout(resolve,ms));

function percentile(values,p){
  if(!values.length) return 0;
  const sorted=[...values].sort((a,b)=>a-b);
  const i=Math.min(sorted.length-1,Math.max(0,Math.ceil((p/100)*sorted.length)-1));
  return sorted[i];
}

class CDP {
  constructor(wsUrl){
    this.ws=new WebSocket(wsUrl);
    this.nextId=1;
    this.pending=new Map();
    this.listeners=new Set();
  }
  async ready(){
    if(this.ws.readyState===WebSocket.OPEN) return;
    await new Promise((resolve,reject)=>{
      this.ws.once("open",resolve);
      this.ws.once("error",reject);
    });
    this.ws.on("message",(raw)=>{
      const msg=JSON.parse(raw.toString());
      if(msg.id && this.pending.has(msg.id)){
        const {resolve,reject}=this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if(msg.error) reject(new Error(msg.error.message || JSON.stringify(msg.error)));
        else resolve(msg.result || {});
        return;
      }
      for(const listener of this.listeners) listener(msg);
    });
  }
  send(method,params={},sessionId){
    const id=this.nextId++;
    return new Promise((resolve,reject)=>{
      this.pending.set(id,{resolve,reject});
      const payload={id,method,params};
      if(sessionId) payload.sessionId=sessionId;
      this.ws.send(JSON.stringify(payload));
    });
  }
  waitFor(method,sessionId,timeout=15000){
    return new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>{
        this.listeners.delete(listener);
        reject(new Error("timeout waiting for "+method));
      },timeout);
      const listener=(msg)=>{
        if(msg.method!==method) return;
        if(sessionId && msg.sessionId!==sessionId) return;
        clearTimeout(timer);
        this.listeners.delete(listener);
        resolve(msg.params || {});
      };
      this.listeners.add(listener);
    });
  }
  close(){ this.ws.close(); }
}

async function launchChrome(){
  if(!CHROME) throw new Error("Chrome/Chromium not found");
  const userDataDir=fs.mkdtempSync(path.join(os.tmpdir(),"ace-cdp-"));
  const child=spawn(CHROME,[
    "--headless=new",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--hide-scrollbars",
    "--remote-debugging-port=0",
    "--remote-debugging-address=127.0.0.1",
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows",
    "--disable-renderer-backgrounding",
    "--disable-features=Translate,BackForwardCache",
    "--user-data-dir="+userDataDir,
  ],{stdio:["ignore","ignore","pipe"]});

  const wsUrl=await new Promise((resolve,reject)=>{
    let buf="";
    const timer=setTimeout(()=>reject(new Error("Chrome DevTools endpoint timeout")),15000);
    child.stderr.on("data",(chunk)=>{
      buf+=chunk.toString();
      const match=buf.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if(match){
        clearTimeout(timer);
        resolve(match[1]);
      }
    });
    child.once("exit",(code)=>{
      clearTimeout(timer);
      reject(new Error("Chrome exited before DevTools endpoint: "+code+"\n"+buf.slice(-2000)));
    });
  });

  const cdp=new CDP(wsUrl);
  await cdp.ready();
  return {cdp,child,userDataDir};
}

async function createPage(cdp,{width,height,mobile=false,lite=false,reduced=false}){
  const {targetId}=await cdp.send("Target.createTarget",{url:"about:blank"});
  const {sessionId}=await cdp.send("Target.attachToTarget",{targetId,flatten:true});
  await cdp.send("Page.enable",{},sessionId);
  await cdp.send("Runtime.enable",{},sessionId);
  await cdp.send("Network.enable",{},sessionId);
  await cdp.send("Emulation.setDeviceMetricsOverride",{
    width,height,deviceScaleFactor:1,mobile,screenWidth:width,screenHeight:height
  },sessionId);

  if(reduced){
    await cdp.send("Emulation.setEmulatedMedia",{
      features:[{name:"prefers-reduced-motion",value:"reduce"}]
    },sessionId);
  }

  if(lite){
    await cdp.send("Page.addScriptToEvaluateOnNewDocument",{
      source:`
        Object.defineProperty(navigator,"hardwareConcurrency",{get:()=>2,configurable:true});
        Object.defineProperty(navigator,"deviceMemory",{get:()=>2,configurable:true});
      `
    },sessionId);
  }

  const failures=[];
  const resources=[];
  const listener=(msg)=>{
    if(msg.sessionId!==sessionId) return;
    if(msg.method==="Network.responseReceived") resources.push(msg.params.response?.url || "");
    if(msg.method==="Network.loadingFailed"){
      const url=msg.params?.requestId || "";
      if(msg.params?.errorText) failures.push(msg.params.errorText+" "+url);
    }
  };
  cdp.listeners.add(listener);

  const loaded=cdp.waitFor("Page.loadEventFired",sessionId,30000).catch(()=>null);
  await cdp.send("Page.navigate",{url:BASE},sessionId);
  await loaded;
  await sleep(250);
  await evaluate(cdp,sessionId,`document.fonts?.ready?.then(()=>true).catch(()=>true)`,true).catch(()=>{});

  return {sessionId,targetId,resources,failures,cleanup:()=>cdp.listeners.delete(listener)};
}

async function evaluate(cdp,sessionId,expression,awaitPromise=false){
  const result=await cdp.send("Runtime.evaluate",{
    expression,
    awaitPromise,
    returnByValue:true,
    userGesture:true
  },sessionId);
  if(result.exceptionDetails) {
    const description =
      result.exceptionDetails.exception?.description ||
      result.exceptionDetails.exception?.value ||
      result.exceptionDetails.text ||
      "Runtime.evaluate failed";
    throw new Error(description);
  }
  return result.result?.value;
}

async function screenshot(cdp,sessionId,name){
  const {data}=await cdp.send("Page.captureScreenshot",{format:"png",fromSurface:true},sessionId);
  const dest=path.join(OUT,name+".png");
  fs.writeFileSync(dest,Buffer.from(data,"base64"));
  return dest;
}

async function closePage(cdp,page){
  page.cleanup();
  await cdp.send("Target.closeTarget",{targetId:page.targetId}).catch(()=>{});
}

async function main(){
  fs.mkdirSync(OUT,{recursive:true});
  const chrome=await launchChrome();
  const {cdp}=chrome;
  const report={base:BASE,chrome:CHROME,desktop:{},mobile:{},reduced:{}};
  const failures=[];

  try {
    const desktop=await createPage(cdp,{width:1440,height:1000});
    const facts=await evaluate(cdp,desktop.sessionId,`(()=>{
      const text=document.body.innerText || "";
      const resources=performance.getEntriesByType("resource").map((r)=>r.name);
      return {
        title:document.title,
        hero:/A FEEDBACK LOOP/i.test(text),
        lenis:Boolean(window.__ACE_LENIS__),
        quality:document.documentElement.dataset.aceQuality,
        overflow:document.documentElement.scrollWidth-window.innerWidth,
        scrollHeight:document.documentElement.scrollHeight,
        resources,
        initialTwin:resources.some((u)=>/TwinExportCampus/.test(u)),
        initialPascal:resources.some((u)=>/PascalFacility/.test(u)),
        initialChat:resources.some((u)=>/AIChat/.test(u)),
        tailwindCdn:resources.some((u)=>/cdn\\.tailwindcss\\.com/.test(u)),
        semanticTrace:Boolean(document.querySelector(".ace-core-trace-signal")),
        movingTicker:Boolean(document.querySelector(".ace-signal-track")),
        palette:{
          bg:getComputedStyle(document.documentElement).getPropertyValue("--ace-bg").trim(),
          signal:getComputedStyle(document.documentElement).getPropertyValue("--ace-signal").trim(),
        },
      };
    })()`);
    report.desktop.home=facts;
    report.desktop.hero=await screenshot(cdp,desktop.sessionId,"desktop-hero");
    if(!facts.hero) failures.push("desktop hero copy missing");
    if(!facts.lenis) failures.push("Lenis did not initialize on desktop");
    if(facts.overflow>2) failures.push("desktop horizontal overflow "+facts.overflow+"px");
    if(facts.initialTwin) failures.push("Twin renderer chunk loaded on home");
    if(facts.initialPascal) failures.push("Pascal chunk should not ship or load");
    if(facts.initialChat) failures.push("AIChat chunk loaded before interaction");
    if(facts.tailwindCdn) failures.push("Tailwind CDN runtime requested");
    if(!facts.semanticTrace) failures.push("semantic loop trace missing");
    if(facts.movingTicker) failures.push("autonomous signal ticker regressed");
    if(facts.palette.bg.toLowerCase()!=="#071426") failures.push("ACE navy token mismatch "+facts.palette.bg);
    if(facts.palette.signal.toLowerCase()!=="#dfff4f") failures.push("ACE signal token mismatch "+facts.palette.signal);

    const perf=await evaluate(cdp,desktop.sessionId,`(async()=>{
      const frames=[];
      let last=performance.now();
      const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
      const start=performance.now();
      await new Promise((resolve)=>{
        const step=(now)=>{
          frames.push(now-last);
          last=now;
          const t=Math.min(1,(now-start)/1600);
          const eased=t<.5 ? 2*t*t : 1-Math.pow(-2*t+2,2)/2;
          const lenis=window.__ACE_LENIS__;
          if(lenis) lenis.scrollTo(max*eased,{immediate:true});
          else window.scrollTo(0,max*eased);
          if(t<1) requestAnimationFrame(step); else resolve();
        };
        requestAnimationFrame(step);
      });
      return {
        frames:frames.slice(6),
        progress:getComputedStyle(document.documentElement).getPropertyValue("--ace-scroll").trim(),
        section:document.querySelector(".ace-live-section")?.textContent?.trim() || "",
      };
    })()`,true);
    const clean=perf.frames.filter((dt)=>dt>0 && dt<1000);
    report.desktop.scroll={
      n:clean.length,
      mean:clean.length?clean.reduce((a,b)=>a+b,0)/clean.length:0,
      p95:percentile(clean,95),
      max:clean.length?Math.max(...clean):0,
      progress:perf.progress,
      section:perf.section,
    };
    report.desktop.mid=await screenshot(cdp,desktop.sessionId,"desktop-mid");
    if(Number(perf.progress)<=0.5) failures.push("scroll progress did not publish ("+perf.progress+")");
    if(!perf.section) failures.push("live section label did not update");

    await evaluate(cdp,desktop.sessionId,`(()=>{
      const button=[...document.querySelectorAll("button")].find((el)=>el.textContent?.trim()==="System");
      button?.click();
      return Boolean(button);
    })()`);
    await sleep(750);
    const system=await evaluate(cdp,desktop.sessionId,`(()=>({
      heading:[...document.querySelectorAll("h2")].some((el)=>/How the loop compounds/i.test(el.textContent||"")),
      overflow:document.documentElement.scrollWidth-window.innerWidth,
    }))()`);
    report.desktop.system=system;
    report.desktop.systemShot=await screenshot(cdp,desktop.sessionId,"desktop-system");
    if(!system.heading) failures.push("System route did not render");
    if(system.overflow>2) failures.push("System horizontal overflow "+system.overflow+"px");

    await evaluate(cdp,desktop.sessionId,`(()=>{
      const button=[...document.querySelectorAll("button")].find((el)=>el.textContent?.trim()==="Campus");
      button?.click();
      return Boolean(button);
    })()`);
    for(let i=0;i<80;i++){
      const ready=await evaluate(cdp,desktop.sessionId,`Boolean(document.querySelector(".ace-twin-export-badge")) && Boolean(document.querySelector("canvas"))`);
      if(ready) break;
      await sleep(100);
    }
    const campusFacts=await evaluate(cdp,desktop.sessionId,`(()=>{
      const resources=performance.getEntriesByType("resource").map((r)=>r.name);
      return {
        canvas:Boolean(document.querySelector("canvas")),
        badge:document.querySelector(".ace-twin-export-badge")?.textContent || "",
        specStamp:[...document.querySelectorAll(".ace-stamp")].some((el)=>/SPEC · PUBLIC EXPORT/.test(el.textContent||"")),
        exportLoaded:resources.some((u)=>u.includes("/twin/ace-digital-twin-v1.json")),
        twinLoaded:resources.some((u)=>/TwinExportCampus/.test(u)),
        pascalLoaded:resources.some((u)=>/PascalFacility/.test(u)),
        overflow:document.documentElement.scrollWidth-window.innerWidth,
      };
    })()`);
    report.desktop.campus=campusFacts;
    report.desktop.campusShot=await screenshot(cdp,desktop.sessionId,"desktop-real-twin");
    if(!campusFacts.canvas) failures.push("real twin canvas did not render");
    if(!/STRUCTURAL EXPORT/.test(campusFacts.badge)) failures.push("real twin export badge missing");
    if(!campusFacts.specStamp) failures.push("Campus must identify exported geometry as SPEC");
    if(!campusFacts.exportLoaded) failures.push("public twin JSON was not loaded");
    if(!campusFacts.twinLoaded) failures.push("TwinExportCampus lazy chunk did not load");
    if(campusFacts.pascalLoaded) failures.push("Pascal loaded on real-twin Campus route");
    if(campusFacts.overflow>2) failures.push("Campus horizontal overflow "+campusFacts.overflow+"px");

    await evaluate(cdp,desktop.sessionId,`(()=>{
      const button=[...document.querySelectorAll("button")].find((el)=>el.textContent?.trim()==="Spec");
      button?.click();
      return Boolean(button);
    })()`);
    await sleep(450);
    const specFacts=await evaluate(cdp,desktop.sessionId,`(()=>({
      cards:document.querySelectorAll(".ace-spec-card").length,
      moving:[...document.querySelectorAll(".ace-spec-card")].some((el)=>{
        const style=getComputedStyle(el);
        return style.animationName!=="none" || (style.transform && style.transform!=="none");
      }),
    }))()`);
    report.desktop.spec=specFacts;
    report.desktop.specShot=await screenshot(cdp,desktop.sessionId,"desktop-spec");
    if(specFacts.cards<8) failures.push("Spec matrix incomplete");
    if(specFacts.moving) failures.push("Spec route regressed to positional/stagger motion");

    await evaluate(cdp,desktop.sessionId,`(()=>{
      const button=[...document.querySelectorAll("button")].find((el)=>el.textContent?.trim()==="Contact");
      button?.click();
      return Boolean(button);
    })()`);
    await sleep(350);
    const contactBefore=await evaluate(cdp,desktop.sessionId,`(()=>({
      goal:Boolean(document.querySelector("#ace-goal")),
      role:Boolean(document.querySelector("#ace-role")),
      email:Boolean(document.querySelector("#ace-email")),
    }))()`);
    await evaluate(cdp,desktop.sessionId,`(()=>{
      const goal=document.querySelector("#ace-goal");
      if(!goal) return false;
      const setter=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,"value")?.set;
      setter?.call(goal,"Improve my repeatable movement quality");
      goal.dispatchEvent(new Event("input",{bubbles:true}));
      return true;
    })()`);
    await sleep(120);
    const roleReady=await evaluate(cdp,desktop.sessionId,`Boolean(document.querySelector("#ace-role"))`);
    if(roleReady){
      await evaluate(cdp,desktop.sessionId,`(()=>{
        const role=document.querySelector("#ace-role");
        const setter=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,"value")?.set;
        setter?.call(role,"Athlete / member");
        role.dispatchEvent(new Event("change",{bubbles:true}));
        return true;
      })()`);
      await sleep(120);
    }
    const contactAfter=await evaluate(cdp,desktop.sessionId,`(()=>({
      role:Boolean(document.querySelector("#ace-role")),
      email:Boolean(document.querySelector("#ace-email")),
    }))()`);
    report.desktop.contact={before:contactBefore,after:contactAfter};
    report.desktop.contactShot=await screenshot(cdp,desktop.sessionId,"desktop-contact");
    if(!contactBefore.goal || contactBefore.role || contactBefore.email) failures.push("Contact must begin goal-only");
    if(!contactAfter.role || !contactAfter.email) failures.push("Contact progressive disclosure failed");

    failures.push(...desktop.failures.map((e)=>"desktop request: "+e));
    await closePage(cdp,desktop);

    const mobile=await createPage(cdp,{width:390,height:844,mobile:true,lite:true});
    await evaluate(cdp,mobile.sessionId,`document.querySelector('button[aria-label="Open navigation menu"]')?.click()`);
    await sleep(80);
    await evaluate(cdp,mobile.sessionId,`(()=>{
      const button=[...document.querySelectorAll("button")].find((el)=>el.textContent?.trim()==="Campus");
      button?.click();
      return Boolean(button);
    })()`);
    for(let i=0;i<40;i++){
      const ready=await evaluate(cdp,mobile.sessionId,`Boolean(document.querySelector(".ace-campus-enable-3d"))`);
      if(ready) break;
      await sleep(100);
    }
    const mobileFacts=await evaluate(cdp,mobile.sessionId,`(()=>{
      const resources=performance.getEntriesByType("resource").map((r)=>r.name);
      return {
        quality:document.documentElement.dataset.aceQuality,
        overflow:document.documentElement.scrollWidth-window.innerWidth,
        hasCanvas:Boolean(document.querySelector("canvas")),
        enable3d:Boolean(document.querySelector(".ace-campus-enable-3d")),
        twinLoaded:resources.some((u)=>/TwinExportCampus/.test(u)),
        pascalLoaded:resources.some((u)=>/PascalFacility/.test(u)),
        exportLoaded:resources.some((u)=>u.includes("/twin/ace-digital-twin-v1.json")),
        exportBadge:Boolean(document.querySelector(".ace-twin-export-badge")),
      };
    })()`);
    report.mobile=mobileFacts;
    report.mobile.shot=await screenshot(cdp,mobile.sessionId,"mobile-campus-lite");
    if(mobileFacts.quality!=="lite") failures.push("mobile quality expected lite, got "+mobileFacts.quality);
    if(mobileFacts.overflow>2) failures.push("mobile horizontal overflow "+mobileFacts.overflow+"px");
    if(!mobileFacts.enable3d) failures.push("lite campus 3D opt-in missing");
    if(mobileFacts.hasCanvas) failures.push("lite campus mounted a canvas before opt-in");
    if(mobileFacts.twinLoaded) failures.push("lite campus fetched 3D twin renderer before opt-in");
    if(mobileFacts.pascalLoaded) failures.push("lite campus fetched obsolete Pascal code");
    if(!mobileFacts.exportLoaded || !mobileFacts.exportBadge) failures.push("lite campus must render the real export-backed fallback");
    failures.push(...mobile.failures.map((e)=>"mobile request: "+e));
    await closePage(cdp,mobile);

    const reduced=await createPage(cdp,{width:1280,height:800,reduced:true});
    const reducedFacts=await evaluate(cdp,reduced.sessionId,`(()=>({
      motion:document.documentElement.dataset.aceMotion,
      orbitAnimation:getComputedStyle(document.querySelector(".ace-core-orbit")).animationName,
      overflow:document.documentElement.scrollWidth-window.innerWidth,
    }))()`);
    report.reduced=reducedFacts;
    report.reduced.shot=await screenshot(cdp,reduced.sessionId,"reduced-home");
    if(reducedFacts.motion!=="reduced") failures.push("reduced-motion dataset missing ("+reducedFacts.motion+")");
    if(reducedFacts.overflow>2) failures.push("reduced-motion horizontal overflow "+reducedFacts.overflow+"px");
    failures.push(...reduced.failures.map((e)=>"reduced request: "+e));
    await closePage(cdp,reduced);
  } finally {
    cdp.close();
    chrome.child.kill("SIGTERM");
    await Promise.race([
      new Promise((resolve) => chrome.child.once("exit", resolve)),
      sleep(1200),
    ]);
  }

  report.failures=failures;
  fs.writeFileSync(path.join(OUT,"report.json"),JSON.stringify(report,null,2));
  fs.writeFileSync(path.join(OUT,"report.md"),[
    "# ACE visual smoke",
    "",
    "- desktop scroll p95: "+report.desktop.scroll.p95.toFixed(1)+"ms · max "+report.desktop.scroll.max.toFixed(1)+"ms",
    "- desktop section after scroll: "+(report.desktop.scroll.section || "unknown"),
    "- mobile lite mode: "+report.mobile.quality+" · twin renderer preloaded: "+report.mobile.twinLoaded+" · export fallback: "+report.mobile.exportBadge,
    "- reduced motion: "+report.reduced.motion,
    "- result: "+(failures.length ? "FAIL — "+failures.join("; ") : "PASS"),
    "",
  ].join("\n"));
  try {
    fs.rmSync(chrome.userDataDir,{recursive:true,force:true,maxRetries:4,retryDelay:80});
  } catch (err) {
    console.warn("visual smoke cleanup warning:", String(err));
  }
  console.log(JSON.stringify(report,null,2));
  if(failures.length) process.exitCode=1;
}

main().catch((err)=>{
  console.error(err);
  process.exit(2);
});

/* Toolify shared core: Firebase, auth gate, theme, settings, context menu, local+cloud store */
const TF=(()=>{
// >>> Paste the SAME firebaseConfig object your login.html uses <<<

  const firebaseConfig = { 
    apiKey: "AIzaSyAeHDhdiTRwftUGYgrb1m19v7hm2R5rb-Y", 
    authDomain: "toolbox-hub-98c03.firebaseapp.com", 
    projectId: "toolbox-hub-98c03", 
    storageBucket: "toolbox-hub-98c03.firebasestorage.app", 
    messagingSenderId: "321020105472", 
    appId: "1:321020105472:web:356e7c2903def7b9d859e5" 
  };
  
const BASE='/toolify/',LOGIN=BASE+'login.html';
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const P=d=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const I={gear:'⚙',check:P('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),x:P('<path d="M6 6l12 12M18 6L6 18"/>'),plus:P('<path d="M12 5v14M5 12h14"/>'),
pen:P('<path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19z"/>'),share:P('<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.6M8.2 13.2l7.6 4.6"/>'),
out:P('<path d="M9 4H5v16h4M16 8l4 4-4 4M20 12H9"/>'),moon:P('<path d="M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5z"/>'),
sun:P('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>')};
let U=null,db,auth,cfg={theme:'system',accent:'#8b5cf6',scale:100},menuFn=null;
try{Object.assign(cfg,JSON.parse(localStorage.tf_cfg||'{}'))}catch{}
const mq=matchMedia('(prefers-color-scheme:dark)');
const dark=()=>cfg.theme=='system'?mq.matches:cfg.theme=='dark';
function apply(){const r=document.documentElement;r.dataset.t=dark()?'dark':'light';r.style.setProperty('--a',cfg.accent);r.style.setProperty('--s',cfg.scale/100);localStorage.tf_cfg=JSON.stringify(cfg);syncUI()}
function setCfg(p){Object.assign(cfg,p);apply();if(U)db.doc(`dayPasser/${U.uid}/meta/toolifySettings`).set(cfg).catch(()=>{})}
mq.onchange=apply;

const CSS=`*{box-sizing:border-box;margin:0}html{font-size:calc(16px*var(--s,1));scroll-behavior:smooth}
[data-t=dark]{--bg:#08080d;--c:rgba(255,255,255,.055);--b:rgba(255,255,255,.1);--tx:#f3f3f8;--mu:#9b9bb3;color-scheme:dark}
[data-t=light]{--bg:#f3f2f9;--c:rgba(255,255,255,.72);--b:rgba(30,25,60,.12);--tx:#16162a;--mu:#666682;color-scheme:light}
body{font:400 1rem/1.5 'Space Grotesk',system-ui,sans-serif;background:var(--bg);color:var(--tx);min-height:100vh;transition:background .3s,color .3s}
body::before{content:"";position:fixed;inset:0;z-index:-1;background:radial-gradient(60rem 40rem at 8% -10%,color-mix(in srgb,var(--a) 30%,transparent),transparent),radial-gradient(45rem 35rem at 100% 0,rgba(245,158,11,.13),transparent)}
a{color:inherit;text-decoration:none}.wrap{max-width:72rem;margin:auto;padding:1rem}
.glass{background:var(--c);border:1px solid var(--b);border-radius:1.1rem;backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}.pad{padding:1.2rem}
.top{display:flex;align-items:center;gap:.5rem;padding:.55rem .8rem;position:sticky;top:.6rem;z-index:20;margin-bottom:1.2rem}
.brand{display:flex;align-items:center;gap:.5rem;font-weight:700}.brand img{width:1.8rem;height:1.8rem;border-radius:.5rem}
nav{display:flex;gap:.2rem;margin-left:.5rem}nav a{padding:.35rem .8rem;border-radius:.7rem;color:var(--mu);font-size:.9rem;transition:.2s}nav a:hover{color:var(--tx)}nav a.on{background:color-mix(in srgb,var(--a) 22%,transparent);color:var(--tx)}.sp{flex:1}
.ic{width:2.2rem;height:2.2rem;display:grid;place-items:center;border-radius:.7rem;border:1px solid var(--b);background:var(--c);color:var(--tx);cursor:pointer;transition:.2s;font:inherit;flex:none}.ic:hover{border-color:var(--a);transform:translateY(-1px)}.ic svg{width:1.05rem;height:1.05rem}
.btn{font:inherit;font-weight:600;padding:.6rem 1rem;border-radius:.8rem;border:1px solid var(--b);background:var(--c);color:var(--tx);cursor:pointer;transition:.2s;display:inline-block}.btn:hover{transform:translateY(-1px)}.btn.pri{background:var(--a);border-color:transparent;color:#fff;box-shadow:0 .5rem 1.4rem -.5rem var(--a)}
input,select{font:inherit;color:var(--tx);background:color-mix(in srgb,var(--tx) 6%,transparent);border:1px solid var(--b);border-radius:.75rem;padding:.6rem .8rem;outline:0;min-width:0;transition:.2s}input:focus,select:focus{border-color:var(--a);box-shadow:0 0 0 3px color-mix(in srgb,var(--a) 25%,transparent)}
input[type=color]{padding:.15rem;width:2.4rem;height:2.1rem;cursor:pointer}input[type=range]{padding:0;accent-color:var(--a);width:100%}
footer{text-align:center;color:var(--mu);font-size:.85rem;padding:2rem 0 1rem}footer a{text-decoration:underline}
.mu{color:var(--mu);font-size:.9rem}.row{display:flex;gap:.6rem;flex-wrap:wrap;align-items:center}.empty{text-align:center;color:var(--mu);padding:2rem}
.note{padding:.6rem .9rem;border-radius:.8rem;background:color-mix(in srgb,#f59e0b 16%,transparent);border:1px dashed #f59e0b;font-size:.88rem;margin-bottom:.8rem}
.seg{display:flex;gap:.3rem;padding:.25rem;border:1px solid var(--b);border-radius:.9rem}.seg button{flex:1;font:inherit;padding:.4rem .6rem;border:0;border-radius:.65rem;background:none;color:var(--mu);cursor:pointer;transition:.2s}.seg button.on{background:var(--a);color:#fff}
.dr{position:fixed;top:0;right:0;height:100%;width:min(22rem,92vw);transform:translateX(105%);transition:transform .35s cubic-bezier(.2,.8,.2,1);z-index:50;padding:1.2rem;background:var(--bg);border-left:1px solid var(--b);display:flex;flex-direction:column;gap:.7rem;box-shadow:-2rem 0 4rem rgba(0,0,0,.25)}.dr.on{transform:none}.dr label{font-size:.8rem;color:var(--mu);text-transform:uppercase;letter-spacing:.08em;margin-top:.5rem}
.sw{display:flex;gap:.45rem;flex-wrap:wrap;align-items:center}.sw button{width:1.7rem;height:1.7rem;border-radius:50%;border:2px solid transparent;cursor:pointer;transition:.2s}.sw button.on{border-color:var(--tx);transform:scale(1.15)}
.cm{position:fixed;z-index:70;min-width:12rem;padding:.35rem;background:var(--bg);border:1px solid var(--b);border-radius:.9rem;box-shadow:0 1.5rem 3rem -.5rem rgba(0,0,0,.4);animation:pop .15s ease}.cm[hidden]{display:none}.cm button{display:block;width:100%;text-align:left;font:inherit;padding:.5rem .8rem;border:0;border-radius:.6rem;background:none;color:var(--tx);cursor:pointer}.cm button:hover:not(:disabled){background:color-mix(in srgb,var(--a) 20%,transparent)}.cm button:disabled{opacity:.4;cursor:default}.cm .dg{color:#ef4444}
@keyframes pop{from{opacity:0;transform:scale(.94)}}
.ts{position:fixed;bottom:1rem;left:50%;transform:translateX(-50%);display:grid;gap:.4rem;z-index:80}.ts div{padding:.6rem 1.1rem;border-radius:2rem;background:var(--tx);color:var(--bg);font-weight:600;font-size:.9rem;animation:pop .25s ease}
.md{position:fixed;inset:0;background:rgba(0,0,0,.5);display:grid;place-items:center;z-index:60;padding:1rem}.md>div{width:min(28rem,100%);padding:1.4rem;display:grid;gap:.8rem;background:var(--bg)}
@media(max-width:640px){.brand b{display:none}nav a{padding:.3rem .55rem}.wrap{padding:.6rem}}`;
const st=document.createElement('style');st.textContent=CSS;document.head.append(st);

function shell(page){
document.body.innerHTML=`<div class="wrap"><header class="glass top"><a class="brand" href="${BASE}"><img src="${BASE}logo.png" alt="" onerror="this.remove()"><b>Toolify</b></a><nav>${[['tasks','Tasks'],['list','Lists'],['days','Days']].map(([k,l])=>`<a href="${BASE}${k}/" class="${k==page?'on':''}">${l}</a>`).join('')}</nav><div class="sp"></div><button class="ic" id="tg" title="Toggle theme"></button><button class="ic" id="gear" title="Settings">${I.gear}</button><button class="ic" id="out" title="Sign out">${I.out}</button></header><main id="m"></main><footer>© <span id="copyright-year"></span> Toolify · Made by Mohak Choubey · <a href="${BASE}">Home</a></footer></div>
<aside class="dr" id="dr"><div class="row"><b style="flex:1;font-size:1.2rem">Settings</b><button class="ic" id="dx">${I.x}</button></div>
<label>Theme</label><div class="seg" id="sg">${['light','dark','system'].map(v=>`<button data-v="${v}">${v[0].toUpperCase()+v.slice(1)}</button>`).join('')}</div>
<label>Accent colour</label><div class="sw" id="sw">${['#8b5cf6','#f59e0b','#10b981','#ef4444','#3b82f6','#ec4899','#14b8a6'].map(c=>`<button data-c="${c}" style="background:${c}"></button>`).join('')}<input type="color" id="ac"></div>
<label>Interface size · <span id="sv"></span></label><input type="range" id="sc" min="80" max="130" step="5">
<button class="btn" id="rs" style="margin-top:.8rem">Reset to defaults</button></aside>
<div class="cm" id="cm" hidden></div><div class="ts" id="ts"></div>`;
document.getElementById('copyright-year').textContent = new Date().getFullYear();
$('#tg').onclick=()=>setCfg({theme:dark()?'light':'dark'});
$('#gear').onclick=e=>{e.stopPropagation();$('#dr').classList.toggle('on')};$('#dx').onclick=()=>$('#dr').classList.remove('on');
$('#sg').onclick=e=>{const b=e.target.closest('button');b&&setCfg({theme:b.dataset.v})};
$('#sw').onclick=e=>{const b=e.target.closest('button');b&&setCfg({accent:b.dataset.c})};
$('#ac').oninput=e=>setCfg({accent:e.target.value});$('#sc').oninput=e=>setCfg({scale:+e.target.value});
$('#rs').onclick=()=>setCfg({theme:'system',accent:'#8b5cf6',scale:100});
document.addEventListener('click',e=>{if(!e.target.closest('#dr'))$('#dr').classList.remove('on')});
apply()}
function syncUI(){if(!$('#dr'))return;$('#tg').innerHTML=dark()?I.sun:I.moon;$('#sg').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.v==cfg.theme));
$('#sw').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.c==cfg.accent));$('#ac').value=cfg.accent;$('#sc').value=cfg.scale;$('#sv').textContent=cfg.scale+'%'}

function showMenu(x,y,items){const m=$('#cm');m.innerHTML=items.map((it,i)=>`<button data-i="${i}" class="${it.danger?'dg':''}" ${it.off?'disabled':''}>${it.l}</button>`).join('');m.hidden=false;
m.style.left=Math.max(8,Math.min(x,innerWidth-m.offsetWidth-8))+'px';m.style.top=Math.max(8,Math.min(y,innerHeight-m.offsetHeight-8))+'px';
m.onclick=e=>{const b=e.target.closest('button');if(b&&!b.disabled)items[b.dataset.i].fn()}}
document.addEventListener('contextmenu',e=>{if(!menuFn||e.target.closest('input,[contenteditable=true]'))return;const it=menuFn(e);if(!it)return;e.preventDefault();showMenu(e.clientX,e.clientY,it)});
['click','scroll','resize','keydown'].forEach(v=>addEventListener(v,e=>{if((v!='keydown'||e.key=='Escape')&&$('#cm'))$('#cm').hidden=true},true));
let lp;addEventListener('touchstart',e=>{if(!menuFn||e.target.closest('input'))return;const t=e.touches[0],tg=e.target;lp=setTimeout(()=>{const it=menuFn({target:tg});if(it)showMenu(t.clientX,t.clientY,it)},650)},{passive:true});
['touchend','touchmove','touchcancel'].forEach(v=>addEventListener(v,()=>clearTimeout(lp),{passive:true}));

function toast(msg){const d=document.createElement('div');d.textContent=msg;$('#ts').append(d);setTimeout(()=>d.remove(),2800)}
function modal(h){const o=document.createElement('div');o.className='md';o.innerHTML=`<div class="glass">${h}</div>`;document.body.append(o);const b=o.firstChild;b.close=()=>o.remove();o.onclick=e=>{if(e.target==o)o.remove()};return b}

/* Local-first store: instant from localStorage, live-synced with Firestore (dayPasser/{uid}/{col}) */
function Store(col,onChange){let items=[];const k=()=>`tf_${col}_${U.uid}`,ref=()=>db.collection(`dayPasser/${U.uid}/${col}`),keep=()=>localStorage[k()]=JSON.stringify(items);
try{items=JSON.parse(localStorage[k()]||'[]')}catch{}
return{get:()=>items,
async put(it){const i=items.findIndex(x=>x.id==it.id);i<0?items.push(it):items[i]=it;keep();onChange(items);try{await ref().doc(it.id).set(JSON.parse(JSON.stringify(it)))}catch{toast('Saved on this device · cloud sync failed')}},
async del(id){items=items.filter(x=>x.id!=id);keep();onChange(items);try{await ref().doc(id).delete()}catch{toast('Deleted locally · cloud sync failed')}},
start(){onChange(items);return ref().onSnapshot(s=>{items=s.docs.map(d=>d.data());keep();onChange(items)},()=>toast('Offline · showing saved data'))}}}

function boot({page,open,menu,start}){
shell(page);menuFn=menu||null;
if(FIREBASE_CONFIG.apiKey=='PASTE'){$('#m').innerHTML='<div class="glass pad"><b>Firebase config missing</b><p class="mu">Open shared.js and paste the same firebaseConfig object that your login.html uses.</p></div>';return}
firebase.initializeApp(FIREBASE_CONFIG);auth=firebase.auth();db=firebase.firestore();
$('#out').onclick=()=>auth.signOut();
auth.onAuthStateChanged(async u=>{
if(!u){if(open&&open()){$('#out').remove();return start(null)}location.href=LOGIN+'?next='+encodeURIComponent(location.pathname+location.search);return}
U=u;try{const d=await db.doc(`dayPasser/${u.uid}/meta/toolifySettings`).get();if(d.exists){Object.assign(cfg,d.data());apply()}}catch{}
start(u)})}
apply();
return{boot,$,esc,I,toast,modal,Store,get U(){return U},get db(){return db}}})();

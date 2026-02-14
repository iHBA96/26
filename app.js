// ====== CONFIG ======
const TOTAL = 19;

const SCENES = [
  // 1
  { title: "Chapter I — The Letter",  text: "Reem receives her Hogwarts letter.", sub: "An invitation to the School of Witchcraft & Wizardry… and a life about to change forever.", fx: "none" },

  // 2
  { title: "Chapter II — Platform 9¾", text: "Bags packed. Heart racing.", sub: "Platform 9¾ waits… and the Hogwarts Express is about to take her away.", fx: "steam" },

  // 3
  { title: "Chapter III — The Castle", text: "First sight of Hogwarts.", sub: "The School of Wizardry rises like a dream made real.", fx: "mist" },

  // 4
  { title: "Chapter IV — The Sorting", text: "The Great Hall holds its breath.", sub: "The Sorting Hat decides where Reem truly belongs.", fx: "candle" },

  // 5
  { title: "Chapter V — Gryffindor!", text: "BETTER BE, GRYFFINDOR!", sub: "Courage, loyalty… and a heart that never backs down.", fx: "spark" },

  // 6
  { title: "Chapter VI — Common Room", text: "A new home inside the castle.", sub: "Firelight, laughter, and the feeling of belonging.", fx: "ember" },

  // 7
  { title: "Chapter VII — The Duel", text: "Dark Arts class turns competitive.", sub: "Reem faces a Ravenclaw student in a duel… sparks fly.", fx: "spark" },

  // 8
  { title: "Chapter VIII — Eyes On You", text: "The whole class watches.", sub: "Two wands, one moment—like a scene from a movie.", fx: "spark" },

  // 9
  { title: "Chapter IX — Friendly Again", text: "They meet again… differently.", sub: "This time it’s a friendly class—talking, laughing, getting to know each other.", fx: "candle" },

  // 10
  { title: "Chapter X — Feelings", text: "Something changes between them.", sub: "A look that lasts too long… a smile that says too much.", fx: "candle" },

  // 11 (question popup triggers here)
  { title: "Chapter XI — Valentine", text: "He writes it in the snow:", sub: "“Will you be my valentine?”", fx: "snow", ask: true },

  // 12
  { title: "Chapter XII — Valentine Date", text: "She said yes.", sub: "A magical date—riding a griffin together, the castle glowing in winter light.", fx: "snow" },

  // 13
  { title: "Chapter XIII — The Bet", text: "A bet in the skies.", sub: "Who catches the golden snitch first? Reem wins—fair and fearless.", fx: "wind" },

  // 14
  { title: "Chapter XIV — Representing the School", text: "Champions of the academy.", sub: "They compete against rival teams—wearing their colors with pride.", fx: "wind" },

  // 15
  { title: "Chapter XV — Forbidden Forest", text: "Where memories turn legendary.", sub: "Through the shadows of the forest… together.", fx: "mist" },

  // 16
  { title: "Chapter XVI — Classes & Memories", text: "Days filled with magic.", sub: "Herbology. Defense. Potions. Spells—moments that became their story.", fx: "spark" },

  // 17
  { title: "Chapter XVII — The Dark Lord", text: "The final battle begins.", sub: "A dark lord rises… and they stand together to end it.", fx: "storm" },

  // 18
  { title: "Chapter XVIII — The Wedding", text: "A promise inside the academy.", sub: "After the storm, after the legend—love wins.", fx: "gold" },

  // 19
  { title: "Chapter XIX — Happily Ever After", text: "And they lived happily ever after.", sub: "Not just a story… a forever.", fx: "candle" },
];

// Images are in repo root as 1.PNG ... 19.PNG
const imgPath = (i) => `${i}.PNG`;

// Optional music: add music.mp3 to repo root if you want.
const MUSIC_FILE = "music.mp3";

// ====== UI ======
const bgA = document.getElementById("bgA");
const bgB = document.getElementById("bgB");
const captionEl = document.getElementById("caption");
const subEl = document.getElementById("sub");
const chapterEl = document.getElementById("chapter");
const idxEl = document.getElementById("idx");
const totalEl = document.getElementById("total");
const dotsEl = document.getElementById("dots");

const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const modal = document.getElementById("modal");
const btnInfo = document.getElementById("btnInfo");
const closeModal = document.getElementById("closeModal");

const btnMusic = document.getElementById("btnMusic");
const music = document.getElementById("music");

totalEl.textContent = TOTAL;

let current = 1;
let showingA = true;

// Track whether the Scene 11 question has been answered
let valentineAnswered = false;

// ====== TYPEWRITER ======
let typeTimer = null;
function typeText(el, text, speed = 18){
  clearInterval(typeTimer);
  el.textContent = "";
  let i = 0;
  typeTimer = setInterval(() => {
    el.textContent += text[i] ?? "";
    i++;
    if(i > text.length) clearInterval(typeTimer);
  }, speed);
}

// ====== BACKGROUND SWAP ======
function setBg(url){
  const show = showingA ? bgA : bgB;
  const hide = showingA ? bgB : bgA;

  hide.classList.remove("show","kenburns");
  show.style.backgroundImage = `url("${url}")`;
  show.classList.add("show","kenburns");

  showingA = !showingA;
}

// ====== DOTS ======
function buildDots(){
  dotsEl.innerHTML = "";
  for(let i=1;i<=TOTAL;i++){
    const d = document.createElement("div");
    d.className = "dot";
    d.title = `Scene ${i}`;
    d.addEventListener("click", () => go(i));
    dotsEl.appendChild(d);
  }
}
function updateDots(){
  [...dotsEl.children].forEach((d, i) => {
    d.classList.toggle("active", (i+1) === current);
  });
}

// ====== FX CANVAS ======
const canvas = document.getElementById("fx");
const ctx = canvas.getContext("2d");
let W=0,H=0,particles=[],fxMode="none";

function resize(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

function setFX(mode){
  fxMode = mode || "none";
  particles = [];
  const count = ({
    snow: 180, ember: 80, spark: 70, mist: 60,
    wind: 120, candle: 45, storm: 130, gold: 70, steam: 75, none: 0
  })[fxMode] || 0;

  for(let i=0;i<count;i++){
    particles.push(makeParticle(fxMode));
  }
}
function rnd(a,b){return a+Math.random()*(b-a)}
function makeParticle(mode){
  const p = { x:rnd(0,W), y:rnd(0,H), vx:0, vy:0, r:rnd(1,3), a:rnd(.15,.9) };

  if(mode==="snow"){
    p.r = rnd(1,3); p.vx = rnd(-.4,.4); p.vy = rnd(.6,1.6); p.a = rnd(.25,.8);
  } else if(mode==="ember"){
    p.r = rnd(1,3); p.vx = rnd(-.3,.3); p.vy = rnd(-.9,-.2); p.a = rnd(.15,.55);
  } else if(mode==="spark" || mode==="gold"){
    p.r = rnd(1,2.4); p.vx = rnd(-.9,.9); p.vy = rnd(-.9,.9); p.a = rnd(.15,.7);
  } else if(mode==="mist" || mode==="steam"){
    p.r = rnd(12,28); p.vx = rnd(-.15,.15); p.vy = rnd(-.08,.08); p.a = rnd(.04,.12);
  } else if(mode==="wind"){
    p.r = rnd(1,2.2); p.vx = rnd(1.0,2.0); p.vy = rnd(-.2,.2); p.a = rnd(.08,.25);
  } else if(mode==="candle"){
    p.r = rnd(2,5); p.vx = rnd(-.05,.05); p.vy = rnd(-.25,-.08); p.a = rnd(.08,.22);
  } else if(mode==="storm"){
    p.r = rnd(1,2.2); p.vx = rnd(-1.6,-.6); p.vy = rnd(1.2,2.6); p.a = rnd(.12,.35);
  }
  return p;
}

function draw(){
  ctx.clearRect(0,0,W,H);
  if(fxMode==="none") { requestAnimationFrame(draw); return; }

  for(const p of particles){
    p.x += p.vx; p.y += p.vy;

    if(p.x < -50) p.x = W+50;
    if(p.x > W+50) p.x = -50;
    if(p.y < -50) p.y = H+50;
    if(p.y > H+50) p.y = -50;

    if(fxMode==="snow"){
      ctx.fillStyle = `rgba(255,255,255,${p.a})`;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    } else if(fxMode==="ember"){
      ctx.fillStyle = `rgba(255,170,90,${p.a})`;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    } else if(fxMode==="spark"){
      ctx.fillStyle = `rgba(140,200,255,${p.a})`;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    } else if(fxMode==="gold"){
      ctx.fillStyle = `rgba(255,215,120,${p.a})`;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    } else if(fxMode==="mist" || fxMode==="steam"){
      const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);
      g.addColorStop(0, `rgba(255,255,255,${p.a})`);
      g.addColorStop(1, `rgba(255,255,255,0)`);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    } else if(fxMode==="wind"){
      ctx.strokeStyle = `rgba(255,255,255,${p.a})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p.x,p.y);
      ctx.lineTo(p.x - 14, p.y + rnd(-3,3));
      ctx.stroke();
    } else if(fxMode==="candle"){
      ctx.fillStyle = `rgba(255,210,150,${p.a})`;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    } else if(fxMode==="storm"){
      ctx.strokeStyle = `rgba(190,220,255,${p.a})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p.x,p.y);
      ctx.lineTo(p.x + rnd(-6,6), p.y + rnd(10,22));
      ctx.stroke();
    }
  }

  requestAnimationFrame(draw);
}
draw();

// ====== CUSTOM POPUP QUESTION (Scene 11) ======
function showValentineQuestion(){
  // If already answered, just continue
  if(valentineAnswered) return;

  modal.classList.add("show");
  modal.setAttribute("aria-hidden","false");

  // Replace modal content with the question (keeps your existing modal element)
  const card = modal.querySelector(".card");
  card.innerHTML = `
    <h2 style="font-family:Cinzel,serif;margin:0 0 10px;">A question…</h2>
    <p style="margin:0 0 14px;opacity:.9;line-height:1.45;">
      Reem, will you be my valentine?
    </p>
    <div style="display:flex;gap:10px;">
      <button id="yes1" class="primary" style="flex:1;">Yes</button>
      <button id="yes2" class="primary" style="flex:1;">Yes</button>
    </div>
    <p style="margin:12px 0 0;color:rgba(255,255,255,.7);font-size:12px;">
      (There was never another option.)
    </p>
  `;

  const finish = () => {
    valentineAnswered = true;
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden","true");
    // Go to scene 12 immediately after answering
    go(12);
  };

  card.querySelector("#yes1").addEventListener("click", finish);
  card.querySelector("#yes2").addEventListener("click", finish);

  // Also allow tapping outside to not dismiss (keep romantic control)
  modal.onclick = (e) => { /* ignore */ };
}

// ====== NAV ======
function go(i){
  // Special rule: if user tries to go past 11 without answering, force question
  if(i >= 12 && !valentineAnswered){
    current = 11;
  } else {
    current = Math.max(1, Math.min(TOTAL, i));
  }

  const scene = SCENES[current-1] || {title:"",text:"",sub:"",fx:"none"};

  idxEl.textContent = current;
  chapterEl.textContent = scene.title || `Scene ${current}`;

  typeText(captionEl, scene.text || "", 16);
  subEl.textContent = scene.sub || "";

  setBg(imgPath(current));
  setFX(scene.fx);

  updateDots();

  // Preload next image
  const next = new Image();
  next.src = imgPath(Math.min(TOTAL, current+1));

  // Trigger the Scene 11 question
  if(scene.ask === true && !valentineAnswered){
    // tiny delay so the scene loads first
    setTimeout(showValentineQuestion, 650);
  }
}

prevBtn.addEventListener("click", () => go(current-1));
nextBtn.addEventListener("click", () => go(current+1));

window.addEventListener("keydown", (e)=>{
  if(e.key === "ArrowLeft") go(current-1);
  if(e.key === "ArrowRight") go(current+1);
});

// Swipe
let sx=0, sy=0;
window.addEventListener("touchstart",(e)=>{
  const t=e.touches[0]; sx=t.clientX; sy=t.clientY;
},{passive:true});
window.addEventListener("touchend",(e)=>{
  const t=e.changedTouches[0]; const dx=t.clientX-sx; const dy=t.clientY-sy;
  if(Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)){
    if(dx<0) go(current+1); else go(current-1);
  }
},{passive:true});

// ====== INFO MODAL (button still works) ======
btnInfo.addEventListener("click", ()=>{
  modal.classList.add("show");
  modal.setAttribute("aria-hidden","false");
  const card = modal.querySelector(".card");
  card.innerHTML = `
    <h2>How to use</h2>
    <p>Swipe left/right or use the arrows. Tap a dot to jump to a scene.</p>
    <p>Scene 11 contains a special question.</p>
    <p>Music is optional (add <code>music.mp3</code> to repo root).</p>
    <button id="closeModal" class="primary">Close</button>
  `;
  card.querySelector("#closeModal").addEventListener("click", ()=>{
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden","true");
  });
});
closeModal?.addEventListener("click", ()=>{
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden","true");
});

// ====== MUSIC ======
let musicReady = false;
function setupMusic(){
  music.src = MUSIC_FILE;
  music.loop = true;
  music.volume = 0.55;
  music.addEventListener("canplaythrough", ()=> musicReady = true);
}
setupMusic();

btnMusic.addEventListener("click", async ()=>{
  try{
    if(!musicReady){
      await music.play().catch(()=>{});
      music.pause();
      music.currentTime = 0;
    }
    if(music.paused){
      await music.play();
      btnMusic.textContent = "❚❚";
    } else {
      music.pause();
      btnMusic.textContent = "♪";
    }
  }catch(_){}
});

// ====== INIT ======
buildDots();
go(1);

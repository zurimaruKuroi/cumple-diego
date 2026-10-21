(() => {
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- pixel art ---------- */
function sprite(rows, pal, scale = 1){
  const h = rows.length, w = Math.max(...rows.map(r => r.length));
  const c = document.createElement('canvas'); c.width = w*scale; c.height = h*scale;
  const g = c.getContext('2d');
  rows.forEach((r,y) => [...r].forEach((ch,x) => { if (pal[ch]) { g.fillStyle = pal[ch]; g.fillRect(x*scale,y*scale,scale,scale); } }));
  return c.toDataURL();
}
let seed = 7; const rnd = () => (seed = (seed*9301+49297)%233280)/233280;
function texture(fn, n = 16){
  const c = document.createElement('canvas'); c.width = c.height = n; const g = c.getContext('2d');
  for (let y=0;y<n;y++) for (let x=0;x<n;x++){ g.fillStyle = fn(x,y); g.fillRect(x,y,1,1); }
  return c.toDataURL();
}
const pick = a => a[Math.floor(rnd()*a.length)];
const dirt = ['#79553a','#6b4a2b','#8a6243','#593d23','#966c4a'];
const grass = ['#5fa52b','#4f8f22','#6fbf33','#47801d'];
const sponge = ['#e9c48f','#dfb57c','#f0cf9e','#d6a96d'];
const cream = ['#fdf6ef','#f4eadf','#ffffff'];
const drips = [3,4,3,5,4,3,3,4,5,4,3,4,3,5,4,3];
const grassSide = texture((x,y) => y < drips[x] ? pick(grass) : pick(dirt));
const cakeSide = texture((x,y) => y < 3 ? pick(cream) : y===3 ? (x%3? '#f4eadf':'#e0202c') : y===4 ? '#c0392b' : pick(sponge));
const cakeTop = texture((x,y) => ([[3,3],[11,4],[6,9],[12,12],[3,12],[8,2]].some(([a,b])=>a===x&&b===y)) ? '#e0202c' : pick(cream));
const candleTex = sprite(['WRRW','RRWW','RWWR','WWRR','WRRW','RRWW','RWWR','WWRR','WRRW','RRWW','RWWR'],{W:'#fff',R:'#ff6b8a'});

document.querySelectorAll('.cake .side').forEach(f => f.style.backgroundImage = `url(${cakeSide})`);
document.getElementById('cakeTop').style.backgroundImage = `url(${cakeTop})`;
const ground = document.getElementById('ground');
ground.style.backgroundImage = `url(${grassSide})`;

const cake = document.getElementById('cake');
[[-40,-40],[40,-40],[0,0],[-40,40],[40,40]].forEach(([dx,dz]) => {
  const c = document.createElement('div'); c.className = 'candle';
  c.style.transform = `translate3d(${dx}px,0,${dz}px)`;
  c.innerHTML = `<i style="background-image:url(${candleTex})"></i><i style="background-image:url(${candleTex})"></i><div class="flame"></div>`;
  cake.appendChild(c);
});

const S = {
  heart:[ '..XX...XX..','.XRRX.XRRX.','XRWRRXRRRRX','XRRRRRRRRRX','XRRRRRRRRRX','.XRRRRRRRX.','..XRRRRRX..','...XRRRX...','....XRX....','.....X.....' ],
  diamond:[ '...XXXXX...','..XCLLCCX..','.XCLLCCCCX.','XCCCCCCCCCX','.XCCCCCCDX.','..XCCCCDX..','...XCCDX...','....XCX....','.....X.....' ],
  apple:[ '.....S.....','....SL.....','..XXXSXXX..','.XRRRRRRWX.','XRRRRRRRWRX','XRRRRRRRRRX','XRRRRRRRRRX','XRRRRRRRRRX','.XRRRRRRRX.','..XRRXRRX..','...XX.XX...' ],
  gold:[ '...........','...........','...XXXXXX..','..XWYYYYOX.','.XWYYYYYYOX','XWYYYYYYYOX','XXXXXXXXXXX' ],
  rose:[ '..XRRRX..','.XRRDRRX.','.XRDRRRX.','..XRRRX..','....G....','..LGG....','..LLGGL..','....GLL..','....G....','....G....' ],
  potion:[ '....WW....','....XX....','....GG....','...XGGX...','..XPPPPX..','.XPLPPPPX.','.XPLPPPPX.','.XPPPPPPX.','..XPPPPX..','...XXXX...' ],
  cookie:[ '...XXXX...','..XTTTTX..','.XTCTTTTX.','XTTTTTCTTX','XTCTTTTTTX','XTTTTCTTTX','.XTTTTTTX.','..XTCTTX..','...XXXX...' ],
  star:[ '.....X.....','....XYX....','....XYX....','XXXXYYYXXXX','.XYYYWYYYX.','..XYYYYYX..','..XYYXYYX..','.XYYX.XYYX.','.XXX...XXX.' ],
  petal:[ '.PP.','PLPP','PPPD','.PD.' ],
  torch:[ '..F..','.FYF.','.YWY.','.XYX.','..B..','..B..','..B..','..B..','..B..' ],
  cake:[ '..F.F.F..','..W.W.W..','.XXXXXXX.','XWWRWWRWX','XWWWWWWWX','XRRRRRRRX','XTTTTTTTX','XTTTTTTTX','.XXXXXXX.' ]
};
const P = {
  heart:{X:'#5a0a12',R:'#e0202c',W:'#ffd0d0'},
  diamond:{X:'#0b4f4c',C:'#4de8e0',L:'#d8fffb',D:'#1aa7a0'},
  apple:{X:'#5a0a12',R:'#d8242c',W:'#ff9a9a',S:'#5b3a1c',L:'#4f8f22'},
  gold:{X:'#6b4a00',W:'#fffbd0',Y:'#ffd83b',O:'#d49a10'},
  rose:{X:'#5a0a12',R:'#e0202c',D:'#9a0f1a',G:'#2f7a1a',L:'#5fa52b'},
  potion:{X:'#2a1040',W:'#a0682a',G:'#d0e8ff',P:'#d44df0',L:'#f8c8ff'},
  cookie:{X:'#5b3a1c',T:'#d49a5a',C:'#3b2210'},
  star:{X:'#6b4a00',Y:'#ffd83b',W:'#ffffff'},
  petal:{P:'#ffb3cf',L:'#ffe3ee',D:'#f07aa6'},
  torch:{F:'#ff8a1c',Y:'#ffd83b',W:'#fff6c8',X:'#6b3d14',B:'#8a5a2b'},
  cake:{X:'#3b2210',W:'#fdf6ef',R:'#e0202c',T:'#e9c48f',F:'#ffd83b'}
};
const img = k => sprite(S[k], P[k], 8);
const IMG = Object.fromEntries(Object.keys(S).map(k => [k, img(k)]));

/* corazones de vida */
const hearts = document.getElementById('hearts');
for (let i=0;i<10;i++){ const im = new Image(); im.src = IMG.heart; im.alt=''; im.style.setProperty('--i',i); hearts.appendChild(im); }

/* título con letras que ondulan */
const t = document.getElementById('title'); let idx = 0;
t.innerHTML = t.textContent.split(' ').map(w => `<span class="w">${[...w].map(ch => `<span class="l" style="--i:${idx++}">${ch}</span>`).join('')}</span>`).join(' ');

/* cielo */
const sky = document.getElementById('sky');
for (let i=0;i<70;i++){ const s=document.createElement('div'); s.className='star';
  s.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*42}%;animation-delay:${Math.random()*3}s;opacity:${.3+Math.random()*.7}`; sky.appendChild(s); }
for (let i=0;i<5;i++){ const c=document.createElement('div'); c.className='cloud'; const w=80+Math.random()*120;
  c.style.cssText=`width:${w}px;top:${5+Math.random()*40}%;animation-duration:${40+Math.random()*40}s;animation-delay:-${Math.random()*60}s`; sky.appendChild(c); }

/* paisaje de pixeles: sol retro + montañas + pinos */
const land = document.getElementById('land'), lg = land.getContext('2d');
function drawLand(){
  const PX = 5, W = Math.ceil(innerWidth/PX), H = Math.ceil(innerHeight/PX);
  land.width = W; land.height = H; lg.clearRect(0,0,W,H);
  let sd = 42; const r2 = () => (sd = (sd*16807)%2147483647)/2147483647;
  // sol
  const cx = Math.round(W*.5), cy = Math.round(H*.66), R = Math.round(Math.min(W,H)*.2);
  for (let y=-R;y<=R;y++){
    const yy = cy+y, half = Math.round(Math.sqrt(R*R-y*y));
    if (y > 0 && (y % Math.max(3, Math.round(8 - y/R*6))) < Math.round(1 + y/R*2)) continue; // franjas retro
    const t = (y+R)/(2*R);
    lg.fillStyle = `rgb(255,${Math.round(236-t*120)},${Math.round(140+t*30)})`;
    lg.fillRect(cx-half, yy, half*2, 1);
  }
  // montañas
  const layers = [
    {base:.62, amp:.16, col:'#9a5aa8', seed:1},
    {base:.70, amp:.13, col:'#6e3f8e', seed:2},
    {base:.79, amp:.10, col:'#43296b', seed:3, trees:true},
    {base:.90, amp:.05, col:'#2a1a4f', seed:4, trees:true}
  ];
  layers.forEach(L => {
    const ph = [r2()*9, r2()*9, r2()*9];
    const step = 3;
    for (let x=0;x<W;x+=step){
      const n = Math.sin(x*.018+ph[0])*.55 + Math.sin(x*.047+ph[1])*.3 + Math.sin(x*.11+ph[2])*.15;
      const top = Math.round(H*(L.base - n*L.amp));
      lg.fillStyle = L.col; lg.fillRect(x, top, step, H-top);
      if (L.trees && r2() < .22){
        const th = 4 + Math.floor(r2()*5);
        for (let k=0;k<th;k++){ const w = Math.max(1, Math.round((th-k)/2)); lg.fillRect(x+1-w, top-k-2, w*2+1, 1); }
        lg.fillRect(x+1, top-2, 1, 2);
      }
    }
  });
  // brillo de neblina sobre el horizonte
  const fog = lg.createLinearGradient(0,H*.6,0,H);
  fog.addColorStop(0,'rgba(255,190,200,0)'); fog.addColorStop(.6,'rgba(255,190,200,.12)'); fog.addColorStop(1,'rgba(40,20,80,.35)');
  lg.fillStyle = fog; lg.fillRect(0,H*.6,W,H*.4);
}
drawLand(); addEventListener('resize', drawLand);
for (let i=0;i<22;i++){ const f=document.createElement('div'); f.className='firefly';
  f.style.cssText=`left:${Math.random()*100}%;top:${55+Math.random()*40}%;--d:${7+Math.random()*8}s;animation-delay:-${Math.random()*8}s,-${Math.random()*2}s`; sky.appendChild(f); }
setInterval(() => { if (reduce || document.hidden) return; const s=document.createElement('div'); s.className='shoot';
  s.style.cssText=`left:${40+Math.random()*60}%;top:${Math.random()*25}%`; sky.appendChild(s); s.addEventListener('animationend',()=>s.remove()); }, 3800);
const fallers = ['petal','petal','petal','heart','petal','star'];
function spawnFall(){
  if (reduce || document.hidden) return;
  const im = new Image(); im.src = IMG[fallers[Math.floor(Math.random()*fallers.length)]]; im.className='fall'; im.alt='';
  const size = 14 + Math.random()*20; im.style.cssText = `left:${Math.random()*100}%;width:${size}px;opacity:${.35+Math.random()*.5};animation-duration:${7+Math.random()*8}s;--r:${(Math.random()-.5)*540}deg`;
  sky.appendChild(im); im.addEventListener('animationend', () => im.remove());
}
setInterval(spawnFall, 700);

/* flores en el suelo */
['rose','rose','rose','rose'].forEach((k,i) => { const im = new Image(); im.src = IMG[k]; im.alt=''; im.className='flower';
  im.style.cssText=`left:${10+i*24}%;animation-delay:${i*.4}s`; ground.appendChild(im); });

/* toast */
const toast = document.getElementById('toast'); let tt;
function achieve(text, icon){
  document.getElementById('toastTxt').textContent = text;
  document.getElementById('toastImg').src = IMG[icon];
  toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('show'), 4200);
}
setTimeout(() => achieve('Diego llegó al nivel 18', 'cake'), 1400);

/* hotbar */
const items = [
  ['heart','Corazón','Contigo siento que reaparezco cada mañana con la barra de vida llena.','Vida extra permanente'],
  ['diamond','Diamante','Eres más difícil de encontrar que un diamante en la primera mina.','Rareza: legendaria'],
  ['apple','Manzana','Tus abrazos regeneran más que cualquier comida del inventario.','Regeneración II'],
  ['gold','Lingote de oro','Tienes un corazón de oro. Lo digo literal.','Valor: incalculable'],
  ['rose','Rosa','Una flor para el chico más lindo de todo el mundo, incluido el Nether.','Para ti, siempre'],
  ['potion','Poción','Efecto: enamoramiento. Me la tomé el día que nos besamos por primera vez.','Duración: ∞'],
  ['cookie','Galleta','Te debo mil galletas y otros mil besos. Hoy empiezo a pagar.','Apilable hasta 64'],
  ['star','Estrella','Brillas incluso en la capa más oscura de la cueva.','Encantado'],
  ['torch','Antorcha','Iluminas cada camino por el que paso a tu lado.','Luz nivel 15'],
];
const bar = document.getElementById('hotbar'), nameEl = document.getElementById('itemName'), reason = document.getElementById('reason');
items.forEach(([k,n],i) => {
  const b = document.createElement('button'); b.className='slot'; b.setAttribute('role','option'); b.id='slot'+i;
  b.setAttribute('aria-label', n); b.innerHTML = `<img src="${IMG[k]}" alt=""><span class="n">${i+1}</span>`;
  b.addEventListener('click', () => select(i, true)); bar.appendChild(b);
});
function select(i, fx){
  [...bar.children].forEach((s,j) => { s.classList.toggle('on', j===i); s.setAttribute('aria-selected', j===i); });
  const [k,n,txt,lore] = items[i];
  nameEl.textContent = n; nameEl.classList.remove('pop'); void nameEl.offsetWidth; nameEl.classList.add('pop');
  reason.querySelector('b').textContent = n; reason.querySelector('p').textContent = txt; reason.querySelector('.lore').textContent = lore;
  if (fx){ reason.classList.remove('swap'); void reason.offsetWidth; reason.classList.add('swap');
    const r = bar.children[i].getBoundingClientRect(); burst(r.left+r.width/2, r.top+r.height/2, 14, ['#fff','#ffd83b','#4de8e0']); }
}
select(0, false);
addEventListener('keydown', e => { if (/^[1-9]$/.test(e.key) && !e.target.closest('input,textarea')) select(+e.key-1, true); });

/* pastel: soplar velas */
let blown = false;
document.getElementById('cakeBtn').addEventListener('click', e => {
  const stage = e.currentTarget, r = stage.getBoundingClientRect();
  blown = !blown; cake.classList.toggle('blown', blown);
  if (blown){
    burst(r.left+r.width/2, r.top+r.height*.35, 70, ['#e0202c','#ffd83b','#4de8e0','#7efc20','#ff6bf0','#fff']);
    achieve('Deseo pedido. Que se cumpla todo', 'star');
    document.getElementById('hint').textContent = '▶ Toca otra vez para encender las velas';
  } else document.getElementById('hint').textContent = '▶ Toca el pastel y pide un deseo';
});

/* cofre + carta */
const letterText = `Feliz cumpleaños bb.

Hoy cumples 18 y no sabes lo feliz que me hace celebrarlo contigo.

Si la vida fuera un mundo infinito, igual elegiría construirlo contigo, bloque por bloque. Gracias por cada aventura, por cada risa y por hacer que hasta los días difíciles se sientan como un lugar seguro.

Hoy llegas al nivel 18 y yo estoy muy orgullosa d todo lo que eres. Que este año te traiga todo lo que deseas y muchos tesoros por descubrir.

Te amo muchísimo, Diego.`;
const chest = document.getElementById('chest'), letter = document.getElementById('letter'), typed = document.getElementById('typed');
let typing = false;
chest.addEventListener('click', () => {
  if (chest.classList.contains('open')) return;
  chest.classList.add('open'); chest.setAttribute('aria-label','Cofre abierto');
  const r = chest.getBoundingClientRect(); setTimeout(() => burst(r.left+r.width/2, r.top+20, 50, ['#ffd83b','#fff','#4de8e0']), 350);
  document.getElementById('closedMsg').hidden = true; typed.hidden = false;
  achieve('Encontraste un tesoro', 'diamond');
  if (reduce){ typed.textContent = letterText; letter.classList.add('done'); return; }
  let i = 0; typing = true; typed.innerHTML = '<span class="caret"></span>';
  const tick = () => {
    i += 1; typed.textContent = letterText.slice(0,i); const c = document.createElement('span'); c.className='caret'; typed.appendChild(c);
    if (i < letterText.length) setTimeout(tick, letterText[i-1]==='\n' ? 180 : 28); else { letter.classList.add('done'); typing = false; }
  };
  setTimeout(tick, 600);
});


/* easter egg: escribir "bb" o tocar el título 5 veces */
const secret = document.getElementById('secret'); document.getElementById('secretImg').src = IMG.heart;
let found = false;
function unlock(){
  secret.classList.add('show'); document.body.classList.add('bb-mode');
  document.getElementById('secretClose').focus();
  for (let k=0;k<8;k++) setTimeout(() => burst(innerWidth*Math.random(), innerHeight*(.2+Math.random()*.4), 60, ['#ff6b8a','#ffb3cf','#fff','#ff6bf0'], 7), k*220);
  if (!reduce) for (let k=0;k<60;k++) setTimeout(() => {
    const im = new Image(); im.src = IMG.heart; im.className='fall'; im.alt='';
    im.style.cssText = `left:${Math.random()*100}%;width:${18+Math.random()*26}px;animation-duration:${3+Math.random()*3}s;z-index:44;--r:${(Math.random()-.5)*360}deg`;
    sky.appendChild(im); im.addEventListener('animationend', () => im.remove());
  }, k*60);
  if (!found){ found = true; setTimeout(() => achieve('Logro secreto: modo bb', 'heart'), 500); }
}
document.getElementById('secretClose').addEventListener('click', () => secret.classList.remove('show'));
secret.addEventListener('click', e => { if (e.target === secret) secret.classList.remove('show'); });
addEventListener('keydown', e => { if (e.key === 'Escape') secret.classList.remove('show'); });
let typedKeys = '';
addEventListener('keydown', e => {
  if (e.key.length !== 1) return;
  if (e.key === ' ' && typedKeys.endsWith('te')) e.preventDefault(); // que el espacio no baje la página
  typedKeys = (typedKeys + e.key.toLowerCase()).slice(-10);
  if (typedKeys.endsWith('te 5')){ typedKeys = ''; unlock(); }
});
let taps = 0, tapT;
t.addEventListener('click', () => { taps++; clearTimeout(tapT); tapT = setTimeout(() => taps = 0, 1500);
  t.animate([{transform:'scale(1)'},{transform:'scale(1.06)'},{transform:'scale(1)'}],{duration:200});
  if (taps >= 5){ taps = 0; breakTitle(); } });
let titleFound = false;
function breakTitle(){
  const letters = t.querySelectorAll('.l');
  letters.forEach(l => {
    const dx = (Math.random()-.5)*innerWidth*.8, dy = 120 + Math.random()*innerHeight*.5, r = (Math.random()-.5)*720;
    l.animate([{transform:'none'},{transform:`translate(${dx}px,${dy}px) rotate(${r}deg)`, offset:.45},{transform:`translate(${dx}px,${dy}px) rotate(${r}deg)`, offset:.6},{transform:'none'}],
      {duration: reduce ? 1 : 2200, easing:'cubic-bezier(.5,0,.3,1)'});
  });
  if (!reduce) for (let k=0;k<45;k++) setTimeout(() => {
    const im = new Image(); im.src = IMG[k%2 ? 'diamond' : 'gold']; im.className='fall'; im.alt='';
    im.style.cssText = `left:${Math.random()*100}%;width:${16+Math.random()*22}px;animation-duration:${2.5+Math.random()*2.5}s;z-index:44;--r:${(Math.random()-.5)*360}deg`;
    sky.appendChild(im); im.addEventListener('animationend', () => im.remove());
  }, k*50);
  setTimeout(() => {
    const o = document.getElementById('secret4'); o.classList.add('show'); o.querySelector('button').focus();
    if (!titleFound){ titleFound = true; achieve('Logro secreto: rompe-títulos', 'gold'); }
  }, reduce ? 0 : 2300);
}


/* secretos extra */
document.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => b.closest('.secret').classList.remove('show')));
document.querySelectorAll('.secret').forEach(o => o.addEventListener('click', e => { if (e.target === o) o.classList.remove('show'); }));
addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelectorAll('.secret').forEach(o => o.classList.remove('show')); });
function openSecret(id, toastTxt, icon){
  const o = document.getElementById(id); o.classList.add('show'); o.querySelector('button').focus();
  for (let k=0;k<5;k++) setTimeout(() => burst(innerWidth*Math.random(), innerHeight*(.2+Math.random()*.4), 60, ['#ffd83b','#4de8e0','#fff','#ff6bf0'], 7), k*220);
  achieve(toastTxt, icon);
}
let flowerTaps = 0, fT;
ground.querySelectorAll('.flower').forEach(f => f.addEventListener('click', () => {
  f.animate([{transform:'scale(1)'},{transform:'scale(1.6) rotate(15deg)'},{transform:'scale(1)'}],{duration:300});
  flowerTaps++; clearTimeout(fT); fT = setTimeout(() => flowerTaps = 0, 2000);
  if (flowerTaps >= 3){ flowerTaps = 0; openSecret('secret2','Logro secreto: jardinero del amor','rose'); }
}));
document.getElementById('secret3Img').src = IMG.diamond;
document.getElementById('secret4Img').src = IMG.gold;
let codeKeys = '';
addEventListener('keydown', e => {
  if (e.key.length !== 1) return;
  codeKeys = (codeKeys + e.key).slice(-8);
  if (codeKeys === '18112023'){ codeKeys = ''; openSecret('secret3','Logro secreto: código legendario','diamond'); }
});

/* contador */
const counter = document.getElementById('counter');
const start = new Date(counter.dataset.inicio + 'T00:00:00');
function tickCount(){
  if (isNaN(start)) { document.getElementById('since').textContent = 'Revisa la fecha en el HTML (formato AÑO-MES-DÍA).'; return; }
  let d = Math.max(0, Math.floor((Date.now() - start) / 1000));
  const D = Math.floor(d/86400); d%=86400; const H = Math.floor(d/3600); d%=3600; const M = Math.floor(d/60), Sx = d%60;
  document.getElementById('cD').textContent = D.toLocaleString('es');
  document.getElementById('cH').textContent = H; document.getElementById('cM').textContent = M; document.getElementById('cS').textContent = Sx;
  const sb = document.getElementById('cSbox'); sb.classList.remove('tick'); void sb.offsetWidth; sb.classList.add('tick');
}
document.getElementById('since').textContent = isNaN(start) ? '' : 'Desde el ' + start.toLocaleDateString('es', {day:'numeric', month:'long', year:'numeric'}) + ', el mejor día de mi vida.';
tickCount(); setInterval(tickCount, 1000);

/* cupones */
const CUP_KEY = 'cupones-diego'; let usados = {};
try { usados = JSON.parse(localStorage.getItem(CUP_KEY) || '{}'); } catch(e) {}
document.querySelectorAll('.coupon').forEach(c => {
  const icon = c.dataset.icon; if (IMG[icon]){ const im = new Image(); im.src = IMG[icon]; im.alt=''; c.prepend(im); }
  if (usados[c.dataset.id]) c.classList.add('used');
  c.setAttribute('aria-pressed', !!usados[c.dataset.id]);
  c.addEventListener('click', () => {
    const on = !c.classList.contains('used'); c.classList.toggle('used', on); c.setAttribute('aria-pressed', on);
    usados[c.dataset.id] = on; try { localStorage.setItem(CUP_KEY, JSON.stringify(usados)); } catch(e) {}
    if (on){ const r = c.getBoundingClientRect(); burst(r.left+r.width/2, r.top+r.height/2, 30, ['#d8242c','#ffd83b','#fff']); achieve('Cupón canjeado', icon || 'heart'); }
  });
});

/* mini juego */
const game = document.getElementById('game'), gc = document.getElementById('gameCanvas'), gx = gc.getContext('2d');
const stoneTex = texture(() => pick(['#7f7f7f','#8f8f8f','#6f6f6f','#9a9a9a','#747474']), 8);
const loadImg = src => { const i = new Image(); i.src = src; return i; };
const GI = { diamond:loadImg(IMG.diamond), heart:loadImg(IMG.heart), gold:loadImg(IMG.gold), stone:loadImg(stoneTex) };
const G = { run:false, score:0, lives:3, items:[], px:.5, last:0, spawn:0, keys:{}, goal:18 };
function gSize(){ const r = gc.getBoundingClientRect(); gc.width = Math.round(r.width); gc.height = Math.round(r.height); gx.imageSmoothingEnabled = false; gDraw(); }
function gHud(){ document.getElementById('gScore').textContent = `Tesoros: ${G.score}/${G.goal}`; document.getElementById('gLives').textContent = '♥'.repeat(G.lives); }
function gStart(){
  Object.assign(G, {run:true, score:0, lives:3, items:[], px:.5, spawn:0, last:performance.now()});
  document.getElementById('gOver').hidden = true; game.classList.add('playing'); gHud(); requestAnimationFrame(gLoop);
}
function gEnd(win){
  G.run = false; game.classList.remove('playing');
  const o = document.getElementById('gOver'); o.hidden = false;
  document.getElementById('gTitle').textContent = win ? '¡Ganaste, bb!' : 'Te alcanzaron las piedras';
  document.getElementById('gText').textContent = win ? 'Premio desbloqueado: un beso de verdad la próxima vez que me veas. Y otro de regalo.' : 'No pasa nada, los héroes reaparecen. ¿Otra partida?';
  document.getElementById('gStart').textContent = win ? 'Jugar otra vez' : 'Reintentar';
  if (win){ const r = gc.getBoundingClientRect(); for (let k=0;k<4;k++) setTimeout(() => burst(r.left+r.width*Math.random(), r.top+r.height*.4, 70, ['#ffd83b','#4de8e0','#ff6b8a','#fff'], 7), k*250); achieve('Nivel 18 completado', 'diamond'); }
}
function gLoop(t){
  if (!G.run) return;
  const dt = Math.min(40, t - G.last) / 16.67; G.last = t;
  const W = gc.width, H = gc.height, size = 30;
  if (G.keys.arrowleft) G.px -= .018*dt; if (G.keys.arrowright) G.px += .018*dt; G.px = Math.max(0, Math.min(1, G.px));
  G.spawn -= dt;
  if (G.spawn <= 0){
    const bad = Math.random() < .28; const kinds = ['diamond','heart','gold'];
    G.items.push({ k: bad ? 'stone' : kinds[Math.floor(Math.random()*3)], x: Math.random()*(W-size), y:-size, v: 2 + Math.random()*1.5 + G.score*.09 });
    G.spawn = Math.max(14, 40 - G.score*1.2);
  }
  const pw = 70, ph = 34, pxx = G.px*(W-pw), py = H-ph-10;
  for (const it of G.items){
    it.y += it.v*dt;
    if (!it.done && it.y+size >= py && it.y <= py+ph && it.x+size > pxx && it.x < pxx+pw){
      it.done = true;
      if (it.k === 'stone'){ G.lives--; game.classList.remove('shake'); void game.offsetWidth; game.classList.add('shake'); }
      else { G.score++; const r = gc.getBoundingClientRect(); burst(r.left+(it.x+size/2)*r.width/W, r.top+py*r.height/H, 12, ['#ffd83b','#fff','#4de8e0'], 4); }
      gHud();
    }
  }
  G.items = G.items.filter(i => !i.done && i.y < H+size);
  gDraw(pxx, py, pw, ph);
  if (G.score >= G.goal) return gEnd(true);
  if (G.lives <= 0) return gEnd(false);
  requestAnimationFrame(gLoop);
}
function gDraw(pxx, py, pw = 70, ph = 34){
  const W = gc.width, H = gc.height; if (!W) return;
  const sk = gx.createLinearGradient(0,0,0,H); sk.addColorStop(0,'#2b1d5e'); sk.addColorStop(1,'#a8569c');
  gx.fillStyle = sk; gx.fillRect(0,0,W,H);
  gx.fillStyle = 'rgba(255,255,255,.6)'; for (let i=0;i<30;i++) gx.fillRect((i*97)%W, (i*53)%(H*.6), 2, 2);
  gx.fillStyle = '#4f8f22'; gx.fillRect(0,H-10,W,10); gx.fillStyle = '#6b4a2b'; gx.fillRect(0,H-4,W,4);
  for (const it of G.items) gx.drawImage(GI[it.k], Math.round(it.x), Math.round(it.y), 30, 30);
  if (pxx === undefined){ pxx = G.px*(W-pw); py = H-ph-10; }
  gx.fillStyle = '#2b1a08'; gx.fillRect(pxx-3, py-3, pw+6, ph+6);
  gx.fillStyle = '#a0682a'; gx.fillRect(pxx, py, pw, ph);
  gx.fillStyle = '#7a4c1c'; for (let x=pxx+12;x<pxx+pw;x+=18) gx.fillRect(x, py, 3, ph);
  gx.fillStyle = '#c9c9c9'; gx.fillRect(pxx+pw/2-6, py+6, 12, 14);
}
gc.addEventListener('pointermove', e => { if (!G.run) return; const r = gc.getBoundingClientRect(); G.px = (e.clientX - r.left - 35) / (r.width - 70); });
gc.addEventListener('pointerdown', e => { if (!G.run) return; const r = gc.getBoundingClientRect(); G.px = (e.clientX - r.left - 35) / (r.width - 70); });
addEventListener('keydown', e => { const k = e.key.toLowerCase(); if (G.run && (k==='arrowleft'||k==='arrowright')){ G.keys[k] = true; e.preventDefault(); } });
addEventListener('keyup', e => { G.keys[e.key.toLowerCase()] = false; });
document.getElementById('gStart').addEventListener('click', gStart);
addEventListener('resize', gSize); gSize(); gHud();

/* música: archivo propio si existe, si no, canción 8 bits original */
const hz = n => { const m = n.match(/^([A-G])(#?)(\d)$/); const st = {C:0,D:2,E:4,F:5,G:7,A:9,B:11}[m[1]] + (m[2]?1:0); return 440 * 2 ** ((12*(+m[3]+1) + st - 69) / 12); };
const chords = [['A3','C4','E4'],['F3','A3','C4'],['C4','E4','G4'],['G3','B3','D4']];
const lead = [
  ['E5',2],['C5',1],['D5',1],['E5',2],['G5',2], ['A5',3],['G5',1],['F5',2],['E5',2],
  ['E5',2],['D5',1],['C5',1],['D5',2],['E5',2], ['D5',3],['B4',1],['D5',2],[null,2],
  ['C5',2],['E5',1],['A5',1],['G5',2],['E5',2], ['F5',2],['A5',2],['C6',2],['A5',2],
  ['G5',3],['E5',1],['C5',2],['E5',2], ['D5',4],['B4',2],['G4',2]
];
let actx = null, mTimer = null;
const musicBtn = document.getElementById('music'), songFile = document.getElementById('songFile');
const hasFile = () => songFile && songFile.getAttribute('src');
function voice(ctx, type, freq, t, dur, vol){
  const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t+.01); g.gain.setValueAtTime(vol, t+dur*.6); g.gain.linearRampToValueAtTime(0, t+dur*.95);
  o.connect(g).connect(ctx.destination); o.start(t); o.stop(t+dur);
}
function kick(ctx, t){
  const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine';
  o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(45, t+.12);
  g.gain.setValueAtTime(.35, t); g.gain.exponentialRampToValueAtTime(.001, t+.18); o.connect(g).connect(ctx.destination); o.start(t); o.stop(t+.2);
}
function playSong(){
  if (!actx) return;
  const e8 = .27, s16 = e8/2, t0 = actx.currentTime + .1; let t = t0;
  for (const [n,d] of lead){ if (n) voice(actx,'square',hz(n),t,d*e8,.05); t += d*e8; }
  const total = 64*e8, bars = 8;
  for (let bar=0; bar<bars; bar++){
    const ch = chords[bar % 4], tb = t0 + bar*8*e8;
    for (let i=0;i<8;i++) voice(actx,'triangle',hz(ch[i%3]),tb+i*e8,e8*.9,.045);              // arpegio
    for (const step of [0,3,4,6,8,11,12,14]) {                                                // ritmo dembow
      voice(actx,'triangle',hz(ch[0])/2,tb+step*s16,s16*1.6,.13);
      if (step % 8 === 0) kick(actx, tb+step*s16);
    }
  }
  mTimer = setTimeout(playSong, (t0 + total - actx.currentTime) * 1000 - 60);
}
function setMusic(on){ musicBtn.classList.toggle('on', on); musicBtn.setAttribute('aria-pressed', on); document.getElementById('musicTxt').textContent = on ? 'Pausar' : 'Música'; }
musicBtn.addEventListener('click', () => {
  if (hasFile()){
    if (songFile.paused){ songFile.play().then(() => setMusic(true)).catch(() => setMusic(false)); } else { songFile.pause(); setMusic(false); }
    return;
  }
  if (actx){ clearTimeout(mTimer); actx.close(); actx = null; setMusic(false); return; }
  try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) { return; }
  setMusic(true); playSong();
});

/* partículas y fuegos */
const cv = document.getElementById('fx'), g = cv.getContext('2d'); let parts = [], running = false;
function size(){ cv.width = innerWidth; cv.height = innerHeight; } size(); addEventListener('resize', size);
function burst(x, y, n, colors, speed = 6){
  if (reduce) return;
  for (let i=0;i<n;i++){ const a = Math.random()*Math.PI*2, v = 1.5+Math.random()*speed;
    parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-2,life:60+Math.random()*40,s:4+Math.floor(Math.random()*3)*2,c:colors[i%colors.length]}); }
  if (!running){ running = true; requestAnimationFrame(loop); }
}
function loop(){
  g.clearRect(0,0,cv.width,cv.height);
  parts = parts.filter(p => p.life > 0);
  for (const p of parts){ p.x+=p.vx; p.y+=p.vy; p.vy+=.12; p.vx*=.985; p.life--;
    g.globalAlpha = Math.min(1,p.life/30); g.fillStyle = p.c; g.fillRect(Math.round(p.x/2)*2, Math.round(p.y/2)*2, p.s, p.s); }
  g.globalAlpha = 1;
  if (parts.length) requestAnimationFrame(loop); else running = false;
}
const fwColors = [['#e0202c','#ff9a9a','#fff'],['#4de8e0','#d8fffb','#fff'],['#ffd83b','#fff6c8','#ff8a1c'],['#7efc20','#d8ffb0'],['#d44df0','#f8c8ff','#fff']];
document.getElementById('fwBtn').addEventListener('click', () => {
  for (let k=0;k<6;k++) setTimeout(() => {
    burst(innerWidth*(.15+Math.random()*.7), innerHeight*(.15+Math.random()*.35), 80, fwColors[k%fwColors.length], 7);
  }, k*320);
  setTimeout(() => achieve('El cielo celebra contigo', 'heart'), 600);
});
})();

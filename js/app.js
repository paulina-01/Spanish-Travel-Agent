/* SOURCE: Splash-draftv3-parrot.html */
import { modules, drillWords, stepLabels } from '../data/modules.js';

let currentStep = 0;

function goStep(n) {
  document.getElementById('step-' + currentStep).classList.remove('active');
  const dots = document.querySelectorAll('#m0-dots .step-dot');
  if (dots[currentStep]) dots[currentStep].classList.remove('active');
  currentStep = n;
  document.getElementById('step-' + n).classList.add('active');
  if (dots[n]) dots[n].classList.add('active');
  document.getElementById('m0-step-label').textContent = stepLabels[n];
}

window.goStep = goStep;

const switcher = document.getElementById('switcher');

function render(i) {
  const m = modules[i];
  const isM0 = !!m.isM0;
  document.getElementById('bg-num').textContent    = m.n;
  document.getElementById('track').textContent     = m.track;
  document.getElementById('mod-num').textContent   = String(m.n).padStart(2,'0');
  document.getElementById('mod-title').textContent = m.title;
  document.getElementById('level').textContent     = m.level;
  document.getElementById('students').textContent  = m.students;

  document.getElementById('panel-standard').style.display = isM0 ? 'none' : 'flex';
  document.getElementById('panel-m0').style.display       = isM0 ? 'flex' : 'none';

  if (!isM0) {
    document.getElementById('std-content').style.display  = '';
    document.getElementById('std-signup').style.display   = 'none';
    document.getElementById('signup-email').value         = '';
    document.querySelector('.signup-row').style.display   = '';
    document.getElementById('signup-thanks').style.display = 'none';
  }
  document.getElementById('m0-dots').style.display        = isM0 ? 'flex' : 'none';
  document.getElementById('m0-step-label').style.display  = isM0 ? 'block' : 'none';

  if (isM0) {
    goStep(0);
    document.getElementById('drill-pills').innerHTML =
      drillWords.map(w => `<span class="vocab-pill">${w}</span>`).join('');
  } else {
    document.getElementById('hook').textContent     = '“' + m.hook + '”';
    document.getElementById('sent-es').textContent  = m.es;
    document.getElementById('sent-en').textContent  = m.en;
    document.getElementById('drill').textContent    = m.drill;
    document.getElementById('culture').textContent  = m.culture;
    document.getElementById('concepts').innerHTML   = [m.c1,m.c2,m.c3].map(c =>
      `<div class="concept-item"><div class="concept-dot"></div><span>${c}</span></div>`).join('');
    document.getElementById('vocab').innerHTML      = m.v.map(v =>
      `<span class="vocab-pill">${v}</span>`).join('');
  }

  document.querySelectorAll('.sw-btn').forEach((b,j) => b.classList.toggle('active', j===i));
  const pl = document.querySelector('.panel-left');
  pl.style.animation = 'none'; pl.offsetHeight; pl.style.animation = '';
}

modules.forEach((m,i) => {
  const b = document.createElement('button');
  b.className = 'sw-btn' + (i===0 ? ' active' : '');
  b.textContent = 'M' + m.n + ' — ' + m.title;
  b.onclick = () => render(i);
  switcher.appendChild(b);
});

const CK_API_KEY = 'YOUR_API_KEY';
const CK_FORM_ID = 'YOUR_FORM_ID';

function showSignup() {
  document.getElementById('std-content').style.display = 'none';
  document.getElementById('std-signup').style.display  = 'flex';
}

window.showSignup = showSignup;

async function handleSignup() {
  const input = document.getElementById('signup-email');
  const btn   = document.querySelector('#std-signup .nav-btn');
  const val   = input.value.trim();
  if (!val || !val.includes('@')) { input.focus(); return; }

  btn.textContent = 'Sending…';
  btn.disabled = true;

  try {
    const res = await fetch(`https://api.convertkit.com/v3/forms/${CK_FORM_ID}/subscribe`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ api_key: CK_API_KEY, email: val }),
    });
    if (!res.ok) throw new Error();

    document.querySelector('.signup-row').style.display    = 'none';
    document.getElementById('signup-thanks').style.display = 'block';
  } catch {
    btn.textContent = 'Try again';
    btn.disabled = false;
    input.style.borderColor = 'var(--terracotta)';
  }
}

window.handleSignup = handleSignup;

const m0html = await fetch('modules/m0-sound-like-spanish.html').then(r => r.text());
document.getElementById('panel-m0').innerHTML = m0html;

render(0);

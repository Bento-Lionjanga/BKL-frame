/* =====================================================
   MOVIMENTO DA PÁGINA
   Três partes: A) fotos  B) nome  C) funções animadas
   ===================================================== */

// ---------- A) AS TUAS FOTOS ----------
// Põe as fotos na pasta "fotos" e escreve aqui o caminho de cada uma,
// entre aspas e separadas por vírgulas. Exemplo:
//   const FOTOS = ['fotos/foto1.jpg', 'fotos/foto2.jpg', 'fotos/foto3.jpg'];
// Enquanto a lista estiver vazia, aparecem 3 quadros de exemplo.
const FOTOS = ['fotos/FOTO1.jpg', 'fotos/FOTO2.jpg', 'fotos/FOTO3.jpg'];

// Tempo entre cada foto, em milissegundos (2000 = 2 segundos)
const TEMPO_FOTOS = 2000;

// ---------- C) AS FUNÇÕES QUE APARECEM EM LETRAS ANIMADAS ----------
// Para mudar, edita esta lista. Cada função vai entre aspas e termina com vírgula.
const FUNCOES = [
  'Filmmaker',
  'Estrategista de conteúdos',
  'Designer',
  'Técnico informático',
];

/* ---------- daqui para baixo, só mexe se quiseres aprender ---------- */

const semMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;

// B) Nome: cada letra entra com um pequeno atraso
const nome = document.getElementById('nome');
const textoNome = nome.textContent;
nome.textContent = '';
[...textoNome].forEach((letra, i) => {
  if (letra === ' ') { nome.append(' '); return; }
  const span = document.createElement('span');
  span.className = 'l';
  span.textContent = letra;
  if (!semMovimento) span.style.animationDelay = (i * 45) + 'ms';
  nome.append(span);
});

// C) Funções: as letras entram, ficam um momento e saem
const caixaFuncoes = document.getElementById('roles');
if (!semMovimento) {
  let n = 0;
  const suave = 'cubic-bezier(.2,.8,.2,1)';
  const mostrar = () => {
    caixaFuncoes.textContent = '';
    const letras = [...FUNCOES[n]].map(l => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.textContent = l === ' ' ? '\u00a0' : l;
      caixaFuncoes.append(s);
      return s;
    });
    const entrar = letras.map((s, k) => s.animate(
      [{ transform: 'translateY(110%)', opacity: 0 }, { transform: 'none', opacity: 1 }],
      { duration: 450, delay: k * 35, easing: suave, fill: 'both' }));
    Promise.all(entrar.map(a => a.finished))
      .then(() => new Promise(r => setTimeout(r, 1500)))
      .then(() => {
        const sair = letras.map((s, k) => s.animate(
          [{ transform: 'none', opacity: 1 }, { transform: 'translateY(-110%)', opacity: 0 }],
          { duration: 400, delay: k * 20, easing: suave, fill: 'both' }));
        return Promise.all(sair.map(a => a.finished));
      })
      .then(() => { n = (n + 1) % FUNCOES.length; mostrar(); });
  };
  mostrar();
}

// A) Fotos: mudam sozinhas e voltam ao início no fim do ciclo
const palco = document.getElementById('stage');
const pontos = document.getElementById('dots');
const fontes = FOTOS.length ? FOTOS : [0, 1, 2];
let atual = 0, relogio;

const quadros = fontes.map((f, i) => {
  const q = document.createElement('div');
  q.className = 'slide' + (FOTOS.length ? '' : ' ph');
  if (FOTOS.length) {
    const img = new Image();
    img.src = f;
    img.alt = 'Fotografia de Bento Lionjanga ' + (i + 1);
    q.append(img);
  } else {
    q.innerHTML = '<b>BL</b><span>Foto ' + (i + 1) + '</span>';
  }
  palco.append(q);
  const b = document.createElement('button');
  b.type = 'button';
  b.setAttribute('aria-label', 'Foto ' + (i + 1));
  b.onclick = () => { mostrarFoto(i); iniciar(); };
  pontos.append(b);
  return q;
});

function mostrarFoto(n) {
  atual = n;
  quadros.forEach((q, k) => q.classList.toggle('on', k === n));
  [...pontos.children].forEach((b, k) => b.classList.toggle('on', k === n));
}
function parar() { clearInterval(relogio); }
function iniciar() {
  parar();
  if (semMovimento || quadros.length < 2) return;
  relogio = setInterval(() => mostrarFoto((atual + 1) % quadros.length), TEMPO_FOTOS);
}

const moldura = palco.parentElement;
moldura.addEventListener('mouseenter', parar);
moldura.addEventListener('mouseleave', iniciar);
mostrarFoto(0);
iniciar();
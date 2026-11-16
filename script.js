(function () {
  'use strict';

  /* CONFIGURACIÓN: cambia aquí tus textos, fotos y vídeos
     Foto:  { src: "fotos/foto1.jpg", alt: "descripción" }
     GIF:   { src: "fotos/animacion.gif" }
     Vídeo: { video: "fotos/clip.mp4", poster: "fotos/clip.jpg" } */
  var CONFIG = {
    nombre: 'Paola',
    duracionCarga: 4200,
    frases: ['Preparando algo para ti…', 'Ya casi está…', '¡Última vez, lo prometo!'],

    titulo: 'Hoy es el cumpleaños de una de mis personas favoritas',
    fecha: '18 De Noviembre',

    fotos: [
      { src: '7.jpg', alt: 'Nuestra primera foto' },
      { src: '11.jpg', alt: 'Un día especial' },
      { src: '12.jpg', alt: 'Un día especial' },
      { src: '4.jpg', alt: 'Un día especial' },
      { src: '5.jpg', alt: 'Un día especial' },
      { src: '1.jpg', alt: 'Un día especial' },
      { src: '2.jpg', alt: 'Un día especial' },
      { src: '6.jpg', alt: 'Un día especial' },
      { src: '3.jpg', alt: 'Un día especial' },
      { src: '8.jpg', alt: 'Un día especial' }
    ],

    carta: [
      '🎈🎂🎈',
      'Primero que nada decirte gracias, gracias por todo lo que hemos compartido y seguiremos compartiendo juntos, gracias por darme la dicha de ser un padre y un esposo.',
      'Gracias por ayudarme siempre y por ser mi motor en mis momentos más difíciles, siempre has estado ahí y se que siempre lo estarás, así como yo para ti lo estaré.',
      'Hoy es un día muy especial y quiero desearte un feliz cumpleaños, que Dios te bendiga siempre y te ayude a cumplir todos tus sueños y tú metas, eres una mujer maravillosa y te mereces todo lo mejor del mundo.',
      'Y si en mis manos está yo te lo quiero dar, aunque se que eres capaz de dártelo tu misma, yo quiero hacerlo.  Eres una mujer fuerte y con Miles de cualidades, una esposa hermosa y cariñosa, una madre extraordinaria y la mejor que puede tener Nana.',
      'no creo que  Nana se queje nunca de la mami que le tocó💜, hoy celebramos tu cumpleaños y tu vida y espero poder acompañarte en mil cumpleaños más tomados de la mano. Te amo mucho amor de mi vida y espero que hoy tu día sea súper especial y que tengas el mejor de los cumpleaños 🎂💜 Atte:Tu esposo.'
    ],
    cartaFinal: 'Cada año tuyo es un capítulo nuevo, y quiero estar en todos.',

    brindis: 'Por muchos cumpleaños más juntos',
    mediaFinal: { video: 'final.mp4', alt: 'video final' },
    gracias: 'Gracias por compartir tu vida conmigo'
  };

  var $ = function (id) { return document.getElementById(id); };
  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  function recuadro() {
    var d = document.createElement('div');
    d.className = 'ph';
    var s = document.createElement('span');
    s.textContent = '♥';
    var p = document.createElement('p');
    p.textContent = 'Pon aquí tu foto o vídeo';
    d.appendChild(s);
    d.appendChild(p);
    return d;
  }

  function crearMedia(item) {
    item = item || {};
    var el;
    if (item.video) {
      el = document.createElement('video');
      el.muted = true;
      el.defaultMuted = true;
      el.loop = true;
      el.autoplay = true;
      el.playsInline = true;
      el.preload = 'metadata';
      el.setAttribute('muted', '');
      el.setAttribute('playsinline', '');
      el.setAttribute('webkit-playsinline', '');
      el.setAttribute('aria-label', item.alt || 'Vídeo');
      if (item.poster) el.poster = item.poster;
      el.addEventListener('error', function () {
        if (el.parentNode) el.parentNode.replaceChild(recuadro(), el);
      });
      el.src = item.video;
      return el;
    }
    if (item.src) {
      el = new Image();
      el.alt = item.alt || '';
      el.decoding = 'async';
      el.draggable = false;
      el.addEventListener('error', function () {
        if (el.parentNode) el.parentNode.replaceChild(recuadro(), el);
      });
      el.src = item.src;
      return el;
    }
    return recuadro();
  }

  function iniciarCarrusel() {
    var track = $('track');
    var dots = $('dots');
    var frame = $('slider');
    var fotos = CONFIG.fotos && CONFIG.fotos.length ? CONFIG.fotos : [{}];
    var actual = 0;
    var timer = null;

    fotos.forEach(function (f, i) {
      var slide = document.createElement('div');
      slide.className = 'slide';
      slide.appendChild(crearMedia(f));
      track.appendChild(slide);

      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'dot';
      b.setAttribute('aria-label', 'Ir a la foto ' + (i + 1));
      b.appendChild(document.createElement('span'));
      b.addEventListener('click', function () { parar(); ir(i); });
      dots.appendChild(b);
    });

    function parar() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    function ir(n) {
      actual = (n + fotos.length) % fotos.length;
      track.style.transform = 'translateX(-' + (actual * 100) + '%)';
      var slides = track.children;
      for (var i = 0; i < slides.length; i++) {
        slides[i].setAttribute('aria-hidden', i === actual ? 'false' : 'true');
        dots.children[i].classList.toggle('is-active', i === actual);
        var v = slides[i].querySelector('video');
        if (v) {
          if (i === actual) {
            var p = v.play();
            if (p && p.catch) p.catch(function () {});
          } else {
            v.pause();
          }
        }
      }
    }

    var x0 = null;
    frame.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
    frame.addEventListener('pointercancel', function () { x0 = null; });
    frame.addEventListener('pointerup', function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 40) { parar(); ir(actual + (dx < 0 ? 1 : -1)); }
    });
    frame.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { parar(); ir(actual + 1); }
      if (e.key === 'ArrowLeft') { parar(); ir(actual - 1); }
    });

    ir(0);
    if (!reduceMotion && fotos.length > 1) {
      timer = setInterval(function () { ir(actual + 1); }, 5000);
    }
  }

  function construirCarta() {
    var paper = $('letterPaper');
    CONFIG.carta.forEach(function (txt, i) {
      var p = document.createElement('p');
      if (i === 0) p.className = 'letter__top';
      p.textContent = txt;
      paper.appendChild(p);
    });
    if (CONFIG.cartaFinal) {
      var f = document.createElement('p');
      f.className = 'letter__big';
      f.textContent = CONFIG.cartaFinal;
      paper.appendChild(f);
    }
  }

  function iniciarSobre() {
    var envelope = $('envelope');
    var seal = $('sealBtn');
    var letter = $('letter');
    var abierto = false;

    seal.addEventListener('click', function () {
      if (abierto) return;
      abierto = true;
      envelope.classList.add('is-open');
      seal.setAttribute('aria-expanded', 'true');

      setTimeout(function () {
        envelope.classList.add('is-gone');
        letter.hidden = false;
        letter.style.maxHeight = letter.scrollHeight + 'px';
        letter.classList.add('is-open');
        setTimeout(function () {
          letter.style.maxHeight = 'none';
          $('end').hidden = false;
        }, reduceMotion ? 0 : 950);
      }, reduceMotion ? 0 : 650);
    });
  }

  function cargar() {
  var fill = $('barFill');
  var bar = $('bar');
  var pctEl = $('ldPct');
  var frase = $('ldPhrase');
  var loader = $('loader');
  var frases = CONFIG.frases && CONFIG.frases.length ? CONFIG.frases : [''];
  var toquesNecesarios = 10;
  var toques = 0;

  frase.textContent = 'Toca o haz clic 10 veces para continuar';

  loader.addEventListener('click', function () {
    if (toques >= toquesNecesarios) return;

    toques++;

    var pct = toques * 10;
    fill.style.width = pct + '%';
    bar.setAttribute('aria-valuenow', String(pct));
    pctEl.textContent = pct + '%';

    if (toques < toquesNecesarios) {
      var indice = Math.min(
        frases.length - 1,
        Math.floor((toques / toquesNecesarios) * frases.length)
      );
      frase.textContent = frases[indice] + ' (<3)';
    } else {
      frase.textContent = '¡Listo!';
      setTimeout(mostrar, 450);
    }
  });
  }

  function mostrar() {
    $('loader').hidden = true;
    $('app').hidden = false;
    window.scrollTo(0, 0);
  }

  function init() {
    document.title = 'Feliz cumpleaños, ' + CONFIG.nombre;
    $('ldName').textContent = CONFIG.nombre;
    $('title').textContent = CONFIG.titulo;
    $('date').textContent = CONFIG.fecha;
    $('toast').textContent = CONFIG.brindis;
    $('thanks').textContent = CONFIG.gracias;
    $('endMedia').appendChild(crearMedia(CONFIG.mediaFinal));

    iniciarCarrusel();
    construirCarta();
    iniciarSobre();
    cargar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
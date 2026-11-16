(function () {
  'use strict';

  /* CONFIGURACIÓN: cambia aquí tus textos, fotos y vídeos
     Foto:  { src: "fotos/foto1.jpg", alt: "descripción" }
     GIF:   { src: "fotos/animacion.gif" }
     Vídeo: { video: "fotos/clip.mp4", poster: "fotos/clip.jpg" } */
  var CONFIG = {
    nombre: 'Tu nombre',
    toques: 10, // toques necesarios para cargar la página
    frases: ['Preparando algo para ti…', 'Ya casi está…', '¡Última vez, lo prometo!'],

    titulo: 'Hoy es el cumpleaños de mi persona favorita',
    fecha: '18 de junio',

    fotos: [
      { src: '7.jpg', alt: 'Nuestra primera foto' },
      { src: '11.jpg', alt: 'Un día especial' },
      { src: '2.jpg', alt: 'Un día especial' },
      { src: '1.jpg', alt: 'Un día especial' },
      { src: '3.jpg', alt: 'Un día especial' },
      { src: '4.jpg', alt: 'Un día especial' },
      { src: '12.jpg', alt: 'Un día especial' },
      { src: '6.jpg', alt: 'Un día especial' },
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
    cartaFinal: 'Cada año tuyo es un capítulo nuevo, y quiero estar contigo en todos, junto a nana.',

    brindis: 'Por muchos cumpleaños más juntos',
    mediaFinal: { video: 'final.mp4', alt: 'video final' },
    gracias: 'Gracias por compartir tu vida con nosotros'
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
    return function arrancar() {
      if (!reduceMotion && fotos.length > 1 && !timer) {
        timer = setInterval(function () { ir(actual + 1); }, 5000);
      }
    };
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

  /* Abre un sobre: gira la solapa, el sobre desaparece y el contenido se despliega */
  function abrirAlTocar(envId, sealId, contenidoId, alAbrir, alTerminar) {
    var envelope = $(envId);
    var seal = $(sealId);
    var contenido = $(contenidoId);
    var abierto = false;

    seal.addEventListener('click', function () {
      if (abierto) return;
      abierto = true;
      envelope.classList.add('is-open');
      seal.setAttribute('aria-expanded', 'true');
      if (alAbrir) alAbrir();

      setTimeout(function () {
        envelope.classList.add('is-gone');
        contenido.hidden = false;
        contenido.style.maxHeight = contenido.scrollHeight + 'px';
        contenido.classList.add('is-open');
        setTimeout(function () {
          contenido.style.maxHeight = 'none';
          contenido.classList.add('is-done');
          if (alTerminar) alTerminar();
        }, reduceMotion ? 0 : 950);
      }, reduceMotion ? 0 : 650);
    });
  }

  function iniciarSobres(arrancarCarrusel) {
    var hero = $('hero');
    // Al abrir cualquiera de las 2 cartas, el título vuelve a su tamaño normal
    function tituloNormal() { hero.classList.remove('hero--big'); }

    abrirAlTocar('envelopePhotos', 'sealPhotos', 'photos', tituloNormal, arrancarCarrusel);
    abrirAlTocar('envelope', 'sealBtn', 'letter', tituloNormal, function () {
      $('end').hidden = false;
    });
  }

  function cargar() {
    var fill = $('barFill');
    var bar = $('bar');
    var pctEl = $('ldPct');
    var frase = $('ldPhrase');
    var frases = CONFIG.frases && CONFIG.frases.length ? CONFIG.frases : [''];
    var dur = CONFIG.duracionCarga || 4200;
    var t0 = null;

    function paso(t) {
      if (t0 === null) t0 = t;
      var p = Math.max(0, Math.min(1, (t - t0) / dur));
      var pct = Math.round(p * 100);
      fill.style.width = pct + '%';
      bar.setAttribute('aria-valuenow', String(pct));
      pctEl.textContent = pct + '%';
      frase.textContent = frases[Math.min(frases.length - 1, Math.floor(p * frases.length))];
      if (p < 1) {
        requestAnimationFrame(paso);
      } else {
        setTimeout(mostrar, 450);
      }
    }
    requestAnimationFrame(paso);
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

    var arrancarCarrusel = iniciarCarrusel();
    construirCarta();
    iniciarSobres(arrancarCarrusel);
    cargar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
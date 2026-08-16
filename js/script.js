/* ============================================================
   CGY PIXEL STUDIO — script.js
   Menú móvil · scroll reveal · header on-scroll · reproductor de
   video con previsualización · resplandor del hero · formulario a WhatsApp
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Año en el footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header: sombra/fondo al hacer scroll ---------- */
  const header = document.getElementById('header');
  const onScrollHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------- Menú móvil ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  const closeMenu = () => {
    mainNav.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Cerrar el menú al elegir un link (comportamiento esperado en mobile)
  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  /* ---------- Resplandor dorado que sigue al cursor en el hero ---------- */
  const hero = document.querySelector('.hero');
  if (hero && window.matchMedia('(hover: hover)').matches) {
    hero.addEventListener('pointermove', (event) => {
      const rect = hero.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      hero.style.setProperty('--mx', `${x}%`);
      hero.style.setProperty('--my', `${y}%`);
    });
  }

  /* ---------- Revelado de secciones al hacer scroll ---------- */
  const revealTargets = document.querySelectorAll('.reveal-up');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: si no hay soporte, mostrar todo directamente
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Reproductor de video: previsualización + botón de play ---------- */
  document.querySelectorAll('.video-frame').forEach((frame) => {
    const video = frame.querySelector('video');
    const playBtn = frame.querySelector('.play-btn');
    if (!video || !playBtn) return;

    const startPlayback = () => {
      frame.classList.add('is-playing');
      video.setAttribute('controls', '');
      video.play().catch(() => {
        // Reproducción automática bloqueada por el navegador: igual mostramos
        // los controles nativos para que el usuario le dé play manualmente.
      });
    };

    playBtn.addEventListener('click', startPlayback);

    // Si el video termina o se pausa desde el inicio, volvemos a mostrar
    // la previsualización para mantener la grilla prolija.
    video.addEventListener('ended', () => {
      frame.classList.remove('is-playing');
      video.removeAttribute('controls');
      video.currentTime = 0;
    });
  });

  /* ---------- Formulario de contacto → mensaje de WhatsApp ---------- */
  const WHATSAPP_NUMBER = '5493412037382'; // Camila — formato internacional sin '+' ni espacios

  const form = document.getElementById('contactForm');

  const setFieldError = (field, hasError) => {
    field.closest('.form-field').classList.toggle('has-error', hasError);
  };

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const nombre = form.nombre.value.trim();
      const servicio = form.servicio.value;
      const proyecto = form.proyecto.value.trim();
      const contacto = form.contacto.value.trim();

      // Validación simple de campos obligatorios
      let isValid = true;
      [
        [form.nombre, nombre],
        [form.proyecto, proyecto],
      ].forEach(([field, value]) => {
        const empty = value.length === 0;
        setFieldError(field, empty);
        if (empty) isValid = false;
      });

      if (!isValid) return;

      // Arma el mensaje pedido por el cliente
      const mensaje =
        `Hola, soy ${nombre}. Me interesa realizar un proyecto de ${servicio}. ` +
        `Esto es lo que necesito: ${proyecto}. Mi medio de contacto es: ${contacto}.`;

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
      window.open(url, '_blank', 'noopener');

      form.reset();
    });

    // Quita el estado de error apenas el usuario empieza a corregir
    ['nombre', 'proyecto', 'contacto'].forEach((name) => {
      form[name].addEventListener('input', () => setFieldError(form[name], false));
    });
  }

});

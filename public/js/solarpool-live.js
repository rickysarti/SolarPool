/* ---------------------------------------------------------------------------
 * solarpool-live.js
 * Helper mínimo (sin dependencias) para leer Supabase desde el navegador.
 *
 * El sitio es estático (S3 + CloudFront), así que el HTML se genera en el build.
 * Este helper permite que, además, cada página vuelva a pedirle los datos a
 * Supabase al cargarse: así los cambios de precio, stock, links de pago y los
 * posts nuevos del blog aparecen SIN necesidad de recompilar y redeployar.
 *
 * La config (URL + anon key) la inyecta <SupabaseLive /> en window.__SB__.
 * La anon key es pública por diseño: lo que se puede leer lo definen las
 * políticas RLS de cada tabla.
 * ------------------------------------------------------------------------- */
(function () {
  var cfg = window.__SB__ || {};

  function ready() {
    return !!(cfg.url && cfg.key);
  }

  /** SELECT contra PostgREST. query = string tipo "select=*&activo=eq.true". */
  function select(tabla, query) {
    if (!ready()) return Promise.reject(new Error('Supabase no configurado'));
    var url = cfg.url + '/rest/v1/' + encodeURIComponent(tabla) + '?' + query;
    return fetch(url, {
      headers: { apikey: cfg.key, Authorization: 'Bearer ' + cfg.key },
      cache: 'no-store'
    }).then(function (res) {
      if (!res.ok) throw new Error('Supabase respondió ' + res.status);
      return res.json();
    });
  }

  function formatARS(n) {
    if (n === null || n === undefined || n === '') return '';
    return '$' + Number(n).toLocaleString('es-AR');
  }

  /** Escapa texto antes de meterlo en innerHTML. */
  function esc(s) {
    return String(s === null || s === undefined ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /** Sólo deja pasar http(s) y rutas internas, para no inyectar javascript:. */
  function safeUrl(u) {
    if (!u) return null;
    var s = String(u).trim();
    return /^(https?:\/\/|\/)/i.test(s) ? s : null;
  }

  window.SolarpoolLive = {
    ready: ready,
    select: select,
    formatARS: formatARS,
    esc: esc,
    safeUrl: safeUrl,
    WHATSAPP: 'https://api.whatsapp.com/send?phone=5491136171286'
  };
})();

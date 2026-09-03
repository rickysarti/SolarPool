// ---------------------------------------------------------------------------
// Blog en el navegador: trae un post de Supabase y lo pinta en el DOM.
//
// Lo usan dos páginas:
//   - /blog/[slug]  -> refresca en vivo un post que ya tiene página estática,
//                      para que una corrección en Supabase se vea al instante.
//   - /blog/post    -> lector genérico (?slug=...) para los posts publicados
//                      después del último deploy, que todavía no tienen página.
//
// Este módulo se bundlea con Astro (usa las dependencias marked y dompurify
// que ya están en el proyecto), no hace falta ningún CDN.
// ---------------------------------------------------------------------------
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export interface PostLive {
  slug: string;
  titulo: string;
  subtitulo?: string | null;
  autor?: string | null;
  categoria?: string | null;
  resumen?: string | null;
  contenido?: string | null;
  imagen_destacada_url?: string | null;
  fecha_publicacion?: string | null;
}

function live(): any {
  return (window as any).SolarpoolLive;
}

export function hayConexion(): boolean {
  const L = live();
  return !!(L && L.ready());
}

/** Markdown -> HTML sanitizado (el contenido se inyecta con innerHTML). */
export function contenidoHtml(post: PostLive): string {
  const md = post.contenido || post.resumen || '';
  let html: string;
  try {
    html = marked.parse(md, { async: false }) as string;
  } catch {
    html = String(md).replace(/\n/g, '<br>');
  }
  return DOMPurify.sanitize(html);
}

export function fechaCorta(valor?: string | null): string {
  if (!valor) return '';
  const d = new Date(valor);
  return isNaN(d.getTime()) ? '' : d.toLocaleDateString();
}

/** Trae un post publicado por slug. Devuelve null si no existe. */
export async function traerPost(slug: string): Promise<PostLive | null> {
  const L = live();
  if (!L || !L.ready() || !slug) return null;
  const filas = await L.select(
    'blog_posts',
    'select=*&estado=eq.publicado&slug=eq.' + encodeURIComponent(slug) + '&limit=1'
  );
  return (filas && filas[0]) || null;
}

/** Pinta el post sobre los contenedores #live-post-* que existan en la página. */
export function pintarPost(post: PostLive): void {
  const L = live();
  const el = (id: string) => document.getElementById(id);

  const titulo = el('live-post-titulo');
  if (titulo) titulo.textContent = post.titulo || '';

  const subtitulo = el('live-post-subtitulo');
  if (subtitulo) {
    subtitulo.textContent = post.subtitulo || '';
    subtitulo.style.display = post.subtitulo ? '' : 'none';
  }

  const meta = el('live-post-meta');
  if (meta) {
    const partes: string[] = [];
    if (post.autor) partes.push('<span>Por ' + L.esc(post.autor) + '</span>');
    const f = fechaCorta(post.fecha_publicacion);
    if (f) partes.push('<span class="mx-2">' + L.esc(f) + '</span>');
    if (post.categoria) partes.push('<span>' + L.esc(post.categoria) + '</span>');
    meta.innerHTML = partes.join(' · ');
  }

  const img = el('live-post-img');
  if (img) {
    const src = L.safeUrl(post.imagen_destacada_url);
    img.innerHTML = src
      ? '<img loading="lazy" src="' + L.esc(src) + '" alt="' + L.esc(post.titulo || '') +
        '" class="img-fluid rounded destacada my-3">'
      : '';
  }

  const contenido = el('live-post-contenido');
  if (contenido) contenido.innerHTML = contenidoHtml(post);
}

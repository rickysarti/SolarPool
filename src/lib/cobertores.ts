// ---------------------------------------------------------------------------
// Datos y contenido SEO de los cobertores solares térmicos por medida.
//
// De acá salen:
//   - Las 28 subpáginas /productos/cobertores-solares-termicos/medidas/<slug>
//     (14 medidas × 2 espesores), generadas con getStaticPaths.
//   - Las tablas de la lista de precios (/precio), que enlazan a cada subpágina.
//
// Precios actualizados según "precios julio 26" (Transferencia / Tarjeta+envío).
// Los links de MercadoPago son los existentes (ver decisión de negocio).
// ---------------------------------------------------------------------------

export const WHATSAPP = 'https://api.whatsapp.com/send?phone=5491136171286';

export type Espesor = 300 | 400;

export interface PrecioEspesor {
  transferencia: number;
  tarjeta: number;
  /** shortcode de mpago.li (sin el dominio). null => sin link, va a WhatsApp. */
  mp: string | null;
}

export interface Medida {
  largo: number;
  ancho: number;
  /** Etiqueta visible, ej: "8 × 4 m". */
  label: string;
  /** Fragmento para slug/id, ej: "8x4" o "12-5x6-25". */
  key: string;
  /** Precio por espesor. null => sin stock. */
  p300: PrecioEspesor | null;
  p400: PrecioEspesor | null;
}

// Orden según la lista de precios (de menor a mayor superficie aprox.).
export const medidas: Medida[] = [
  { largo: 5,    ancho: 3,    label: '5 × 3 m',      key: '5x3',
    p300: null,
    p400: { transferencia: 132000, tarjeta: 140000, mp: '2XnQAwp' } },
  { largo: 6,    ancho: 3,    label: '6 × 3 m',      key: '6x3',
    p300: null,
    p400: { transferencia: 165000, tarjeta: 173250, mp: '1Jcy4qM' } },
  { largo: 7,    ancho: 3,    label: '7 × 3 m',      key: '7x3',
    p300: null,
    p400: { transferencia: 210000, tarjeta: 220500, mp: '2T958wE' } },
  { largo: 9,    ancho: 3,    label: '9 × 3 m',      key: '9x3',
    p300: { transferencia: 250000, tarjeta: 262500, mp: '1J9GycG' },
    p400: null },
  { largo: 7,    ancho: 4,    label: '7 × 4 m',      key: '7x4',
    p300: null,
    p400: { transferencia: 250000, tarjeta: 262500, mp: '2tmwHB6' } },
  { largo: 8,    ancho: 4,    label: '8 × 4 m',      key: '8x4',
    p300: { transferencia: 250000, tarjeta: 262500, mp: '2siHUME' },
    p400: { transferencia: 300000, tarjeta: 315000, mp: '2CyC3xR' } },
  { largo: 12,   ancho: 3,    label: '12 × 3 m',     key: '12x3',
    p300: { transferencia: 330000, tarjeta: 346500, mp: '1jxLcHM' },
    p400: null },
  { largo: 9,    ancho: 4,    label: '9 × 4 m',      key: '9x4',
    p300: { transferencia: 330000, tarjeta: 346500, mp: '1WnFbng' },
    p400: null },
  { largo: 10,   ancho: 4,    label: '10 × 4 m',     key: '10x4',
    p300: { transferencia: 360000, tarjeta: 378000, mp: '1rNeHkU' },
    p400: null },
  { largo: 9,    ancho: 5,    label: '9 × 5 m',      key: '9x5',
    p300: { transferencia: 410000, tarjeta: 430500, mp: '27S61fW' },
    p400: null },
  { largo: 10,   ancho: 5,    label: '10 × 5 m',     key: '10x5',
    p300: { transferencia: 450000, tarjeta: 472500, mp: '12h9dUT' },
    p400: { transferencia: 550000, tarjeta: 577500, mp: '2euxFEt' } },
  { largo: 10,   ancho: 6,    label: '10 × 6 m',     key: '10x6',
    p300: { transferencia: 550000, tarjeta: 577500, mp: '1Ck75vE' },
    p400: null },
  { largo: 12,   ancho: 5,    label: '12 × 5 m',     key: '12x5',
    p300: { transferencia: 550000, tarjeta: 577500, mp: '1yussog' },
    p400: null },
  { largo: 12.5, ancho: 6.25, label: '12.5 × 6.25 m', key: '12-5x6-25',
    p300: { transferencia: 675000, tarjeta: 708750, mp: '33yUh2E' },
    p400: { transferencia: 850000, tarjeta: 892500, mp: '1E4UTXA' } },
];

export function formatARS(n: number): string {
  return '$' + n.toLocaleString('es-AR');
}

export function mpUrl(code: string): string {
  return `https://mpago.li/${code}`;
}

// ---------------------------------------------------------------------------
// Generación de contenido SEO por medida+espesor (28 combinaciones).
// Cada página queda "un poco distinta": distinto keyword principal, imágenes,
// títulos H1/H2/H3, intro y meta. Todo determinístico según el índice.
// ---------------------------------------------------------------------------

// Sinónimos con su género gramatical, para concordar artículos (el/la, un/una…).
const SINONIMOS: { n: string; g: 'm' | 'f' }[] = [
  { n: 'Cobertor Solar Térmico', g: 'm' },
  { n: 'Manta Térmica', g: 'f' },
  { n: 'Cobertor Térmico', g: 'm' },
  { n: 'Lona Térmica', g: 'f' },
  { n: 'Manta Solar', g: 'f' },
  { n: 'Cubre Pileta Térmico', g: 'm' },
  { n: 'Cobertor de Burbujas', g: 'm' },
];

const IMAGENES = [
  '/img/pro-home-cobertores.jpg',
  '/img/bg-pro-1-1.jpg',
  '/img/bg-pro-1-2.jpg',
  '/img/bg-pro-1-3.jpg',
  '/img/bg-productos-cobertores.jpg',
  '/img/deco-productos-cobertores.png',
];

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Convierte un texto en slug URL (sin acentos, minúsculas, con guiones). */
function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[áàä]/g, 'a')
    .replace(/[éèë]/g, 'e')
    .replace(/[íìï]/g, 'i')
    .replace(/[óòö]/g, 'o')
    .replace(/[úùü]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export interface CobertorPagina {
  slug: string;
  medida: Medida;
  espesor: Espesor;
  precio: PrecioEspesor | null;
  enStock: boolean;
  // SEO / contenido
  keyword: string;       // sinónimo principal, ej: "Manta Térmica"
  pool: string;          // "pileta" | "piscina"
  title: string;
  description: string;
  h1: string;
  heroImg: string;
  sideImg: string;
  intro: string;
  h2Beneficios: string;
  h2Medir: string;
  h2Precio: string;
  otrasMedidas: { label: string; slug: string; espesor: Espesor }[];
}

// El slug arranca con el keyword/H1 (SEO) + medida + micrones.
// Ej: "lona-termica-9x4-400-micrones", "manta-solar-8x4-300-micrones".
function slugDe(keyword: string, m: Medida, esp: Espesor): string {
  return `${slugify(keyword)}-${m.key}-${esp}-micrones`;
}

interface Art {
  el: string;   // el / la
  un: string;   // un / una
  este: string; // este / esta
}

const INTRO = [
  (nl: string, size: string, pool: string, esp: number, a: Art) =>
    `${cap(a.el)} ${nl} de ${size} en ${esp} micrones es la forma más económica de calentar y mantener climatizada tu ${pool}. Retiene el calor durante la noche, evita la evaporación del agua y reduce el consumo de químicos.`,
  (nl: string, size: string, pool: string, esp: number, a: Art) =>
    `¿Buscás ${a.un} ${nl} de ${size} para tu ${pool}? Con ${esp} micrones de polietileno virgen y protección UV, conservás la temperatura del agua y ahorrás hasta un 70% en calefacción.`,
  (nl: string, size: string, pool: string, esp: number, a: Art) =>
    `${cap(a.este)} ${nl} de ${size} y ${esp} micrones cubre tu ${pool} con burbujas de aire que flotan sobre el agua, aprovechando el sol de día y conservando el calor de noche. Menos gasto, menos limpieza y menos evaporación.`,
  (nl: string, size: string, pool: string, esp: number, a: Art) =>
    `${cap(a.el)} ${nl} ideal para ${pool}s de ${size}. Con ${esp} micrones y alta protección UV, es el complemento perfecto de cualquier sistema de climatización de ${pool}.`,
];

export const cobertores: CobertorPagina[] = (() => {
  const out: CobertorPagina[] = [];
  let i = 0;
  for (const m of medidas) {
    for (const esp of [300, 400] as Espesor[]) {
      const precio = esp === 300 ? m.p300 : m.p400;
      const enStock = precio !== null;
      const syn = SINONIMOS[i % SINONIMOS.length];
      const keyword = syn.n;
      const kl = keyword.toLowerCase();
      const art: Art = {
        el: syn.g === 'f' ? 'la' : 'el',
        un: syn.g === 'f' ? 'una' : 'un',
        este: syn.g === 'f' ? 'esta' : 'este',
      };
      const del = syn.g === 'f' ? 'de la' : 'del';
      const pool = i % 2 === 0 ? 'pileta' : 'piscina';
      const Pool = cap(pool);
      const size = m.label;
      const heroImg = IMAGENES[i % IMAGENES.length];
      const sideImg = IMAGENES[(i + 3) % IMAGENES.length];

      // Título (3 plantillas, siempre único por medida+espesor)
      const titleTpl = i % 3;
      const title =
        titleTpl === 0
          ? `${keyword} ${size} para ${Pool}s ${esp} micrones | Solarpool`
          : titleTpl === 1
          ? `${keyword} para ${Pool} ${size} · ${esp} micrones — Precio | Solarpool`
          : `${keyword} ${size} ${esp} micrones para ${Pool} | Solarpool`;

      // H1 (distinto del title)
      const h1Tpl = (i + 1) % 3;
      const h1 =
        h1Tpl === 0
          ? `${keyword} para ${Pool} — ${size}`
          : h1Tpl === 1
          ? `${keyword} de ${size} · ${esp} micrones`
          : `${keyword} ${esp} micrones para ${pool} de ${size}`;

      // Meta description con precio + keywords
      const precioTxt = enStock
        ? `Desde ${formatARS(precio!.transferencia)}.`
        : `Consultá disponibilidad y precio.`;
      const description =
        `${keyword} de ${size} en ${esp} micrones para ${pool}. ${precioTxt} ` +
        `Ahorrá en calefacción, conservá el agua y reducí químicos. Importado, con protección UV y garantía. Envío a todo el país.`;

      const intro = INTRO[i % INTRO.length](kl, size, pool, esp, art);

      const h2Beneficios =
        i % 2 === 0
          ? `Beneficios ${del} ${kl} de ${size}`
          : `¿Por qué elegir ${art.un} ${kl} de ${esp} micrones?`;
      const h2Medir = `Cómo medir tu ${pool} para el cobertor de ${size}`;
      const h2Precio = `Precio ${del} ${kl} ${size} · ${esp} micrones`;

      out.push({
        slug: slugDe(keyword, m, esp),
        medida: m,
        espesor: esp,
        precio,
        enStock,
        keyword,
        pool,
        title,
        description,
        h1,
        heroImg,
        sideImg,
        intro,
        h2Beneficios,
        h2Medir,
        h2Precio,
        otrasMedidas: [], // se completa abajo
      });
      i++;
    }
  }
  // Enlazado interno: cada página apunta a otras 4 medidas del mismo espesor.
  for (const page of out) {
    const mismos = out.filter(
      (p) => p.espesor === page.espesor && p.slug !== page.slug
    );
    const idx = out.indexOf(page);
    page.otrasMedidas = [0, 1, 2, 3].map((k) => {
      const p = mismos[(idx + k) % mismos.length];
      return { label: p.medida.label, slug: p.slug, espesor: p.espesor };
    });
  }
  return out;
})();

/** Devuelve el slug de la subpágina para una medida+espesor (para la lista). */
export function slugMedida(m: Medida, esp: Espesor): string {
  const p = cobertores.find((c) => c.medida.key === m.key && c.espesor === esp);
  return p ? p.slug : slugDe('cobertor', m, esp);
}

// ---------------------------------------------------------------------------
// Precios / stock / links de pago de los cobertores, leídos de Supabase.
//
// Tabla: public."solarpool-cobertores" (una fila por medida + espesor).
// Se edita directo desde el panel de Supabase y la web la toma:
//   - en el build (para que el HTML y el SEO salgan con el precio correcto)
//   - en el navegador (public/js/solarpool-live.js), para que los cambios
//     aparezcan sin recompilar el sitio.
//
// El catálogo en sí (medidas, slugs, textos SEO) sigue viviendo en
// ./cobertores.ts: agregar una medida nueva requiere rebuild porque implica
// una página nueva. Lo que cambia seguido -precio, stock y link- viene de acá.
// ---------------------------------------------------------------------------
import { createSupabaseClient } from './supabase/client';
import { WHATSAPP, mpUrl, type Espesor, type PrecioEspesor } from './cobertores';

export const TABLA_COBERTORES = 'solarpool-cobertores';

export interface FilaCobertor {
  medida_key: string;
  label: string;
  largo: number;
  ancho: number;
  espesor: number;
  precio_transferencia: number | null;
  precio_tarjeta: number | null;
  link_pago: string | null;
  en_stock: boolean;
  activo: boolean;
  orden: number;
}

/** Precio ya resuelto y listo para pintar. null => sin stock. */
export interface PrecioResuelto {
  transferencia: number;
  tarjeta: number;
  /** URL de compra online. null => mandar a WhatsApp. */
  url: string | null;
}

export function claveCobertor(medidaKey: string, espesor: number): string {
  return `${medidaKey}|${espesor}`;
}

let cache: Promise<Map<string, FilaCobertor>> | null = null;

/**
 * Trae todas las filas activas de Supabase (una sola vez por build).
 * Si Supabase falla devuelve un mapa vacío: las páginas caen a los precios
 * de cobertores.ts y el build nunca se rompe.
 */
export function getPreciosLive(): Promise<Map<string, FilaCobertor>> {
  if (!cache) {
    cache = (async () => {
      const mapa = new Map<string, FilaCobertor>();
      try {
        const supabase = createSupabaseClient();
        const { data, error } = await supabase
          .from(TABLA_COBERTORES)
          .select('*')
          .eq('activo', true)
          .order('orden', { ascending: true });
        if (error) throw error;
        for (const fila of (data ?? []) as FilaCobertor[]) {
          mapa.set(claveCobertor(fila.medida_key, fila.espesor), fila);
        }
        if (mapa.size === 0) {
          console.warn('[cobertores] Supabase no devolvió filas: uso precios locales.');
        }
      } catch (e) {
        console.warn('[cobertores] No pude leer Supabase, uso precios locales:', e);
      }
      return mapa;
    })();
  }
  return cache;
}

/**
 * Resuelve el precio de una medida+espesor: primero Supabase, y si esa fila
 * no existe, el valor histórico de cobertores.ts.
 */
export function resolverPrecio(
  mapa: Map<string, FilaCobertor>,
  medidaKey: string,
  espesor: Espesor,
  fallback: PrecioEspesor | null
): PrecioResuelto | null {
  const fila = mapa.get(claveCobertor(medidaKey, espesor));

  if (fila) {
    if (!fila.en_stock || fila.precio_transferencia == null) return null;
    return {
      transferencia: Number(fila.precio_transferencia),
      tarjeta: Number(fila.precio_tarjeta ?? fila.precio_transferencia),
      url: fila.link_pago || null,
    };
  }

  if (!fallback) return null;
  return {
    transferencia: fallback.transferencia,
    tarjeta: fallback.tarjeta,
    url: fallback.mp ? mpUrl(fallback.mp) : null,
  };
}

/** URL del botón "Comprar": link de pago propio o WhatsApp. */
export function urlCompra(p: PrecioResuelto | null): string {
  return p?.url ?? WHATSAPP;
}

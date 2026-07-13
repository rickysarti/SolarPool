import { createSupabaseClient } from './client';

export type BlogPost = {
  id: string;
  slug: string;
  titulo: string;
  subtitulo?: string;
  autor: string;
  imagen_destacada_url?: string;
  contenido: string;
  resumen?: string;
  categoria: string;
  estado: string;
  fecha_publicacion?: string;
  created_at: string;
  updated_at: string;
};

export const blogService = {
  // Obtener todos los posts publicados
  async getPublishedPosts() {
    try {
      const supabase = createSupabaseClient();

      const { data, error } = await supabase
        .from('blog_posts')
        .select('slug, titulo, resumen, categoria, imagen_destacada_url, fecha_publicacion, autor')
        .eq('estado', 'publicado')
        .order('fecha_publicacion', { ascending: false });

      if (error) {
        console.error('Error fetching published posts:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPublishedPosts:', error);
      return [];
    }
  },

  // Obtener un post por su slug
  async getPostBySlug(slug: string) {
    try {
      const supabase = createSupabaseClient();

      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('estado', 'publicado')
        .single();

      if (error) {
        console.error('Error fetching post:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getPostBySlug:', error);
      return null;
    }
  },

  // Obtener posts relacionados por categoría
  async getRelatedPosts(category: string, currentSlug: string, limit = 3) {
    try {
      const supabase = createSupabaseClient();

      const { data, error } = await supabase
        .from('blog_posts')
        .select('slug, titulo, imagen_destacada_url, fecha_publicacion, resumen, categoria')
        .eq('estado', 'publicado')
        .eq('categoria', category)
        .neq('slug', currentSlug)
        .order('fecha_publicacion', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching related posts:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getRelatedPosts:', error);
      return [];
    }
  },

  // Obtener todos los slugs para getStaticPaths
  async getAllPublishedSlugs() {
    try {
      const supabase = createSupabaseClient();

      const { data, error } = await supabase
        .from('blog_posts')
        .select('slug')
        .eq('estado', 'publicado');

      if (error) {
        console.error('Error fetching slugs:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllPublishedSlugs:', error);
      return [];
    }
  }
};
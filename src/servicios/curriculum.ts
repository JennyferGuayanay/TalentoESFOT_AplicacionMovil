
import { supabase } from "./supabase";
import type { DatosDetalle, DatosPerfil, DetalleCV, PerfilCV, TipoDetalle } from "../tipos/curriculum";
import type { Habilidad } from "../tipos/habilidad";

async function obtenerUsuario() {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new Error("Debes iniciar sesión para continuar.");
  }
  return data.user;
}

export async function consultarPerfil(): Promise<PerfilCV | null> {
  const usuario = await obtenerUsuario();

  const { data, error } = await supabase
    .from("perfiles_cv")
    .select("*")
    .eq("usuario_id", usuario.id)
    .maybeSingle();

  if (error) throw error;
  return data as PerfilCV | null;
}

export async function guardarPerfil(datos: DatosPerfil) {
  const usuario = await obtenerUsuario();

  const { data, error } = await supabase
    .from("perfiles_cv")
    .upsert({
      ...datos,
      usuario_id: usuario.id,
      fecha_actualizacion: new Date().toISOString()
    }, { onConflict: "usuario_id" })
    .select()
    .single();

  if (error) throw error;
  return data as PerfilCV;
}

export async function consultarDetalles(tipo?: TipoDetalle): Promise<DetalleCV[]> {
  const usuario = await obtenerUsuario();

  let consulta = supabase
    .from("detalles_cv")
    .select("*")
    .eq("usuario_id", usuario.id)
    .order("fecha_creacion", { ascending: false });

  if (tipo) consulta = consulta.eq("tipo", tipo);

  const { data, error } = await consulta;
  if (error) throw error;

  return (data || []) as DetalleCV[];
}

export async function guardarDetalle(datos: DatosDetalle, id?: string) {
  const usuario = await obtenerUsuario();

  if (id) {
    const { data, error } = await supabase
      .from("detalles_cv")
      .update(datos)
      .eq("id", id)
      .eq("usuario_id", usuario.id)
      .select()
      .single();

    if (error) throw error;
    return data as DetalleCV;
  }

  const { data, error } = await supabase
    .from("detalles_cv")
    .insert({ ...datos, usuario_id: usuario.id })
    .select()
    .single();

  if (error) throw error;
  return data as DetalleCV;
}

export async function eliminarDetalle(id: string) {
  const usuario = await obtenerUsuario();

  const { data, error } = await supabase
    .from("detalles_cv")
    .delete()
    .eq("id", id)
    .eq("usuario_id", usuario.id)
    .select("id");

  if (error) throw error;
  if (!data?.length) throw new Error("No se encontró el registro para eliminar.");
}

export async function consultarHabilidadesCV(): Promise<Habilidad[]> {
  const usuario = await obtenerUsuario();

  const { data, error } = await supabase
    .from("habilidades")
    .select("*")
    .eq("usuario_id", usuario.id)
    .order("fecha_creacion", { ascending: false });

  if (error) throw error;
  return (data || []) as Habilidad[];
}

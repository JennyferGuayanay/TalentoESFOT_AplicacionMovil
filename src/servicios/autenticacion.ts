
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { supabase } from "./supabase";

WebBrowser.maybeCompleteAuthSession();

const retorno = Linking.createURL("autenticacion", {
  scheme: "talentoesfot"
});

export async function iniciarSesion(correo: string, contrasena: string) {
  const { error } = await supabase.auth.signInWithPassword({
    email: correo.trim().toLowerCase(),
    password: contrasena
  });

  if (error) throw error;
}

export async function registrarUsuario(
  nombre: string,
  correo: string,
  contrasena: string
) {
  const { data, error } = await supabase.auth.signUp({
    email: correo.trim().toLowerCase(),
    password: contrasena,
    options: {
      data: { nombre: nombre.trim() },
      emailRedirectTo: retorno
    }
  });

  if (error) throw error;
  return data;
}

export async function iniciarConGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: retorno,
      skipBrowserRedirect: true
    }
  });

  if (error) throw error;
  if (!data.url) throw new Error("No se obtuvo la URL de Google.");

  const resultado = await WebBrowser.openAuthSessionAsync(data.url, retorno);
  if (resultado.type === "success") {
    await procesarRetorno(resultado.url);
  }
}

export async function procesarRetorno(url: string) {
  const parametros = Linking.parse(url);
  const codigo = parametros.queryParams?.code;
  const tokenAcceso = parametros.queryParams?.access_token;
  const tokenRenovacion = parametros.queryParams?.refresh_token;
  const tokenHash = parametros.queryParams?.token_hash;
  const tipo = parametros.queryParams?.type;

  if (typeof codigo === "string") {
    const { error } = await supabase.auth.exchangeCodeForSession(codigo);
    if (error) throw error;
  } else if (typeof tokenHash === "string" && typeof tipo === "string") {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: tipo as "recovery" | "signup" | "email"
    });
    if (error) throw error;
  } else if (typeof tokenAcceso === "string" && typeof tokenRenovacion === "string") {
    const { error } = await supabase.auth.setSession({
      access_token: tokenAcceso,
      refresh_token: tokenRenovacion
    });
    if (error) throw error;
  }

  return tipo === "recovery";
}

export async function recuperarContrasena(correo: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(
    correo.trim().toLowerCase(),
    { redirectTo: `${retorno}?accion=recuperar` }
  );

  if (error) throw error;
}

export async function cambiarContrasena(contrasena: string) {
  const { error } = await supabase.auth.updateUser({
    password: contrasena
  });

  if (error) throw error;
}

export async function cerrarSesion() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

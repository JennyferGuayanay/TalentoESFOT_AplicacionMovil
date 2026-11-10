
import * as ImagePicker from "expo-image-picker";
import { decode } from "base64-arraybuffer";
import { supabase } from "./supabase";

const almacenamiento = "fotos-cv";
const limiteFoto = 2 * 1024 * 1024;

export async function seleccionarFoto(origen: "camara" | "galeria") {
  const permiso = origen === "camara"
    ? await ImagePicker.requestCameraPermissionsAsync()
    : await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permiso.granted) {
    throw new Error("Debes conceder permiso para acceder a la cámara o galería.");
  }

  const opciones: ImagePicker.ImagePickerOptions = {
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.6,
    base64: true
  };

  const resultado = origen === "camara"
    ? await ImagePicker.launchCameraAsync(opciones)
    : await ImagePicker.launchImageLibraryAsync(opciones);

  if (resultado.canceled) return null;

  const foto = resultado.assets[0];
  if (!foto.base64) {
    throw new Error("No se pudo procesar la fotografía.");
  }

  const contenido = decode(foto.base64);

  if (contenido.byteLength > limiteFoto) {
    throw new Error("La fotografía no debe superar los 2 MB.");
  }

  return contenido;
}

export async function subirFoto(contenido: ArrayBuffer) {
  const { data: usuario, error: errorUsuario } = await supabase.auth.getUser();

  if (errorUsuario || !usuario.user) {
    throw new Error("Debes iniciar sesión para subir una fotografía.");
  }

  const ruta = `${usuario.user.id}/foto-${Date.now()}.jpg`;

  const { data, error } = await supabase.storage
    .from(almacenamiento)
    .upload(ruta, contenido, {
      contentType: "image/jpeg",
      upsert: false
    });

  if (error) {
    console.error("Error al subir fotografía:", error);
    throw error;
  }

  return data.path;
}

export async function obtenerUrlFoto(ruta: string) {
  const { data, error } = await supabase.storage
    .from(almacenamiento)
    .createSignedUrl(ruta, 3600);

  if (error) throw error;
  return data.signedUrl;
}

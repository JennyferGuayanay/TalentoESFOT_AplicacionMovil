import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { obtenerUrlFoto, seleccionarFoto, subirFoto } from "../servicios/almacenamiento";

interface Propiedades {
  ruta: string | null;
  alCambiar: (ruta: string) => void | Promise<void>;
}

export default function FotoPerfil({ ruta, alCambiar }: Propiedades) {
  const [url, setUrl] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    let activo = true;

    async function cargarFoto() {
      if (!ruta) {
        setUrl(null);
        return;
      }

      try {
        const direccion = await obtenerUrlFoto(ruta);
        if (activo) setUrl(direccion);
      } catch {
        if (activo) setUrl(null);
      }
    }

    void cargarFoto();
    return () => { activo = false; };
  }, [ruta]);

  function mostrarOpciones() {
    Alert.alert("Fotografía de perfil", "Selecciona una opción:", [
      { text: "Tomar fotografía", onPress: () => cambiarFoto("camara") },
      { text: "Elegir de galería", onPress: () => cambiarFoto("galeria") },
      { text: "Cancelar", style: "cancel" }
    ]);
  }

  async function cambiarFoto(origen: "camara" | "galeria") {
    setCargando(true);

    try {
      const contenido = await seleccionarFoto(origen);
      if (!contenido) return;

      const nuevaRuta = await subirFoto(contenido);
      await alCambiar(nuevaRuta);

      const direccion = await obtenerUrlFoto(nuevaRuta);
      setUrl(direccion);

      Alert.alert("Correcto", "Fotografía actualizada correctamente.");
    } catch (error) {
      Alert.alert(
        "Fotografía",
        error instanceof Error ? error.message : "No se pudo subir la fotografía."
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <View className="items-center py-2">
      <Pressable
        onPress={mostrarOpciones}
        disabled={cargando}
        accessibilityRole="button"
        accessibilityLabel="Seleccionar fotografía de perfil"
        className="h-36 w-36 items-center justify-center rounded-full border-4 border-white bg-suave"
        style={{
          shadowColor: "#32156E",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.2,
          shadowRadius: 18,
          elevation: 8
        }}
      >
        <View className="h-full w-full items-center justify-center overflow-hidden rounded-full">
          {cargando ? (
            <ActivityIndicator color="#7628C7" />
          ) : url ? (
            <Image source={{ uri: url }} className="h-full w-full" />
          ) : (
            <Ionicons name="person" size={62} color="#7628C7" />
          )}
        </View>
        <View className="absolute bottom-0 right-0 h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-acento">
          <Ionicons name="camera" size={19} color="#FFFFFF" />
        </View>
      </Pressable>

      <Pressable
        onPress={mostrarOpciones}
        disabled={cargando}
        accessibilityRole="button"
        className="mt-5 rounded-full bg-suave px-5 py-3"
      >
        <Text className="font-bold text-acento">
          {ruta ? "Cambiar fotografía" : "Agregar fotografía"}
        </Text>
      </Pressable>

      <Text className="mt-2 text-xs text-muted">
        Cámara o galería · Máximo 2 MB
      </Text>
    </View>
  );
}

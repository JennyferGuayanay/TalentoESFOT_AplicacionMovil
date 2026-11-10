import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import CampoFormulario from "./CampoFormulario";
import type { DatosDetalle, DetalleCV, TipoDetalle } from "../tipos/curriculum";

interface Propiedades {
  tipo: TipoDetalle;
  registro?: DetalleCV | null;
  guardar: (datos: DatosDetalle, id?: string) => Promise<void>;
  cancelar: () => void;
}

const etiquetas: Record<TipoDetalle, [string, string]> = {
  formacion: ["Título obtenido", "Institución educativa"],
  idioma: ["Idioma", "Información adicional"],
  curso: ["Nombre del curso", "Institución"],
  proyecto: ["Nombre del proyecto", "Tecnología utilizada"],
  practica: ["Cargo desempeñado", "Empresa"],
  experiencia: ["Cargo desempeñado", "Empresa"],
  referencia: ["Nombre de la referencia", "Cargo o relación"]
};

export default function FormularioDetalle({ tipo, registro, guardar, cancelar }: Propiedades) {
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [nivel, setNivel] = useState("");
  const [enlace, setEnlace] = useState("");
  const [contacto, setContacto] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    setTitulo(registro?.titulo || "");
    setSubtitulo(registro?.subtitulo || "");
    setDescripcion(registro?.descripcion || "");
    setPeriodo(registro?.periodo || "");
    setNivel(registro?.nivel || "");
    setEnlace(registro?.enlace || "");
    setContacto(registro?.contacto || "");
  }, [registro, tipo]);

  async function guardarDatos() {
    if (!titulo.trim()) {
      return Alert.alert("Atención", `Completa el campo ${etiquetas[tipo][0]}.`);
    }
    if (tipo === "referencia" && !contacto.trim()) {
      return Alert.alert("Atención", "Ingresa un contacto para la referencia.");
    }
    if (enlace.trim() && !/^https?:\/\/\S+\.\S+/i.test(enlace.trim())) {
      return Alert.alert("Atención", "Ingresa un enlace válido que comience con https://.");
    }

    const datos: DatosDetalle = {
      tipo,
      titulo: titulo.trim(),
      subtitulo: subtitulo.trim() || null,
      descripcion: descripcion.trim() || null,
      periodo: periodo.trim() || null,
      nivel: nivel.trim() || null,
      enlace: enlace.trim() || null,
      contacto: contacto.trim() || null
    };

    setCargando(true);
    try {
      await guardar(datos, registro?.id);
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "No se pudo guardar."
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <View className="rounded-[26px] border border-lavanda/50 bg-niebla p-5">
      <View className="mb-6 flex-row items-center">
        <View className="mr-3 h-11 w-11 items-center justify-center rounded-2xl bg-white">
          <Ionicons name="create-outline" size={22} color="#7628C7" />
        </View>
        <View className="flex-1">
          <Text className="text-xl font-black text-primario">
            {registro ? "Editar información" : "Agregar información"}
          </Text>
          <Text className="mt-1 text-sm text-muted">Completa los datos de esta sección</Text>
        </View>
      </View>

      <CampoFormulario
        etiqueta={etiquetas[tipo][0]}
        value={titulo}
        onChangeText={setTitulo}
        maxLength={150}
      />
      <CampoFormulario
        etiqueta={etiquetas[tipo][1]}
        value={subtitulo}
        onChangeText={setSubtitulo}
        maxLength={150}
      />

      {tipo === "idioma" && (
        <>
          <Text className="mb-3 font-semibold text-tinta">Nivel de idioma</Text>
          <View className="mb-5 flex-row flex-wrap gap-2">
            {["Básico", "Intermedio", "Avanzado", "Nativo"].map(opcion => (
              <Pressable
                key={opcion}
                onPress={() => setNivel(opcion)}
                className={`rounded-full border px-4 py-3 ${
                  nivel === opcion
                    ? "border-acento bg-acento"
                    : "border-lavanda/60 bg-white"
                }`}
              >
                <Text className={nivel === opcion ? "font-bold text-white" : "text-tinta"}>
                  {opcion}
                </Text>
              </Pressable>
            ))}
          </View>
        </>
      )}

      {tipo !== "idioma" && tipo !== "referencia" && (
        <CampoFormulario
          etiqueta="Período o año"
          placeholder="Ej. 2024 - 2026"
          value={periodo}
          onChangeText={setPeriodo}
          maxLength={50}
        />
      )}

      {["proyecto", "practica", "experiencia", "formacion", "curso"].includes(tipo) && (
        <CampoFormulario
          etiqueta="Descripción"
          placeholder="Breve descripción"
          value={descripcion}
          onChangeText={setDescripcion}
          maxLength={500}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      )}

      {tipo === "proyecto" && (
        <CampoFormulario
          etiqueta="Enlace del proyecto (opcional)"
          placeholder="https://github.com/..."
          value={enlace}
          onChangeText={setEnlace}
          autoCapitalize="none"
          maxLength={300}
        />
      )}

      {tipo === "referencia" && (
        <CampoFormulario
          etiqueta="Teléfono o correo de contacto"
          value={contacto}
          onChangeText={setContacto}
          maxLength={150}
        />
      )}

      <Pressable disabled={cargando} onPress={guardarDatos} className="mt-2">
        <LinearGradient
          colors={["#8D39D8", "#5A1FA5"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="flex-row items-center justify-center rounded-full px-5 py-4"
        >
          {cargando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={21} color="#FFFFFF" />
              <Text className="ml-2 font-bold text-white">Guardar información</Text>
            </>
          )}
        </LinearGradient>
      </Pressable>

      <Pressable onPress={cancelar} className="mt-4">
        <Text className="text-center font-semibold text-acento">
          Cancelar
        </Text>
      </Pressable>
    </View>
  );
}

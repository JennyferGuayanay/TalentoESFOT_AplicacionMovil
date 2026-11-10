import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View
} from "react-native";

import CampoFormulario from "../componentes/CampoFormulario";
import { supabase } from "../servicios/supabase";
import type { Categoria, Habilidad, Nivel } from "../tipos/habilidad";

const categorias: Categoria[] = ["Tecnica", "Blanda", "Idioma", "Herramienta"];
const niveles: Nivel[] = ["Basico", "Intermedio", "Avanzado"];

function iconoCategoria(categoria: Categoria): keyof typeof Ionicons.glyphMap {
  if (categoria === "Tecnica") return "code-slash-outline";
  if (categoria === "Blanda") return "people-outline";
  if (categoria === "Idioma") return "language-outline";
  return "construct-outline";
}

export default function Habilidades({ volver }: { volver: () => void }) {
  const [habilidades, setHabilidades] = useState<Habilidad[]>([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState<Categoria>("Tecnica");
  const [nivel, setNivel] = useState<Nivel>("Basico");
  const [editando, setEditando] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const consultar = useCallback(async () => {
    setCargando(true);
    const { data, error } = await supabase
      .from("habilidades")
      .select("*")
      .order("fecha_creacion", { ascending: false });

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      setHabilidades((data || []) as Habilidad[]);
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    void consultar();
  }, [consultar]);

  function limpiar() {
    setNombre("");
    setDescripcion("");
    setCategoria("Tecnica");
    setNivel("Basico");
    setEditando(null);
  }

  async function guardar() {
    if (nombre.trim().length < 2 || nombre.trim().length > 80) {
      return Alert.alert("Atención", "El nombre debe tener entre 2 y 80 caracteres.");
    }
    if (descripcion.trim().length > 500) {
      return Alert.alert("Atención", "La descripción es demasiado larga.");
    }

    setGuardando(true);
    try {
      const { data: usuario, error: errorUsuario } = await supabase.auth.getUser();
      if (errorUsuario || !usuario.user) {
        throw new Error("Tu sesión no está disponible.");
      }

      const datos = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        categoria,
        nivel
      };

      const resultado = editando
        ? await supabase.from("habilidades").update(datos)
            .eq("id", editando)
            .eq("usuario_id", usuario.user.id)
            .select()
        : await supabase.from("habilidades").insert({
            ...datos,
            usuario_id: usuario.user.id
          }).select();

      if (resultado.error) throw resultado.error;
      if (!resultado.data?.length) {
        throw new Error("No se pudo guardar el registro.");
      }

      limpiar();
      await consultar();
      Alert.alert(
        "Correcto",
        editando ? "Habilidad actualizada." : "Habilidad registrada."
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "No se pudo guardar."
      );
    } finally {
      setGuardando(false);
    }
  }

  function editar(habilidad: Habilidad) {
    setEditando(habilidad.id);
    setNombre(habilidad.nombre);
    setDescripcion(habilidad.descripcion || "");
    setCategoria(habilidad.categoria);
    setNivel(habilidad.nivel);
  }

  function eliminar(habilidad: Habilidad) {
    Alert.alert("Eliminar habilidad", `¿Deseas eliminar "${habilidad.nombre}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          const { error } = await supabase.from("habilidades")
            .delete()
            .eq("id", habilidad.id);

          if (error) {
            Alert.alert("Error", error.message);
          } else {
            if (editando === habilidad.id) limpiar();
            await consultar();
          }
        }
      }
    ]);
  }

  return (
    <ImageBackground
      source={require("../../assets/portada-cv.png")}
      resizeMode="cover"
      className="flex-1"
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        <FlatList
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 44 }}
          data={habilidades}
          keyExtractor={elemento => elemento.id}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
            <LinearGradient
              colors={["#32156E", "#7628C7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-b-[36px] px-5 pb-7 pt-14"
            >
              <Pressable
                onPress={volver}
                accessibilityRole="button"
                accessibilityLabel="Volver a Mi espacio"
                className="mb-3 flex-row items-center self-start rounded-full bg-white/15 px-4 py-3"
              >
                <Ionicons name="arrow-back" size={23} color="#FFFFFF" />
                <Text className="ml-2 font-bold text-white">← Mi espacio</Text>
              </Pressable>
              <View>
                <View className="pb-3">
                  <Text className="text-xs font-bold uppercase tracking-[2px] text-lavanda">
                    Mi espacio
                  </Text>
                  <Text className="mt-2 text-3xl font-black text-white">
                    Mis habilidades
                  </Text>
                  <Text className="mt-3 leading-6 text-white/75">
                    Haz visible lo que sabes hacer.
                  </Text>
                </View>
              </View>
            </LinearGradient>

            <View className="px-4 pt-5">
              <View
                className="mb-6 rounded-[30px] border border-lavanda/40 bg-white p-4"
                style={{
                  shadowColor: "#32156E",
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.1,
                  shadowRadius: 18,
                  elevation: 4
                }}
              >
                <View className="mb-5 flex-row items-center">
                  <View className="mr-3 h-12 w-12 items-center justify-center rounded-2xl bg-suave">
                    <Ionicons
                      name={editando ? "create-outline" : "add-circle-outline"}
                      size={25}
                      color="#7628C7"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xl font-black text-primario">
                      {editando ? "Editar habilidad" : "Nueva habilidad"}
                    </Text>
                    <Text className="mt-1 text-sm text-muted">
                      Completa los datos de tu conocimiento
                    </Text>
                  </View>
                </View>

                <CampoFormulario
                  etiqueta="Nombre"
                  placeholder="Ej. Desarrollo con React Native"
                  value={nombre}
                  onChangeText={setNombre}
                  maxLength={80}
                />
                <CampoFormulario
                  etiqueta="Descripción"
                  placeholder="Describe brevemente esta habilidad"
                  value={descripcion}
                  onChangeText={setDescripcion}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  maxLength={500}
                />

                <View className="mb-3 flex-row items-center">
                  <Ionicons name="grid-outline" size={18} color="#7628C7" />
                  <Text className="ml-2 font-bold text-tinta">Categoría</Text>
                </View>
                <View className="mb-5 flex-row flex-wrap gap-2">
                  {categorias.map(opcion => {
                    const seleccionada = categoria === opcion;
                    return (
                      <Pressable
                        key={opcion}
                        onPress={() => setCategoria(opcion)}
                        accessibilityRole="button"
                        accessibilityState={{ selected: seleccionada }}
                        className={`flex-row items-center rounded-full border px-4 py-3 ${
                          seleccionada
                            ? "border-acento bg-acento"
                            : "border-lavanda/60 bg-niebla"
                        }`}
                      >
                        <Ionicons
                          name={iconoCategoria(opcion)}
                          size={17}
                          color={seleccionada ? "#FFFFFF" : "#7628C7"}
                        />
                        <Text
                          className={`ml-2 font-semibold ${
                            seleccionada ? "text-white" : "text-tinta"
                          }`}
                        >
                          {opcion === "Tecnica" ? "Técnica" : opcion}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <View className="mb-3 flex-row items-center">
                  <Ionicons name="stats-chart-outline" size={18} color="#7628C7" />
                  <Text className="ml-2 font-bold text-tinta">Nivel de conocimiento</Text>
                </View>
                <View className="mb-5 flex-row flex-wrap gap-2">
                  {niveles.map(opcion => {
                    const seleccionado = nivel === opcion;
                    return (
                      <Pressable
                        key={opcion}
                        onPress={() => setNivel(opcion)}
                        accessibilityRole="button"
                        accessibilityState={{ selected: seleccionado }}
                        className={`rounded-full border px-4 py-3 ${
                          seleccionado
                            ? "border-primario bg-primario"
                            : "border-lavanda/60 bg-niebla"
                        }`}
                      >
                        <Text
                          className={`font-semibold ${
                            seleccionado ? "text-white" : "text-tinta"
                          }`}
                        >
                          {opcion === "Basico" ? "Básico" : opcion}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Pressable
                  disabled={guardando}
                  onPress={guardar}
                  accessibilityRole="button"
                  accessibilityLabel={editando ? "Guardar cambios" : "Agregar habilidad"}
                  accessibilityState={{ disabled: guardando }}
                  className="overflow-hidden rounded-2xl"
                >
                  <LinearGradient
                    colors={["#32156E", "#7628C7"]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    className="flex-row items-center justify-center px-5 py-4"
                  >
                    {guardando ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <>
                        <Ionicons
                          name={editando ? "checkmark-circle-outline" : "add-circle-outline"}
                          size={21}
                          color="#FFFFFF"
                        />
                        <Text className="ml-2 font-bold text-white">
                          {editando ? "Guardar cambios" : "Agregar habilidad +"}
                        </Text>
                      </>
                    )}
                  </LinearGradient>
                </Pressable>

                {editando && (
                  <Pressable
                    onPress={limpiar}
                    accessibilityRole="button"
                    className="mt-4 items-center py-2"
                  >
                    <Text className="font-semibold text-acento">Cancelar edición</Text>
                  </Pressable>
                )}
              </View>

              <View className="mb-4 flex-row items-center justify-between">
                <View>
                  <Text className="text-xs font-bold uppercase tracking-[2px] text-acento">
                    Repertorio
                  </Text>
                  <Text className="mt-1 text-2xl font-black text-primario">
                    Mi colección
                  </Text>
                </View>
                <View className="rounded-full bg-suave px-4 py-2">
                  <Text className="font-bold text-acento">
                    {habilidades.length} registros
                  </Text>
                </View>
              </View>
              {cargando && <ActivityIndicator color="#7628C7" />}
            </View>
            </View>
          }
          renderItem={({ item }) => (
          <View
            className="mx-4 mb-4 rounded-[28px] border border-lavanda/40 bg-white p-4"
            style={{
              shadowColor: "#32156E",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.08,
              shadowRadius: 16,
              elevation: 3
            }}
          >
            <View className="flex-row items-start">
              <View className="mr-4 h-12 w-12 items-center justify-center rounded-2xl bg-suave">
                <Ionicons
                  name={iconoCategoria(item.categoria)}
                  size={24}
                  color="#7628C7"
                />
              </View>
              <View className="flex-1">
                <View className="mb-2 flex-row flex-wrap gap-2">
                  <View className="rounded-full bg-niebla px-3 py-1.5">
                    <Text className="text-xs font-bold text-acento">
                      {item.categoria === "Tecnica" ? "Técnica" : item.categoria}
                    </Text>
                  </View>
                  <View className="rounded-full bg-rosa px-3 py-1.5">
                    <Text className="text-xs font-bold text-primario">
                      {item.nivel === "Basico" ? "Básico" : item.nivel}
                    </Text>
                  </View>
                </View>
                <Text className="text-xl font-black text-primario">{item.nombre}</Text>
              </View>
            </View>

            {!!item.descripcion && (
              <Text className="mt-4 leading-6 text-muted">{item.descripcion}</Text>
            )}

            <View className="mt-4 flex-row gap-3 border-t border-suave pt-4">
              <Pressable
                onPress={() => editar(item)}
                accessibilityRole="button"
                accessibilityLabel={`Editar ${item.nombre}`}
                className="flex-1 flex-row items-center justify-center rounded-2xl bg-suave px-4 py-3"
              >
                <Ionicons name="create-outline" size={18} color="#32156E" />
                <Text className="ml-2 font-bold text-primario">Editar</Text>
              </Pressable>
              <Pressable
                onPress={() => eliminar(item)}
                accessibilityRole="button"
                accessibilityLabel={`Eliminar ${item.nombre}`}
                className="flex-1 flex-row items-center justify-center rounded-2xl bg-rosa px-4 py-3"
              >
                <Ionicons name="trash-outline" size={18} color="#B4234D" />
                <Text className="ml-2 font-bold text-[#B4234D]">Eliminar</Text>
              </Pressable>
            </View>
          </View>
          )}
          ListEmptyComponent={!cargando ? (
          <View className="mx-4 items-center rounded-[28px] bg-white p-4">
            <View className="h-44 w-44 items-center justify-center">
              <Ionicons name="bulb-outline" size={62} color="#CBA7FA" />
              <LottieView
                source={require("../animaciones/bienvenida.json")}
                autoPlay
                loop
                speed={0.5}
                resizeMode="contain"
                style={{ position: "absolute", width: 180, height: 180 }}
              />
            </View>
            <Text className="text-center leading-6 text-muted">
              Tu colección comienza aquí. ¡Agrega tu primera habilidad!
            </Text>
          </View>
          ) : null}
        />
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

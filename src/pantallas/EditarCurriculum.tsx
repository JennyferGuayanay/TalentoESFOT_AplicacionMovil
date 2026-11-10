import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View
} from "react-native";

import CampoFormulario from "../componentes/CampoFormulario";
import FotoPerfil from "../componentes/FotoPerfil";
import FormularioDetalle from "../componentes/FormularioDetalle";
import SeccionCurriculum from "../componentes/SeccionCurriculum";
import {
  consultarDetalles,
  consultarPerfil,
  eliminarDetalle,
  guardarDetalle,
  guardarPerfil
} from "../servicios/curriculum";
import { supabase } from "../servicios/supabase";
import {
  seccionesCV,
  type DatosDetalle,
  type DatosPerfil,
  type DetalleCV,
  type TipoDetalle
} from "../tipos/curriculum";

interface Propiedades {
  volver: () => void;
  irHabilidades: () => void;
  verCurriculum: () => void;
}

const perfilInicial: DatosPerfil = {
  nombres: "",
  apellidos: "",
  correo: "",
  telefono: "",
  ciudad: "",
  profesion: "",
  descripcion: "",
  foto_ruta: null
};

export default function EditarCurriculum({
  volver,
  irHabilidades,
  verCurriculum
}: Propiedades) {
  const [perfil, setPerfil] = useState<DatosPerfil>(perfilInicial);
  const [detalles, setDetalles] = useState<DetalleCV[]>([]);
  const [formulario, setFormulario] = useState<TipoDetalle | null>(null);
  const [editando, setEditando] = useState<DetalleCV | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    try {
      const [datosPerfil, datosDetalles] = await Promise.all([
        consultarPerfil(),
        consultarDetalles()
      ]);

      if (datosPerfil) {
        setPerfil({
          nombres: datosPerfil.nombres,
          apellidos: datosPerfil.apellidos,
          correo: datosPerfil.correo,
          telefono: datosPerfil.telefono || "",
          ciudad: datosPerfil.ciudad || "",
          profesion: datosPerfil.profesion || "",
          descripcion: datosPerfil.descripcion || "",
          foto_ruta: datosPerfil.foto_ruta
        });
      } else {
        const { data } = await supabase.auth.getUser();
        setPerfil({
          ...perfilInicial,
          correo: data.user?.email || "",
          nombres: data.user?.user_metadata?.nombre || ""
        });
      }
      setDetalles(datosDetalles);
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "No se pudieron cargar los datos."
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargarDatos();
  }, [cargarDatos]);

  function actualizarPerfil(campo: keyof DatosPerfil, valor: string | null) {
    setPerfil(actual => ({ ...actual, [campo]: valor }));
  }

  async function guardarDatosPersonales() {
    if (!perfil.nombres.trim() || !perfil.apellidos.trim()) {
      return Alert.alert("Atención", "Ingresa tus nombres y apellidos.");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(perfil.correo.trim())) {
      return Alert.alert("Atención", "Ingresa un correo válido.");
    }
    if (perfil.telefono && !/^\+?[\d\s-]{7,20}$/.test(perfil.telefono.trim())) {
      return Alert.alert("Atención", "Ingresa un teléfono válido.");
    }

    setGuardando(true);
    try {
      await guardarPerfil({
        ...perfil,
        nombres: perfil.nombres.trim(),
        apellidos: perfil.apellidos.trim(),
        correo: perfil.correo.trim(),
        telefono: perfil.telefono?.trim() || null,
        ciudad: perfil.ciudad?.trim() || null,
        profesion: perfil.profesion?.trim() || null,
        descripcion: perfil.descripcion?.trim() || null
      });
      Alert.alert("Correcto", "Tu información personal se guardó correctamente.");
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "No se pudo guardar.");
    } finally {
      setGuardando(false);
    }
  }

  async function cambiarFoto(ruta: string) {
    const perfilActualizado = { ...perfil, foto_ruta: ruta };
    await guardarPerfil(perfilActualizado);
    setPerfil(perfilActualizado);
  }

  async function guardarRegistro(datos: DatosDetalle, id?: string) {
    await guardarDetalle(datos, id);
    setFormulario(null);
    setEditando(null);
    const registros = await consultarDetalles();
    setDetalles(registros);
    Alert.alert("Correcto", id ? "Registro actualizado." : "Registro agregado.");
  }

  function editarRegistro(registro: DetalleCV) {
    setEditando(registro);
    setFormulario(registro.tipo);
  }

  function borrarRegistro(registro: DetalleCV) {
    Alert.alert("Eliminar registro", `¿Deseas eliminar "${registro.titulo}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await eliminarDetalle(registro.id);
            if (editando?.id === registro.id) {
              setEditando(null);
              setFormulario(null);
            }
            setDetalles(await consultarDetalles());
          } catch (error) {
            Alert.alert(
              "Error",
              error instanceof Error ? error.message : "No se pudo eliminar."
            );
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
      {cargando ? (
        <LinearGradient
          colors={["rgba(248,239,255,0.94)", "rgba(237,224,255,0.9)"]}
          className="flex-1 items-center justify-center"
        >
          <ActivityIndicator size="large" color="#7628C7" />
          <Text className="mt-4 font-semibold text-tinta">Preparando tu currículum...</Text>
        </LinearGradient>
      ) : (
      <KeyboardAvoidingView
        className="flex-1"
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 44 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={["rgba(50,21,110,0.94)", "rgba(118,40,199,0.74)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="px-5 pb-9 pt-14"
          >
            <Pressable
              onPress={volver}
              accessibilityRole="button"
              accessibilityLabel="Volver a Mi espacio"
              className="flex-row items-center self-start rounded-full bg-white/15 px-4 py-3"
            >
              <Ionicons name="arrow-back" size={23} color="#FFFFFF" />
              <Text className="ml-2 font-bold text-white">← Mi espacio</Text>
            </Pressable>
            <View className="mt-3 flex-row items-end">
              <View className="flex-1 pb-3">
                <Text className="text-xs font-bold uppercase tracking-[2px] text-lavanda">
                  Currículum digital
                </Text>
                <Text className="mt-2 text-3xl font-black leading-9 text-white">
                  Construye tu CV
                </Text>
                <Text className="mt-3 leading-6 text-white/75">
                  Completa tu información y presenta tu trayectoria profesional.
                </Text>
              </View>
              <View className="h-40 w-40 items-center justify-center">
                <Ionicons name="document-text-outline" size={54} color="#CBA7FA" />
                <LottieView
                  source={require("../animaciones/bienvenida.json")}
                  autoPlay
                  loop
                  speed={0.5}
                  resizeMode="contain"
                  style={{ position: "absolute", width: 160, height: 160 }}
                />
              </View>
            </View>
          </LinearGradient>

        <View className="px-4 pt-5">
          <View
            className="mb-5 rounded-[30px] bg-white p-4"
            style={{
              shadowColor: "#32156E",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.1,
              shadowRadius: 18,
              elevation: 4
            }}
          >
            <View className="mb-3 flex-row items-center">
              <View className="mr-3 h-11 w-11 items-center justify-center rounded-2xl bg-suave">
                <Ionicons name="camera-outline" size={22} color="#7628C7" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-black text-primario">Tu imagen profesional</Text>
                <Text className="mt-1 text-sm text-muted">Cámara o galería</Text>
              </View>
            </View>
            <FotoPerfil ruta={perfil.foto_ruta} alCambiar={cambiarFoto} />
          </View>

          <SeccionCurriculum titulo="Información personal">
            <View className="mb-5 rounded-2xl bg-niebla p-4">
              <View className="flex-row items-center">
                <Ionicons name="information-circle-outline" size={21} color="#7628C7" />
                <Text className="ml-2 flex-1 text-sm leading-5 text-tinta">
                  Estos datos serán la presentación principal de tu hoja de vida.
                </Text>
              </View>
            </View>

            <CampoFormulario
              etiqueta="Nombres"
              value={perfil.nombres}
              onChangeText={valor => actualizarPerfil("nombres", valor)}
              maxLength={100}
            />
            <CampoFormulario
              etiqueta="Apellidos"
              value={perfil.apellidos}
              onChangeText={valor => actualizarPerfil("apellidos", valor)}
              maxLength={100}
            />
            <CampoFormulario
              etiqueta="Correo de contacto"
              value={perfil.correo}
              onChangeText={valor => actualizarPerfil("correo", valor)}
              keyboardType="email-address"
              autoCapitalize="none"
              maxLength={150}
            />
            <CampoFormulario
              etiqueta="Teléfono"
              value={perfil.telefono || ""}
              onChangeText={valor => actualizarPerfil("telefono", valor)}
              keyboardType="phone-pad"
              maxLength={20}
            />
            <CampoFormulario
              etiqueta="Ciudad"
              value={perfil.ciudad || ""}
              onChangeText={valor => actualizarPerfil("ciudad", valor)}
              maxLength={100}
            />
            <CampoFormulario
              etiqueta="Profesión"
              value={perfil.profesion || ""}
              onChangeText={valor => actualizarPerfil("profesion", valor)}
              maxLength={120}
            />
            <CampoFormulario
              etiqueta="Descripción profesional"
              placeholder="Cuéntanos brevemente sobre ti"
              value={perfil.descripcion || ""}
              onChangeText={valor => actualizarPerfil("descripcion", valor)}
              multiline
              numberOfLines={4}
              maxLength={700}
              textAlignVertical="top"
            />

            <Pressable
              onPress={guardarDatosPersonales}
              disabled={guardando}
              accessibilityRole="button"
              accessibilityState={{ disabled: guardando }}
              className="mt-1 overflow-hidden rounded-2xl"
            >
              <LinearGradient
                colors={["#32156E", "#7628C7"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                className="flex-row items-center justify-center px-4 py-4"
              >
                {guardando ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Ionicons name="save-outline" size={20} color="#FFFFFF" />
                    <Text className="ml-2 font-bold text-white">
                      Guardar información personal
                    </Text>
                  </>
                )}
              </LinearGradient>
            </Pressable>
          </SeccionCurriculum>

          <LinearGradient
            colors={["#32156E", "#7628C7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="mb-4 rounded-[28px] p-5"
          >
            <View className="flex-row items-start">
              <View className="mr-4 h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <Ionicons name="sparkles-outline" size={24} color="#FF9EAE" />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-black text-white">Mis habilidades</Text>
                <Text className="mt-2 leading-6 text-white/75">
                  Administra tus habilidades técnicas, idiomas y conocimientos.
                </Text>
              </View>
            </View>
            <Pressable
              onPress={irHabilidades}
              accessibilityRole="button"
              className="mt-5 flex-row items-center justify-center rounded-2xl bg-white px-5 py-4"
            >
              <Text className="mr-2 font-bold text-primario">
                Administrar habilidades →
              </Text>
              <Ionicons name="arrow-forward" size={19} color="#32156E" />
            </Pressable>
          </LinearGradient>

          <View className="mb-4 mt-4">
            <Text className="text-xs font-bold uppercase tracking-[2px] text-acento">
              Trayectoria
            </Text>
            <Text className="mt-1 text-2xl font-black text-primario">
              Completa tus secciones
            </Text>
            <Text className="mt-2 leading-6 text-muted">
              Despliega cada categoría para agregar o editar información.
            </Text>
          </View>

          {seccionesCV.map(seccion => {
            const registros = detalles.filter(item => item.tipo === seccion.tipo);

            return (
              <SeccionCurriculum
                key={seccion.tipo}
                titulo={seccion.nombre}
                cantidad={registros.length}
              >
                {registros.map(registro => (
                  <View
                    key={registro.id}
                    className="mb-3 rounded-[22px] border border-lavanda/40 bg-niebla p-4"
                  >
                    <View className="flex-row items-start">
                      <View className="mr-3 mt-0.5 h-9 w-9 items-center justify-center rounded-xl bg-white">
                        <Ionicons name="document-text-outline" size={18} color="#7628C7" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-bold text-primario">
                          {registro.titulo}
                        </Text>
                        {!!registro.subtitulo && (
                          <Text className="mt-1 text-muted">{registro.subtitulo}</Text>
                        )}
                        {!!registro.periodo && (
                          <Text className="mt-1 text-sm font-semibold text-acento">
                            {registro.periodo}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View className="mt-4 flex-row gap-3 border-t border-lavanda/30 pt-3">
                      <Pressable
                        onPress={() => editarRegistro(registro)}
                        accessibilityRole="button"
                        className="flex-1 flex-row items-center justify-center rounded-xl bg-white py-3"
                      >
                        <Ionicons name="create-outline" size={17} color="#32156E" />
                        <Text className="ml-2 font-bold text-primario">Editar</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => borrarRegistro(registro)}
                        accessibilityRole="button"
                        className="flex-1 flex-row items-center justify-center rounded-xl bg-rosa py-3"
                      >
                        <Ionicons name="trash-outline" size={17} color="#B4234D" />
                        <Text className="ml-2 font-bold text-[#B4234D]">Eliminar</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}

                {formulario === seccion.tipo ? (
                  <FormularioDetalle
                    tipo={seccion.tipo}
                    registro={editando?.tipo === seccion.tipo ? editando : null}
                    guardar={guardarRegistro}
                    cancelar={() => {
                      setFormulario(null);
                      setEditando(null);
                    }}
                  />
                ) : (
                  <Pressable
                    onPress={() => {
                      setEditando(null);
                      setFormulario(seccion.tipo);
                    }}
                    accessibilityRole="button"
                    className="flex-row items-center justify-center rounded-2xl border border-lavanda bg-niebla py-4"
                  >
                    <Ionicons name="add-circle-outline" size={20} color="#7628C7" />
                    <Text className="ml-2 font-bold text-acento">Agregar información</Text>
                  </Pressable>
                )}
              </SeccionCurriculum>
            );
          })}

          <Pressable
            onPress={verCurriculum}
            accessibilityRole="button"
            className="mt-5 overflow-hidden rounded-[22px]"
          >
            <LinearGradient
              colors={["#7628C7", "#32156E"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              className="flex-row items-center justify-center px-5 py-5"
            >
              <Ionicons name="eye-outline" size={22} color="#FFFFFF" />
              <Text className="ml-2 text-base font-bold text-white">
                Ver mi hoja de vida →
              </Text>
              <Ionicons
                name="arrow-forward"
                size={20}
                color="#FF9EAE"
                style={{ marginLeft: 8 }}
              />
            </LinearGradient>
          </Pressable>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
      )}
    </ImageBackground>
  );
}

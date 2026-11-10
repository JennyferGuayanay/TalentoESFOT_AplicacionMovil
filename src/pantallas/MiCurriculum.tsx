import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View
} from "react-native";

import { obtenerUrlFoto } from "../servicios/almacenamiento";
import {
  consultarDetalles,
  consultarHabilidadesCV,
  consultarPerfil
} from "../servicios/curriculum";
import { seccionesCV, type DetalleCV, type PerfilCV } from "../tipos/curriculum";
import type { Habilidad } from "../tipos/habilidad";

interface Propiedades {
  volver: () => void;
  editar: () => void;
}

function iconoSeccion(nombre: string): keyof typeof Ionicons.glyphMap {
  const texto = nombre.toLowerCase();
  if (texto.includes("formación")) return "school-outline";
  if (texto.includes("idioma")) return "language-outline";
  if (texto.includes("curso")) return "ribbon-outline";
  if (texto.includes("proyecto")) return "code-slash-outline";
  if (texto.includes("práctica")) return "briefcase-outline";
  if (texto.includes("experiencia")) return "business-outline";
  return "people-outline";
}

export default function MiCurriculum({ volver, editar }: Propiedades) {
  const [perfil, setPerfil] = useState<PerfilCV | null>(null);
  const [detalles, setDetalles] = useState<DetalleCV[]>([]);
  const [habilidades, setHabilidades] = useState<Habilidad[]>([]);
  const [foto, setFoto] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    try {
      const [datosPerfil, datosDetalles, datosHabilidades] = await Promise.all([
        consultarPerfil(),
        consultarDetalles(),
        consultarHabilidadesCV()
      ]);

      setPerfil(datosPerfil);
      setDetalles(datosDetalles);
      setHabilidades(datosHabilidades);
      setFoto(null);

      if (datosPerfil?.foto_ruta) {
        try {
          const direccion = await obtenerUrlFoto(datosPerfil.foto_ruta);
          setFoto(direccion);
        } catch {
          setFoto(null);
        }
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "No se pudo cargar el currículum."
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargarDatos();
  }, [cargarDatos]);

  async function abrirEnlace(enlace: string) {
    try {
      await Linking.openURL(enlace);
    } catch {
      Alert.alert("Error", "No se pudo abrir el enlace.");
    }
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
          className="flex-1 items-center justify-center px-6"
        >
          <ActivityIndicator size="large" color="#7628C7" />
          <Text className="mt-4 font-semibold text-tinta">
            Preparando tu portafolio...
          </Text>
        </LinearGradient>
      ) : (
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
      <View className="mb-5 flex-row items-center justify-between rounded-b-[28px] bg-primario px-5 pb-5 pt-14">
        <Pressable
          onPress={volver}
          accessibilityRole="button"
          accessibilityLabel="Volver"
          className="flex-row items-center rounded-full bg-white px-4 py-3"
          style={{
            shadowColor: "#32156E",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.08,
            shadowRadius: 10,
            elevation: 2
          }}
        >
          <Ionicons name="arrow-back" size={19} color="#30265F" />
          <Text className="ml-2 font-bold text-tinta">← Volver</Text>
        </Pressable>
        <Pressable
          onPress={editar}
          accessibilityRole="button"
          accessibilityLabel="Editar CV"
          className="flex-row items-center rounded-full bg-white/15 px-4 py-3"
        >
          <Ionicons name="create-outline" size={18} color="#FFFFFF" />
          <Text className="ml-2 font-bold text-white">Editar CV</Text>
        </Pressable>
      </View>

      <View className="mx-4 overflow-hidden rounded-[28px]">
        <LinearGradient
          colors={["rgba(50,21,110,0.94)", "rgba(118,40,199,0.68)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="items-center p-5"
        >
          <View className="mb-5 self-start flex-row items-center rounded-full border border-white/25 bg-white/10 px-4 py-2">
            <Ionicons name="sparkles-outline" size={15} color="#FF9EAE" />
            <Text className="ml-2 text-xs font-bold tracking-[2px] text-white">
              TALENTOESFOT / PORTAFOLIO
            </Text>
          </View>

          <View
            className="h-36 w-36 items-center justify-center rounded-full border-4 border-white bg-suave"
            style={{
              shadowColor: "#1B0A3A",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 18,
              elevation: 8
            }}
          >
            {foto ? (
              <Image
                source={{ uri: foto }}
                accessibilityLabel="Fotografía de perfil"
                className="h-full w-full rounded-full"
              />
            ) : (
              <Ionicons name="person" size={68} color="#7628C7" />
            )}
          </View>

          <Text className="mt-6 text-center text-3xl font-black leading-9 text-white">
            {perfil ? `${perfil.nombres} ${perfil.apellidos}` : "Mi hoja de vida"}
          </Text>

          {!!perfil?.profesion && (
            <View className="mt-4 rounded-full bg-coral px-5 py-3">
              <Text className="text-center font-bold text-primario">
                {perfil.profesion}
              </Text>
            </View>
          )}

          <View className="mt-5 items-center">
            {!!perfil?.ciudad && (
              <View className="mb-2 flex-row items-center">
                <Ionicons name="location-outline" size={18} color="#CBA7FA" />
                <Text className="ml-2 text-center text-white">{perfil.ciudad}</Text>
              </View>
            )}
            {!!perfil?.correo && (
              <View className="mb-2 flex-row items-center">
                <Ionicons name="mail-outline" size={18} color="#CBA7FA" />
                <Text className="ml-2 text-center text-white/85">{perfil.correo}</Text>
              </View>
            )}
            {!!perfil?.telefono && (
              <View className="flex-row items-center">
                <Ionicons name="call-outline" size={18} color="#CBA7FA" />
                <Text className="ml-2 text-center text-white/85">{perfil.telefono}</Text>
              </View>
            )}
          </View>

          <View className="h-44 w-44 items-center justify-center">
            <Ionicons name="sparkles-outline" size={60} color="#CBA7FA" />
            <LottieView
              source={require("../animaciones/bienvenida.json")}
              autoPlay
              loop
              speed={0.5}
              resizeMode="contain"
              style={{ position: "absolute", width: 180, height: 180 }}
            />
          </View>
          <Text className="text-center text-xs font-bold tracking-[2px] text-coral">
            CONOCE MI TRAYECTORIA
          </Text>
        </LinearGradient>
      </View>

      <View className="px-4 pt-5">
        {!perfil && (
          <View
            className="mb-5 rounded-[28px] bg-white p-5"
            style={{
              shadowColor: "#32156E",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.08,
              shadowRadius: 16,
              elevation: 3
            }}
          >
            <View className="mb-4 h-12 w-12 items-center justify-center rounded-2xl bg-suave">
              <Ionicons name="document-text-outline" size={24} color="#7628C7" />
            </View>
            <Text className="text-xl font-black text-primario">
              Comienza a contar tu historia
            </Text>
            <Text className="mt-3 leading-6 text-muted">
              Completa tu información para construir un portafolio profesional.
            </Text>
            <Pressable
              onPress={editar}
              accessibilityRole="button"
              className="mt-5 overflow-hidden rounded-2xl"
            >
              <LinearGradient
                colors={["#32156E", "#7628C7"]}
                className="flex-row items-center justify-center px-5 py-4"
              >
                <Text className="mr-2 font-bold text-white">Completar mi CV →</Text>
                <Ionicons name="arrow-forward" size={19} color="#FFFFFF" />
              </LinearGradient>
            </Pressable>
          </View>
        )}

        {!!perfil?.descripcion && (
          <View
            className="mb-5 rounded-[28px] bg-white p-5"
            style={{
              shadowColor: "#32156E",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.08,
              shadowRadius: 16,
              elevation: 3
            }}
          >
            <View className="mb-4 flex-row items-center">
              <View className="mr-3 h-12 w-12 items-center justify-center rounded-2xl bg-rosa">
                <Ionicons name="person-outline" size={24} color="#7628C7" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-bold uppercase tracking-[2px] text-acento">
                  Perfil
                </Text>
                <Text className="mt-1 text-2xl font-black text-primario">
                  Un poco sobre mí
                </Text>
              </View>
            </View>
            <Text className="text-base leading-7 text-tinta">{perfil.descripcion}</Text>
          </View>
        )}

        {habilidades.length > 0 && (
          <LinearGradient
            colors={["#EDE0FF", "#F8EFFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="mb-5 rounded-[28px] border border-lavanda/40 p-5"
          >
            <View className="mb-5 flex-row items-center">
              <View className="mr-3 h-12 w-12 items-center justify-center rounded-2xl bg-white">
                <Ionicons name="sparkles-outline" size={24} color="#7628C7" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-bold uppercase tracking-[2px] text-acento">
                  Lo que sé hacer
                </Text>
                <Text className="mt-1 text-2xl font-black text-primario">
                  Mis habilidades
                </Text>
              </View>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {habilidades.map(habilidad => (
                <View
                  key={habilidad.id}
                  className="flex-row items-center rounded-full border border-lavanda/60 bg-white px-4 py-3"
                >
                  <Ionicons name="checkmark-circle" size={17} color="#7628C7" />
                  <Text className="ml-2 font-bold text-acento">{habilidad.nombre}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        )}

        {seccionesCV.map((seccion, indice) => {
          const registros = detalles.filter(item => item.tipo === seccion.tipo);
          if (!registros.length) return null;

          return (
            <View
              key={seccion.tipo}
              className="mb-5 rounded-[28px] bg-white p-5"
              style={{
                shadowColor: "#32156E",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.08,
                shadowRadius: 16,
                elevation: 3
              }}
            >
              <View className="mb-5 flex-row items-center">
                <LinearGradient
                  colors={["#32156E", "#7628C7"]}
                  className="mr-4 h-12 w-12 items-center justify-center rounded-2xl"
                >
                  <Ionicons name={iconoSeccion(seccion.nombre)} size={23} color="#FFFFFF" />
                </LinearGradient>
                <View className="flex-1">
                  <Text className="text-xs font-bold tracking-[2px] text-coral">
                    {String(indice + 1).padStart(2, "0")}
                  </Text>
                  <Text className="mt-1 text-xl font-black text-primario">
                    {seccion.nombre}
                  </Text>
                </View>
              </View>

              {registros.map((registro, posicion) => (
                <View
                  key={registro.id}
                  className={
                    posicion > 0
                      ? "mt-5 border-t border-suave pt-5"
                      : "rounded-2xl bg-niebla p-4"
                  }
                >
                  <View className="flex-row items-start">
                    <View className="mr-3 mt-1 h-3 w-3 rounded-full bg-coral" />
                    <View className="flex-1">
                      <Text className="text-lg font-bold text-primario">
                        {registro.titulo}
                      </Text>
                      {!!registro.subtitulo && (
                        <Text className="mt-2 text-muted">{registro.subtitulo}</Text>
                      )}
                      {!!registro.periodo && (
                        <View className="mt-3 self-start rounded-full bg-suave px-3 py-1.5">
                          <Text className="text-sm font-bold text-acento">
                            {registro.periodo}
                          </Text>
                        </View>
                      )}
                      {!!registro.nivel && (
                        <Text className="mt-3 font-semibold text-acento">
                          Nivel: {registro.nivel}
                        </Text>
                      )}
                      {!!registro.descripcion && (
                        <Text className="mt-3 leading-6 text-tinta">
                          {registro.descripcion}
                        </Text>
                      )}
                      {!!registro.contacto && (
                        <View className="mt-3 flex-row items-center">
                          <Ionicons name="at-outline" size={18} color="#7628C7" />
                          <Text className="ml-2 flex-1 text-muted">
                            Contacto: {registro.contacto}
                          </Text>
                        </View>
                      )}
                      {!!registro.enlace && (
                        <Pressable
                          onPress={() => abrirEnlace(registro.enlace!)}
                          accessibilityRole="link"
                          className="mt-4 flex-row items-center self-start rounded-full bg-suave px-4 py-3"
                        >
                          <Ionicons name="open-outline" size={18} color="#7628C7" />
                          <Text className="ml-2 font-bold text-acento">
                            Explorar proyecto ↗
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          );
        })}

        <LinearGradient
          colors={["#32156E", "#7628C7"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="mt-3 items-center rounded-[28px] p-5"
        >
          <View className="mb-4 h-12 w-12 items-center justify-center rounded-full bg-white/15">
            <Ionicons name="rocket-outline" size={24} color="#FF9EAE" />
          </View>
          <Text className="text-center text-lg font-bold text-white">
            Cada experiencia construye mi futuro.
          </Text>
          <Text className="mt-3 text-center text-xs font-bold tracking-[2px] text-lavanda">
            TALENTOESFOT · CURRÍCULUM DIGITAL
          </Text>
        </LinearGradient>
      </View>
      </ScrollView>
      )}
    </ImageBackground>
  );
}

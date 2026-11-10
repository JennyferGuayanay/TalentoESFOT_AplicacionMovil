import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { Alert, Image, ImageBackground, Pressable, ScrollView, Text, View } from "react-native";

import { cerrarSesion } from "../servicios/autenticacion";

interface Propiedades {
  nombre: string;
  navegar: (pantalla: "habilidades" | "cambiar" | "editarCV" | "verCV") => void;
}

export default function Inicio({ nombre, navegar }: Propiedades) {
  async function salir() {
    try {
      await cerrarSesion();
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "No se pudo cerrar sesión."
      );
    }
  }

  return (
    <ImageBackground
      source={require("../../assets/portada-cv.png")}
      resizeMode="cover"
      className="flex-1"
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <LinearGradient
          colors={["rgba(42,12,99,0.95)", "rgba(108,40,178,0.85)"]}
          className="px-5 pb-10 pt-14"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white">
                <Text className="text-3xl font-black text-acento">T</Text>
              </View>
              <View className="ml-3">
                <Text className="text-2xl font-black text-white">ESFOT</Text>
                <Text className="text-xs text-white">TalentoESFOT</Text>
              </View>
            </View>

            <Pressable
              onPress={salir}
              accessibilityRole="button"
              accessibilityLabel="Cerrar sesión"
              className="h-11 w-11 items-center justify-center rounded-full bg-white/20"
            >
              <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
            </Pressable>
          </View>

          <View className="mt-7 flex-row items-center">
            <Ionicons name="school-outline" size={31} color="#FFFFFF" />
            <Text className="ml-3 flex-1 text-2xl text-white">
              Bienvenida, <Text className="font-black">{nombre || "Talento"}</Text>
            </Text>
          </View>

          <Text className="ml-11 mt-2 font-semibold text-[#F8C3D7]">
            Tu futuro profesional comienza aquí ✦
          </Text>
        </LinearGradient>

      <View className="-mt-5 px-4">
        <View className="overflow-hidden rounded-[30px] border border-lavanda bg-white">
          <LinearGradient
            colors={["#F6E9FF", "#EAD4FF", "#FDE3F0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-4"
          >
            <Text className="text-center text-3xl font-black text-primario">
              Construye tu currículum
            </Text>
            <Text className="mt-1 text-center text-2xl font-bold italic text-acento">
              con estilo ✦
            </Text>

            <Image
              source={require("../../assets/ilustracion-cv.png")}
              resizeMode="contain"
              className="mt-1 h-44 w-full"
            />

            <Text className="mb-4 mt-1 text-center text-base leading-6 text-tinta">
              Crea una hoja de vida profesional, moderna y lista para destacar.
            </Text>

            <Pressable onPress={() => navegar("editarCV")}>
              <LinearGradient
                colors={["#9D38E0", "#6418AE"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="flex-row items-center justify-center rounded-full py-3"
              >
                <Text className="mr-3 text-base font-black text-white">
                  Crear ahora
                </Text>
                <Ionicons name="arrow-forward" size={21} color="#FFFFFF" />
              </LinearGradient>
            </Pressable>
          </LinearGradient>
        </View>

        <View className="mt-6 flex-row items-center justify-between">
          <Text className="text-2xl font-black text-primario">
            Mi espacio
          </Text>
          <Ionicons name="sparkles-outline" size={25} color="#7628C7" />
        </View>

        <View className="mt-4 flex-row gap-3">
          <View className="flex-1 rounded-3xl border border-lavanda/50 bg-white p-4">
            <View className="mb-3 h-11 w-11 items-center justify-center rounded-2xl bg-suave">
              <Ionicons name="document-text-outline" size={26} color="#7628C7" />
            </View>
            <Text className="text-lg font-black text-primario">
              Crear mi currículum
            </Text>
            <Text className="mb-4 mt-2 flex-1 text-sm text-tinta">
              Diseña tu CV paso a paso con estilo profesional.
            </Text>
            <Pressable onPress={() => navegar("editarCV")}>
              <LinearGradient
                colors={["#9D38E0", "#6418AE"]}
                className="items-center rounded-full py-3"
              >
                <Text className="font-bold text-white">Comenzar →</Text>
              </LinearGradient>
            </Pressable>
          </View>

          <View className="flex-1 rounded-3xl border border-lavanda/50 bg-white p-4">
            <View className="mb-3 h-11 w-11 items-center justify-center rounded-2xl bg-suave">
              <Ionicons name="id-card-outline" size={26} color="#7628C7" />
            </View>
            <Text className="text-lg font-black text-primario">
              Ver mi hoja de vida
            </Text>
            <Text className="mb-4 mt-2 flex-1 text-sm text-tinta">
              Visualiza tu currículum digital y tu trayectoria.
            </Text>
            <Pressable onPress={() => navegar("verCV")}>
              <LinearGradient
                colors={["#9D38E0", "#6418AE"]}
                className="items-center rounded-full py-3"
              >
                <Text className="font-bold text-white">Ver ahora →</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>

        <View className="mt-4 flex-row gap-3">
          <View className="flex-1 rounded-3xl border border-lavanda/50 bg-white p-4">
            <View className="mb-3 h-11 w-11 items-center justify-center rounded-2xl bg-suave">
              <Ionicons name="ribbon-outline" size={26} color="#7628C7" />
            </View>
            <Text className="text-lg font-black text-primario">
              Mis habilidades
            </Text>
            <Text className="mb-4 mt-2 flex-1 text-sm text-tinta">
              Registra y gestiona tus conocimientos.
            </Text>
            <Pressable onPress={() => navegar("habilidades")}>
              <LinearGradient
                colors={["#9D38E0", "#6418AE"]}
                className="items-center rounded-full py-3"
              >
                <Text className="font-bold text-white">Gestionar →</Text>
              </LinearGradient>
            </Pressable>
          </View>

          <View className="flex-1 rounded-3xl border border-lavanda/50 bg-white p-4">
            <View className="mb-3 h-11 w-11 items-center justify-center rounded-2xl bg-suave">
              <Ionicons name="shield-checkmark-outline" size={26} color="#7628C7" />
            </View>
            <Text className="text-lg font-black text-primario">
              Seguridad
            </Text>
            <Text className="mb-4 mt-2 flex-1 text-sm text-tinta">
              Protege tu cuenta y cambia tu contraseña.
            </Text>
            <Pressable onPress={() => navegar("cambiar")}>
              <LinearGradient
                colors={["#9D38E0", "#6418AE"]}
                className="items-center rounded-full py-3"
              >
                <Text className="font-bold text-white">Configurar →</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>

        <View className="mt-4 items-center rounded-3xl bg-white p-4">
          <View className="h-40 w-40 items-center justify-center">
            <Ionicons name="rocket-outline" size={58} color="#CBA7FA" />
            <LottieView
              source={require("../animaciones/bienvenida.json")}
              autoPlay
              loop
              speed={0.5}
              resizeMode="contain"
              style={{ position: "absolute", width: 170, height: 170 }}
            />
          </View>
          <Text className="text-center text-lg font-black text-primario">
            ¡Tu talento merece destacar!
          </Text>
          <Text className="mt-2 text-center text-sm text-tinta">
            Cada habilidad y experiencia cuenta tu historia.
          </Text>
        </View>

        <Text className="mt-6 text-center text-xs font-semibold tracking-widest text-acento">
          TALENTOESFOT · TU FUTURO PROFESIONAL
        </Text>
      </View>
      </ScrollView>
    </ImageBackground>
  );
}

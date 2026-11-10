import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  View
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";

import CampoFormulario from "../componentes/CampoFormulario";
import { iniciarSesion, iniciarConGoogle } from "../servicios/autenticacion";

interface Propiedades {
  navegar: (pantalla: "registro" | "recuperar") => void;
}

export default function InicioSesion({ navegar }: Propiedades) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [cargando, setCargando] = useState(false);

  async function ingresar() {
    if (!correo.trim() || !contrasena) {
      return Alert.alert("Atención", "Completa todos los campos.");
    }

    setCargando(true);
    try {
      await iniciarSesion(correo, contrasena);
    } catch (error) {
      Alert.alert(
        "No se pudo ingresar",
        error instanceof Error ? error.message : "Ocurrió un error."
      );
    } finally {
      setCargando(false);
    }
  }

  async function ingresarGoogle() {
    setCargando(true);
    try {
      await iniciarConGoogle();
    } catch (error) {
      Alert.alert(
        "Google",
        error instanceof Error ? error.message : "No se pudo iniciar sesión."
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-fondo"
      behavior="padding"
    >
      <ImageBackground
        source={require("../../assets/portada-cv.png")}
        resizeMode="cover"
        className="flex-1"
      >
        <LinearGradient
          colors={["rgba(50,21,110,0.88)", "rgba(118,40,199,0.62)"]}
          className="absolute inset-0"
        />
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
        >
          <View className="px-5 pb-4 pt-8">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="h-11 w-11 items-center justify-center rounded-2xl bg-white">
                  <Text className="text-2xl font-black text-acento">T</Text>
                </View>
                <View className="ml-3">
                  <Text className="text-xl font-black text-white">ESFOT</Text>
                  <Text className="text-xs text-white/80">TalentoESFOT</Text>
                </View>
              </View>
              <View className="rounded-full bg-white/15 px-3 py-2">
                <Ionicons name="sparkles" size={18} color="#FFFFFF" />
              </View>
            </View>

            <View className="mt-3 items-center">
              <Text className="text-center text-[30px] font-black text-white">
                Bienvenida de nuevo
              </Text>
              <Text className="mt-2 max-w-80 text-center text-sm leading-5 text-white/85">
                Inicia sesión para continuar construyendo tu futuro profesional.
              </Text>
            </View>

            <View className="mt-2 flex-row items-center justify-center">
              <Image
                source={require("../../assets/ilustracion-cv.png")}
                resizeMode="contain"
                className="h-44 flex-1"
              />
              <View className="h-40 w-40 items-center justify-center">
                <Ionicons name="sparkles-outline" size={56} color="#CBA7FA" />
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
          </View>

          <View
            className="mx-4 flex-1 rounded-[30px] bg-white p-5"
            style={{
              shadowColor: "#32156E",
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.12,
              shadowRadius: 24,
              elevation: 6
            }}
          >
          <View className="mb-4 flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-black text-primario">Iniciar sesión</Text>
              <Text className="mt-1 text-sm text-muted">Accede a tu espacio profesional</Text>
            </View>
            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-fondo">
              <Ionicons name="person-outline" size={22} color="#7628C7" />
            </View>
          </View>

          <CampoFormulario
            etiqueta="Correo electrónico"
            placeholder="correo@ejemplo.com"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <CampoFormulario
            etiqueta="Contraseña"
            placeholder="Ingresa tu contraseña"
            value={contrasena}
            onChangeText={setContrasena}
            autoComplete="current-password"
            esContrasena
          />

          <Pressable
            onPress={() => navegar("recuperar")}
            className="mb-4 self-end"
          >
            <Text className="font-bold text-acento">
              ¿Olvidaste tu contraseña?
            </Text>
          </Pressable>

          <Pressable disabled={cargando} onPress={ingresar}>
            <LinearGradient
              colors={["#7628C7", "#32156E"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="flex-row items-center justify-center rounded-[20px] px-6 py-4.5"
            >
              {cargando ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text className="mr-3 text-lg font-black text-white">
                    Ingresar
                  </Text>
                  <Ionicons name="arrow-forward" size={22} color="#FFFFFF" />
                </>
              )}
            </LinearGradient>
          </Pressable>

          <View className="my-4 flex-row items-center">
            <View className="h-px flex-1 bg-lavanda" />
            <Text className="mx-4 text-sm text-gray-500">
              o continúa con
            </Text>
            <View className="h-px flex-1 bg-lavanda" />
          </View>

          <Pressable
            disabled={cargando}
            onPress={ingresarGoogle}
            className="flex-row items-center justify-center rounded-[20px] border border-lavanda bg-fondo/40 px-6 py-4.5"
          >
            <Ionicons name="logo-google" size={23} color="#7628C7" />
            <Text className="ml-3 text-base font-bold text-primario">
              Continuar con Google
            </Text>
          </Pressable>

          <Pressable
            onPress={() => navegar("registro")}
            className="mt-4 py-2"
          >
            <Text className="text-center text-base text-tinta">
              ¿No tienes cuenta?{" "}
              <Text className="font-black text-acento">
                Crear cuenta
              </Text>
            </Text>
          </Pressable>
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

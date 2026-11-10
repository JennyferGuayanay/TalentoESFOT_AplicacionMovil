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
import { registrarUsuario } from "../servicios/autenticacion";

interface Propiedades {
  volver: () => void;
}

export default function Registro({ volver }: Propiedades) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [cargando, setCargando] = useState(false);

  async function registrar() {
    if (!nombre.trim() || !correo.trim() || !contrasena || !confirmacion) {
      return Alert.alert("Atención", "Completa todos los campos.");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
      return Alert.alert("Correo inválido", "Ingresa un correo válido.");
    }
    if (contrasena.length < 8 || !/[A-Z]/.test(contrasena) ||
        !/[a-z]/.test(contrasena) || !/[0-9]/.test(contrasena)) {
      return Alert.alert(
        "Contraseña insegura",
        "Usa 8 caracteres como mínimo, con mayúsculas, minúsculas y números."
      );
    }
    if (contrasena !== confirmacion) {
      return Alert.alert("Error", "Las contraseñas no coinciden.");
    }

    setCargando(true);
    try {
      const resultado = await registrarUsuario(nombre, correo, contrasena);
      Alert.alert(
        "Registro realizado",
        resultado.session ? "Tu cuenta está lista." : "Revisa tu correo para confirmar la cuenta.",
        [{ text: "Aceptar", onPress: volver }]
      );
    } catch (error) {
      Alert.alert(
        "Registro",
        error instanceof Error ? error.message : "No se pudo registrar."
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <KeyboardAvoidingView className="flex-1 bg-fondo" behavior="padding">
      <ImageBackground
        source={require("../../assets/portada-cv.png")}
        resizeMode="cover"
        className="flex-1"
      >
        <LinearGradient
          colors={["rgba(50,21,110,0.9)", "rgba(118,40,199,0.64)"]}
          className="absolute inset-0"
        />
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
        >
          <View className="px-5 pb-4 pt-8">
            <Pressable onPress={volver} className="flex-row items-center self-start py-2">
              <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
              <Text className="ml-2 font-bold text-white">Volver</Text>
            </Pressable>

            <View className="mt-2 items-center">
              <Text className="text-center text-3xl font-black text-white">
                Tu historia comienza aquí
              </Text>
              <Text className="mt-2 max-w-80 text-center text-sm leading-5 text-white/85">
                Crea tu cuenta y convierte tu experiencia en oportunidades.
              </Text>
            </View>

            <View className="mt-2 flex-row items-center justify-center">
              <Image
                source={require("../../assets/ilustracion-cv.png")}
                resizeMode="contain"
                className="h-44 flex-1"
              />
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
          </View>

          <View
            className="mx-4 rounded-[30px] bg-white p-5"
            style={{
              shadowColor: "#32156E",
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.12,
              shadowRadius: 24,
              elevation: 6
            }}
          >
          <View className="mb-4 flex-row items-center">
            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-fondo">
              <Ionicons name="person-add-outline" size={22} color="#7628C7" />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-2xl font-black text-primario">Crea tu perfil</Text>
              <Text className="mt-1 text-sm text-muted">Completa tus datos para comenzar</Text>
            </View>
          </View>

          <CampoFormulario
            etiqueta="Nombre completo"
            value={nombre}
            onChangeText={setNombre}
            placeholder="Tu nombre"
          />
          <CampoFormulario
            etiqueta="Correo electrónico"
            value={correo}
            onChangeText={setCorreo}
            placeholder="correo@ejemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <CampoFormulario
            etiqueta="Contraseña"
            value={contrasena}
            onChangeText={setContrasena}
            placeholder="Contraseña segura"
            esContrasena
          />
          <CampoFormulario
            etiqueta="Confirmar contraseña"
            value={confirmacion}
            onChangeText={setConfirmacion}
            placeholder="Repite la contraseña"
            esContrasena
          />

          <View className="mb-2 flex-row items-center rounded-2xl bg-fondo px-4 py-3">
            <Ionicons name="shield-checkmark-outline" size={20} color="#7628C7" />
            <Text className="ml-3 flex-1 text-xs leading-5 text-tinta">
              Usa al menos 8 caracteres, mayúsculas, minúsculas y números.
            </Text>
          </View>

          <Pressable disabled={cargando} onPress={registrar} className="mt-4">
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
                  <Text className="mr-3 text-base font-black text-white">
                    Crear mi cuenta
                  </Text>
                  <Ionicons name="arrow-forward" size={21} color="#FFFFFF" />
                </>
              )}
            </LinearGradient>
          </Pressable>

          <Pressable onPress={volver} className="mt-4 py-2">
            <Text className="text-center text-base text-tinta">
              ¿Ya tienes cuenta?{" "}
              <Text className="font-black text-acento">Iniciar sesión</Text>
            </Text>
          </Pressable>
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

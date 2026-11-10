import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  View
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import CampoFormulario from "../componentes/CampoFormulario";
import { recuperarContrasena } from "../servicios/autenticacion";

export default function RecuperarContrasena({ volver }: { volver: () => void }) {
  const [correo, setCorreo] = useState("");
  const [cargando, setCargando] = useState(false);

  async function enviar() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
      return Alert.alert("Atención", "Ingresa un correo válido.");
    }

    setCargando(true);
    try {
      await recuperarContrasena(correo);
      Alert.alert(
        "Solicitud recibida",
        "Si existe una cuenta con ese correo, recibirás instrucciones para recuperar tu contraseña.",
        [{ text: "Aceptar", onPress: volver }]
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "No se pudo realizar la solicitud."
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

            <View className="items-center pt-2">
              <View className="h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                <Ionicons name="mail-open-outline" size={28} color="#FFFFFF" />
              </View>
              <Text className="mt-3 text-center text-3xl font-black text-white">
                Recupera tu acceso
              </Text>
              <Text className="mt-2 max-w-80 text-center text-sm leading-5 text-white/85">
                Te ayudaremos a volver a tu cuenta de forma segura.
              </Text>
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
          <Text className="text-2xl font-black text-primario">Restablece tu contraseña</Text>
          <Text className="mb-4 mt-2 text-sm leading-5 text-muted">
            Ingresa tu correo y te enviaremos un enlace para establecer una nueva contraseña.
          </Text>

          <CampoFormulario
            etiqueta="Correo electrónico"
            placeholder="correo@ejemplo.com"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Pressable disabled={cargando} onPress={enviar} className="mt-2">
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
                  <Text className="mr-3 text-base font-black text-white">Enviar enlace</Text>
                  <Ionicons name="send" size={20} color="#FFFFFF" />
                </>
              )}
            </LinearGradient>
          </Pressable>

          <View className="mt-4 items-center">
            <Ionicons name="checkmark-circle-outline" size={28} color="#CBA7FA" />
          </View>

          <View className="mt-4 flex-row items-start rounded-2xl bg-fondo px-4 py-3">
            <Ionicons name="information-circle-outline" size={20} color="#7628C7" />
            <Text className="ml-3 flex-1 text-xs leading-5 text-tinta">
              Revisa también las carpetas de correo no deseado y promociones.
            </Text>
          </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

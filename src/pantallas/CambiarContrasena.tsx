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
import { cambiarContrasena } from "../servicios/autenticacion";

export default function CambiarContrasena({ volver }: { volver: () => void }) {
  const [contrasena, setContrasena] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [cargando, setCargando] = useState(false);

  async function guardar() {
    if (contrasena.length < 8 || !/[A-Z]/.test(contrasena) ||
        !/[a-z]/.test(contrasena) || !/[0-9]/.test(contrasena)) {
      return Alert.alert(
        "Contraseña insegura",
        "Utiliza al menos 8 caracteres, mayúsculas, minúsculas y números."
      );
    }

    if (contrasena !== confirmacion) {
      return Alert.alert("Atención", "Las contraseñas no coinciden.");
    }

    setCargando(true);
    try {
      await cambiarContrasena(contrasena);
      Alert.alert("Actualizada", "Tu contraseña se cambió correctamente.", [
        { text: "Aceptar", onPress: volver }
      ]);
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "No se pudo actualizar."
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
              <View className="h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-white/15">
                <Ionicons name="lock-closed" size={28} color="#FFFFFF" />
              </View>
              <Text className="mt-3 text-center text-3xl font-black text-white">
                Protege tu cuenta
              </Text>
              <Text className="mt-2 max-w-80 text-center text-sm leading-5 text-white/85">
                Crea una clave sólida que solo tú puedas reconocer.
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
          <View className="mb-4 flex-row items-center">
            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-fondo">
              <Ionicons name="shield-checkmark-outline" size={23} color="#7628C7" />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-2xl font-black text-primario">Nueva contraseña</Text>
              <Text className="mt-1 text-sm text-muted">Actualiza tus credenciales de acceso</Text>
            </View>
          </View>

          <CampoFormulario
            etiqueta="Nueva contraseña"
            placeholder="Nueva contraseña"
            value={contrasena}
            onChangeText={setContrasena}
            esContrasena
          />
          <CampoFormulario
            etiqueta="Confirmar contraseña"
            placeholder="Repite tu contraseña"
            value={confirmacion}
            onChangeText={setConfirmacion}
            esContrasena
          />

          <View className="rounded-3xl border border-lavanda/50 bg-fondo/70 p-4">
            <View className="mb-2 flex-row items-center">
              <Ionicons name="key-outline" size={20} color="#7628C7" />
              <Text className="ml-2 font-bold text-primario">Una contraseña segura incluye</Text>
            </View>
            <View className="flex-row items-center py-1">
              <Ionicons name="checkmark-circle" size={17} color="#7628C7" />
              <Text className="ml-2 text-sm text-tinta">8 caracteres como mínimo</Text>
            </View>
            <View className="flex-row items-center py-1">
              <Ionicons name="checkmark-circle" size={17} color="#7628C7" />
              <Text className="ml-2 text-sm text-tinta">Mayúsculas y minúsculas</Text>
            </View>
            <View className="flex-row items-center py-1">
              <Ionicons name="checkmark-circle" size={17} color="#7628C7" />
              <Text className="ml-2 text-sm text-tinta">Al menos un número</Text>
            </View>
          </View>

          <Pressable disabled={cargando} onPress={guardar} className="mt-4">
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
                    Guardar contraseña
                  </Text>
                  <Ionicons name="lock-closed-outline" size={20} color="#FFFFFF" />
                </>
              )}
            </LinearGradient>
          </Pressable>

          <View className="mt-4 flex-row items-center justify-center">
            <Ionicons name="shield-outline" size={16} color="#756A91" />
            <Text className="ml-2 text-xs text-muted">Tus datos están protegidos</Text>
          </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

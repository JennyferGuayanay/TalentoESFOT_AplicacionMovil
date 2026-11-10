import { useState } from "react";
import { Pressable, Text, TextInput, View, type TextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Propiedades extends TextInputProps {
  etiqueta: string;
  esContrasena?: boolean;
}

export default function CampoFormulario({
  etiqueta,
  esContrasena = false,
  multiline = false,
  className,
  ...propiedades
}: Propiedades) {
  const [mostrar, setMostrar] = useState(false);

  function obtenerIcono(): keyof typeof Ionicons.glyphMap {
    const texto = etiqueta.toLowerCase();

    if (esContrasena) return "lock-closed-outline";
    if (texto.includes("correo")) return "mail-outline";
    if (texto.includes("teléfono")) return "call-outline";
    if (texto.includes("ciudad")) return "location-outline";
    if (texto.includes("profesión")) return "briefcase-outline";
    if (texto.includes("nombre") || texto.includes("apellido")) return "person-outline";
    if (texto.includes("descripción") || texto.includes("sobre")) {
      return "document-text-outline";
    }
    if (texto.includes("institución")) return "school-outline";
    if (texto.includes("período") || texto.includes("año")) {
      return "calendar-outline";
    }
    if (texto.includes("enlace")) return "link-outline";

    return "create-outline";
  }

  return (
    <View className="mb-4">
      <Text className="mb-2 ml-1 text-sm font-bold text-tinta">{etiqueta}</Text>

      <View
        className={`flex-row rounded-[22px] border border-lavanda/70 bg-white px-4 ${
          multiline ? "items-start py-4" : "items-center"
        }`}
        style={{
          shadowColor: "#32156E",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.06,
          shadowRadius: 14,
          elevation: 2
        }}
      >
        <Ionicons
          name={obtenerIcono()}
          size={21}
          color="#7628C7"
          style={multiline ? { marginTop: 2 } : undefined}
        />

        <TextInput
          {...propiedades}
          multiline={multiline}
          className={`ml-3 flex-1 text-base text-tinta ${
            multiline ? "min-h-28" : "h-14"
          } ${className || ""}`}
          placeholderTextColor="#9182AD"
          secureTextEntry={esContrasena && !mostrar}
        />

        {esContrasena && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={mostrar ? "Ocultar contraseña" : "Mostrar contraseña"}
            hitSlop={10}
            onPress={() => setMostrar(!mostrar)}
          >
            <Ionicons
              name={mostrar ? "eye-off-outline" : "eye-outline"}
              size={23}
              color="#7628C7"
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}

import { useState, type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Propiedades {
  titulo: string;
  cantidad?: number;
  children: ReactNode;
}

export default function SeccionCurriculum({ titulo, cantidad, children }: Propiedades) {
  const [abierta, setAbierta] = useState(false);

  function obtenerIcono(): keyof typeof Ionicons.glyphMap {
    const texto = titulo.toLowerCase();
    if (texto.includes("personal")) return "person-outline";
    if (texto.includes("formación")) return "school-outline";
    if (texto.includes("idioma")) return "language-outline";
    if (texto.includes("curso")) return "ribbon-outline";
    if (texto.includes("proyecto")) return "code-slash-outline";
    if (texto.includes("práctica")) return "briefcase-outline";
    if (texto.includes("experiencia")) return "business-outline";
    return "people-outline";
  }

  return (
    <View
      className="mb-4 overflow-hidden rounded-[28px] border border-white bg-white"
      style={{
        shadowColor: "#32156E",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 18,
        elevation: 3
      }}
    >
      <Pressable
        onPress={() => setAbierta(!abierta)}
        accessibilityRole="button"
        accessibilityState={{ expanded: abierta }}
        className="flex-row items-center p-5"
      >
        <View className="mr-4 h-12 w-12 items-center justify-center rounded-2xl bg-suave">
          <Ionicons name={obtenerIcono()} size={23} color="#7628C7" />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-bold text-primario">
            {titulo}
          </Text>
          {cantidad !== undefined && (
            <Text className="mt-1 text-sm text-muted">
              {cantidad} {cantidad === 1 ? "registro" : "registros"}
            </Text>
          )}
        </View>

        <View className="ml-3 h-9 w-9 items-center justify-center rounded-full bg-niebla">
          <Ionicons
            name={abierta ? "chevron-up" : "chevron-down"}
            size={20}
            color="#7628C7"
          />
        </View>
      </Pressable>

      {abierta && (
        <View className="border-t border-suave px-5 pb-5 pt-5">
          {children}
        </View>
      )}
    </View>
  );
}

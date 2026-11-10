import "./global.css";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Linking, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { ProveedorAutenticacion, usarAutenticacion } from "./src/contextos/ContextoAutenticacion";
import { procesarRetorno } from "./src/servicios/autenticacion";
import InicioSesion from "./src/pantallas/InicioSesion";
import Registro from "./src/pantallas/Registro";
import RecuperarContrasena from "./src/pantallas/RecuperarContrasena";
import CambiarContrasena from "./src/pantallas/CambiarContrasena";
import Habilidades from "./src/pantallas/Habilidades";
import EditarCurriculum from "./src/pantallas/EditarCurriculum";
import MiCurriculum from "./src/pantallas/MiCurriculum";
import Inicio from "./src/pantallas/Inicio";

type Pantalla =
  | "login"
  | "registro"
  | "recuperar"
  | "inicio"
  | "habilidades"
  | "cambiar"
  | "editarCV"
  | "verCV";

function Contenido() {
  const { sesion, cargando } = usarAutenticacion();
  const [pantalla, setPantalla] = useState<Pantalla>("login");
  const [recuperacion, setRecuperacion] = useState(false);

  useEffect(() => {
    async function manejarEnlace(url: string) {
      try {
        const esRecuperacion = await procesarRetorno(url);

        if (esRecuperacion || url.includes("accion=recuperar")) {
          setRecuperacion(true);
          setPantalla("cambiar");
        }
      } catch (error) {
        Alert.alert(
          "Autenticación",
          error instanceof Error ? error.message : "No se pudo procesar el enlace."
        );
      }
    }

    const suscripcion = Linking.addEventListener("url", evento => {
      void manejarEnlace(evento.url);
    });

    Linking.getInitialURL().then(url => {
      if (url) void manejarEnlace(url);
    });

    return () => suscripcion.remove();
  }, []);

  useEffect(() => {
    if (!sesion) {
      setRecuperacion(false);
      setPantalla("login");
    }
  }, [sesion]);

  if (cargando) {
    return (
      <View className="flex-1 items-center justify-center bg-fondo">
        <ActivityIndicator size="large" color="#7628C7" />
      </View>
    );
  }

  if (sesion) {
    if (pantalla === "cambiar" || recuperacion) {
      return (
        <CambiarContrasena
          volver={() => {
            setRecuperacion(false);
            setPantalla("inicio");
          }}
        />
      );
    }

    if (pantalla === "habilidades") {
      return <Habilidades volver={() => setPantalla("inicio")} />;
    }

    if (pantalla === "editarCV") {
      return (
        <EditarCurriculum
          volver={() => setPantalla("inicio")}
          irHabilidades={() => setPantalla("habilidades")}
          verCurriculum={() => setPantalla("verCV")}
        />
      );
    }

    if (pantalla === "verCV") {
      return (
        <MiCurriculum
          volver={() => setPantalla("inicio")}
          editar={() => setPantalla("editarCV")}
        />
      );
    }

    return (
      <Inicio
        nombre={sesion.user.user_metadata?.nombre ||
          sesion.user.email?.split("@")[0] || "Talento"}
        navegar={setPantalla}
      />
    );
  }

  if (pantalla === "registro") {
    return <Registro volver={() => setPantalla("login")} />;
  }

  if (pantalla === "recuperar") {
    return <RecuperarContrasena volver={() => setPantalla("login")} />;
  }

  return <InicioSesion navegar={setPantalla} />;
}

export default function App() {
  return (
    <ProveedorAutenticacion>
      <StatusBar style="light" />
      <Contenido />
    </ProveedorAutenticacion>
  );
}

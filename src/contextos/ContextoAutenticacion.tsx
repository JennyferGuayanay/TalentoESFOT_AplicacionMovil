import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../servicios/supabase";

interface DatosAutenticacion {
  sesion: Session | null;
  cargando: boolean;
}

const Contexto = createContext<DatosAutenticacion>({ sesion: null, cargando: true });

export function ProveedorAutenticacion({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<Session | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    supabase.auth.getSession().then(({ data }) => {
      if (activo) {
        setSesion(data.session);
        setCargando(false);
      }
    }).catch(() => { if (activo) setCargando(false); });
    const { data: escucha } = supabase.auth.onAuthStateChange((_evento, nuevaSesion) => {
      if (activo) {
        setSesion(nuevaSesion);
        setCargando(false);
      }
    });
    return () => {
      activo = false;
      escucha.subscription.unsubscribe();
    };
  }, []);

  return <Contexto.Provider value={{ sesion, cargando }}>{children}</Contexto.Provider>;
}

export function usarAutenticacion() {
  return useContext(Contexto);
}
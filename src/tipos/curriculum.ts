
export type TipoDetalle =
  | "formacion"
  | "idioma"
  | "curso"
  | "proyecto"
  | "practica"
  | "experiencia"
  | "referencia";

export interface PerfilCV {
  usuario_id: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string | null;
  ciudad: string | null;
  profesion: string | null;
  descripcion: string | null;
  foto_ruta: string | null;
  fecha_actualizacion: string;
}

export interface DetalleCV {
  id: string;
  usuario_id: string;
  tipo: TipoDetalle;
  titulo: string;
  subtitulo: string | null;
  descripcion: string | null;
  periodo: string | null;
  nivel: string | null;
  enlace: string | null;
  contacto: string | null;
  fecha_creacion: string;
}

export type DatosPerfil = Omit<
  PerfilCV,
  "usuario_id" | "fecha_actualizacion"
>;

export type DatosDetalle = Omit<
  DetalleCV,
  "id" | "usuario_id" | "fecha_creacion"
>;

export const seccionesCV: { tipo: TipoDetalle; nombre: string }[] = [
  { tipo: "formacion", nombre: "Formación académica" },
  { tipo: "idioma", nombre: "Idiomas" },
  { tipo: "curso", nombre: "Cursos y certificaciones" },
  { tipo: "proyecto", nombre: "Proyectos" },
  { tipo: "practica", nombre: "Prácticas" },
  { tipo: "experiencia", nombre: "Experiencia laboral" },
  { tipo: "referencia", nombre: "Referencias" }
];

export type Categoria = "Tecnica" | "Blanda" | "Idioma" | "Herramienta";
export type Nivel = "Basico" | "Intermedio" | "Avanzado";

export interface Habilidad {
  id: string;
  usuario_id: string;
  nombre: string;
  categoria: Categoria;
  nivel: Nivel;
  descripcion: string;
  fecha_creacion: string;
}
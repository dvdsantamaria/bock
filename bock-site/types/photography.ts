export interface PhotographyBlock {
  id: number; // ✅ obligatorio — usado como key
  title: string; // ✅ obligatorio — mostrado como <h1>
  subtitle?: string; // ✅ opcional — mostrado en <p> si existe
  body: string | { type: string; children: { text: string }[] }[];
  // ✅ correcto — contemplás contenido raw o rich text
  slug: string; // ✅ obligatorio — usado en la URL
  imageThumb?: string; // ✅ opcional — mostrado en thumbnails
  imageFull?: string; // ✅ opcional — mostrado como imagen principal
  category: string; // ✅ obligatorio — slug de categoría, usado para navegación
}

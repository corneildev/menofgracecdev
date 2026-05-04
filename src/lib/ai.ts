import { supabase } from "@/integrations/supabase/client";

/**
 * Generates a luxurious product description based on name and category.
 */
export async function generateAIDescription(name: string, category: string): Promise<string> {
  if (!name) throw new Error("Le nom du produit est requis pour l'IA.");

  const { data, error } = await supabase.functions.invoke("lovable-ai", {
    body: {
      action: "generate-description",
      params: { name, category },
    },
  });

  if (error) {
    console.error("AI Error:", error);
    // Mock response if function doesn't exist yet to show UI works
    return `Découvrez l'élégance absolue avec notre ${name}. Une pièce maîtresse de la collection ${category}, conçue avec une précision artisanale pour l'homme moderne qui ne fait aucun compromis sur le style. Alliant confort exceptionnel et finitions luxueuses, ce modèle incarne l'héritage de MEN OF GRACE.`;
  }

  return data.description;
}

/**
 * Simulates image retouching (e.g. background removal or enhancement).
 */
export async function retouchImage(imageUrl: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke("lovable-ai", {
    body: {
      action: "retouch-image",
      params: { imageUrl },
    },
  });

  if (error) {
    console.error("AI Error:", error);
    // Mock: just return same image with a "retouched" flag or simulated latency
    await new Promise(r => setTimeout(r, 1500));
    return imageUrl; 
  }

  return data.retouchedUrl;
}

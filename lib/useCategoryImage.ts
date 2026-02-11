import { Category } from "../types";

/**
 * Curated Unsplash image URLs per category.
 * Direct links to images.unsplash.com – no API key needed, no redirects.
 */
const CATEGORY_IMAGES: Record<string, string[]> = {
  Restauracje: [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=300&fit=crop&crop=center",
  ],
  Atrakcje: [
    "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=800&h=300&fit=crop&crop=center",
  ],
  Transport: [
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=800&h=300&fit=crop&crop=center",
  ],
  Nocleg: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=300&fit=crop&crop=center",
  ],
  Zakupy: [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=300&fit=crop&crop=center",
  ],
  Inne: [
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=300&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&h=300&fit=crop&crop=center",
  ],
};

/**
 * Returns a direct Unsplash image URL for a given expense category.
 * Picks a deterministic image based on a simple hash to keep it consistent per render.
 */
export function getCategoryImageUrl(category: Category, seed?: string): string {
  const images = CATEGORY_IMAGES[category] || CATEGORY_IMAGES["Inne"];
  // Use a simple hash from the seed (expense id) for consistency, or random
  const index = seed
    ? Math.abs(seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)) %
      images.length
    : Math.floor(Math.random() * images.length);
  return images[index];
}

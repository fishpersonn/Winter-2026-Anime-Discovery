import { JikanResponse, Anime, Pagination } from '../types';

const BASE_URL = 'https://api.jikan.moe/v4';

// Simple delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchWinter2026AnimePage = async (page: number = 1): Promise<{ data: Anime[], pagination: Pagination }> => {
  try {
    // Add a small artificial delay to prevent rate limiting when user clicks quickly, 
    // and to make the skeleton loading feel purposeful (UX).
    await delay(300);

    const response = await fetch(`${BASE_URL}/seasons/2026/winter?page=${page}`);
    
    if (!response.ok) {
      if (response.status === 429) {
         throw new Error("Rate limit exceeded. Please wait a moment.");
      }
      throw new Error(`Jikan API Error: ${response.statusText}`);
    }

    const data: JikanResponse = await response.json();
    return {
      data: data.data,
      pagination: data.pagination
    };
  } catch (error) {
    console.error("Failed to fetch anime:", error);
    throw error;
  }
};

// Keep the original function name for compatibility if needed, but redirect to page logic
// Or purely replace it. Let's export the old name but implement single page fetch for the first load to be safe.
export const fetchWinter2026Anime = async (): Promise<Anime[]> => {
  const { data } = await fetchWinter2026AnimePage(1);
  return data;
};
export interface JikanImage {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

export interface JikanImages {
  jpg: JikanImage;
  webp: JikanImage;
}

export interface JikanTrailer {
  youtube_id: string | null;
  url: string | null;
  embed_url: string | null;
}

export interface JikanGenre {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Anime {
  mal_id: number;
  url: string;
  images: JikanImages;
  trailer: JikanTrailer;
  approved: boolean;
  titles: { type: string; title: string }[];
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  type: string;
  source: string;
  episodes: number | null;
  status: string;
  airing: boolean;
  duration: string;
  rating: string;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string | null;
  background: string | null;
  season: string | null;
  year: number | null;
  genres: JikanGenre[];
  explicit_genres: JikanGenre[];
  themes: JikanGenre[];
  demographics: JikanGenre[];
}

export interface Pagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
}

export interface JikanResponse {
  data: Anime[];
  pagination: Pagination;
}

export type FilterType = 'source' | 'genre';
export type SortOption = 'default' | 'score' | 'popularity' | 'members';

export interface FilterState {
  source: string | null;
  genre: number | null; // using mal_id
  search: string;
  favoritesOnly: boolean;
}

export interface Translations {
  season: string;
  subtitle: string;
  searchPlaceholder: string;
  foundTitles: string;
  scanning: string;
  noResults: string;
  clearFilters: string;
  retry: string;
  error: string;
  filters: string;
  refineBy: string;
  clearAll: string;
  showAll: string;
  source: string;
  genres: string;
  score: string;
  members: string;
  favs: string;
  synopsis: string;
  noSynopsis: string;
  trailer: string;
  noTrailer: string;
  watchTrailer: string;
  viewMal: string;
  unknownGenre: string;
  loadMore: string;
  loadingMore: string;
  noMoreResults: string;
  myFavorites: string;
  sortBy: string;
  sortDefault: string;
  sortScore: string;
  sortPopularity: string;
  sortMembers: string;
}
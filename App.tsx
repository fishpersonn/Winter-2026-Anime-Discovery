import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchWinter2026AnimePage } from './services/jikanService';
import { Anime, FilterState, SortOption } from './types';
import AnimeCard from './components/AnimeCard';
import AnimeCardSkeleton from './components/AnimeCardSkeleton';
import FilterSidebar from './components/FilterSidebar';
import AnimeModal from './components/AnimeModal';
import Toast from './components/Toast';
import { dictionaries } from './utils/translations';
import { Search, Menu, Snowflake, Globe, RefreshCcw, WifiOff, ArrowUp, ChevronDown, Loader2, ListFilter } from 'lucide-react';

const App: React.FC = () => {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  // Language State
  const [language, setLanguage] = useState<'en' | 'zh'>('en');
  const t = dictionaries[language];

  // Filters & Sort State
  const [filters, setFilters] = useState<FilterState>({
    source: null,
    genre: null,
    search: '',
    favoritesOnly: false,
  });
  const [sortOption, setSortOption] = useState<SortOption>('default');

  // Favorites State (Persisted)
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Load Favorites from LocalStorage on mount
  useEffect(() => {
    const storedFavs = localStorage.getItem('favorites');
    if (storedFavs) {
      try {
        setFavorites(new Set(JSON.parse(storedFavs)));
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }
  }, []);

  // Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFavorite = (id: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)));
  };

  // Fetch Logic
  const fetchAnime = useCallback(async (pageNum: number, isReset: boolean = false) => {
    try {
      if (isReset) {
        setIsInitialLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      const { data, pagination } = await fetchWinter2026AnimePage(pageNum);
      
      setAnimeList(prev => isReset ? data : [...prev, ...data]);
      setHasNextPage(pagination.has_next_page);
      setPage(pageNum);

    } catch (err) {
      console.error(err);
      setError(t.error); 
    } finally {
      setIsInitialLoading(false);
      setIsLoadingMore(false);
    }
  }, [t.error]);

  // Initial Load
  useEffect(() => {
    fetchAnime(1, true);
  }, []); 

  const handleLoadMore = () => {
    if (!isLoadingMore && hasNextPage) {
      fetchAnime(page + 1);
    }
  };

  // Filter & Sort Logic
  const filteredAndSortedAnime = useMemo(() => {
    let result = animeList.filter(anime => {
      // 1. Source Filter
      if (filters.source && anime.source !== filters.source) return false;
      
      // 2. Genre Filter
      if (filters.genre && !anime.genres.some(g => g.mal_id === filters.genre)) return false;
      
      // 3. Search Filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const titleMatch = (anime.title_english?.toLowerCase().includes(searchLower)) || 
                           (anime.title.toLowerCase().includes(searchLower));
        if (!titleMatch) return false;
      }
      
      // 4. Favorites Filter
      if (filters.favoritesOnly && !favorites.has(anime.mal_id)) return false;

      return true;
    });

    // 5. Sorting
    if (sortOption !== 'default') {
      result = [...result].sort((a, b) => {
        if (sortOption === 'score') {
          return (b.score || 0) - (a.score || 0);
        } else if (sortOption === 'popularity') {
          // Note: Jikan 'popularity' is rank (lower is better), but usually users expect "Most Popular" 
          // to mean higher numbers of members. Jikan also gives 'members'.
          // Let's use members count for popularity sorting as it's more intuitive visually.
          return (b.members || 0) - (a.members || 0);
        } else if (sortOption === 'members') {
          return (b.members || 0) - (a.members || 0);
        }
        return 0;
      });
    }

    return result;
  }, [animeList, filters, favorites, sortOption]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  return (
    <div className="min-h-screen bg-cyber-900 flex flex-col font-sans text-gray-100">
      
      {/* Toast Notification */}
      {error && (
        <Toast 
          message={error} 
          onClose={() => setError(null)} 
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b border-cyber-700 bg-cyber-900/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-gray-400 hover:text-white md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={scrollToTop}>
              <Snowflake className="h-8 w-8 text-cyber-accent animate-pulse" />
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                  {t.season}
                </h1>
                <p className="hidden text-xs text-gray-400 sm:block">{t.subtitle}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-1 justify-end sm:justify-between sm:flex-initial">
             {/* Search Bar */}
             <div className="relative w-full max-w-md hidden sm:block ml-8">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                className="block w-full rounded-full border border-cyber-700 bg-cyber-800 py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-cyber-accent focus:outline-none focus:ring-1 focus:ring-cyber-accent transition-all"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyber-800 border border-cyber-700 hover:bg-cyber-700 transition-colors text-sm font-medium"
            >
              <Globe className="w-4 h-4 text-cyber-highlight" />
              <span>{language === 'en' ? 'EN' : '中'}</span>
            </button>
          </div>

        </div>
        {/* Mobile Search */}
        <div className="sm:hidden px-4 pb-4">
           <div className="relative w-full">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                className="block w-full rounded-full border border-cyber-700 bg-cyber-800 py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-cyber-accent focus:outline-none focus:ring-1 focus:ring-cyber-accent transition-all"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Sidebar */}
        <FilterSidebar 
          animeList={animeList} 
          filters={filters} 
          setFilters={setFilters}
          isOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
          t={t}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          
          {isInitialLoading ? (
            /* Skeleton Grid */
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 animate-in fade-in duration-500">
              {Array.from({ length: 10 }).map((_, i) => (
                <AnimeCardSkeleton key={i} />
              ))}
            </div>
          ) : error && animeList.length === 0 ? (
            /* Error State */
            <div className="flex h-[60vh] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-red-900/50 bg-red-950/10 text-center p-8 animate-in zoom-in-95 duration-300">
              <div className="rounded-full bg-red-900/20 p-4 mb-4">
                <WifiOff className="h-12 w-12 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-red-400 mb-2">Connection Interrupted</h3>
              <p className="text-gray-400 max-w-md mb-8">{t.error}</p>
              <button 
                onClick={() => fetchAnime(1, true)}
                className="group flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-semibold shadow-lg shadow-red-600/20 transition-all hover:scale-105 active:scale-95"
              >
                <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                {t.retry}
              </button>
            </div>
          ) : (
            <>
              {/* Toolbar: Results Count & Sort */}
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-white">
                  <span className="text-cyber-accent">{filteredAndSortedAnime.length}</span> {t.foundTitles}
                </h2>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 bg-cyber-800 p-1 rounded-lg border border-cyber-700">
                  <div className="px-2 text-gray-400">
                    <ListFilter className="w-4 h-4" />
                  </div>
                  <select 
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as SortOption)}
                    className="bg-transparent text-sm text-white focus:outline-none py-1 pr-2 cursor-pointer"
                  >
                    <option value="default" className="bg-cyber-800">{t.sortDefault}</option>
                    <option value="score" className="bg-cyber-800">{t.sortScore}</option>
                    <option value="popularity" className="bg-cyber-800">{t.sortPopularity}</option>
                  </select>
                </div>
              </div>

              {/* Grid */}
              {filteredAndSortedAnime.length > 0 ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 animate-in fade-in duration-500">
                    {filteredAndSortedAnime.map(anime => (
                      <AnimeCard 
                        key={anime.mal_id} 
                        anime={anime} 
                        onClick={setSelectedAnime} 
                        isFavorite={favorites.has(anime.mal_id)}
                        toggleFavorite={toggleFavorite}
                        t={t}
                      />
                    ))}
                  </div>
                  
                  {/* Load More Button */}
                  {hasNextPage && !filters.search && !filters.source && !filters.genre && !filters.favoritesOnly && (
                    <div className="flex justify-center pt-8 pb-4">
                      <button
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        className="group relative px-8 py-3 bg-cyber-800 hover:bg-cyber-700 text-white font-semibold rounded-full border border-cyber-700 hover:border-cyber-accent transition-all shadow-lg shadow-black/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoadingMore ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin text-cyber-accent" />
                            <span>{t.loadingMore}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>{t.loadMore}</span>
                            <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                          </div>
                        )}
                        <div className="absolute inset-0 rounded-full ring-2 ring-white/10 group-hover:ring-cyber-accent/50 transition-all" />
                      </button>
                    </div>
                  )}
                  
                  {(!hasNextPage || filters.favoritesOnly) && (
                    <div className="text-center text-gray-500 text-sm py-8 border-t border-cyber-800 mt-8">
                      {t.noMoreResults}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-cyber-700 text-center">
                  <p className="text-gray-500">{t.noResults}</p>
                  <button 
                    onClick={() => setFilters({ source: null, genre: null, search: '', favoritesOnly: false })}
                    className="mt-2 text-cyber-accent hover:underline"
                  >
                    {t.clearFilters}
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-40 p-3 rounded-full bg-cyber-accent text-white shadow-lg shadow-cyber-accent/30 hover:bg-blue-600 transition-all duration-300 transform ${
          showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}
      >
        <ArrowUp className="w-6 h-6" />
      </button>

      {/* Detail Modal */}
      <AnimeModal 
        anime={selectedAnime} 
        isOpen={!!selectedAnime} 
        onClose={() => setSelectedAnime(null)} 
        language={language}
        isFavorite={selectedAnime ? favorites.has(selectedAnime.mal_id) : false}
        toggleFavorite={toggleFavorite}
        t={t}
      />
    </div>
  );
};

export default App;
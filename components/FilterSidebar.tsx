import React, { useMemo } from 'react';
import { Anime, FilterState, Translations } from '../types';
import { X, Filter, Sparkles, BookOpen, Layers, Heart } from 'lucide-react';

interface FilterSidebarProps {
  animeList: Anime[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  isOpen: boolean;
  onCloseMobile: () => void;
  t: Translations;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  animeList, 
  filters, 
  setFilters,
  isOpen,
  onCloseMobile,
  t
}) => {
  
  // Calculate counts dynamically based on the full dataset
  const { sources, genres } = useMemo(() => {
    const sourceMap = new Map<string, number>();
    const genreMap = new Map<number, { name: string; count: number }>();

    animeList.forEach(anime => {
      // Count Source
      const src = anime.source || 'Unknown';
      sourceMap.set(src, (sourceMap.get(src) || 0) + 1);

      // Count Genres
      anime.genres.forEach(g => {
        const current = genreMap.get(g.mal_id);
        if (current) {
          current.count++;
        } else {
          genreMap.set(g.mal_id, { name: g.name, count: 1 });
        }
      });
    });

    // Sort by count descending
    const sortedSources = Array.from(sourceMap.entries()).sort((a, b) => b[1] - a[1]);
    const sortedGenres = Array.from(genreMap.entries()).sort((a, b) => b[1].count - a[1].count);

    return { sources: sortedSources, genres: sortedGenres };
  }, [animeList]);

  const handleSourceClick = (source: string) => {
    setFilters(prev => ({ 
      ...prev, 
      source: prev.source === source ? null : source 
    }));
  };

  const handleGenreClick = (id: number) => {
    setFilters(prev => ({ 
      ...prev, 
      genre: prev.genre === id ? null : id 
    }));
  };

  const toggleFavorites = () => {
    setFilters(prev => ({
      ...prev,
      favoritesOnly: !prev.favoritesOnly
    }));
  };

  const clearFilters = () => {
    setFilters(prev => ({ ...prev, source: null, genre: null, favoritesOnly: false }));
  };

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-40 w-72 transform bg-cyber-900 border-r border-cyber-700 p-6 transition-transform duration-300 ease-in-out overflow-y-auto
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    md:relative md:translate-x-0 md:block md:h-[calc(100vh-80px)] md:border-r-0 md:bg-transparent
  `;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Content */}
      <aside className={sidebarClasses}>
        <div className="flex items-center justify-between mb-8 md:hidden">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Filter className="w-5 h-5 text-cyber-accent" /> {t.filters}
          </h2>
          <button onClick={onCloseMobile} className="p-2 text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Header & Show All Button */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{t.refineBy}</h3>
        </div>

        {/* Favorites Filter */}
        <button
          onClick={toggleFavorites}
          className={`w-full mb-4 py-3 px-4 rounded-xl transition-all flex items-center gap-3 font-semibold border ${
            filters.favoritesOnly
              ? 'bg-red-500/10 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
              : 'bg-cyber-800 border-cyber-700 text-gray-400 hover:border-red-500/50 hover:text-red-400'
          }`}
        >
          <Heart className={`w-5 h-5 ${filters.favoritesOnly ? 'fill-current' : ''}`} />
          <span>{t.myFavorites}</span>
        </button>

        {/* Distinct Show All Button */}
        {(filters.source || filters.genre || filters.favoritesOnly) && (
          <button 
            onClick={clearFilters}
            className="w-full mb-8 py-2.5 px-4 bg-cyber-accent hover:bg-blue-600 text-white rounded-xl transition-all flex items-center justify-center gap-2 font-semibold shadow-lg shadow-cyber-accent/20 border border-blue-400/30 group animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <Layers className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            {t.showAll}
          </button>
        )}

        {/* Source Section */}
        <div className="mb-8">
          <h4 className="flex items-center gap-2 mb-4 text-white font-semibold">
            <BookOpen className="w-4 h-4 text-cyber-accent" /> {t.source}
          </h4>
          <div className="space-y-2">
            {sources.map(([source, count]) => (
              <button
                key={source}
                onClick={() => handleSourceClick(source)}
                className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg transition-all ${
                  filters.source === source 
                    ? 'bg-cyber-800 border-l-4 border-cyber-accent text-white pl-2' 
                    : 'text-gray-400 hover:bg-cyber-800 hover:text-white border-l-4 border-transparent'
                }`}
              >
                <span>{source}</span>
                <span className={`text-xs ${filters.source === source ? 'text-white' : 'text-gray-600'}`}>
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Genres Section */}
        <div className="mb-8">
          <h4 className="flex items-center gap-2 mb-4 text-white font-semibold">
            <Sparkles className="w-4 h-4 text-cyber-accent" /> {t.genres}
          </h4>
          <div className="flex flex-wrap gap-2">
            {genres.map(([id, { name, count }]) => (
              <button
                key={id}
                onClick={() => handleGenreClick(id)}
                className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                  filters.genre === id
                    ? 'bg-cyber-accent border-cyber-accent text-white shadow-lg shadow-cyber-accent/20'
                    : 'bg-transparent border-cyber-700 text-gray-400 hover:border-cyber-highlight hover:text-cyber-highlight'
                }`}
              >
                {name} <span className="opacity-60 ml-1">({count})</span>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;
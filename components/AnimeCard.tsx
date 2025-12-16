import React from 'react';
import { Anime, Translations } from '../types';
import { PlayCircle, Star, Heart } from 'lucide-react';

interface AnimeCardProps {
  anime: Anime;
  onClick: (anime: Anime) => void;
  isFavorite: boolean;
  toggleFavorite: (id: number) => void;
  t: Translations;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime, onClick, isFavorite, toggleFavorite, t }) => {
  const displayTitle = anime.title_english || anime.title;
  const displayGenre = anime.genres.slice(0, 3).map(g => g.name).join(' • ');

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(anime.mal_id);
  };

  return (
    <div 
      onClick={() => onClick(anime)}
      className="group relative flex flex-col overflow-hidden rounded-xl bg-cyber-800 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyber-accent/20 cursor-pointer border border-cyber-700"
    >
      {/* Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <img 
          src={anime.images.webp.large_image_url || anime.images.jpg.large_image_url} 
          alt={displayTitle}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center backdrop-blur-sm">
           <PlayCircle className="h-12 w-12 text-white opacity-90" />
        </div>

        {/* Top Actions Row */}
        <div className="absolute top-0 left-0 w-full p-2 flex justify-between items-start z-10">
          {/* Source Badge */}
          <div className="rounded-md bg-cyber-accent/90 px-2 py-1 text-xs font-semibold text-white backdrop-blur-md shadow-sm">
            {anime.source}
          </div>

          {/* Favorite Button */}
          <button 
            onClick={handleFavoriteClick}
            className={`p-1.5 rounded-full backdrop-blur-md transition-all duration-200 ${
              isFavorite 
                ? 'bg-red-500/80 text-white hover:bg-red-600' 
                : 'bg-black/50 text-gray-300 hover:bg-white hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Score Badge */}
        {anime.score && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs font-bold text-yellow-400 backdrop-blur-md">
            <Star className="h-3 w-3 fill-yellow-400" />
            <span>{anime.score}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-lg font-bold text-white group-hover:text-cyber-highlight transition-colors">
          {displayTitle}
        </h3>
        <p className="mt-2 text-xs font-medium text-gray-400 line-clamp-1">
          {displayGenre || t.unknownGenre}
        </p>
      </div>
    </div>
  );
};

export default AnimeCard;
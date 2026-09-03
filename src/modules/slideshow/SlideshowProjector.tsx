import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useResolvedMediaUrl } from '../../hooks/useResolvedMediaUrl';

export interface SlideshowImage {
  id: string;
  url: string;
  caption?: string;
}

export interface SlideshowConfig {
  images: SlideshowImage[];
  intervalSeconds: number;
  autoPlay: boolean;
  transitionEffect: 'fade' | 'slide' | 'zoom';
}

export const SlideshowProjector: React.FC<{
  config: SlideshowConfig;
  isActive: boolean;
}> = ({ config, isActive }) => {
  const { images = [], intervalSeconds = 6, autoPlay = true } = config;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isActive || !autoPlay || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, Math.max(2, intervalSeconds) * 1000);

    return () => clearInterval(interval);
  }, [isActive, autoPlay, images.length, intervalSeconds]);

  const currentImg = images[currentIndex] || images[0];
  const resolvedCurrentUrl = useResolvedMediaUrl(currentImg?.url);

  if (images.length === 0 || !currentImg) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
        <p className="text-3xl font-bold mb-2">Brak zdjęć w pokazie slajdów</p>
        <p className="text-lg">Dodaj zdjęcia w panelu administracyjnym.</p>
      </div>
    );
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % images.length);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden select-none bg-black">
      {/* Blurred Ambient Background */}
      {resolvedCurrentUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-110 transition-all duration-1000"
          style={{ backgroundImage: `url(${resolvedCurrentUrl})` }}
        />
      )}

      {/* Main Image */}
      <div className="relative z-10 max-w-6xl max-h-[82vh] p-4 flex flex-col items-center justify-center">
        {resolvedCurrentUrl && (
          <img
            key={currentImg.id}
            src={resolvedCurrentUrl}
            alt={currentImg.caption || 'Zdjęcie'}
            className="max-h-[72vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-500"
          />
        )}

        {currentImg.caption && (
          <div className="mt-4 px-6 py-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-white text-xl md:text-2xl font-semibold tracking-wide text-center drop-shadow-md">
            {currentImg.caption}
          </div>
        )}
      </div>

      {/* Controls on hover */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-6 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white/80 hover:text-white border border-white/10 transition-all hover:scale-110"
            aria-label="Poprzednie zdjęcie"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-6 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white/80 hover:text-white border border-white/10 transition-all hover:scale-110"
            aria-label="Następne zdjęcie"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 z-20 flex items-center gap-2">
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-purple-400 w-8' : 'bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Przejdź do zdjęcia ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

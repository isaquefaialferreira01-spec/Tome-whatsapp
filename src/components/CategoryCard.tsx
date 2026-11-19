import React from 'react';
import { CategoryItem } from '../data/categories';

interface CategoryCardProps {
  category: CategoryItem;
  imageRef?: (el: HTMLImageElement | null) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, imageRef }) => {
  return (
    <a
      href={category.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col items-center justify-between bg-white rounded-xl sm:rounded-2xl px-2.5 py-2 sm:p-4 md:p-5 lg:p-6 [@media(max-height:500px)_and_(orientation:landscape)]:p-2 shadow-lg shadow-black/8 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1.5 active:scale-[0.98] transition-all duration-300 ease-out border border-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black w-full h-[118px] min-[360px]:h-[136px] min-[390px]:h-[148px] min-[414px]:h-[158px] sm:h-[200px] md:h-[min(248px,28dvh)] lg:h-[min(268px,29dvh)] [@media(max-height:500px)_and_(orientation:landscape)]:h-[100px] cursor-pointer overflow-hidden touch-manipulation"
      aria-label={`Acessar categoria ${category.name}`}
    >
      {/* Product Image Container with safe internal padding */}
      <div className="relative w-full flex-1 min-h-0 flex items-center justify-center p-1 sm:p-3 md:p-4 [@media(max-height:500px)_and_(orientation:landscape)]:p-0.5 overflow-hidden">
        <img
          ref={imageRef}
          src={category.image}
          alt={`Peça automotiva ${category.name} original Nova Viseu`}
          referrerPolicy="no-referrer"
          decoding="async"
          fetchPriority="low"
          style={{
            maxWidth: `${category.cardFit}%`,
            maxHeight: `${category.cardFit}%`
          }}
          className="w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-300 ease-out"
        />
      </div>

      {/* Clear Category Title */}
      <div className="w-full text-center pt-1 sm:pt-2 shrink-0">
        <h3 className="text-xs min-[375px]:text-[13px] sm:text-base md:text-xl lg:text-2xl [@media(max-height:500px)_and_(orientation:landscape)]:text-xs font-black text-black tracking-tight uppercase group-hover:text-[#F99B00] transition-colors duration-200 leading-tight whitespace-nowrap">
          {category.name}
        </h3>
      </div>
    </a>
  );
};

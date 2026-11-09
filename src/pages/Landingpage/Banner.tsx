import React from "react";
import ROUTES from "../../utils/Routes";
import { STORE_CATEGORIES } from "../../utils/categories";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Banner: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col gap-4">
      <div className="flex flex-row gap-5 items-stretch">
        <aside className="hidden lg:flex w-60 flex-shrink-0 py-3.5 flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-h-[430px]">
          <h3 className="px-4 pb-2 text-[11px] font-roboto font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
            Categories
          </h3>
          <div className="flex-1 overflow-y-auto scrollable-element py-1">
            {STORE_CATEGORIES.map((cat) => (
              <a
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 font-roboto hover:bg-purple-50 hover:text-Storepurple transition-colors"
                href={`${ROUTES.CATEGORY}?category=${cat.value}`}
                key={cat.value}
              >
                {cat.renderIcon()}
                <span className="truncate">{cat.label}</span>
              </a>
            ))}
          </div>
        </aside>

        <div className="flex-1 w-full overflow-hidden rounded-2xl shadow-sm border border-gray-100">
          <Carousel
            autoPlay
            infiniteLoop
            showThumbs={false}
            showStatus={false}
            interval={3500}
            transitionTime={600}
            swipeable
            emulateTouch
          >
            <div>
              <img src="/img/banner1.png" alt="Banner 1" className="h-full w-full object-cover" />
            </div>
            <div>
              <img src="/img/banner2.png" alt="Banner 2" className="h-full w-full object-cover" />
            </div>
            <div>
              <img src="/img/banner3.png" alt="Banner 3" className="h-full w-full object-cover" />
            </div>
          </Carousel>
        </div>
      </div>

      {/* Horizontal quick-access category chips on mobile & tablet */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {STORE_CATEGORIES.map((cat) => (
          <a
            key={cat.value}
            href={`${ROUTES.CATEGORY}?category=${cat.value}`}
            className="flex-shrink-0 inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-purple-50 border border-gray-200/80 rounded-full text-xs font-roboto font-medium text-gray-700 hover:text-Storepurple shadow-sm transition-colors"
          >
            {cat.renderIcon()}
            <span>{cat.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Banner;

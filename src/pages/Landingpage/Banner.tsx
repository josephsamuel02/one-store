import React from "react";
import ROUTES from "../../utils/Routes";
import { STORE_CATEGORIES } from "../../utils/categories";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Banner: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-row gap-5 items-start">
      <aside className="hidden lg:flex w-56 flex-shrink-0 py-4 flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <h3 className="px-4 pb-2 text-xs font-roboto font-bold text-gray-400 uppercase tracking-wider">
          Categories
        </h3>
        {STORE_CATEGORIES.map((cat) => (
          <a
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 font-roboto hover:bg-purple-50 hover:text-Storepurple transition-colors"
            href={`${ROUTES.CATEGORY}?category=${cat.value}`}
            key={cat.value}
          >
            {cat.renderIcon()}
            <span>{cat.label}</span>
          </a>
        ))}
      </aside>

      <div className="flex-1 w-full overflow-hidden rounded-xl">
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          interval={3000}
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
  );
};

export default Banner;

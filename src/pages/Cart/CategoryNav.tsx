import React from "react";
import { useLocation } from "react-router-dom";
import ROUTES from "../../utils/Routes";
import { findCategoryBySlug, STORE_CATEGORIES } from "../../utils/categories";

const CategoryNav: React.FC = () => {
  const location = useLocation();
  const rawCategory = new URLSearchParams(location.search).get("category") ?? "";
  const activeSlug = findCategoryBySlug(rawCategory)?.value ?? rawCategory;

  return (
    <div className="w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {STORE_CATEGORIES.map((cat) => {
          const isActive = cat.value === activeSlug;
          return (
            <a
              key={cat.value}
              href={`${ROUTES.CATEGORY}?category=${cat.value}`}
              className={`flex-shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs md:text-sm font-roboto font-medium transition-all ${
                isActive
                  ? "bg-Storepurple text-white shadow-sm shadow-purple-600/20"
                  : "bg-gray-50 hover:bg-purple-50 text-gray-700 hover:text-Storepurple border border-gray-200/70"
              }`}
            >
              {cat.renderIcon(isActive ? "text-white" : "text-Storepurple")}
              <span>{cat.label}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryNav;

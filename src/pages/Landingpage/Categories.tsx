import React from "react";
import ROUTES from "../../utils/Routes";

const Categories: React.FC = () => {
  const Menu = [
    { name: "Computing", img: "/img/computers.png", url: "computers" },
    { name: "Electronics", img: "/img/electronics.png", url: "electronics" },
    { name: "Groceries", img: "/img/groceries.png", url: "groceries" },
    { name: "Phone & Tablets", img: "/img/phone and tablet.png", url: "phone" },
    { name: "Accessories", img: "/img/accessories.png", url: "accessories" },
    { name: "Body Care", img: "/img/body care.png", url: "body" },
  ];

  return (
    <div className="w-full bg-gradient-to-r from-[#4303a8] to-[#5b21b6] py-8 md:py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-white text-lg md:text-xl font-dayone mb-5 md:mb-6">
          Shop by Category
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
          {Menu.map((i, index) => (
            <a
              className="group flex flex-col items-center bg-white rounded-xl p-2 md:p-3 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              key={index}
              href={`${ROUTES.CATEGORY}?category=${i.url}`}
            >
              <div className="w-full aspect-square overflow-hidden rounded-lg bg-gray-50">
                <img
                  src={i.img}
                  alt={i.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="mt-2 text-xs md:text-sm text-gray-800 text-center font-nunito font-bold leading-tight">
                {i.name}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;

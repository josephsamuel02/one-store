import React from "react";
import ROUTES from "../../utils/Routes";
const Categories: React.FC = () => {
  const Menu = [
    {
      name: "Computing",
      img: "/img/computers.png",
      url: "computers",
    },
    {
      name: "Electronics",
      img: "/img/electronics.png",
      url: "electronics",
    },
    {
      name: "Groceries",
      img: "/img/groceries.png",
      url: "groceries",
    },
    {
      name: "Phone & tablets",
      img: "/img/phone and tablet.png",
      url: "phone",
    },
    {
      name: "Accessories",
      img: "/img/accessories.png",
      url: "accessories",
    },
    { name: "Body care and hygiene", img: "/img/body care.png", url: "body" },
    // { name: "Cosmetics", img: "/img/c.png", url: "cosmetics" },
    // { name: "Wines and liquor", img: "/img/c.png", url: "wine" },
  ];

  return (
    <div className="w-full h-auto mt-10 md:mt-5 md:p-2 grid grid-cols-3 md:grid md:grid-cols-6  bg-[#4303a8] items-center ">
      {Menu.map((i, index) => (
        <a
          className=" w-[124px] h-[160px] md:w-[190px] md:h-auto p-1 mx-auto  my-4 items-center flex flex-col bg-white cursor-pointer rounded transform transition-transform duration-300 hover:scale-105"
          key={index}
          href={`${ROUTES.CATEGORY}?category=${i.url}`}
        >
          <img
            src={i.img}
            alt={i.name}
            className="mx-0 w-[400px] md:w-[180px] h-[auto] md:h-[170px] object-cover rounded-md "
          />
          <p className="text-xs py-2 md:text-base text-slate-8 text-center font-nunito font-bold ">
            {i.name}
          </p>
        </a>
      ))}
    </div>
  );
};

export default Categories;

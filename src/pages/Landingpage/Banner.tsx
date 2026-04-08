import React from "react";
import { FaHeadphones, FaWineBottle } from "react-icons/fa6";
import { GiLipstick, GiLiquidSoap } from "react-icons/gi";
import { LuApple, LuBaby, LuRadioReceiver, LuShirt } from "react-icons/lu";
import { AiOutlineShopping } from "react-icons/ai";
import { BsPhone } from "react-icons/bs";
import { HiOutlineDesktopComputer } from "react-icons/hi";
import { CgGym } from "react-icons/cg";
import ROUTES from "../../utils/Routes";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Banner: React.FC = () => {
  const Menu = [
    {
      name: "Computers",
      url: "computers",
      icon: <HiOutlineDesktopComputer size={20} className="text-Storepurple" />,
    },
    {
      name: "Electronics",
      url: "electronics",
      icon: <LuRadioReceiver size={18} className="text-Storepurple" />,
    },
    {
      name: "Grocery",
      url: "groceries",
      icon: <AiOutlineShopping size={18} className="text-Storepurple" />,
    },
    {
      name: "Phone & Tablets",
      url: "phones",
      icon: <BsPhone size={18} className="text-Storepurple" />,
    },
    {
      name: "Accessories",
      url: "accessories",
      icon: <FaHeadphones size={18} className="text-Storepurple" />,
    },
    {
      name: "Fashion",
      url: "fashion",
      icon: <LuShirt size={18} className="text-Storepurple" />,
    },
    {
      name: "Sport",
      url: "sport",
      icon: <CgGym size={18} className="text-Storepurple" />,
    },
    {
      name: "Food",
      url: "food",
      icon: <LuApple size={18} className="text-Storepurple" />,
    },
    {
      name: "Body Care",
      icon: <GiLiquidSoap size={18} className="text-Storepurple" />,
      url: "body_care",
    },
    {
      name: "Baby",
      icon: <LuBaby size={18} className="text-Storepurple" />,
      url: "baby",
    },
    {
      name: "Cosmetics",
      icon: <GiLipstick size={18} className="text-Storepurple" />,
      url: "cosmetics",
    },
    {
      name: "Wines & Drinks",
      icon: <FaWineBottle size={18} className="text-Storepurple" />,
      url: "wine",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-row gap-5 items-start">
      <aside className="hidden lg:flex w-56 flex-shrink-0 py-4 flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <h3 className="px-4 pb-2 text-xs font-roboto font-bold text-gray-400 uppercase tracking-wider">
          Categories
        </h3>
        {Menu.map((i, index) => (
          <a
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 font-roboto hover:bg-purple-50 hover:text-Storepurple transition-colors"
            href={`${ROUTES.CATEGORY}?category=${i.url}`}
            key={index}
          >
            {i.icon}
            <span>{i.name}</span>
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

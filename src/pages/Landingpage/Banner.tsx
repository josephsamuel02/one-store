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
      icon: <HiOutlineDesktopComputer size={24} className="mx-2 text-Storepurple" />,
    },
    {
      name: "Electronics",
      url: "electronics",
      icon: <LuRadioReceiver size={18} className="mx-2 text-Storepurple" />,
    },
    {
      name: "Grocery",
      url: "groceries",
      icon: <AiOutlineShopping size={18} className="mx-2 text-Storepurple" />,
    },
    {
      name: " Phone & tablets",
      url: "phones",
      icon: <BsPhone size={18} className="mx-2 text-Storepurple" />,
    },
    {
      name: "Accessories",
      url: "accessories",
      icon: <FaHeadphones size={18} className="mx-2 text-Storepurple" />,
    },
    {
      name: "Fashion",
      url: "fashion",
      icon: <LuShirt size={18} className="mx-2 text-Storepurple" />,
    },
    {
      name: "Sport",
      url: "sport",
      icon: <CgGym size={18} className="mx-2 text-Storepurple" />,
    },
    {
      name: "Food",
      url: "food",
      icon: <LuApple size={18} className="mx-2 text-Storepurple" />,
    },
    {
      name: "Body care and hygiene",
      icon: <GiLiquidSoap size={18} className="mx-2 text-Storepurple" />,
      url: "body_care",
    },
    {
      name: "Baby",
      icon: <LuBaby size={18} className="mx-2 text-Storepurple" />,
      url: "baby",
    },

    {
      name: "Cosmetics",
      icon: <GiLipstick size={18} className="mx-2 text-Storepurple" />,
      url: "cosmetics",
    },
    {
      name: "Wines and Drinks",
      icon: <FaWineBottle size={18} className="mx-2 text-Storepurple" />,
      url: "wine",
    },
  ];

  return (
    <div className="mx-auto w-11/12 h-10/12 flex flex-row items-center">
      <div className="hidden  lg:flex mx-auto w-1/6  py-8 h-auto flex-col rounded shadow-lg bg-white ">
        {Menu.map((i, index) => (
          <a
            className="w-full h-auto pl-1 py-3 flex flex-row items-center hover:bg-deep-purple-50 cursor-pointer"
            href={`${ROUTES.CATEGORY}?category=${i.url}`}
            key={index}
          >
            {i.icon}
            <p className=" px-1 text-[12px] text-slate-800 font-roboto font-thin">{i.name}</p>
          </a>
        ))}
      </div>

      <div className="  mx-auto w-full h-full md:w-4/5 ">
        <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false} interval={2000}>
          <div>
            <img src="/img/banner1.png" alt="image 1" className="h-full w-full object-cover" />
          </div>
          <div>
            <img src="/img/banner2.png" alt="image 2" className="h-full w-full object-cover" />
          </div>
          <div>
            <img src="/img/banner3.png" alt="image 3" className="h-full w-full object-cover" />
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default Banner;

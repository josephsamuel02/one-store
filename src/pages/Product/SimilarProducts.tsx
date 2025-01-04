/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import ROUTES from "../../utils/Routes";
interface AppComponent {
  categoryProducts: any;
  category: any;
}
const SimilarProducts: React.FC<AppComponent> = ({ categoryProducts }) => {
  const priceFormat = new Intl.NumberFormat("en-US");

  return (
    <div className="mx-auto p-3 w-11/12 md:w-10/12 h-auto bg-white rounded-md">
      <div className="w-full h-auto p-0 flex flex-col bg-blue-600">
        <p className=" text-2xl md:text-3xl py-3 text-white text-center font-RubikDistressed ">
          You may also like
        </p>
      </div>
      <div className="w-full h-auto md:p-2 grid grid-cols-3 md:grid md:grid-cols-6  bg-purple-100 items-center ">
        {categoryProducts &&
          categoryProducts.slice(0, 10).map((i: any, index: any) => (
            <div
              className=" w-28 md:w-48 h-auto mx-auto  my-4 items-center flex flex-col bg-white cursor-pointer rounded"
              key={index}
            >
              <a
                className=" h-auto mx-auto  items-center flex flex-col "
                href={`${ROUTES.PRODUCT}/${i.id}`}
              >
                <img
                  src={i.image}
                  alt={i.name}
                  className="mx-auto w-full md:w-48 h-24 md:h-52 object-contain "
                />
                <p className=" line-clamp-1 p-1 text-sm md:text-lg  text-gray-800">{i.name}</p>
                <p className=" pb-1 text-base font-bold text-gray-800">
                  ₦{priceFormat.format(i.price)}
                  <span className="pl-2 text-slate-600 text-sm text-decoration-line: line-through font-normal">
                    ₦{priceFormat.format(i.price)}
                  </span>
                </p>
              </a>
              <p
                className=" w-full mx-0.5 py-1 text-center text-sm md:text-base text-white bg-Storepurple hover:bg-purple-800 rounded-sm cursor-pointer"
                // onClick={() =>
                //    dispatch<any>(
                //     addToCart({
                //       id: i.id,
                //       image: i.image,
                //       name: i.name,
                //       price: i.price,
                //       category: i.category,
                //       quantity: 1,
                //     })
                //   )
                // }
              >
                Add to cart
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SimilarProducts;

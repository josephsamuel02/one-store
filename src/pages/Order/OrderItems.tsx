import React from "react";
import ROUTES from "../../utils/Routes";
interface AppComponent {
  Orders: any;
  totalPrice: any;
}

const OrderItems: React.FC<AppComponent> = ({ Orders }) => {
  const priceFormat = new Intl.NumberFormat("en-US");
  return (
    <div className="w-11/12 md:w-10/12 md:p-6 h-auto mx-auto my-4 p-4 flex flex-col bg-white ">
      <h3 className="text-2xl  md:text-3xl p-4 text-black font-bold font-dayone border-b-2 border-slate-300 ">
        Orders
      </h3>
      <>
        <h3 className="text-2xl  md:text-3xl p-4 text-black font-nunito ">New Orders</h3>

        {Orders &&
          Orders.map((i: any, n: any) => (
            <div className="w-full" key={n}>
              {i &&
                i.Products.map((i: any, index: any) => (
                  <div
                    className="w-full h-auto my-2 flex flex-col bg-white rounded-md shadow-lg cursor-pointer"
                    key={index}
                  >
                    <a
                      className="w-full h-auto mx-auto items-center flex flex-col"
                      href={`${ROUTES.PRODUCT}/${i.id}`}
                    >
                      <div className="w-full h-auto flex flex-row">
                        <img
                          src={i.image}
                          alt=""
                          className="w-32 h-32  mx-auto object-contain"
                        />

                        <div className="w-4/6 flex my-auto flex-col md:flex-row ">
                          <h3 className="text-md  md:text-lg p-2 text-black font-roboto ">
                            {i.name}
                          </h3>
                          <div className=" mx-auto w-2/6 h-auto flex flex-col ">
                            <h3 className="text-xl py-2 text-black font-dayone">
                              ₦{priceFormat.format(i.price)}
                            </h3>

                            <div className="w-full h-auto flex flex-row py-6 ">
                              <p className="  text-md text-black font-roboto">
                                Quantity: {i.inStock}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                ))}

              <div className="md:w-3/5 m-2 h-auto px-4 pt-5 pb-12 flex flex-row cursor-pointer items-center">
                <div className="w-full h-auto flex flex-row">
                  {i.orderLevel == 0 && (
                    <div className="mx-4 h-10 px-16 flex flex-col bg-yellow-600   shadow items-center rounded">
                      <span className=" m-auto font-nunito text-center text-md text-white">
                        Pending
                      </span>
                    </div>
                  )}

                  {i.orderLevel == 1 && (
                    <div className="mx-4 h-10 px-16 flex flex-col bg-blue-700   shadow items-center rounded">
                      <span className=" m-auto py-6 font-nunito text-center text-md text-white">
                        Order Confirmed
                      </span>
                    </div>
                  )}
                  {i.orderLevel == 2 && (
                    <div className="mx-4  h-6 px-6 flex flex-col bg-Storepurple shadow items-center rounded">
                      <span className=" m-auto font-nunito text-center text-md text-white">
                        Order Shipped
                      </span>
                    </div>
                  )}
                  {i.orderLevel == 3 && (
                    <div className="mx-4 h-10 px-16 flex flex-col bg-green-800   shadow items-center rounded">
                      <span className=" m-auto font-nunito text-center text-md text-white">
                        Order Completed
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full text-base text-black font-roboto border-b-2">
                Total: {priceFormat.format(i.totalPrice)}
              </div>
            </div>
          ))}

        {/* <div className="md:w-3/5 m-2 h-auto px-4 pb-2 flex flex-row cursor-pointer items-center">
          <div className="w-full h-auto flex flex-row">
            {Orders.orderLevel == 0 && (
              <div className="mx-4 h-10 px-16 flex flex-col bg-yellow-600   shadow items-center rounded">
                <span className=" m-auto font-nunito text-center text-md text-white">
                  Pending
                </span>
              </div>
            )}

            {Orders.orderLevel == 1 && (
              <div className="mx-4 h-10 px-16 flex flex-col bg-blue-700   shadow items-center rounded">
                <span className=" m-auto py-6 font-nunito text-center text-md text-white">
                  Order Confirmed
                </span>
              </div>
            )}
            {Orders.orderLevel == 2 && (
              <div className="mx-4  h-6 px-6 flex flex-col bg-Storepurple shadow items-center rounded">
                <span className=" m-auto font-nunito text-center text-md text-white">
                  Order Shipped
                </span>
              </div>
            )}
            {Orders.orderLevel == 3 && (
              <div className="mx-4 h-10 px-16 flex flex-col bg-green-800   shadow items-center rounded">
                <span className=" m-auto font-nunito text-center text-md text-white">
                  Order Completed
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="w-full text-base text-black font-roboto border-b-2">
          Total: {priceFormat.format(Orders.totalPrice)}
        </div> */}
      </>
      {/* 
      <div className="w-full h-auto mt-14 border-2 border-slate-300 rounded-sm">
        <h3 className="text-xl   px-4 py-2 text-black  font-dayone  border-b-2 border-slate-300">
          CLOSED ORDERS
        </h3>

         <>
          <div className="w-full h-auto my-2 flex flex-col bg-white   border-b-2 border-slate-300">
            <div className="w-full h-auto flex flex-row">
              <img src="/img/2.png" alt="" className="w-32 h-32  mx-auto object-contain" />

              <div className="w-4/6 flex my-auto flex-col md:flex-row ">
                <h3 className="text-md  md:text-lg p-2 text-black font-roboto ">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                  tempor
                </h3>
                <div className="w-72 h-auto flex flex-col ">
                  <h3 className="text-2xl py-2 text-black font-dayone">₦ 27,999 </h3>
                  <div className="w-full h-auto flex flex-row py-6 ">
                    <p className="text-lg text-black font-roboto">Qty: 1 </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-auto my-2 flex flex-col bg-white   border-b-2 border-slate-300">
            <div className="w-full h-auto flex flex-row">
              <img src="/img/2.png" alt="" className="w-32 h-32  mx-auto object-contain" />

              <div className="w-4/6 flex my-auto flex-col md:flex-row ">
                <h3 className="text-md  md:text-lg p-2 text-black font-roboto ">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                  tempor
                </h3>
                <div className="w-72 h-auto flex flex-col ">
                  <h3 className="text-2xl py-2 text-black font-dayone">₦ 27,999 </h3>
                  <div className="w-full h-auto flex flex-row py-6 ">
                    <p className="text-lg text-black font-roboto">Qty: 1 </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>  
      </div> */}
    </div>
  );
};

export default OrderItems;

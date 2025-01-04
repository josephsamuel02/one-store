/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
interface appState {
  setOrderPage: (value: any) => any;
  orderPage: any;
}
const OrdersMenu: React.FC<appState> = ({ setOrderPage, orderPage }) => {
  return (
    <div className="fixed top-16 left-0 right-0 w-full h-auto  bg-white z-50">
      <div className=" w-full  md:w-4/6 py-2 h-auto mx-auto px-3 md:px-5 ">
        <div className="w-full h-auto md:px-1 flex flex-row items-center">
          <div
            className="w-1/4   mx-0.5 h-full  border-b-4 border-slate-600 rounded-sm hover:bg-slate-200 cursor-default"
            style={{ backgroundColor: orderPage == 0 ? "rgb(233 203 255)" : "" }}
            onClick={() => setOrderPage(0)}
          >
            <p className=" py-2 text-sm md:text-base text-center text-slate-800 font-dayone">
              Pending
            </p>
          </div>

          <div
            className="w-1/4  mx-0.5 h-full  border-b-4 border-purple-700 rounded-sm hover:bg-slate-200 cursor-default"
            style={{ backgroundColor: orderPage == 1 ? "rgb(233 213 255)" : "" }}
            onClick={() => setOrderPage(1)}
          >
            <p className=" py-2 text-sm md:text-base text-center text-slate-800 font-dayone">
              Confirmed
            </p>
          </div>
          <div
            className="w-1/4  mx-0.5 h-full  border-b-4 border-blue-600 rounded-sm hover:bg-slate-200 cursor-default"
            style={{ backgroundColor: orderPage == 2 ? "rgb(233 213 255)" : "" }}
            onClick={() => setOrderPage(2)}
          >
            <p className=" py-2 text-sm md:text-base text-center text-slate-800 font-dayone">
              Shipped
            </p>
          </div>
          <div
            className="w-1/4  mx-0.5 h-full  border-b-4 border-green-600 rounded-sm  hover:bg-slate-200 cursor-default"
            style={{ backgroundColor: orderPage == 3 ? "rgb(233 213 255)" : "" }}
            onClick={() => setOrderPage(3)}
          >
            <p className=" py-2 text-sm md:text-base text-center text-slate-800 font-dayone">
              Completed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersMenu;

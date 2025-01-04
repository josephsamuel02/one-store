import React from "react";
interface appState {
  stocks: any;
  setStock: (value: any) => void;
}

const StoreMenu: React.FC<appState> = ({ setStock, stocks }) => {
  return (
    <div className="fixed top-12 left-0 right-0 w-full h-auto  bg-white  ">
      <div className=" w-full h-auto  flex md:w-4/6 py-2 mx-auto px-3 md:px-5 ">
        <div className="w-full mx-auto h-auto md:px-1 flex flex-row items-center">
          <div
            className="w-1/3   mx-4 h-full  border-b-4 border-slate-600 rounded-sm hover:bg-slate-200 cursor-default"
            style={{ backgroundColor: stocks == 1 ? "rgb(233 213 255)" : "" }}
            onClick={() => setStock(1)}
          >
            <p className=" py-2 text-sm md:text-base text-center text-slate-800 font-dayone">
              In Stock
            </p>
          </div>

          <div
            className="w-1/3  mx-4 h-full  border-b-4 border-purple-700 rounded-sm hover:bg-slate-200 cursor-default"
            style={{ backgroundColor: stocks == 0 ? "rgb(233 213 255)" : "" }}
            onClick={() => setStock(0)}
          >
            <p className=" py-2 text-sm md:text-base text-center text-slate-800 font-dayone">
              Out of Stock
            </p>
          </div>

          {/* <div
            className="w-1/3  mx-4 h-full  border-b-4 border-green-600 rounded-sm  hover:bg-slate-200 cursor-default"
            style={{ backgroundColor: stocks == "upload" ? "rgb(233 213 255)" : "" }}
            onClick={() => setStock("upload")}
          >
            <p className=" py-2 text-sm md:text-base text-center text-slate-800 font-dayone">
              Add new Products
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default StoreMenu;

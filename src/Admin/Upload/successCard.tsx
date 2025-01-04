/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface appState {
  showCard: boolean;
  setShowCard: (value: any) => any;
  Text: any;
}

const SuccessCard: React.FC<appState> = ({ showCard, setShowCard, Text }) => {
  return (
    <>
      {showCard && (
        <div className="fixed left-0 right-0 top-0 bottom-0 bg-transparent  rounded-md z-40 items-center  ">
          <div className=" relative top-36 mx-auto p-4  w-96 h-96 flex flex-col bg-white border-2 border-slate-200 rounded-md items-center justify-center shadow-lg">
            <img
              src="/img/done-checkmark-svgrepo-com.svg"
              alt=""
              className=" mx-auto w-20 h-20"
            />
            <p className="mx-auto py-2 text-2xl text-green-700 font-OleoScript font-roboto ">
              Uploaded Successfully
            </p>
            <p className="mx-auto py-2 text-lg text-center text-slate-800 font-nunito ">
              {Text}
            </p>
            <p
              className="w-3/5  mx-auto my-2 py-2 text-lg text-center font-OleoScript text-white bg-purple-600 hover:bg-purple-800  font-nunito rounded cursor-pointer"
              onClick={() => {
                window.location.replace("/admin/upload_product");
                setShowCard(false);
              }}
            >
              Okay
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default SuccessCard;

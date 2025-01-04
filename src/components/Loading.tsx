import React from "react";

export const Loading: React.FC = () => {
  return (
    <>
      <div className="m-auto w-full h-full flex flex-col items-center fixed top-0 left-0 right-0 bottom-0 z-30 bg-[#290a0aaf]   backdrop-blur-sm">
        <div className="m-auto w-[250px] h-[250px] flex flex-col items-center     bg-[#ffffffd0] rounded-xl ">
          <img src="/img/fade-stagger-circles.svg" alt="" className="m-auto w-40 h-40" />
        </div>
      </div>
    </>
  );
};

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState } from "react";
import { MdPersonOutline } from "react-icons/md";
import ROUTES from "../../utils/Routes";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../DB/firebase";
import { useNavigate } from "react-router-dom";

const AdminNav: React.FC = () => {
  const token = localStorage.getItem("one_store_admin");
  const Navigate = useNavigate();
  const [updatedUser, setUpdatedUser] = useState<any>();

  useEffect(() => {
    const docRef = doc(db, "user", token!);

    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUpdatedUser(data);
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.error("Error getting document:", error);
        Navigate("/admin");
      });
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 w-full h-auto px-3 py-4 md:px-5  bg-white flex flex-row items-center z-40">
      <a className="w-44 mx-2 my-2 flex items-center" href={ROUTES.ADMIN_LANDINGPAGE}>
        <img src="/img/OneStore logo.svg" alt="" className="w-auto h-auto" />
      </a>
      {updatedUser && (
        <div className=" w-4/5 mx-auto md:mx-4 md:ml-auto px-1 flex flex-row bg-white ">
          <span className="w-auto mx-auto cursor-pointer"></span>
          <div className="w-auto mx-4 flex flex-col items-center cursor-pointer">
            <a
              className="w-auto mx-auto flex flex-row items-center"
              href={ROUTES.ADMIN_PROFILE}
            >
              <MdPersonOutline size={32} className=" text-slate-700" />
              <span className="text-lg md:text-sm text-black font-roboto font-thin">
                {`${updatedUser.surname} ${updatedUser.name}`}
              </span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNav;

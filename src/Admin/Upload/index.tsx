/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { v4 } from "uuid";
import { useState } from "react";
import Select from "react-select";
import { db, storage } from "../../DB/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast, ToastContainer } from "react-toastify";
import { addDoc, collection } from "firebase/firestore";
import SuccessCard from "./successCard";
import ScaleLoader from "react-spinners/ScaleLoader";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../utils/Routes";
import DefaultNav from "../components/AdminNav";

const AdminUpload: React.FC = () => {
  const adminToken = localStorage.getItem("one_store_admin");
  const Navigate = useNavigate();
  const [showCard, setShowCard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<any>("");
  const [readyToUpload, setReadyToUpload] = useState(false);
  const [setImageFile] = useState<any>("");

  const [siteInformation, setSiteInformation] = useState<any>({
    image: "",
    name: "",
    productDetails: "",
    features: ["", ""],
    old_price: "",
    price: 24354,
    category: "",
    inStock: "",
    PayOnDelivery: false,
  });

  const categoryOptions: any = [
    { value: "computers", label: "computers" },
    { value: "accessories", label: "accessories" },
    { value: "groceries", label: "groceries" },
    { value: "fashion", label: "fashion" },
    { value: "electronics", label: "electronics" },
    { value: "sports", label: "sports" },
    { value: "food", label: "food" },
    { label: "Body care and hygiene", value: "baby" },
    { label: "Baby", value: "baby" },
    { label: "Cosmetics", value: "cosmetics" },
    { label: "Wines and liquor", value: "wine" },
    { label: "household", value: "household" },
  ];
  const options: any = [
    { value: false, label: "No" },
    { value: true, label: "Yes" },
  ];

  const handleImageSelect = async (e: any) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));
    try {
      const imageRef = ref(storage, `/products_images/${e.target.files[0].name + v4()} `);

      await uploadBytes(imageRef, e.target.files[0])
        .then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url: any) => {
            setSiteInformation((prev: any) => ({ ...prev, image: url }));
            toast.success("image uploaded");
            setImageFile(e.target.files[0]);
          });
        })
        .catch((error) => {
          toast.error("unable to upload images");
          console.log(error);
        });
    } catch (error) {
      toast.error("Unable to upload image to server");
    }
  };

  const UploadProduct = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (siteInformation.image !== "") {
        const docRef = await addDoc(collection(db, "products"), siteInformation);
        if (!docRef) {
          toast.error("upload an image");
        }
        setLoading(false);
        setShowCard(true);
      }
    } catch (error) {
      toast.error("Error: Failed to upload");
    }
  };

  useEffect(() => {
    if (!adminToken) {
      Navigate(ROUTES.ADMIN_LOGIN);
    }
  }, []);

  return (
    <div className="mx-auto w-full md:w-5/6 h-full bg-white overflow-y-scroll scrollbar-hide items-center">
      <DefaultNav />
      <form className="mx-auto w-full md:w-96 p-2 mt-16  h-full flex flex-col   items-center">
        {image ? (
          <div className="w-auto mx-auto md:mx-4 my-3 py-1 flex flex-col items-center">
            <img
              src={image}
              alt=""
              className="mx-auto w-48 md:w-72 h-52 object-contain rounded-sm"
            />
          </div>
        ) : (
          <div className="w-auto mx-auto md:mx-4 my-3 py-1 flex flex-col items-center">
            <img
              src={"/img/shopping-cart.png"}
              alt=""
              className="mx-auto w-60 h-48 object-cover border-2 border-slate-200 rounded"
            />
          </div>
        )}

        <div className="w-4/5 mx-auto md:px-2 md:mx-4 my-1 py-1 flex flex-col items-center ">
          <div className="w-full mx-auto my-1 py-1 flex flex-col">
            <label className="text-lg text-gray-700 font-nunito"> Product image:</label>
            <input
              type="file"
              required
              accept="image/jpg, image/jpeg, image/png image/svg"
              multiple={false}
              onChange={(e) => handleImageSelect(e)}
              className=" mx-auto w-full h-auto text-nunito bg-white border-2 outline-none border-slate-300 rounded shadow-sm"
            />
          </div>
          <div className="w-full mx-auto my-1 py-1 flex flex-col   ">
            <label className="text-lg text-gray-700 font-nunito"> Product name:</label>
            <textarea
              required
              draggable={false}
              onChange={(e: any) => {
                setSiteInformation((prev: any) => ({ ...prev, name: e.target.value }));
              }}
              placeholder="product name"
              className=" my-auto w-full h-16 p-1  text-sm text-slate-800 font-normal focus:outline-none resize-none no-scrollbar border-2 border-gray-300 rounded-md"
            ></textarea>
          </div>

          <div className="w-full mx-auto my-1 py-1 flex flex-col   ">
            <label className="text-lg text-gray-700 font-nunito"> Product Details:</label>
            <textarea
              required
              draggable={false}
              onChange={(e: any) => {
                setSiteInformation((prev: any) => ({
                  ...prev,
                  productDetails: e.target.value,
                }));
              }}
              placeholder="Product details"
              className=" my-auto w-full h-20 p-1 text-sm text-slate-800 font-normal focus:outline-none resize-none no-scrollbar border-2 border-gray-300 rounded-md"
            ></textarea>
          </div>

          <div className="w-full mx-auto my-1 py-1 flex flex-col">
            <label className="text-lg text-gray-700 font-nunito">Product Category</label>
            <div className=" py-1 flex flex-row  items-center ">
              <Select
                options={categoryOptions}
                defaultValue={false}
                required
                onChange={(e: any) =>
                  setSiteInformation((prev: any) => ({ ...prev, category: e.value }))
                }
              />
            </div>
          </div>
          {/* <div className="w-full mx-auto my-3  flex flex-col">
            <label className="text-lg text-gray-700 font-nunito flex flex-row items-center">
              <ToolTip tipp="what are the key attributes of the product" /> Product Features:
            </label>
            <div className="w-auto mx-auto md:mx-4 my-3  flex flex-col">
              <div className="w-full h-auto flex flex-col">
                <div>
                  {siteInformation &&
                    siteInformation.features.map((features: any, i) => (
                      <div className=" flex flex-row items-center" key={i}>
                        <button
                          type="button"
                          onClick={() => {
                            siteInformation.features.splice(i, 1);
                            setNewValue({ ...siteInformation });
                          }}
                          className="m-0.5 p-0.5 w-5 h-5 mr-1 text-center font-bold  rounded-full bg-gray-200 text-red-600"
                        >
                          <MdClose size={15} />
                        </button>
                        <input
                          type="text"
                          name={`features[${i}]`}
                          defaultValue={features}
                          id={`features[${i}]`}
                          // onChange={ }

                          disabled={editForm}
                          placeholder="Services offered"
                          className="w-64 h-auto p-1 my-1 text-nunito bg-white border-2 outline-none border-gray-300 rounded "
                        />
                      </div>
                    ))}
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        siteInformation.features.length < 5
                          ? siteInformation.features.push("")
                          : null;
                        setNewValue({ ...siteInformation });
                      }}
                      className="mx-6 p-0.5 px-2 w-14 h-8 text-center text-nunito text-sm rounded-sm bg-purple-700 text-white"
                    >
                      Add
                    </button>
                  </>
                </div>
              </div>
            </div>
          </div> */}
          <div className="w-full mx-auto my-1 py-1 flex flex-col   ">
            <label className="text-lg text-gray-700 font-nunito"> Old price ₦:</label>

            <input
              type="number"
              required
              onChange={(e: any) => {
                setSiteInformation((prev: any) => ({
                  ...prev,
                  old_price: Number(e.target.value),
                }));
              }}
              className=" px-2 mx-1 w-44 h-auto text-nunito bg-white border-2 outline-none border-slate-300 rounded shadow-sm"
            />
          </div>
          <div className="w-full mx-auto my-1 py-1 flex flex-col   ">
            <label className="text-lg text-gray-700 font-nunito">Price ₦ :</label>

            <input
              type="number"
              required
              onChange={(e: any) => {
                setSiteInformation((prev: any) => ({
                  ...prev,
                  price: Number(e.target.value),
                }));
              }}
              className=" px-2 mx-1 w-44 h-auto text-nunito bg-white border-2 outline-none border-slate-300 rounded shadow-sm"
            />
          </div>
          <div className="w-full mx-auto my-1 py-1 flex flex-col   ">
            <label className="text-lg text-gray-700 font-nunito">Available Quantity :</label>

            <input
              type="num"
              required
              onChange={(e: any) => {
                setSiteInformation((prev: any) => ({
                  ...prev,
                  inStock: Number(e.target.value),
                }));
              }}
              className=" px-2 mx-1 w-44 h-auto text-nunito bg-white border-2 outline-none border-slate-300 rounded shadow-sm"
            />
          </div>

          <div className="w-full mx-auto my-1 py-1 flex flex-col">
            <label className="text-lg text-gray-700 font-nunito">Allow pay on delivery</label>
            <div className=" py-1 flex flex-row  items-center ">
              <Select
                options={options}
                defaultValue={false}
                required
                onChange={(e: any) =>
                  setSiteInformation((prev: any) => ({ ...prev, PayOnDelivery: e.value }))
                }
              />
            </div>
          </div>

          <div className="w-full mx-auto my-1 py-1 flex flex-col   ">
            {!readyToUpload ? (
              <button
                type="submit"
                onClick={() => setReadyToUpload(true)}
                className="mx-auto py-2 px-2 w-full font-bold text-white text-center text-nunito text-lg rounded-sm bg-purple-400"
              >
                Submit
              </button>
            ) : (
              <button
                type="button"
                onClick={UploadProduct}
                className="mx-auto py-2 px-2 w-full font-bold text-white text-center text-nunito text-lg rounded-sm bg-purple-700"
              >
                {loading ? (
                  <ScaleLoader
                    color={"white"}
                    aria-label="ScaleLoader"
                    data-testid="ScaleLoader"
                  />
                ) : (
                  "Upload"
                )}
              </button>
            )}
          </div>
        </div>
      </form>
      <ToastContainer />
      <SuccessCard
        showCard={showCard}
        setShowCard={setShowCard}
        Text={"Your Product was successfully uploaded"}
      />
    </div>
  );
};

export default AdminUpload;

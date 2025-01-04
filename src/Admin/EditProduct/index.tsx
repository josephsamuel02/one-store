/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db, storage } from "../../DB/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import Select from "react-select";
import ScaleLoader from "react-spinners/ScaleLoader";
import DefaultNav from "../components/AdminNav";
import delay from "delay";

const Edit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const Navigate = useNavigate();

  const [product, setProduct] = useState<any>({});
  const [newValue, setNewValue] = useState<any>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [prepareData, setPrepareData] = useState(false);

  const options = [
    { value: false, label: "No" },
    { value: true, label: "Yes" },
  ];

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, "products", id!);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProduct(data);
        setNewValue(data); // Initialize newValue with fetched data
      } else {
        console.log("No such document!");
      }
    };

    fetchProduct().catch((error) => {
      console.error("Error fetching document:", error);
    });
  }, [id]);

  // Handle image selection
  const handleImageSelect = (e: any) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Preview image
      setImageFile(e.target.files[0]); // Store file for upload later
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewValue((prev: any) => ({ ...prev, [name]: value }));
  };

  // const readyTosend = () => {
  //   console.log(imageFile);
  //   // console.log(imagePreview);
  // };
  // Handle dropdown selection changes
  const handleSelectChange = (option: any) => {
    setNewValue((prev: any) => ({ ...prev, PayOnDelivery: option.value }));
  };

  // Handle form submission and product update
  const uploadProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (imageFile) {
      // Upload image if selected
      const imageRef = ref(storage, `products_images/${imageFile.name + v4()}`);
      try {
        const snapshot = await uploadBytes(imageRef, imageFile);
        const imageUrl = await getDownloadURL(snapshot.ref);
        setNewValue((prev: any) => ({ ...prev, image: imageUrl }));
        prepareData && toast.success("Image uploaded successfully");
      } catch (error) {
        toast.error("Failed to upload image");
        setLoading(false);
        return;
      }
    }
    delay(1000);

    try {
      const docRef = doc(db, "products", id!);
      await updateDoc(docRef, newValue);

      prepareData && toast.success("Product updated successfully!");
      delay(1000);
      prepareData && Navigate(`/admin/product_details/${id}`);

      setPrepareData(true);
    } catch (error) {
      toast.error("Error updating product");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full mt-10 md:w-5/6 h-full bg-white overflow-y-scroll scrollbar-hide items-center">
      <DefaultNav />
      <div className="mx-auto w-full md:w-96 p-2 mt-16 h-full flex flex-col items-center">
        <h3 className="text-2xl text-gray-900 font-bold">Edit Product</h3>

        {/* Image preview */}
        <div className="w-auto mx-auto my-3 py-1 flex flex-col items-center">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Selected"
              className="w-60 h-auto object-cover rounded-sm"
            />
          ) : (
            <img
              src={product.image}
              alt="Product"
              className="w-60 h-48 object-cover rounded-sm"
            />
          )}
        </div>

        {/* File input for image */}
        <div className="w-full flex flex-col mt-6">
          <label className="text-lg">Product Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="w-full text-sm border rounded"
          />
        </div>

        {/* Product name input */}
        <div className="w-full flex flex-col mt-6">
          <label className="text-lg">Product Name:</label>
          <textarea
            name="name"
            defaultValue={product.name}
            onChange={handleInputChange}
            className="w-full h-16 p-1 border rounded"
          />
        </div>

        {/* Product details input */}
        <div className="w-full flex flex-col">
          <label className="text-lg">Product Details:</label>
          <textarea
            name="productDetails"
            defaultValue={product.productDetails}
            onChange={handleInputChange}
            className="w-full h-20 p-1 border rounded"
          />
        </div>

        {/* Price and old price input */}
        <div className="w-full flex flex-col mt-6">
          <label className="text-lg">Old Price ₦:</label>
          <input
            type="tel"
            name="old_price"
            defaultValue={product.old_price}
            onChange={handleInputChange}
            className="w-44 px-2 border rounded"
          />
        </div>

        <div className="w-full flex flex-col mt-6">
          <label className="text-lg">Price ₦:</label>
          <input
            type="tel"
            name="price"
            defaultValue={product.price}
            onChange={handleInputChange}
            className="w-44 px-2 border rounded"
          />
        </div>

        {/* Available quantity */}
        <div className="w-full flex flex-col mt-6">
          <label className="text-lg">Available Quantity:</label>
          <input
            type="tel"
            name="inStock"
            defaultValue={product.inStock}
            onChange={handleInputChange}
            className="w-44 px-2 border rounded"
          />
        </div>

        {/* Pay on delivery */}
        <div className="w-full flex flex-col mt-6">
          <label className="text-lg">Allow Pay on Delivery:</label>
          <Select
            options={options}
            defaultValue={options.find((option) => option.value === product.PayOnDelivery)}
            onChange={handleSelectChange}
            className="w-32"
          />
        </div>

        {/* Submit button */}
        <div className="w-full flex flex-col mt-6">
          {!prepareData && (
            <button
              type="submit"
              onClick={(e) => {
                uploadProduct(e);
              }}
              className="w-full py-2 text-lg font-bold bg-[#ef8300] text-white rounded-md"
            >
              {loading ? <ScaleLoader color="white" /> : "Ready"}
            </button>
          )}
          {prepareData && (
            <button
              type="submit"
              onClick={uploadProduct}
              className="w-full py-2 text-lg font-bold bg-purple-700 text-white rounded-md"
            >
              {loading ? <ScaleLoader color="white" /> : "Update Product"}
            </button>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Edit;

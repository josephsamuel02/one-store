/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 } from "uuid";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import ScaleLoader from "react-spinners/ScaleLoader";
import DefaultNav from "../components/AdminNav";
import { supabase } from "../../DB/supabase";
import ROUTES from "../../utils/Routes";

const darkSelectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: "#1f2937",
    borderColor: state.isFocused ? "#7c3aed" : "#374151",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(124, 58, 237, 0.25)" : "none",
    borderRadius: "0.5rem",
    padding: "2px 0",
    fontSize: "0.875rem",
    "&:hover": { borderColor: "#7c3aed" },
  }),
  menu: (base: any) => ({ ...base, backgroundColor: "#1f2937", border: "1px solid #374151" }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected ? "#7c3aed" : state.isFocused ? "#374151" : "#1f2937",
    color: state.isSelected ? "white" : "#d1d5db",
    fontSize: "0.875rem",
  }),
  singleValue: (base: any) => ({ ...base, color: "#e5e7eb" }),
  placeholder: (base: any) => ({ ...base, color: "#6b7280" }),
  input: (base: any) => ({ ...base, color: "#e5e7eb" }),
};

const Edit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const adminToken = localStorage.getItem("one_store_admin");

  const [product, setProduct] = useState<any>(null);
  const [newValue, setNewValue] = useState<any>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const payOnDeliveryOptions = [
    { value: false, label: "No" },
    { value: true, label: "Yes" },
  ];

  useEffect(() => {
    if (!adminToken) {
      navigate(ROUTES.ADMIN_LOGIN);
      return;
    }

    const fetchProduct = async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        console.error("Failed to fetch product:", error);
        toast.error("Product not found");
        return;
      }
      setProduct(data);
      setNewValue(data);
    };

    void fetchProduct();
  }, [id, adminToken, navigate]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewValue((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (option: any) => {
    setNewValue((prev: any) => ({ ...prev, PayOnDelivery: option.value }));
  };

  const uploadProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = newValue.image;

      if (imageFile) {
        const fileName = `${v4()}_${imageFile.name}`;
        const { error: storageError } = await supabase.storage
          .from("products")
          .upload(fileName, imageFile);

        if (storageError) {
          toast.error("Image upload failed: " + storageError.message);
          setLoading(false);
          return;
        }

        const { data: urlData } = supabase.storage.from("products").getPublicUrl(fileName);
        imageUrl = urlData.publicUrl;
      }

      const updatePayload: any = {
        name: newValue.name,
        productDetails: newValue.productDetails,
        features: typeof newValue.features === "string"
          ? newValue.features.split(",").map((f: string) => f.trim()).filter(Boolean)
          : newValue.features,
        old_price: newValue.old_price ? Number(newValue.old_price) : null,
        price: Number(newValue.price),
        stock: newValue.stock ? Number(newValue.stock) : null,
        PayOnDelivery: newValue.PayOnDelivery,
        image: imageUrl,
      };

      const { error } = await supabase
        .from("products")
        .update(updatePayload)
        .eq("id", id);

      if (error) {
        toast.error("Failed to update: " + error.message);
        return;
      }

      toast.success("Product updated successfully!");
      setTimeout(() => navigate(`${ROUTES.ADMIN_PRODUCT_DETAILS}/${id}`), 1200);
    } catch (error) {
      toast.error("Error updating product");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 text-sm font-roboto text-gray-200 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-gray-600";

  if (!product) {
    return (
      <div className="w-full min-h-screen bg-[#0c0e14]">
        <DefaultNav />
        <div className="flex items-center justify-center pt-32">
          <div className="w-10 h-10 border-4 border-gray-700 border-t-purple-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0c0e14]">
      <DefaultNav />

      <div className="max-w-xl mx-auto px-4 pt-24 md:pt-28 pb-12">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-sm text-purple-400 font-roboto font-medium hover:underline"
        >
          &larr; Back
        </button>

        <h1 className="text-2xl font-dayone text-gray-100 mb-6">Edit Product</h1>

        <div className="bg-gray-900 rounded-xl border border-gray-800/60 p-6">
          <div className="flex justify-center mb-6">
            <div className="w-48 h-48 rounded-xl bg-gray-800/60 border-2 border-dashed border-gray-700 flex items-center justify-center overflow-hidden">
              <img
                src={imagePreview || product.image}
                alt="Product"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>

          <form onSubmit={uploadProduct} className="space-y-4">
            <div>
              <label className="block text-sm font-roboto font-medium text-gray-300 mb-1">Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="w-full text-sm text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-roboto file:font-bold file:bg-purple-500/15 file:text-purple-400 hover:file:bg-purple-500/25 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-roboto font-medium text-gray-300 mb-1">Product Name</label>
              <textarea
                name="name"
                defaultValue={product.name}
                onChange={handleInputChange}
                className={`${inputClass} h-16 resize-none`}
              />
            </div>

            <div>
              <label className="block text-sm font-roboto font-medium text-gray-300 mb-1">Product Details</label>
              <textarea
                name="productDetails"
                defaultValue={product.productDetails}
                onChange={handleInputChange}
                className={`${inputClass} h-24 resize-none`}
              />
            </div>

            <div>
              <label className="block text-sm font-roboto font-medium text-gray-300 mb-1">Features (comma-separated)</label>
              <textarea
                name="features"
                defaultValue={Array.isArray(product.features) ? product.features.join(", ") : product.features}
                onChange={handleInputChange}
                className={`${inputClass} h-16 resize-none`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-roboto font-medium text-gray-300 mb-1">Old Price &#8358;</label>
                <input
                  type="number"
                  name="old_price"
                  defaultValue={product.old_price}
                  onChange={handleInputChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-roboto font-medium text-gray-300 mb-1">Price &#8358;</label>
                <input
                  type="number"
                  name="price"
                  defaultValue={product.price}
                  onChange={handleInputChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-roboto font-medium text-gray-300 mb-1">Stock Quantity</label>
              <input
                type="number"
                name="stock"
                defaultValue={product.stock}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-roboto font-medium text-gray-300 mb-1">Allow Pay on Delivery</label>
              <Select
                options={payOnDeliveryOptions}
                defaultValue={payOnDeliveryOptions.find((o) => o.value === product.PayOnDelivery)}
                onChange={handleSelectChange}
                styles={darkSelectStyles}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-base font-roboto font-bold text-white rounded-lg bg-Storepurple hover:bg-StorepurpleDark transition-colors disabled:opacity-50"
            >
              {loading ? <ScaleLoader color="white" height={20} /> : "Update Product"}
            </button>
          </form>
        </div>
      </div>

      <ToastContainer theme="dark" />
    </div>
  );
};

export default Edit;

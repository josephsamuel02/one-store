import React, { useEffect, useRef, useState } from "react";
import { v4 } from "uuid";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import SuccessCard from "./successCard";
import ScaleLoader from "react-spinners/ScaleLoader";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../utils/Routes";
import { supabase } from "../../DB/supabase";
import { MdCloudUpload, MdImage } from "react-icons/md";

/* eslint-disable @typescript-eslint/no-explicit-any */
const darkSelectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: "#1f2937",
    borderColor: state.isFocused ? "#7c3aed" : "#374151",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(124, 58, 237, 0.25)" : "none",
    borderRadius: "0.5rem",
    padding: "2px 0",
    fontSize: "0.875rem",
    color: "#e5e7eb",
    "&:hover": { borderColor: "#7c3aed" },
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: "#1f2937",
    border: "1px solid #374151",
  }),
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

const AdminUpload: React.FC = () => {
  const adminToken = localStorage.getItem("one_store_admin");
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCard, setShowCard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    productDetails: "",
    features: "",
    old_price: "",
    price: "",
    stock: "",
    category: "",
    PayOnDelivery: false,
  });

  const categoryOptions = [
    { value: "computers", label: "Computers" },
    { value: "accessories", label: "Accessories" },
    { value: "groceries", label: "Groceries" },
    { value: "fashion", label: "Fashion" },
    { value: "electronics", label: "Electronics" },
    { value: "sports", label: "Sports" },
    { value: "food", label: "Food" },
    { value: "baby", label: "Baby" },
    { value: "cosmetics", label: "Cosmetics" },
    { value: "wine", label: "Wines and liquor" },
    { value: "household", label: "Household" },
  ];

  const payOnDeliveryOptions = [
    { value: false, label: "No" },
    { value: true, label: "Yes" },
  ];

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    setImagePreview(URL.createObjectURL(file));
    setImageFile(file);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const uploadProduct = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("Please select a product image.");
      return;
    }
    if (!product.name || !product.price || !product.category) {
      toast.error("Please fill in name, price and category.");
      return;
    }

    setLoading(true);
    try {
      const fileName = `${v4()}_${imageFile.name}`;
      const { error: storageError } = await supabase.storage
        .from("products")
        .upload(fileName, imageFile);

      if (storageError) {
        console.error(storageError);
        toast.error("Image upload failed: " + storageError.message);
        return;
      }

      const { data: urlData } = supabase.storage.from("products").getPublicUrl(fileName);
      const imageUrl = urlData.publicUrl;

      const { error: insertError } = await supabase.from("products").insert({
        image: imageUrl,
        name: product.name,
        productDetails: product.productDetails || null,
        features: product.features
          ? product.features.split(",").map((f) => f.trim()).filter(Boolean)
          : null,
        old_price: product.old_price ? Number(product.old_price) : null,
        price: Number(product.price),
        stock: product.stock ? Number(product.stock) : null,
        category: product.category,
        PayOnDelivery: product.PayOnDelivery,
        uploaded_by: adminToken,
      });

      if (insertError) {
        console.error(insertError);
        toast.error("Product save failed: " + insertError.message);
        return;
      }

      setShowCard(true);
    } catch (err) {
      console.error(err);
      toast.error("Error: Failed to upload");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!adminToken) {
      navigate(ROUTES.ADMIN_LOGIN);
    }
  }, [adminToken, navigate]);

  const inputClass = "w-full px-4 py-3 text-sm font-roboto text-gray-200 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-gray-600";

  return (
    <div className="w-full px-4 md:px-8 py-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl text-gray-100 font-dayone">Upload Product</h2>
        <p className="text-sm text-gray-500 font-roboto mt-1">Add a new product to your store</p>
      </div>

      <div className="bg-gray-900 rounded-2xl border border-gray-800/60 overflow-hidden">
        <div className="p-6 md:p-8 bg-gradient-to-b from-gray-800/50 to-gray-900 border-b border-gray-800/60">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpg, image/jpeg, image/png, image/svg+xml"
            multiple={false}
            onChange={handleImageSelect}
            className="hidden"
          />

          {imagePreview ? (
            <div className="relative group flex justify-center">
              <div className="w-full max-w-xs">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-56 object-contain rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 w-full py-2 text-xs font-roboto font-medium text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg transition-colors"
                >
                  Change Image
                </button>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center py-12 px-6 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                dragOver
                  ? "border-purple-500 bg-purple-500/10 scale-[1.01]"
                  : "border-gray-700 hover:border-purple-500/50 hover:bg-gray-800/50"
              }`}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                dragOver ? "bg-Storepurple text-white" : "bg-gray-800 text-gray-500"
              }`}>
                <MdImage size={32} />
              </div>
              <p className="text-sm font-roboto font-medium text-gray-300">
                Drop your image here, or <span className="text-purple-400">browse</span>
              </p>
              <p className="text-xs font-roboto text-gray-600 mt-1">
                JPG, PNG or SVG
              </p>
            </div>
          )}
        </div>

        <div className="p-6 md:p-8">
          <form className="space-y-5">
            <div className="space-y-4">
              <h3 className="text-xs font-roboto font-bold text-gray-500 uppercase tracking-widest">
                Product Information
              </h3>

              <div>
                <label className="block text-sm font-roboto font-medium text-gray-300 mb-1.5">
                  Product Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={product.name}
                  onChange={(e) => setProduct((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Wireless Bluetooth Headphones"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-roboto font-medium text-gray-300 mb-1.5">
                  Product Details <span className="text-red-400">*</span>
                </label>
                <textarea
                  required
                  value={product.productDetails}
                  onChange={(e) => setProduct((p) => ({ ...p, productDetails: e.target.value }))}
                  placeholder="Describe the product in detail..."
                  rows={4}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label className="block text-sm font-roboto font-medium text-gray-300 mb-1.5">
                  Features
                </label>
                <textarea
                  value={product.features}
                  onChange={(e) => setProduct((p) => ({ ...p, features: e.target.value }))}
                  placeholder="Noise cancellation, 20hr battery, Foldable design"
                  rows={2}
                  className={`${inputClass} resize-none`}
                />
                <p className="mt-1 text-xs font-roboto text-gray-600">Separate features with commas</p>
              </div>

              <div>
                <label className="block text-sm font-roboto font-medium text-gray-300 mb-1.5">
                  Category <span className="text-red-400">*</span>
                </label>
                <Select
                  options={categoryOptions}
                  onChange={(e) => setProduct((p) => ({ ...p, category: e?.value ?? "" }))}
                  styles={darkSelectStyles}
                  placeholder="Select a category..."
                />
              </div>
            </div>

            <div className="border-t border-gray-800" />

            <div className="space-y-4">
              <h3 className="text-xs font-roboto font-bold text-gray-500 uppercase tracking-widest">
                Pricing & Stock
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-roboto font-medium text-gray-300 mb-1.5">
                    Price &#8358; <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-roboto">&#8358;</span>
                    <input
                      type="number"
                      required
                      value={product.price}
                      onChange={(e) => setProduct((p) => ({ ...p, price: e.target.value }))}
                      placeholder="0"
                      className={`${inputClass} pl-8`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-roboto font-medium text-gray-300 mb-1.5">
                    Old Price &#8358;
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-roboto">&#8358;</span>
                    <input
                      type="number"
                      value={product.old_price}
                      onChange={(e) => setProduct((p) => ({ ...p, old_price: e.target.value }))}
                      placeholder="0"
                      className={`${inputClass} pl-8`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-roboto font-medium text-gray-300 mb-1.5">
                    Stock Qty <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={product.stock}
                    onChange={(e) => setProduct((p) => ({ ...p, stock: e.target.value }))}
                    placeholder="0"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800" />

            <div className="space-y-4">
              <h3 className="text-xs font-roboto font-bold text-gray-500 uppercase tracking-widest">
                Options
              </h3>
              <div>
                <label className="block text-sm font-roboto font-medium text-gray-300 mb-1.5">
                  Allow Pay on Delivery
                </label>
                <Select
                  options={payOnDeliveryOptions}
                  defaultValue={payOnDeliveryOptions[0]}
                  onChange={(e) => setProduct((p) => ({ ...p, PayOnDelivery: e?.value ?? false }))}
                  styles={darkSelectStyles}
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                disabled={loading}
                onClick={uploadProduct}
                className="w-full flex items-center justify-center gap-2 py-3.5 text-base font-roboto font-bold text-white rounded-xl bg-Storepurple hover:bg-StorepurpleDark active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-purple-600/20 hover:shadow-md hover:shadow-purple-600/30"
              >
                {loading ? (
                  <ScaleLoader color="white" height={20} />
                ) : (
                  <>
                    <MdCloudUpload size={22} />
                    Upload Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer theme="dark" />
      <SuccessCard
        showCard={showCard}
        setShowCard={setShowCard}
        Text="Your Product was successfully uploaded"
      />
    </div>
  );
};

export default AdminUpload;

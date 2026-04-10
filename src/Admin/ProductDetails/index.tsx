/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ROUTES from "../../utils/Routes";
import { supabase } from "../../DB/supabase";
import DefaultNav from "../components/AdminNav";
import { MdDeleteOutline } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";

const AdminProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const adminToken = localStorage.getItem("one_store_admin");
  const priceFormat = new Intl.NumberFormat("en-US");

  const [product, setProduct] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

      if (error) {
        console.error("Failed to fetch product:", error);
        return;
      }
      setProduct(data);
    };

    void fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);
    const { error } = await supabase.from("products").delete().eq("id", id);
    setDeleting(false);
    if (error) {
      toast.error("Failed to delete product");
      setShowConfirm(false);
      return;
    }
    toast.success("Product deleted");
    setTimeout(() => navigate(ROUTES.ADMIN_LANDINGPAGE), 1000);
  };

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

  const features: string[] = Array.isArray(product.features) ? product.features : [];

  return (
    <div className="w-full min-h-screen bg-[#0c0e14]">
      <DefaultNav />

      <div className="max-w-4xl mx-auto px-4 md:px-6 pt-24 md:pt-28 pb-12">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-purple-400 font-roboto font-medium hover:underline"
          >
            &larr; Back
          </button>

          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-roboto font-bold text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors"
          >
            <MdDeleteOutline size={16} />
            Delete product
          </button>
        </div>

        <h1 className="text-2xl md:text-3xl font-dayone text-gray-100 mb-6">Product Details</h1>

        <div className="bg-gray-900 rounded-xl border border-gray-800/60 overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-2/5 bg-gray-800/40 flex items-center justify-center p-6">
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-h-72 object-contain rounded-lg"
            />
          </div>

          <div className="flex-1 p-6 md:p-8 flex flex-col gap-4">
            <div>
              <p className="text-xs text-gray-500 font-roboto uppercase tracking-wider">Name</p>
              <p className="text-lg font-roboto font-bold text-gray-100">{product.name}</p>
            </div>

            <div className="flex flex-wrap gap-x-10 gap-y-4">
              <div>
                <p className="text-xs text-gray-500 font-roboto uppercase tracking-wider">Price</p>
                <p className="text-xl font-dayone text-gray-100">&#8358;{priceFormat.format(Number(product.price) || 0)}</p>
              </div>
              {product.old_price && (
                <div>
                  <p className="text-xs text-gray-500 font-roboto uppercase tracking-wider">Old Price</p>
                  <p className="text-xl font-dayone text-gray-500 line-through">&#8358;{priceFormat.format(Number(product.old_price) || 0)}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 font-roboto uppercase tracking-wider">Stock</p>
                <p className="text-xl font-dayone text-gray-100">{product.stock ?? "—"}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-roboto uppercase tracking-wider">Category</p>
              <p className="text-sm font-roboto text-gray-300">{product.category ?? "—"}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-roboto uppercase tracking-wider">Product ID</p>
              <p className="text-xs font-roboto text-gray-600 font-mono">{product.id}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-roboto uppercase tracking-wider">Details</p>
              <p className="text-sm font-roboto text-gray-300 leading-relaxed">{product.productDetails ?? "—"}</p>
            </div>

            {features.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 font-roboto uppercase tracking-wider mb-1">Features</p>
                <ul className="list-disc list-inside space-y-1">
                  {features.map((f, idx) => (
                    <li key={idx} className="text-sm font-roboto text-gray-300">{f}</li>
                  ))}
                </ul>
              </div>
            )}

            <a
              href={`${ROUTES.ADMIN_EDIT_PRODUCT}/${id}`}
              className="mt-4 w-full md:w-auto text-center px-8 py-3 text-base font-roboto font-bold text-white rounded-lg bg-Storepurple hover:bg-StorepurpleDark transition-colors"
            >
              Edit Product
            </a>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center flex-shrink-0">
                <MdDeleteOutline size={22} className="text-red-400" />
              </div>
              <div>
                <p className="text-base font-dayone text-gray-100">Delete product?</p>
                <p className="text-xs font-roboto text-gray-500 mt-0.5">This action cannot be undone.</p>
              </div>
            </div>

            <div className="bg-gray-800/60 rounded-lg px-4 py-3 mb-5 border border-gray-700/60">
              <p className="text-sm font-roboto font-bold text-gray-200 truncate">{product.name}</p>
              <p className="text-xs font-roboto text-gray-500 font-mono truncate mt-0.5">{product.id}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
                className="flex-1 py-2.5 text-sm font-roboto font-bold text-gray-300 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 text-sm font-roboto font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting…
                  </>
                ) : (
                  "Yes, delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer theme="dark" />
    </div>
  );
};

export default AdminProductDetails;

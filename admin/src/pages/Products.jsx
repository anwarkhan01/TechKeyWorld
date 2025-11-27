import React, { useEffect, useState, useCallback } from "react";
import { Edit, Search, Trash2, Upload } from "lucide-react";
import Pagination from "../components/Pagination";
import { API_BASE } from "../utils/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inline editing states
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/products?page=${currentPage}&limit=20&search=${searchTerm}`
      );
      const data = await res.json();
      setProducts(data?.data?.products || []);
      setTotalPages(data?.data?.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, fetchProducts]);

  // --- EDIT LOGIC ---
  const startEdit = (p) => {
    setEditingId(p._id);
    setEditForm({
      product_name: p.product_name,
      category: p.category,
      price: p.price,
      mrp: p.mrp,
      stock_quantity: p.stock_quantity,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveProduct = async (id) => {
    try {
      await fetch(`${API_BASE}/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      cancelEdit();
      fetchProducts();
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  // --- DELETE ---
  const deleteProduct = async (productId) => {
    if (!confirm("Delete this product?")) return;
    try {
      await fetch(`${API_BASE}/products/${productId}`, { method: "DELETE" });
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // --- BULK UPLOAD ---
  const handleBulkUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploadProgress({ status: "uploading", message: "Uploading..." });
    try {
      const res = await fetch(`${API_BASE}/products/bulk-upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      setUploadProgress({
        status: "success",
        message: `Uploaded ${data?.data?.successCount || 0} products`,
        errors: data?.data?.errors || [],
      });

      fetchProducts();
    } catch (err) {
      setUploadProgress({ status: "error", message: err.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wide">
            Catalog
          </p>
          <h1 className="text-3xl font-bold">Products</h1>
        </div>

        <label className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700 cursor-pointer">
          <Upload size={18} />
          <span>Upload Excel</span>
          <input
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleBulkUpload}
          />
        </label>
      </div>

      {/* Upload progress */}
      {uploadProgress && (
        <div
          className={`rounded-2xl border p-4 text-sm ${
            uploadProgress.status === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : uploadProgress.status === "error"
              ? "border-red-200 bg-red-50 text-red-800"
              : "border-blue-200 bg-blue-50 text-blue-800"
          }`}
        >
          <p className="font-medium">{uploadProgress.message}</p>

          {uploadProgress.errors?.length > 0 && (
            <details className="mt-2">
              <summary className="cursor-pointer text-xs text-red-600">
                View {uploadProgress.errors.length} errors
              </summary>
              <div className="mt-1 space-y-1">
                {uploadProgress.errors.slice(0, 5).map((err, idx) => (
                  <p key={idx}>
                    Row {err.row}: {err.error}
                  </p>
                ))}
              </div>
            </details>
          )}
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 text-left">Product ID</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">MRP</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Stock</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-8">
                  <div className="flex justify-center">
                    <div className="h-8 w-8 border-b-2 border-gray-900 rounded-full animate-spin" />
                  </div>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((p) => {
                const editing = editingId === p._id;

                return (
                  <tr key={p._id} className="hover:bg-gray-50/70">
                    {/* PRODUCT ID */}
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {p.product_id}
                    </td>

                    {/* NAME */}
                    <td className="px-6 py-4 font-semibold">
                      {editing ? (
                        <input
                          className="border rounded px-2 py-1 w-full text-sm"
                          value={editForm.product_name}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              product_name: e.target.value,
                            })
                          }
                        />
                      ) : (
                        p.product_name
                      )}
                    </td>

                    {/* CATEGORY */}
                    <td className="px-6 py-4">
                      {editing ? (
                        <input
                          className="border rounded px-2 py-1 w-full text-sm"
                          value={editForm.category}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              category: e.target.value,
                            })
                          }
                        />
                      ) : (
                        p.category || "—"
                      )}
                    </td>

                    {/* MRP */}
                    <td className="px-6 py-4">
                      {editing ? (
                        <input
                          type="number"
                          className="border rounded px-2 py-1 w-full text-sm"
                          value={editForm.mrp}
                          onChange={(e) =>
                            setEditForm({ ...editForm, mrp: e.target.value })
                          }
                        />
                      ) : (
                        <span className="line-through text-gray-500">
                          ₹{p.mrp}
                        </span>
                      )}
                    </td>

                    {/* PRICE */}
                    <td className="px-6 py-4 font-medium">
                      {editing ? (
                        <input
                          type="number"
                          className="border rounded px-2 py-1 w-full text-sm"
                          value={editForm.price}
                          onChange={(e) =>
                            setEditForm({ ...editForm, price: e.target.value })
                          }
                        />
                      ) : (
                        <>₹{p.price}</>
                      )}
                    </td>

                    {/* STOCK */}
                    <td className="px-6 py-4">
                      {editing ? (
                        <input
                          type="number"
                          className="border rounded px-2 py-1 w-full text-sm"
                          value={editForm.stock_quantity}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              stock_quantity: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <span
                          className={`${
                            p.stock_quantity < 10 ? "text-red-600" : ""
                          } font-semibold`}
                        >
                          {p.stock_quantity}
                        </span>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {editing ? (
                          <>
                            <button
                              onClick={() => saveProduct(p._id)}
                              className="rounded-xl border border-green-200 bg-green-50 px-3 py-1.5 text-green-700 hover:bg-green-100 text-xs"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="rounded-xl border border-gray-200 px-3 py-1.5 text-gray-600 hover:border-gray-300 text-xs"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => startEdit(p)}
                            className="rounded-xl border border-gray-200 px-3 py-1.5 text-gray-600 hover:border-gray-300"
                          >
                            <Edit size={16} />
                          </button>
                        )}

                        {!editing && (
                          <button
                            onClick={() => deleteProduct(p._id)}
                            className="rounded-xl border border-red-100 bg-red-50 px-3 py-1.5 text-red-600 hover:bg-red-100"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default Products;

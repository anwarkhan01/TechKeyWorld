import { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ShoppingCart, CreditCard } from "lucide-react";
import { useProducts } from "../contexts/ProductsContext.jsx";
import { useCart } from "../contexts/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function ProductDetail() {
  const { products, loading, getProductsByIds } = useProducts();
  const { user } = useAuth();
  const { id } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const product = useMemo(
    () => products.find((p) => p.product_id === id),
    [id, products]
  );
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!product && !loading) {
      getProductsByIds([id]);
    }
  }, [id, product, loading, getProductsByIds]);

  if (loading || !product) {
    return (
      <main className="flex justify-center items-center h-[60vh] text-lg font-semibold">
        {loading ? "Loading..." : "Product not found"}
      </main>
    );
  }

  const handleAddToCart = (product) => {
    addToCart(product);
    navigate("/cart");
  };
  const images = product.images?.length ? product.images : [product.image];

  const handleBuyNow = (productID) => {
    navigate("/checkout", { state: { buyNowItemId: productID } });
  };

  return (
    <main className="bg-background py-10">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* LEFT SECTION — STICKY IMAGE */}
          <div className="lg:sticky lg:top-24 h-fit flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden bg-white shadow-sm">
              <img
                src={
                  images[activeImg] ||
                  "https://placehold.co/600x400?text=Image+Not+Found"
                }
                alt={product.product_name}
                className="w-full object-contain max-h-[500px]"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/600x400?text=Image+Not+Found";
                }}
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#f0c14b] px-5 py-3 font-semibold text-black shadow hover:bg-[#e2b23a] transition cursor-pointer"
                onClick={() => handleAddToCart(product)}
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>

              <button
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#fa8900] px-5 py-3 font-semibold text-white shadow hover:bg-[#e67e00] transition cursor-pointer"
                onClick={() => handleBuyNow(product.product_id)}
              >
                <CreditCard className="h-5 w-5" />
                Buy Now
              </button>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`shrink-0 border rounded-lg overflow-hidden w-20 h-20 ${
                      i === activeImg ? "border-[#fa8900]" : "border-gray-200"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SECTION */}
          <div className="flex flex-col gap-6 pb-20">
            {/* Name + Price */}
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {product.product_name}
              </h1>

              <div className="flex items-center gap-3 mt-2">
                <span className="text-3xl font-bold text-green-700">
                  ₹{product.price}
                </span>

                {product.mrp > product.price && (
                  <>
                    <span className="text-lg line-through text-gray-500">
                      ₹{product.mrp}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-500 text-white">
                      -
                      {Math.round(
                        ((product.mrp - product.price) / product.mrp) * 100
                      )}
                      %
                    </span>
                  </>
                )}
              </div>

              {product.publisher && (
                <p className="text-sm text-gray-600 mt-1">
                  by {product.publisher}
                </p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-base text-muted-foreground leading-relaxed border-t border-gray-200 pt-4">
                {product.description}
              </p>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm border border-gray-200 rounded-xl p-4">
              <p>
                <span className="font-semibold">Platform:</span>{" "}
                {product.platform}
              </p>

              <p>
                <span className="font-semibold">License:</span>{" "}
                {product.license_type}
              </p>

              <p>
                <span className="font-semibold">Devices:</span>{" "}
                {product.device_limit}
              </p>

              {product.version && (
                <p>
                  <span className="font-semibold">Version:</span>{" "}
                  {product.version}
                </p>
              )}

              {/* Show duration only for subscription */}
              {product.license_type?.toLowerCase() === "subscription" &&
                product.duration && (
                  <p>
                    <span className="font-semibold">Duration:</span>{" "}
                    {product.duration}
                  </p>
                )}
            </div>

            {/* Features */}
            {product.features?.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Key Features</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  {product.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* System Requirements */}
            {product.system_requirements?.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  System Requirements
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  {product.system_requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Activation Steps */}
            {product.activation_steps?.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Activation Steps</h3>
                <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
                  {product.activation_steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Stock */}
            <div className="text-sm text-gray-700">
              <span className="font-semibold">Stock:</span>{" "}
              {product.stock_quantity} available
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

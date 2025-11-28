import { Clock, Users, Monitor, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext.jsx";
export default function ProductCard({ product, idx, isDark }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const platforms = product.platform ? product.platform.split("|") : [];

  console.log(product);
  const discount =
    product.mrp && product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  return (
    <div
      onClick={() => navigate(`/product/${product.product_id}`)}
      className="group relative"
      style={{ animationDelay: `${idx * 100}ms` }}
    >
      {/* Glow */}
      <div className="absolute -inset-1 bg-linear-to-r from-yellow-500/30 to-yellow-300/10 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition duration-500" />

      <div
        className={`relative ${
          isDark ? "bg-linear-to-br from-white/5 to-white/2" : "bg-white/80"
        } backdrop-blur-xl rounded-xl sm:rounded-2xl border ${
          isDark
            ? "border-white/10 hover:border-white/30"
            : "border-yellow-300/40 hover:border-yellow-400"
        } overflow-hidden h-full transition duration-500`}
      >
        {/* Image */}
        <Link
          to={`/product/${product.product_id}`}
          className="block bg-linear-to-br from-gray-50 to-gray-100 px-4 pt-4 pb-3"
        >
          <img
            src={
              product.image_url ||
              "https://placehold.co/600x400?text=Image+Not+Found"
            }
            // src={"https://placehold.co/600x400?text=Image+Not+Found"}
            alt={product.product_name}
            className="w-full h-40 sm:h-44 object-contain transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/600x400?text=Image+Not+Found";
            }}
          />

          {/* Top-left: Platform */}
          {platforms.length > 0 && (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 border border-gray-300 text-gray-800 shadow">
              {platforms.join(" / ")}
            </span>
          )}

          {/* Top-right: Discount */}
          {discount > 0 && (
            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-500 text-white shadow">
              {product.duration ? product.duration + "M " : "LifeTime"}
            </span>
          )}
        </Link>

        {/* Body */}
        <div className="p-4 sm:px-6 sm:pt-6 sm:pb-4">
          {/* Title */}
          <h3
            className={`text-base sm:text-xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            } mb-2 group-hover:text-yellow-600 transition truncate`}
          >
            {product.product_name}
          </h3>

          {/* Publisher */}
          {product.publisher && (
            <p
              className={`text-xs sm:text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              } mb-2`}
            >
              {product.publisher}
            </p>
          )}

          {/* Description */}
          {product.description && (
            <p
              className={`text-xs sm:text-sm ${
                isDark ? "text-gray-400" : "text-gray-700"
              } truncate mb-4`}
            >
              {product.description}
            </p>
          )}

          {/* Price */}
          <div className="flex items-end justify-between mb-5">
            <div>
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-2xl sm:text-3xl font-black ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  ₹{product.price}
                </span>

                {product.mrp > product.price && (
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-yellow-500 text-white">
                    -{discount}%
                  </span>
                )}
              </div>

              {product.mrp > product.price && (
                <span
                  className={`text-xs sm:text-sm ${
                    isDark ? "text-gray-500" : "text-gray-600"
                  } line-through`}
                >
                  ₹{product.mrp}
                </span>
              )}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
              navigate("/cart");
            }}
            disabled={product.stock_quantity === 0}
            className={`w-full py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold bg-gray-900 text-white hover:bg-black transition flex items-center justify-center gap-2 text-sm sm:text-base`}
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            {product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
          </button>

          {/* Bottom stats */}
          <div
            className={`mt-3 sm:mt-4 flex items-center justify-between text-[10px] sm:text-xs ${
              isDark ? "text-gray-500" : "text-gray-700"
            }`}
          >
            {/* Stock */}
            <span>
              {product.stock_quantity > 0
                ? `${product.stock_quantity} in stock`
                : "Out of stock"}
            </span>

            {/* Device Limit */}
            {product.device_limit && (
              <span>
                {product.device_limit} device
                {product.device_limit > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

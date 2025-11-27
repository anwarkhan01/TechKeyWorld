import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, Truck } from "lucide-react";
import { useCart } from "../contexts/CartContext.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import Toast from "../components/Toast.jsx";

export default function Cart() {
  const { cartItems, increaseQty, decreaseQty, removeFromCart, clearCart } =
    useCart();
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState({});

  const totals = useMemo(() => {
    const subtotalMRP = cartItems.reduce(
      (acc, it) => acc + (it.mrp || it.price) * (it.quantity || 1),
      0
    );

    const subtotalPrice = cartItems.reduce(
      (acc, it) => acc + (it.price || 0) * (it.quantity || 1),
      0
    );

    return {
      subtotalMRP,
      discount: subtotalMRP - subtotalPrice,
      grandTotal: subtotalPrice,
    };
  }, [cartItems]);

  const handleCheckoutClick = () => navigate("/checkout");

  const removeItem = (id, name) => {
    removeFromCart(id);
    setToastData({ message: `${name} removed`, type: "success" });
    setShowToast(true);
  };

  return (
    <main className="bg-gray-50 min-h-screen py-4">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center">
            <p className="text-gray-500 text-sm">Your cart is empty.</p>
            <Link
              to="/"
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.toReversed().map((it) => (
                <div
                  key={it.product_id}
                  className="bg-white rounded-xl shadow-sm p-3 flex items-center gap-3"
                >
                  {/* Image */}
                  <Link
                    to={`/product/${it.product_id}`}
                    className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0"
                  >
                    <img
                      src={
                        it.image || "https://placehold.co/300x300?text=No+Image"
                      }
                      alt={it.product_name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* Middle content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <Link
                        to={`/product/${it.product_id}`}
                        className="font-semibold text-gray-800 text-sm sm:text-base line-clamp-1"
                      >
                        {it.product_name}
                      </Link>

                      {/* Mobile remove icon */}
                      <button
                        onClick={() =>
                          removeItem(it.product_id, it.product_name)
                        }
                        className="p-2 rounded-md hover:bg-gray-100 text-red-500 sm:hidden"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {it.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {it.description}
                      </p>
                    )}

                    <div className="flex justify-between items-center mt-2">
                      {/* Quantity */}
                      <div className="inline-flex items-center rounded-md border border-gray-300">
                        <button
                          onClick={() => decreaseQty(it.product_id)}
                          className="px-3 py-2 hover:bg-gray-100"
                        >
                          <Minus className="h-4 w-4 text-gray-600" />
                        </button>
                        <span className="w-10 text-center text-sm">
                          {it.quantity}
                        </span>
                        <button
                          onClick={() => increaseQty(it.product_id)}
                          className="px-3 py-2 hover:bg-gray-100"
                        >
                          <Plus className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>

                      {/* Price + Desktop Remove */}
                      <div className="text-right">
                        <p className="font-bold text-green-700 text-lg whitespace-nowrap">
                          ₹{it.price}
                        </p>
                        <p className="text-xs text-gray-500 line-through whitespace-nowrap">
                          ₹{it.mrp}
                        </p>

                        <button
                          onClick={() =>
                            removeItem(it.product_id, it.product_name)
                          }
                          className="hidden sm:inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 mt-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={clearCart}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100"
                >
                  Clear Cart
                </button>
                <Link
                  to="/"
                  className="rounded-md bg-white px-3 py-2 text-sm shadow-sm hover:shadow-md border border-gray-200"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-xl shadow-md p-6 h-max">
              <h2 className="text-sm font-semibold text-gray-800 mb-4">
                PRICE DETAILS
              </h2>

              {/* Product list */}
              {/* <div className="space-y-4">
                {cartItems.toReversed().map((item) => (
                  <div
                    key={item.product_id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800">
                        {item.product_name}
                      </span>
                      <span className="text-xs text-gray-500">
                        Qty: {item.quantity} x ₹{item.price}
                      </span>
                    </div>
                    <span className="font-medium text-gray-800">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div> */}

              <hr className="my-4 border-gray-200" />

              {/* Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-semibold">₹{totals.subtotalMRP}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Discount</span>
                  <span className="font-medium text-green-600">
                    -₹{totals.discount}
                  </span>
                </div>

                <hr className="my-2 border-gray-200" />

                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>₹{totals.grandTotal}</span>
                </div>
              </div>

              <button
                className="mt-6 w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                onClick={handleCheckoutClick}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      {showToast && (
        <Toast
          message={toastData.message}
          type={toastData.type}
          duration={toastData.duration}
          onclose={() => setShowToast(false)}
        />
      )}
    </main>
  );
}

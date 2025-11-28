import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE } from "../utils/api";

const UserDetail = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE}/users/${userId}`);
        const json = await res.json();

        setUser(json?.data?.user || null);
        setOrders(json?.data?.orders || []);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (!user) return <div className="p-6">No user found</div>;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <img
          src={user.photoURL}
          alt={user.name}
          className="w-24 h-24 rounded-full shadow"
        />
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-500">UID: {user.firebaseUid}</p>
        </div>
      </div>

      {/* TOP GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Info */}
        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-xl font-semibold mb-3">User Info</h2>
          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>
            <p>
              <strong>Auth Provider:</strong> {user.authProvider}
            </p>
            <p>
              <strong>Email Verified:</strong>{" "}
              {user.emailVerified ? "Yes" : "No"}
            </p>
            <p>
              <strong>Joined:</strong>{" "}
              {new Date(user.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white shadow rounded-lg p-5">
          <h2 className="text-xl font-semibold mb-3">Address</h2>
          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Address:</strong> {user.address.fullAddress}
            </p>
            <p>
              <strong>Landmark:</strong> {user.address.landmark}
            </p>
            <p>
              <strong>City:</strong> {user.address.city}
            </p>
            <p>
              <strong>State:</strong> {user.address.state}
            </p>
            <p>
              <strong>Country:</strong> {user.address.country}
            </p>
            <p>
              <strong>Pincode:</strong> {user.address.pincode}
            </p>
          </div>
        </div>
      </div>

      {/* Orders */}
      <div className="bg-white shadow rounded-lg p-5">
        <h2 className="text-xl font-semibold mb-3">Orders ({orders.length})</h2>

        {orders.length === 0 && <p className="text-gray-600">No orders yet.</p>}

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="p-4 border rounded-lg">
              {/* Top Row */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-lg">
                  Order #{order.orderId}
                </h3>
                <span className="px-3 py-1 rounded text-sm bg-blue-100 text-blue-700">
                  {order.status}
                </span>
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700 mb-4">
                <p>
                  <strong>Payment ID:</strong> {order.paymentId}
                </p>
                <p>
                  <strong>Total:</strong> ₹{order.productData.totalPrice}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Product Table */}
              <div>
                <strong className="block mb-2">Products:</strong>
                <table className="w-full border text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-2 py-1 text-left">Product</th>
                      <th className="border px-2 py-1">Qty</th>
                      <th className="border px-2 py-1">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.productData.products.map((p, i) => (
                      <tr key={i}>
                        <td className="border px-2 py-1">{p.product_name}</td>
                        <td className="border px-2 py-1 text-center">
                          {p.quantity}
                        </td>
                        <td className="border px-2 py-1 text-center">
                          ₹{p.product_price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Billing Address - Horizontal Layout */}
              <div className="mt-5">
                <strong className="block mb-2 text-lg">Billing Address</strong>

                <div className="bg-gray-50 p-4 rounded-md border grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                  <div>
                    <p>
                      <strong>Name:</strong> {order.billingAddress.name}
                    </p>
                    <p>
                      <strong>Phone:</strong> {order.billingAddress.phone}
                    </p>
                  </div>

                  <div>
                    <p>
                      <strong>Address:</strong> {order.billingAddress.address}
                    </p>
                    <p>
                      <strong>Landmark:</strong> {order.billingAddress.landmark}
                    </p>
                  </div>

                  <div>
                    <p>
                      <strong>City:</strong> {order.billingAddress.city}
                    </p>
                    <p>
                      <strong>State:</strong> {order.billingAddress.state}
                    </p>
                    <p>
                      <strong>Country:</strong> {order.billingAddress.country}
                    </p>
                    <p>
                      <strong>Pincode:</strong> {order.billingAddress.pincode}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;

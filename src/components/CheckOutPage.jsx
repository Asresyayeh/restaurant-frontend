import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChapaPayment from "./ChapaPayment";

const API_URL = import.meta.env.VITE_API_URL;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showChapaPayment, setShowChapaPayment] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "chapa",
  });

  const getUserIdFromToken = (token) => {
    try {
      if (!token) return null;
      const payload = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payload));
      return decodedPayload.id || decodedPayload.userId || decodedPayload._id;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = getUserIdFromToken(token);

    const fetchCart = async () => {
      try {
        const res = await fetch(`${API_URL}/cart/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch cart");

        const data = await res.json();
        console.log("Fetched cart:", data);
        setCartItems(data.data?.items || data.items || []);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };

    if (userId && token) {
      fetchCart();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo({ ...customerInfo, [name]: value });
  };

  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + (item.menuItem?.price || item.price || 0) * item.quantity,
    0,
  );

  const validateForm = () => {
    if (!customerInfo.name.trim()) {
      alert("Please enter your name");
      return false;
    }
    if (!customerInfo.email.trim() || !customerInfo.email.includes("@")) {
      alert("Please enter a valid email address");
      return false;
    }
    if (!customerInfo.phone.trim()) {
      alert("Please enter your phone number");
      return false;
    }
    if (!customerInfo.address.trim()) {
      alert("Please enter delivery address");
      return false;
    }
    if (!cartItems.length) {
      alert("Your cart is empty!");
      return false;
    }
    return true;
  };

  const placeCashOrder = async () => {
    const token = localStorage.getItem("token");
    const userId = getUserIdFromToken(token);

    const restaurantId =
      cartItems[0]?.menuItem?.restaurant?._id ||
      cartItems[0]?.menuItem?.restaurant;

    const items = cartItems.map((item) => ({
      menuItem: item.menuItem?._id || item._id,
      quantity: item.quantity,
    }));

    const orderData = {
      user: userId,
      restaurant: restaurantId,
      items,
      totalPrice,
      paymentMethod: "cash",
      deliveryAddress: customerInfo.address,
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
    };

    console.log("✅ Sending order data:", orderData);

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("❌ Order placement failed:", data);
        throw new Error(data.message || "Failed to place order");
      }

      console.log("Order placed successfully:", data);

      await clearCart();

      alert("Order placed successfully!");
      navigate("/order-confirmation", { state: { order: data.data } });
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Error placing order. Try again.");
    }
  };

  const prepareChapaOrder = () => {
    const token = localStorage.getItem("token");
    const userId = getUserIdFromToken(token);

    const restaurantId = cartItems[0]?.menuItem?.restaurant?._id;

    const items = cartItems.map((item) => ({
      menuItem: item.menuItem?._id || item._id,
      quantity: item.quantity,
    }));

    // FIXED: Form values are mapped explicitly to block back-end hardcoding fallbacks
    const orderData = {
      userId: userId,
      restaurantId: restaurantId,
      items,
      totalPrice,
      deliveryAddress: customerInfo.address,
      email: customerInfo.email.trim(),
      phone: customerInfo.phone.trim(),
      name: customerInfo.name.trim(),
    };

    setCurrentOrder(orderData);
    setShowChapaPayment(true);
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = getUserIdFromToken(token);

      await fetch(`${API_URL}/cart/clear/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCartItems([]);
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      if (customerInfo.paymentMethod === "chapa") {
        prepareChapaOrder();
      } else {
        await placeCashOrder();
      }
    } catch (error) {
      console.error("Order error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChapaSuccess = (paymentData) => {
    console.log("Chapa payment successful:", paymentData);
    alert("Payment successful! Your order has been placed.");
    clearCart();
    navigate("/order-confirmation", {
      state: {
        order: currentOrder,
        payment: paymentData,
      },
    });
  };

  const handleChapaCancel = () => {
    setShowChapaPayment(false);
    setCurrentOrder(null);
  };

  if (showChapaPayment && currentOrder) {
    return (
      <ChapaPayment
        order={currentOrder}
        customerInfo={customerInfo}
        onSuccess={handleChapaSuccess}
        onCancel={handleChapaCancel}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <h2 className="text-3xl font-bold text-center m-10 ">Checkout</h2>

      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Delivery Information */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Delivery Information</h3>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name *"
              value={customerInfo.name}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address *"
              value={customerInfo.email}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number *"
              value={customerInfo.phone}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
            <textarea
              name="address"
              placeholder="Delivery Address *"
              value={customerInfo.address}
              onChange={handleChange}
              rows="3"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />

            {/* Payment Method Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method *
              </label>
              <select
                name="paymentMethod"
                value={customerInfo.paymentMethod}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 cursor-not-allowed focus:outline-none"
                disabled
              >
                <option value="chapa">🏦 Chapa Online Payment</option>
              </select>

              <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>🧪 Real Chapa Integration (Test Mode)</strong>
                </p>
                <div className="mt-2 text-xs text-blue-600">
                  <p>✅ Real Chapa payment flow</p>
                  <p>✅ Test environment - No real money</p>
                  <p>✅ Professional integration for your project</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

          {cartItems.length ? (
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center py-2 border-b border-gray-200"
                >
                  <div className="flex-1">
                    <p className="font-medium">
                      {item.menuItem?.name || item.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ETB{" "}
                    {(
                      (item.menuItem?.price || item.price || 0) * item.quantity
                    ).toFixed(2)}
                  </p>
                </div>
              ))}

              <div className="border-t pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <p>Total:</p>
                  <p>ETB {totalPrice.toFixed(2)}</p>
                </div>

                <div className="mt-2 p-2 bg-yellow-50 rounded">
                  <p className="text-xs text-yellow-700 text-center">
                    🧪 Test Mode: No additional fees
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Your cart is empty.
            </p>
          )}

          <button
            onClick={handlePlaceOrder}
            disabled={loading || !cartItems.length}
            className="mt-6 w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              "Continue to Chapa Payment"
            )}
          </button>

          {/* Project Note */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700 text-center">
              <strong>🎓 Student Project:</strong> Real Chapa integration with
              test mode
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

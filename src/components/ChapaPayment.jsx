import React, { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const ChapaPayment = ({ order, customerInfo, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isTestMode, setIsTestMode] = useState(true); 

  const totalAmount = order.totalPrice;

  const initializeChapaPayment = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      // Generate unique transaction reference
      const tx_ref = `test-${order.userId}-${Date.now()}`;

      const requestData = {
        amount: totalAmount,
        currency: "ETB",
        email: `${customerInfo.phone}@test.com`,
        first_name: customerInfo.name.split(" ")[0] || "Test",
        last_name: customerInfo.name.split(" ")[1] || "User",
        phone_number: customerInfo.phone,
        tx_ref: tx_ref,
        callback_url: `${window.location.origin}/api/payment/chapa/webhook`,
        return_url: `${window.location.origin}/order-confirmation`,
        customization: {
          title: "Student Project - Test Payment",
          description: `Test payment for order from ${customerInfo.name}`,
        },
        order_data: {
          orderId: order._id,
          userId: order.userId,
          restaurantId: order.restaurantId,
          items: order.items,
          totalPrice: order.totalPrice,
          isTest: true, 
        },
      };

      console.log("🧪 [TEST] Initializing Chapa test payment:", requestData);

      const response = await fetch(`${API_URL}/payment/initialize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to initialize test payment");
      }

      if (data.success && data.data.checkout_url) {
        // Redirect to Chapa TEST checkout page
        window.location.href = data.data.checkout_url;
      } else {
        throw new Error("Failed to get test checkout URL");
      }
    } catch (err) {
      console.error("❌ Chapa test payment error:", err);
      setError(
        err.message || "Test payment initialization failed. Please try again."
      );
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError("");
    initializeChapaPayment();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
       
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-lg">
                <span className="text-2xl">🧪</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Chapa Test Payment
                </h2>
                <p className="text-blue-100 text-sm">
                  Student Project - No Real Money
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-white hover:text-blue-200 transition"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error ? (
            // Error State
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-red-600">❌</span>
              </div>
              <h3 className="text-lg font-semibold text-red-600 mb-2">
                Test Failed
              </h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="space-y-3">
                <button
                  onClick={handleRetry}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-medium flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    "Try Again"
                  )}
                </button>
                <button
                  onClick={onCancel}
                  className="w-full bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel Test
                </button>
              </div>
            </div>
          ) : (
            // Test Payment Details
            <>
              {/* Test Mode Banner */}
              <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mb-4">
                <div className="flex items-center">
                  <span className="text-yellow-600 text-lg mr-2">🧪</span>
                  <div>
                    <p className="text-sm font-semibold text-yellow-800">
                      TEST MODE
                    </p>
                    <p className="text-xs text-yellow-700">
                      No real money will be processed. This is for demonstration
                      only.
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">
                  📦 Order Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-medium">{customerInfo.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{customerInfo.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items:</span>
                    <span className="font-medium">
                      {order.items?.length} items
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Breakdown - No fees in test mode */}
              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-green-800 mb-3">
                  💰 Test Payment
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Order Total:</span>
                    <span className="font-medium">
                      ETB {order.totalPrice?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-green-700">
                    <span>Test Mode:</span>
                    <span>No service fees</span>
                  </div>
                  <div className="flex justify-between border-t border-green-200 pt-2">
                    <span className="font-semibold">Total to Pay:</span>
                    <span className="font-bold text-green-600">
                      ETB {totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Test Instructions */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-800 mb-2">
                  📝 Test Instructions
                </h4>
                <div className="space-y-2 text-sm text-blue-700">
                  <p>✅ You'll be redirected to Chapa's test environment</p>
                  <p>
                    ✅ Use test card: <strong>Any card number</strong>
                  </p>
                  <p>
                    ✅ Expiry: <strong>Any future date</strong>
                  </p>
                  <p>
                    ✅ CVV: <strong>Any 3 digits</strong>
                  </p>
                  <p>✅ No real payment will be made</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={initializeChapaPayment}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-4 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-bold text-lg flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Starting Test...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">🧪</span>
                      Start Chapa Test
                    </>
                  )}
                </button>

                <button
                  onClick={onCancel}
                  disabled={loading}
                  className="w-full bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 disabled:opacity-50 transition"
                >
                  Cancel Test
                </button>
              </div>

              {/* Student Project Footer */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  🎓 Student Project - Real Chapa Integration (Test Mode)
                </p>
                <div className="flex items-center justify-center mt-2 space-x-4 text-xs text-gray-400">
                  <span>🔒 Secure Test</span>
                  <span>🇪🇹 Ethiopian Payment</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapaPayment;

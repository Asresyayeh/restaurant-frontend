import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Catering = () => {
  const { restaurantId } = useParams();
  const API_URL = import.meta.env.VITE_API_URL;

  const [restaurant, setRestaurant] = useState({ menuItem: [] });
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [fetchError, setFetchError] = useState("");
  const [menuLoading, setMenuLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    eventType: "",
    guests: "",
    specialRequests: "",
  });
  const [loadingRestaurant, setLoadingRestaurant] = useState(true);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchRestaurant = async () => {
      setMenuLoading(true); // start menu loading
      try {
        const res = await fetch(`${API_URL}/restaurants/${restaurantId}`);
        const restaurantData = await res.json();

        if (!res.ok) {
          console.error("Restaurant not found");
          setFetchError("Restaurant not found");
        } else {
          setRestaurant(restaurantData);
          setMenuItems(restaurantData.menuItem || []);
        }
      } catch (err) {
        console.error("Failed to fetch restaurant data:", err);
        setFetchError("Failed to fetch restaurant data");
      } finally {
        setLoadingRestaurant(false);
        setMenuLoading(false);
      }
    };

    fetchRestaurant();
  }, [restaurantId, API_URL]);

  const calculateTotal = () => {
    const total = selectedItems.reduce((sum, selectedItem) => {
      const menuItem = menuItems.find((i) => i._id === selectedItem.item);
      const price = Number(menuItem?.price ?? selectedItem.price ?? 0);
      const quantity = Number.isFinite(Number(selectedItem.quantity))
        ? Number(selectedItem.quantity)
        : 1;

      return sum + price * quantity;
    }, 0);

    return Number(total.toFixed(2));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...(errors || {}), [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    const name = (formData.name || "").trim();
    const email = (formData.email || "").trim();
    const phone = (formData.phone || "").trim();
    const eventDate = formData.eventDate || "";
    const guests = Number(formData.guests);

    if (!name) newErrors.name = "Name is required";
    if (!email || !/^\S+@\S+\.\S+$/.test(email))
      newErrors.email = "Valid email is required";
    if (!phone) newErrors.phone = "Phone is required";
    if (!eventDate) {
      newErrors.eventDate = "Event date is required";
    } else {
      const selectedDate = new Date(`${eventDate}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.eventDate = "Event date must be today or in the future";
      }
    }
    if (!Number.isFinite(guests) || guests < 1)
      newErrors.guests = "Number of guests must be at least 1";
    if (!Array.isArray(selectedItems) || selectedItems.length === 0)
      newErrors.menuItems = "Please select at least one menu item";

    setErrors(newErrors || {});
    return Object.keys(newErrors || {}).length === 0;
  };

  const toggleItem = (item) => {
    const exists = selectedItems.find((i) => i.item === item._id);
    if (exists) {
      setSelectedItems(selectedItems.filter((i) => i.item !== item._id));
    } else {
      setSelectedItems([
        ...(Array.isArray(selectedItems) ? selectedItems : []),
        {
          item: item._id,
          quantity: 1,
          name: item.name,
          price: item.price,
          restaurant: restaurantId,
        },
      ]);
    }
    if (errors.menuItems) {
      setErrors({ ...(errors || {}), menuItems: "" });
    }
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) return;
    setSelectedItems(
      (Array.isArray(selectedItems) ? selectedItems : []).map((i) =>
        i.item === itemId ? { ...i, quantity } : i,
      ),
    );
  };

  const removeItem = (itemId) => {
    setSelectedItems(
      (Array.isArray(selectedItems) ? selectedItems : []).filter(
        (i) => i.item !== itemId,
      ),
    );
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setMessage("Please fix the errors above");

      // ⏱️ Clear validation error alert after 5 seconds
      setTimeout(() => {
        setMessage("");
      }, 5000);
      return;
    }

    setIsSubmitting(true);

    // ✅ FORCE THE CORRECT SCHEMATIC MAP FOR YOUR BACKEND
    const formattedMenuItems = selectedItems.map((selectedItem) => ({
      item: selectedItem.item || selectedItem._id,
      quantity: Number(selectedItem.quantity || 1),
    }));

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      eventDate: formData.eventDate,
      eventType: formData.eventType,
      guests: Number(formData.guests),
      specialRequests: formData.specialRequests,
      restaurant: restaurantId,
      restaurantName: restaurant?.name,
      menuItems: formattedMenuItems,
      totalPrice: calculateTotal(),
    };

    console.log("🚀 Submitting final, mapped payload to backend:", payload);

    try {
      const response = await fetch(`${API_URL}/catering`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || result.error || "Failed to submit order",
        );
      }

      setMessage("Catering order submitted successfully!");

      // ⏱️ Clear success alert after 5 seconds
      setTimeout(() => {
        setMessage("");
      }, 5000);

      setFormData({
        name: "",
        email: "",
        phone: "",
        eventDate: "",
        eventType: "",
        guests: "",
        specialRequests: "",
      });
      setSelectedItems([]);
      setErrors({});
    } catch (err) {
      console.error("Submission error:", err);
      setMessage(`Error submitting order: ${err.message}`);

      setTimeout(() => {
        setMessage("");
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-yellow-50 px-4 py-14 sm:px-6 lg:px-8">
      <div className="absolute left-10 top-10 h-24 w-24 rounded-full bg-orange-100/70 blur-2xl"></div>
      <div className="absolute bottom-10 right-14 h-32 w-32 rounded-full bg-yellow-100/70 blur-2xl"></div>

      <div className="relative mx-auto max-w-7xl">
        <div className="m-8 text-center">
          <span className="inline-flex rounded-full bg-orange-100 px-4 py-1 text-sm font-semibold text-orange-700">
            Catering Request
          </span>
          <h1 className="mt-3 text-4xl font-bold text-gray-900 sm:text-5xl">
            Plan Your Event With Us
          </h1>
        </div>

        {restaurant && (
          <div className="mb-8 rounded-3xl border border-orange-100 bg-white/90 p-6 shadow-sm backdrop-blur-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">
                  Ordering from
                </p>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {restaurant.name}
                </h2>
              </div>
              {restaurant.description && (
                <p className="max-w-2xl text-sm leading-6 text-gray-600">
                  {restaurant.description}
                </p>
              )}
            </div>
          </div>
        )}

        {fetchError && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {fetchError}
          </div>
        )}

        {message && (
          <div
            className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
              message.includes("Error") || message.includes("Please")
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">Step 1</p>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Event Details
                </h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full rounded-2xl border bg-gray-50 px-4 py-3 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 ${
                      errors.name ? "border-red-300" : "border-gray-200"
                    }`}
                    required
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`w-full rounded-2xl border bg-gray-50 px-4 py-3 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 ${
                      errors.email ? "border-red-300" : "border-gray-200"
                    }`}
                    required
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+251 9xx xxx xxx"
                    className={`w-full rounded-2xl border bg-gray-50 px-4 py-3 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 ${
                      errors.phone ? "border-red-300" : "border-gray-200"
                    }`}
                    required
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Event Date
                  </label>
                  <input
                    name="eventDate"
                    type="date"
                    value={formData.eventDate}
                    onChange={handleChange}
                    className={`w-full rounded-2xl border bg-gray-50 px-4 py-3 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 ${
                      errors.eventDate ? "border-red-300" : "border-gray-200"
                    }`}
                    required
                  />
                  {errors.eventDate && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.eventDate}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Event Type
                  </label>
                  <input
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    placeholder="Wedding, Birthday, Office..."
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Number of Guests
                  </label>
                  <input
                    name="guests"
                    type="number"
                    min="1"
                    value={formData.guests}
                    onChange={handleChange}
                    placeholder="e.g. 50"
                    className={`w-full rounded-2xl border bg-gray-50 px-4 py-3 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 ${
                      errors.guests ? "border-red-300" : "border-gray-200"
                    }`}
                    required
                  />
                  {errors.guests && (
                    <p className="mt-1 text-sm text-red-500">{errors.guests}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Special Requests
                </label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  placeholder="Tell us about dietary needs, setup preferences, or anything else..."
                  rows="4"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || loadingRestaurant}
                className={`w-full rounded-2xl px-5 py-3.5 font-semibold text-white transition ${
                  isSubmitting || loadingRestaurant
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                }`}
              >
                {isSubmitting ? "Submitting Order..." : "Submit Catering Order"}
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">Step 2</p>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Menu Selection
                </h2>
              </div>
              <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700">
                {selectedItems.length} selected
              </span>
            </div>

            {menuLoading ? (
              <div className="flex min-h-[300px] items-center justify-center rounded-2xl bg-gray-50">
                <p className="text-gray-500">Loading menu...</p>
              </div>
            ) : (
              <>
                {errors.menuItems && (
                  <p className="mb-3 text-sm text-red-500">
                    {errors.menuItems}
                  </p>
                )}

                <div className="space-y-3 rounded-2xl border border-gray-100 bg-gray-50 p-3">
                  {menuItems.length === 0 ? (
                    <div className="rounded-2xl bg-white p-6 text-center text-gray-500">
                      No menu items available for this restaurant.
                    </div>
                  ) : (
                    menuItems.map((item) => {
                      const isSelected = selectedItems.some(
                        (i) => i.item === item._id,
                      );
                      const quantity =
                        selectedItems.find((i) => i.item === item._id)
                          ?.quantity || 1;

                      return (
                        <div
                          key={item._id}
                          className="flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center"
                        >
                          <div className="flex flex-1 items-center gap-3">
                            <input
                              type="checkbox"
                              onChange={() => toggleItem(item)}
                              checked={isSelected}
                              className="h-5 w-5 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                            />
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-20 w-20 rounded-2xl object-cover"
                              />
                            )}
                            <div>
                              <p className="font-semibold text-gray-900">
                                {item.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                ${item.price?.toFixed(2) || "0.00"}
                              </p>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="flex items-center justify-between gap-2 rounded-2xl bg-orange-50 px-3 py-2 sm:justify-end">
                              <span className="text-sm font-medium text-gray-700">
                                Qty
                              </span>
                              <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) =>
                                  updateQuantity(
                                    item._id,
                                    parseInt(e.target.value) || 1,
                                  )
                                }
                                className="w-16 rounded-xl border border-orange-200 bg-white px-2 py-1 text-center outline-none focus:border-orange-400"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {selectedItems.length > 0 && (
                  <div className="mt-6 rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 to-yellow-50 p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Selected Items
                      </h3>
                      <span className="text-sm text-gray-500">
                        {selectedItems.reduce(
                          (sum, item) => sum + item.quantity,
                          0,
                        )}{" "}
                        items
                      </span>
                    </div>

                    <div className="space-y-3">
                      {selectedItems.map((selectedItem) => {
                        const item = menuItems.find(
                          (i) => i._id === selectedItem.item,
                        );
                        return (
                          <div
                            key={selectedItem.item}
                            className="flex items-center justify-between rounded-2xl bg-white p-3 shadow-sm"
                          >
                            <div>
                              <p className="font-medium text-gray-900">
                                {selectedItem.name || item?.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                Qty {selectedItem.quantity}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-gray-900">
                                $
                                {(
                                  (item?.price || selectedItem.price) *
                                  selectedItem.quantity
                                ).toFixed(2)}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeItem(selectedItem.item)}
                                className="rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-600 transition hover:bg-red-100"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 border-t border-orange-100 pt-4">
                      <div className="flex items-center justify-between text-base font-semibold text-gray-900">
                        <span>Total</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Catering;

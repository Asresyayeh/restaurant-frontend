import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PizzaImage from "../assets/Pizza.jpg";
const API_URL = import.meta.env.VITE_API_URL;

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch(`${API_URL}/restaurants`);
        const data = await res.json();
        setRestaurants(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <header className="relative bg-hero-black text-white overflow-hidden min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-12 lg:py-20">
          {/* Left side */}
          <div>
            <span className="inline-block bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full text-sm mb-4">
              Easy way to order your food
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
              Order Healthy And Fresh Food Any Time
            </h1>
            <p className="max-w-xl text-gray-200 mb-6">
              Ethiopian food makes people think of big family dinners. So you
              may want to position your restaurant as a place to bring the whole
              family.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 max-w-xl">
              <button
                onClick={() => navigate("/restaurant")}
                className="bg-yellow-400 text-black px-6 py-3 rounded-md font-semibold hover:bg-yellow-300 transition-colors"
              >
                Order Now
              </button>
              <button
                onClick={() => navigate("/restaurant")}
                className="border border-yellow-300/30 text-white px-6 py-3 rounded-md font-semibold hover:bg-white/5 transition-colors"
              >
                Explore Menu
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-300">
              <span className="bg-white/5 px-3 py-1 rounded-full">
                ⚡ Fast Delivery
              </span>
              <span className="bg-white/5 px-3 py-1 rounded-full">
                🍽️ Fresh Daily
              </span>
              <span className="bg-white/5 px-3 py-1 rounded-full">
                ⭐ 4.9 Rated
              </span>
            </div>

            {/* Popular Restaurants */}
            <div className="mt-8">
              <h3 className="text-white/90 font-semibold mb-3">
                Popular Restaurant
              </h3>
              <div className="flex gap-3 items-center flex-wrap">
                {restaurants.slice(0, 6).map((r) => (
                  <div
                    key={r._id}
                    className="w-16 h-16 rounded-lg overflow-hidden"
                  >
                    <img
                      src={r.image}
                      alt={r.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:flex justify-end relative">
            <div className="absolute -top-4 right-6 z-10 bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              Best Seller
            </div>
            <div className="relative w-[320px] h-[320px] md:w-[380px] md:h-[380px] rounded-full overflow-hidden shadow-2xl border border-yellow-400/20">
              <img
                src={PizzaImage}
                alt="pizza"
                className="object-cover w-full h-full scale-110"
              />
            </div>
            <div className="absolute bottom-4 left-0 bg-black/60 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-xl">
              <p className="text-xs text-yellow-300 uppercase tracking-[0.3em]">
                Today’s Special
              </p>
              <p className="text-lg font-semibold">Spicy Chicken Pizza</p>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          .bg-hero-black {
            background: radial-gradient(
              ellipse at top right,
              #0b0b0b 0%,
              #111111 40%,
              #0b0b0b 100%
            );
          }
        `}
      </style>
    </header>
  );
};

export default Home;

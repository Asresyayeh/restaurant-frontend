import React, { useEffect, useState } from "react";

import PizzaImage from "../assets/Pizza.jpg";
const API_URL = import.meta.env.VITE_API_URL;

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");

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

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

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

            {/* Search Bar */}
            <div className="flex gap-3 items-center max-w-xl">
              <input
                aria-label="search"
                className="w-full rounded-lg border border-yellow-300/30 bg-white/5 placeholder-gray-300 text-white py-3 px-4 pr-12 focus:outline-none"
                placeholder="Search Keywords (Recipe Name Here)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="bg-yellow-400 text-black px-4 py-2 rounded-md">
                🔍
              </button>
            </div>

            {/* Popular Restaurants */}
            <div className="mt-8">
              <h3 className="text-white/90 font-semibold mb-3">
                Popular Restaurant
              </h3>
              <div className="flex gap-3 items-center flex-wrap">
                {filteredRestaurants.slice(0, 6).map((r) => (
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

          {/* Right image */}
          <div className="lg:flex justify-end">
            <div className="relative w-[420px] h-[420px] rounded-full overflow-hidden shadow-2xl">
              <img
                src={PizzaImage}
                alt="pizza"
                className="object-cover w-full h-full"
              />
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

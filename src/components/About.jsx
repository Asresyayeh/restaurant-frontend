import React from "react";
import { Link } from "react-router-dom";

const AboutSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-slate-50 to-blue-50 py-20 px-5 overflow-hidden">
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4 tracking-wide">
            OUR STORY
          </span>
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
            Revolutionizing Food Delivery
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-orange-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-5xl mx-auto leading-relaxed">
            We don’t just deliver food — we bring you moments to savor. From
            your favorite local restaurants to hidden gems across the city, we
            connect you with the flavors that define your community. Every dish
            is prepared with passion, delivered with care, and served with a
            promise to make your dining experience truly special. Whether it’s a
            quick lunch or a family feast, we make every order more than just a
            meal — it’s an experience worth remembering.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-blue-600 transition-colors">
              Our Mission
            </h3>
            <p className="text-gray-600 leading-relaxed">
              To transform ordinary moments into extraordinary experiences by
              delivering exceptional meals with unparalleled speed and care,
              creating smiles one delivery at a time.
            </p>
          </div>

          <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-green-600 transition-colors">
              Our Vision
            </h3>
            <p className="text-gray-600 leading-relaxed">
              To build a future where everyone has instant access to diverse
              culinary experiences, fostering community connections while
              supporting local restaurants and their dreams.
            </p>
          </div>

          <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-orange-600 transition-colors">
              Our Values
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Excellence in every detail, passion for food, commitment to
              sustainability, and building genuine relationships with our
              customers, partners, and community.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-center mb-12">
              Making an Impact, One Meal at a Time
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div className="transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl font-bold mb-2 bg-white bg-opacity-20 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                  5+
                </div>
                <p className="text-blue-100 font-semibold">
                  Premium Restaurants
                </p>
                <p className="text-blue-200 text-sm mt-1">& Growing Weekly</p>
              </div>
              <div className="transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl font-bold mb-2 bg-white bg-opacity-20 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                  1.5K+
                </div>
                <p className="text-blue-100 font-semibold">Curated Dishes</p>
                <p className="text-blue-200 text-sm mt-1">Fresh Daily</p>
              </div>
              <div className="transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl font-bold mb-2 bg-white bg-opacity-20 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                  10K+
                </div>
                <p className="text-blue-100 font-semibold">Happy Customers</p>
                <p className="text-blue-200 text-sm mt-1">98% Satisfaction</p>
              </div>
              <div className="transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl font-bold mb-2 bg-white bg-opacity-20 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                  15min
                </div>
                <p className="text-blue-100 font-semibold">Avg. Delivery</p>
                <p className="text-blue-200 text-sm mt-1">Lightning Fast</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            to="/story"
            className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            Discover Our Story →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

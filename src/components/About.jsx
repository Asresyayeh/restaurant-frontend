import React from "react";
import { Link } from "react-router-dom";

const AboutSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-yellow-50 py-20 px-5 sm:px-6 lg:px-8">
      <div className="absolute left-10 top-10 h-24 w-24 rounded-full bg-orange-100/70 blur-2xl"></div>
      <div className="absolute bottom-10 right-10 h-32 w-32 rounded-full bg-yellow-100/70 blur-2xl"></div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <span className="inline-flex items-center rounded-full bg-orange-100 px-4 py-1 text-sm font-semibold tracking-wide text-orange-700">
            OUR STORY
          </span>
          <h2 className="mt-4 text-4xl font-bold text-gray-900 sm:text-5xl">
            Bringing Flavor to Your Doorstep
          </h2>
          <div className="mx-auto mt-5 h-1.5 w-24 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500"></div>
          <p className="mx-auto mt-6 max-w-4xl text-base leading-7 text-gray-600 sm:text-lg">
            We connect food lovers with the best local restaurants, making every
            meal feel special. From comfort food to chef favorites, our mission
            is to deliver not just dishes, but unforgettable moments.
          </p>
        </div>

        <div className="mb-20 grid gap-8 md:grid-cols-3">
          <div className="group rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 transition-transform duration-300 group-hover:scale-110">
              <svg
                className="h-6 w-6 text-white"
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
            <h3 className="mb-3 text-2xl font-semibold text-gray-900">
              Our Mission
            </h3>
            <p className="leading-7 text-gray-600">
              Delivering fresh, flavorful meals quickly while making every order
              a joyful experience.
            </p>
          </div>

          <div className="group rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 transition-transform duration-300 group-hover:scale-110">
              <svg
                className="h-6 w-6 text-white"
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
            <h3 className="mb-3 text-2xl font-semibold text-gray-900">
              Our Vision
            </h3>
            <p className="leading-7 text-gray-600">
              Creating a future where great food is easy to discover, order, and
              enjoy anywhere.
            </p>
          </div>

          <div className="group rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-600 transition-transform duration-300 group-hover:scale-110">
              <svg
                className="h-6 w-6 text-white"
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
            <h3 className="mb-3 text-2xl font-semibold text-gray-900">
              Our Values
            </h3>
            <p className="leading-7 text-gray-600">
              Quality, care, and community-first service in every bite we
              deliver.
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 p-10 text-white shadow-xl sm:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_18%)]"></div>
          <div className="relative z-10">
            <h3 className="text-center text-3xl font-bold">
              Making an Impact, One Meal at a Time
            </h3>
            <div className="mt-10 grid gap-6 text-center sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/15 text-3xl font-bold">
                  5+
                </div>
                <p className="mt-3 font-semibold">Premium Restaurants</p>
                <p className="mt-1 text-sm text-orange-50">Growing each week</p>
              </div>
              <div>
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/15 text-3xl font-bold">
                  1.5K+
                </div>
                <p className="mt-3 font-semibold">Curated Dishes</p>
                <p className="mt-1 text-sm text-orange-50">Fresh daily</p>
              </div>
              <div>
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/15 text-3xl font-bold">
                  10K+
                </div>
                <p className="mt-3 font-semibold">Happy Customers</p>
                <p className="mt-1 text-sm text-orange-50">98% satisfaction</p>
              </div>
              <div>
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/15 text-3xl font-bold">
                  15m
                </div>
                <p className="mt-3 font-semibold">Avg. Delivery</p>
                <p className="mt-1 text-sm text-orange-50">Fast & reliable</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/story"
            className="inline-flex items-center rounded-full bg-orange-500 px-8 py-4 font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-orange-600"
          >
            Discover Our Story →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

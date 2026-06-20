import React from "react";

const StoryPage = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 py-20 px-5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">Our Story</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-orange-400 mx-auto rounded-full"></div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                How It All Began
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                In 2018, our founder Senayit was working late and craving
                authentic Ethiopian food. After waiting over an hour for a
                delivery that never arrived, she had a realization...
              </p>
              <p className="text-gray-600 leading-relaxed">
                There had to be a better way to connect food lovers with amazing
                local restaurants while ensuring reliability and quality.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-orange-100 rounded-xl p-8 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">2018</div>
              <div className="text-gray-700 font-semibold">The Beginning</div>
              <div className="text-gray-600 mt-4">
                Started with 2 local restaurants
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
              Our Journey
            </h3>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="text-xl font-semibold text-gray-800">
                  2019 - First 1,000 Users
                </h4>
                <p className="text-gray-600">
                  Expanded to cover the entire downtown area
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h4 className="text-xl font-semibold text-gray-800">
                  2020 - Pandemic Response
                </h4>
                <p className="text-gray-600">
                  Launched contactless delivery to support community safety
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-3 h-3 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <h4 className="text-xl font-semibold text-gray-800">
                  2023 - 10,000+ Happy Customers
                </h4>
                <p className="text-gray-600">
                  Became the city's most trusted food delivery platform
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoryPage;

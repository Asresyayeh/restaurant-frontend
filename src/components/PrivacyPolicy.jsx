import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="mt-12 p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">
        At <strong>FoodExpress</strong>, your privacy is important to us. This
        Privacy Policy explains how we collect, use, and protect your personal
        information when you use our food delivery platform.
      </p>

      <h2 className="text-2xl font-semibold mb-2">1. Information We Collect</h2>
      <p className="mb-4">We may collect the following types of information:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Name, email address, phone number, and delivery address</li>
        <li>Payment information for processing orders</li>
        <li>Order history and preferences</li>
        <li>Device and browser information</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-2">
        2. How We Use Your Information
      </h2>
      <p className="mb-4">Your information is used to:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Process and deliver your food orders</li>
        <li>Provide customer support</li>
        <li>Send promotional offers and updates (if you opted in)</li>
        <li>Improve our services and app experience</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-2">
        3. Sharing Your Information
      </h2>
      <p className="mb-4">
        We do not sell your personal information. We may share information with:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Restaurants for order fulfillment</li>
        <li>Delivery partners for order delivery</li>
        <li>Payment processors for secure transactions</li>
        <li>Legal authorities when required by law</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-2">4. Data Security</h2>
      <p className="mb-4">
        We implement industry-standard security measures to protect your
        personal information from unauthorized access, disclosure, or misuse.
      </p>

      <h2 className="text-2xl font-semibold mb-2">5. Your Rights</h2>
      <p className="mb-4">You have the right to:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Access the information we hold about you</li>
        <li>Request correction or deletion of your data</li>
        <li>Opt-out of marketing communications</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-2">6. Changes to This Policy</h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time. Changes will be
        posted on this page with the updated date.
      </p>

      <p className="mb-4">Last updated: October 26, 2025</p>
    </div>
  );
}

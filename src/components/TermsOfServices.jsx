import React from "react";

export default function TermsOfService() {
  return (
    <div className="mt-12 p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <p className="mb-4">
        Welcome to <strong>FoodoSta</strong>. By using our food delivery
        platform, you agree to comply with and be bound by these Terms of
        Service. Please read them carefully.
      </p>

      <h2 className="text-2xl font-semibold mb-2">
        1. Account Responsibilities
      </h2>
      <p className="mb-4">
        You are responsible for maintaining the confidentiality of your account
        information, including your password and payment details. You agree to
        provide accurate and complete information when creating an account.
      </p>

      <h2 className="text-2xl font-semibold mb-2">2. Ordering and Payment</h2>
      <p className="mb-4">
        By placing an order, you agree to pay the total amount shown at
        checkout. Prices, delivery fees, and taxes are subject to change. All
        payments are processed securely through our payment partners.
      </p>

      <h2 className="text-2xl font-semibold mb-2">3. Delivery</h2>
      <p className="mb-4">
        We will make every effort to deliver your order promptly. Delivery times
        may vary due to traffic, weather, or restaurant delays. We are not
        responsible for late deliveries beyond our reasonable control.
      </p>

      <h2 className="text-2xl font-semibold mb-2">4. User Conduct</h2>
      <p className="mb-4">You agree not to:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Use our platform for illegal purposes</li>
        <li>Submit false or misleading information</li>
        <li>Interfere with the operation of the platform</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-2">
        5. Cancellations and Refunds
      </h2>
      <p className="mb-4">
        Orders may be canceled or refunded according to our cancellation and
        refund policy. Please contact customer support for assistance.
      </p>

      <h2 className="text-2xl font-semibold mb-2">
        6. Limitation of Liability
      </h2>
      <p className="mb-4">
        FoodExpress is not liable for any direct, indirect, or consequential
        damages arising from the use of our platform, including delays, lost
        orders, or issues caused by restaurants or delivery partners.
      </p>

      <h2 className="text-2xl font-semibold mb-2">7. Changes to Terms</h2>
      <p className="mb-4">
        We may update these Terms of Service from time to time. Updated terms
        will be posted on this page. Your continued use of the platform
        constitutes acceptance of the changes.
      </p>

      <p className="mb-4">Last updated: October 26, 2025</p>
    </div>
  );
}

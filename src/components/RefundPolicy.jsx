import React from "react";

export default function RefundPolicy() {
  return (
    <div className="mt-12 p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Refund Policy</h1>

      <p className="mb-4">
        At <strong>FoodSta</strong>, we strive to ensure you have a smooth
        ordering experience. This Refund Policy explains the conditions under
        which refunds may be issued.
      </p>

      <h2 className="text-2xl font-semibold mb-2">1. Eligible Refunds</h2>
      <p className="mb-4">Refunds may be issued in the following situations:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Incorrect or missing items in your order</li>
        <li>Orders not delivered due to platform error</li>
        <li>Duplicate charges or payment errors</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-2">
        2. How to Request a Refund
      </h2>
      <p className="mb-4">
        To request a refund, contact our customer support team within 24 hours
        of receiving your order. Provide your order number and a description of
        the issue.
      </p>

      <h2 className="text-2xl font-semibold mb-2">3. Refund Process</h2>
      <p className="mb-4">Once your refund request is approved:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Refunds will be issued to the original payment method.</li>
        <li>
          The process typically takes 3-7 business days, depending on your bank
          or payment provider.
        </li>
        <li>
          Partial refunds may be issued if only part of the order was affected.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mb-2">4. Non-Refundable Items</h2>
      <p className="mb-4">Refunds will not be issued for:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Orders canceled after delivery has been completed</li>
        <li>Customer mistakes (e.g., wrong address provided)</li>
        <li>Promotional items or discounts already redeemed</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-2">
        5. Changes to Refund Policy
      </h2>
      <p className="mb-4">
        We may update this Refund Policy from time to time. Updated policies
        will be posted on this page. Continued use of our platform constitutes
        acceptance of the updated policy.
      </p>

      <p className="mb-4">Last updated: October 26, 2025</p>
    </div>
  );
}

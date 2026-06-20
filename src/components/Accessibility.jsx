import React from "react";

export default function Accessibility() {
  return (
    <div className="mt-12 p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Accessibility Statement</h1>

      <p className="mb-4">
        At <strong>FoodSta</strong>, we are committed to making our platform
        accessible to everyone, including users with disabilities. We strive to
        follow accessibility best practices to ensure an inclusive experience.
      </p>

      <h2 className="text-2xl font-semibold mb-2">1. Keyboard Navigation</h2>
      <p className="mb-4">
        All interactive elements on our platform, such as buttons, links, and
        form fields, are fully navigable using a keyboard. Focus indicators are
        clearly visible to help users understand where they are on the page.
      </p>

      <h2 className="text-2xl font-semibold mb-2">2. Screen Reader Support</h2>
      <p className="mb-4">
        Our platform uses semantic HTML and ARIA attributes where necessary to
        ensure compatibility with screen readers. Images include descriptive{" "}
        <code>alt</code> text, and interactive elements have meaningful labels.
      </p>

      <h2 className="text-2xl font-semibold mb-2">
        3. Color Contrast and Visual Design
      </h2>
      <p className="mb-4">
        We use high-contrast text and background colors to ensure readability
        for users with visual impairments. Colors are not the only means of
        conveying information.
      </p>

      <h2 className="text-2xl font-semibold mb-2">
        4. Forms and Error Handling
      </h2>
      <p className="mb-4">
        Form fields are clearly labeled, and error messages are associated with
        the relevant input fields to assist users with completing forms
        correctly.
      </p>

      <h2 className="text-2xl font-semibold mb-2">
        5. Responsive and Mobile-Friendly
      </h2>
      <p className="mb-4">
        Our platform is fully responsive, ensuring that users on mobile, tablet,
        or desktop devices have a consistent and accessible experience.
      </p>

      <h2 className="text-2xl font-semibold mb-2">
        6. Feedback and Assistance
      </h2>
      <p className="mb-4">
        We welcome feedback regarding accessibility. If you encounter any
        barriers while using our platform, please contact our support team at{" "}
        <a
          href="mailto:support@foodexpress.com"
          className="text-yellow-500 underline"
        >
          support@foodexpress.com
        </a>
        .
      </p>

      <h2 className="text-2xl font-semibold mb-2">7. Continuous Improvement</h2>
      <p className="mb-4">
        We regularly review and update our platform to improve accessibility,
        following guidelines such as the{" "}
        <a
          href="https://www.w3.org/WAI/WCAG21/quickref/"
          className="text-yellow-500 underline"
        >
          WCAG 2.1 standards
        </a>
        .
      </p>

      <p className="mb-4">Last updated: October 26, 2025</p>
    </div>
  );
}

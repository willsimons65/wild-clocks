// src/components/archive/ArchiveAccessRequestForm.jsx

import { useState } from "react";

export default function ArchiveAccessRequestForm({
  place,
  heading = "Request access",
  intro,
  onSubmitted,
  onCancel,
}) {
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    organisation: "",
    email: "",
    purpose: "",
  });

  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Enter your name";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Enter your email address";
    }

    if (!formData.purpose.trim()) {
      nextErrors.purpose =
        "Tell us briefly how you will use the data";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors((current) => ({
      ...current,
      submit: "",
    }));

    try {
      const response = await fetch(
        "/api/archive-access-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            site: place,
            name: formData.name.trim(),
            organisation:
              formData.organisation.trim(),
            email: formData.email.trim(),
            purpose: formData.purpose.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Request could not be submitted"
        );
      }

      setSubmitted(true);
      onSubmitted?.();
    } catch (error) {
      console.error(error);

      setErrors((current) => ({
        ...current,
        submit:
          "There was a problem submitting your request. Please try again.",
      }));
    }
  }

  if (submitted) {
    return (
      <div className="pt-10 max-w-4xl">
        <h2 className="text-xl md:text-2xl font-medium">
          Request received
        </h2>

        <div className="mt-6 space-y-5 text-white/80 leading-relaxed">
          <p>
            Thank you for your interest. Your request has been recorded and will be reviewed by Wild Clocks and the host organisation.
          </p>

          <p>
            We’ll email you when a decision has been made. If approved, access will be enabled for the email address used in your request.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-10 max-w-4xl">
      <h2 className="text-xl md:text-2xl font-medium">
        {heading}
      </h2>

      {intro && (
        <p className="mt-6 text-white/80 leading-relaxed">
          {intro}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-7"
      >
        <div>
          <label
            htmlFor="name"
            className="block mb-2"
          >
            Name
            {errors.name && (
              <span className="ml-2 text-red-500 text-sm">
                {errors.name}
              </span>
            )}
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={`w-full max-w-sm bg-transparent border px-3 py-2 text-white ${
              errors.name
                ? "border-red-500"
                : "border-white/40"
            }`}
          />
        </div>

        <div>
          <label
            htmlFor="organisation"
            className="block mb-2"
          >
            Organisation (optional)
          </label>

          <input
            id="organisation"
            name="organisation"
            type="text"
            value={formData.organisation}
            onChange={handleChange}
            className="w-full max-w-lg bg-transparent border border-white/40 px-3 py-2 text-white"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block mb-2"
          >
            Email
            {errors.email && (
              <span className="ml-2 text-red-500 text-sm">
                {errors.email}
              </span>
            )}
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full max-w-sm bg-transparent border px-3 py-2 text-white ${
              errors.email
                ? "border-red-500"
                : "border-white/40"
            }`}
          />
        </div>

        <div>
          <label
            htmlFor="purpose"
            className="block mb-1"
          >
            How will you use the data?
            {errors.purpose && (
              <span className="ml-2 text-red-500 text-sm">
                {errors.purpose}
              </span>
            )}
          </label>

          <p className="mb-2 text-sm text-white/55">
            Tell us briefly about your research, project
            or intended use.
          </p>

          <textarea
            id="purpose"
            name="purpose"
            rows="4"
            value={formData.purpose}
            onChange={handleChange}
            className={`w-full max-w-lg bg-transparent border px-3 py-2 text-white resize-y ${
              errors.purpose
                ? "border-red-500"
                : "border-white/40"
            }`}
          />
        </div>

        <p className="max-w-lg text-sm text-white/85 leading-relaxed">
          Your request will be shared with Wild Clocks
          and the host organisation so that access can
          be reviewed.
        </p>

        {errors.submit && (
          <p className="text-red-500">
            {errors.submit}
          </p>
        )}

        <div className="flex items-center gap-6">
        <button
            type="submit"
            className="rounded-full border border-white px-7 py-2 text-[#36e0b4] hover:bg-white/5 transition-colors"
        >
            Send request
        </button>

        {onCancel && (
            <button
            type="button"
            onClick={onCancel}
            className="text-white/55 hover:text-white/80 transition-colors"
            >
            Cancel
            </button>
        )}
        </div>
        </form>
    </div>
  );
}
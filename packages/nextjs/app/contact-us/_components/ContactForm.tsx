import React, { useState } from "react";
import * as yup from "yup";
import { sendEmail } from "~~/services/api/email";

const schema = yup.object().shape({
  email: yup.string().email("Email must be a valid email").required("Email is required"),
  subject: yup
    .string()
    .required("Subject is required")
    .min(3, "Subject must be at least 3 characters")
    .max(255, "Subject must be at most 255 characters"),
  message: yup.string().required("Message is required"),
});

export const ContactForm = () => {
  const [formData, setFormData] = useState<{ email: string; subject: string; message: string }>({
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<{ email?: string; subject?: string; message?: string }>({});
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await schema.validate(formData, { abortEarly: false });
      await sendEmail(formData.email, formData.subject, formData.message);
      setAlert({ type: "success", message: "Email sent successfully" });
      setErrors({});
      setFormData({ email: "", subject: "", message: "" });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationErrors: { [key: string]: string } = {};
        error.inner.forEach(err => {
          if (err.path) validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
        setAlert({ type: "error", message: "Validation failed" });
      } else {
        console.error("Error sending email:", error);
        setAlert({ type: "error", message: "Failed to send email" });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-4">
      {alert && (
        <div role="alert" className={`alert alert-${alert.type}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                alert.type === "success"
                  ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  : "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              }
            />
          </svg>
          <span>{alert.message}</span>
        </div>
      )}
      <div className="flex items-center space-x-4">
        <div className="flex flex-col w-full">
          <label htmlFor="email" className="mb-2 text-left font-semibold">
            Email
          </label>
          <input
            type="text"
            name="email"
            id="email"
            className="input input-bordered w-full p-2"
            placeholder="daisy@site.com"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex flex-col w-full">
          <label htmlFor="subject" className="mb-2 text-left font-semibold">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            id="subject"
            className="input input-bordered w-full p-2"
            placeholder="your subject..."
            value={formData.subject}
            onChange={handleChange}
          />
          {errors.subject && <p className="text-red-500 text-sm">{errors.subject}</p>}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex flex-col w-full">
          <label htmlFor="message" className="mb-2 text-left font-semibold">
            Message
          </label>
          <textarea
            name="message"
            id="message"
            className="textarea textarea-info w-full p-2"
            placeholder="Your message"
            value={formData.message}
            onChange={handleChange}
          />
          {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
        </div>
      </div>
      <button type="submit" className="btn btn-primary w-full">
        Submit
      </button>
    </form>
  );
};

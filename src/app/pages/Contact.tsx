import { useState } from "react";

export function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "print",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
      {/* Heading */}
      <div className="mb-16 md:mb-20">
        <h1
          className="text-black dark:text-white text-3xl md:text-4xl tracking-[0.12em] uppercase"
          style={{ fontWeight: 300 }}
        >
          Contact
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
        {/* Left: info */}
        <div className="flex flex-col gap-8">
          <div>
            <p
              className="text-black dark:text-white text-base leading-relaxed mb-4"
              style={{ fontWeight: 300 }}
            >
              For print inquiries, commissions, or general questions, reach out
              using the form or directly by email.
            </p>
            <p
              className="text-black/50 dark:text-white/50 text-sm leading-relaxed"
              style={{ fontWeight: 300 }}
            >
              Jack responds to all inquiries personally and typically replies
              within 2–3 business days.
            </p>
          </div>

          <div className="border-t border-black/8 dark:border-white/8 pt-8 flex flex-col gap-5">
            {[
              { label: "Email", value: "jack@jackdobson.ca" },
              { label: "Location", value: "Pemberton, British Columbia" },
              { label: "Instagram", value: "@jackwdobson" },
            ].map((item) => (
              <div key={item.label}>
                <p
                  className="text-xs text-black/30 dark:text-white/30 tracking-[0.15em] uppercase mb-1"
                  style={{ fontWeight: 300 }}
                >
                  {item.label}
                </p>
                <p
                  className="text-sm text-black dark:text-white"
                  style={{ fontWeight: 300 }}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: form */}
        <div>
          {submitted ? (
            <div className="flex flex-col gap-4 py-12">
              <p
                className="text-black dark:text-white text-base"
                style={{ fontWeight: 300 }}
              >
                Thank you for reaching out.
              </p>
              <p
                className="text-black/50 dark:text-white/50 text-sm"
                style={{ fontWeight: 300 }}
              >
                Jack will get back to you within a few days.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-7"
            >
              <Field
                label="Name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
              />
              <Field
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />

              {/* Subject select */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-xs text-black/40 dark:text-white/40 tracking-[0.15em] uppercase"
                  style={{ fontWeight: 300 }}
                >
                  Subject
                </label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="bg-transparent border-b border-black/15 dark:border-white/15 text-black dark:text-white text-sm py-2 outline-none focus:border-black dark:focus:border-white transition-colors appearance-none"
                  style={{ fontWeight: 300 }}
                >
                  <option value="print">Print inquiry</option>
                  <option value="commission">Commission</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-xs text-black/40 dark:text-white/40 tracking-[0.15em] uppercase"
                  style={{ fontWeight: 300 }}
                >
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Write your message..."
                  className="bg-transparent border-b border-black/15 dark:border-white/15 text-black dark:text-white text-sm py-2 outline-none focus:border-black dark:focus:border-white transition-colors resize-none placeholder:text-black/20 dark:placeholder:text-white/20"
                  style={{ fontWeight: 300 }}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="text-xs text-black dark:text-white border border-black dark:border-white px-8 py-3 tracking-[0.15em] uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-200"
                  style={{ fontWeight: 300 }}
                >
                  Send message
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type,
  value,
  onChange,
  required,
}: {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        className="text-xs text-black/40 dark:text-white/40 tracking-[0.15em] uppercase"
        style={{ fontWeight: 300 }}
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="bg-transparent border-b border-black/15 dark:border-white/15 text-black dark:text-white text-sm py-2 outline-none focus:border-black dark:focus:border-white transition-colors placeholder:text-black/20 dark:placeholder:text-white/20"
        style={{ fontWeight: 300 }}
      />
    </div>
  );
}

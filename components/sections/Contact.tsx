"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { CONTACT_EMAIL, CONTACT_PHONES } from "@/lib/contact";

const PROJECT_TYPES = [
  "Architecture and engineering",
  "Interiors",
  "Spatial planning",
  "Landscaping",
  "Not sure yet",
];

export function Contact() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const type = String(data.get("type") || "").trim();
    const message = String(data.get("message") || "").trim();

    const subject = encodeURIComponent(
      `Project inquiry${type ? ` — ${type}` : ""}${name ? ` · ${name}` : ""}`
    );
    const body = encodeURIComponent(
      [
        name ? `Name: ${name}` : null,
        email ? `Email: ${email}` : null,
        type ? `Interest: ${type}` : null,
        "",
        message || "",
      ]
        .filter((line) => line !== null)
        .join("\n")
    );

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section
      id="contact"
      className="relative z-[11] bg-cream-soft text-ink"
      aria-label="Contact"
    >
      <div className="mx-auto grid max-w-[1600px] gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-12 lg:gap-16 lg:px-12 lg:py-24">
        <div className="lg:col-span-5">
          <p className="mb-4 font-mono text-[0.68rem] font-medium uppercase tracking-[0.22em] text-ink/45">
            Start a conversation
          </p>
          <h2 className="font-display text-[clamp(1.85rem,4vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.03em] text-ink">
            Tell us about the space you want to shape.
          </h2>
          <p className="mt-5 max-w-md font-tagline text-base font-light leading-relaxed text-ink/65 sm:text-lg">
            Share a brief outline of your site, timeline, or idea — we typically
            respond within a few days.
          </p>

          <div className="mt-10 space-y-6 border-t border-ink/10 pt-8">
            <div>
              <p className="mb-1.5 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-ink/40">
                Email
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="group inline-flex items-center gap-2 font-display text-xl font-semibold tracking-[-0.02em] text-terracotta transition-colors hover:text-terracotta-deep"
              >
                {CONTACT_EMAIL}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
            <div>
              <p className="mb-1.5 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-ink/40">
                Phone
              </p>
              <div className="flex flex-col gap-2">
                {CONTACT_PHONES.map((phone) => (
                  <a
                    key={phone.href}
                    href={phone.href}
                    className="group inline-flex items-center gap-2 font-display text-xl font-semibold tracking-[-0.02em] text-terracotta transition-colors hover:text-terracotta-deep"
                  >
                    {phone.display}
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <form
            onSubmit={onSubmit}
            className="flex flex-col gap-6 sm:gap-7"
            noValidate
          >
            <div className="grid gap-6 sm:grid-cols-2 sm:gap-7">
              <Field label="Name" name="name" autoComplete="name" required />
              <Field
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
            </div>

            <label className="block">
              <span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.18em] text-ink/45">
                Interest
              </span>
              <select
                name="type"
                defaultValue=""
                className="w-full border-0 border-b border-ink/20 bg-transparent py-3 font-tagline text-base text-ink outline-none transition-colors focus:border-terracotta"
              >
                <option value="" disabled>
                  Select a focus
                </option>
                {PROJECT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.18em] text-ink/45">
                Message
              </span>
              <textarea
                name="message"
                rows={5}
                required
                placeholder="Site, scale, timeline, or anything that helps us prepare."
                className="w-full resize-y border-0 border-b border-ink/20 bg-transparent py-3 font-tagline text-base text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-terracotta"
              />
            </label>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="submit"
                className="group inline-flex items-center gap-2.5 rounded-full bg-terracotta px-6 py-3.5 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-cream shadow-[0_4px_20px_rgba(168,83,46,0.3)] transition-shadow hover:shadow-[0_6px_28px_rgba(168,83,46,0.4)]"
              >
                Send inquiry
                <ArrowUpRight
                  size={14}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </button>
              {sent ? (
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-ink/50">
                  Opening your mail app…
                </p>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.18em] text-ink/45">
        {label}
      </span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="w-full border-0 border-b border-ink/20 bg-transparent py-3 font-tagline text-base text-ink outline-none transition-colors focus:border-terracotta"
      />
    </label>
  );
}

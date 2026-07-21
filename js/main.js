// gr8graphix — shared site behavior

// Where order & contact form submissions are sent.
// TODO: replace with your real business inbox once you have one set up.
const ORDER_EMAIL = "michaelbernier726@gmail.com";

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initActiveNavLink();
  initYear();
  initOrderForms();
  initContactForm();
  initLivePreview();
});

function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const navbar = document.querySelector(".navbar");
  if (!toggle || !navbar) return;
  toggle.addEventListener("click", () => navbar.classList.toggle("open"));
  navbar.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => navbar.classList.remove("open"));
  });
}

function initActiveNavLink() {
  const current = document.body.dataset.page;
  if (!current) return;
  document.querySelectorAll(`.nav-links a[data-nav="${current}"]`).forEach((link) => {
    link.classList.add("active");
  });
}

function initYear() {
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

// Builds a mailto: link from a list of [label, value] pairs and opens it,
// then shows an on-page confirmation. No backend/server required.
function submitAsEmail({ subject, lines, statusEl, form }) {
  const body = lines
    .filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== "")
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  const mailto = `mailto:${ORDER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  if (statusEl) {
    statusEl.textContent =
      "Thanks! Your details are ready to send — your email app should now be open with everything filled in. Just hit send and we'll follow up within 1 business day to confirm your order and take payment.";
    statusEl.classList.remove("error");
    statusEl.classList.add("show", "success");
  }

  window.location.href = mailto;

  if (form) {
    window.setTimeout(() => form.reset(), 300);
  }
}

function initOrderForms() {
  const birthForm = document.getElementById("birth-order-form");
  if (birthForm) {
    birthForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(birthForm);
      const statusEl = document.getElementById("birth-form-status");

      submitAsEmail({
        subject: `New Birth Poster Order — ${data.get("babyName") || "Custom Order"}`,
        lines: [
          ["Baby's Name", data.get("babyName")],
          ["Date of Birth", data.get("birthDate")],
          ["Time of Birth", data.get("birthTime")],
          ["Weight", data.get("weight")],
          ["Birth Location", data.get("location")],
          ["--- Customer Info ---", ""],
          ["Your Name", data.get("customerName")],
          ["Email", data.get("customerEmail")],
          ["Phone", data.get("customerPhone")],
          ["Color / Style Preference", data.get("notes")],
        ],
        statusEl,
        form: birthForm,
      });
    });
  }

  const gradForm = document.getElementById("grad-order-form");
  if (gradForm) {
    gradForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(gradForm);
      const statusEl = document.getElementById("grad-form-status");

      submitAsEmail({
        subject: `New Graduation Poster Order — ${data.get("gradName") || "Custom Order"}`,
        lines: [
          ["Graduate's Name", data.get("gradName")],
          ["Graduation Year", data.get("gradYear")],
          ["High School Name", data.get("highSchool")],
          ["College / University Name", data.get("college")],
          ["High School Activities / Achievements", data.get("activities")],
          ["--- Customer Info ---", ""],
          ["Your Name", data.get("customerName")],
          ["Email", data.get("customerEmail")],
          ["Phone", data.get("customerPhone")],
          ["Color / Style Preference", data.get("notes")],
        ],
        statusEl,
        form: gradForm,
      });
    });
  }
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const statusEl = document.getElementById("contact-form-status");

    submitAsEmail({
      subject: `Website Contact — ${data.get("name") || "New Message"}`,
      lines: [
        ["Name", data.get("name")],
        ["Email", data.get("email")],
        ["Phone", data.get("phone")],
        ["Message", data.get("message")],
      ],
      statusEl,
      form,
    });
  });
}

// Live-updates the CSS poster mockup preview on the buy pages as the
// customer types, so they get a rough sense of their poster.
function initLivePreview() {
  const preview = document.querySelector("[data-preview]");
  if (!preview) return;
  const type = preview.dataset.preview;

  if (type === "birth") {
    bindPreview("babyName", (v) => (preview.querySelector(".p-name").textContent = v || "Baby's Name"));
    bindPreview("weight", (v) => (preview.querySelector(".p-weight").textContent = v || "—"));
    bindPreview("birthDate", (v) => (preview.querySelector(".p-date").textContent = v || "—"));
    bindPreview("birthTime", (v) => (preview.querySelector(".p-time").textContent = v || "—"));
    bindPreview("location", (v) => (preview.querySelector(".p-location").textContent = v || "—"));
  }

  if (type === "grad") {
    bindPreview("gradName", (v) => (preview.querySelector(".p-name").textContent = v || "Graduate's Name"));
    bindPreview("gradYear", (v) => (preview.querySelector(".p-year").textContent = v || "—"));
    bindPreview("highSchool", (v) => (preview.querySelector(".p-hs").textContent = v || "—"));
    bindPreview("college", (v) => (preview.querySelector(".p-college").textContent = v || "—"));
  }
}

function bindPreview(fieldName, apply) {
  const field = document.querySelector(`[name="${fieldName}"]`);
  if (!field) return;
  field.addEventListener("input", () => apply(field.value));
}

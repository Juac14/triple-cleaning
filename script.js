const serviceCatalog = {
  standard: {
    label: "Standard Cleaning",
    description: "Regular maintenance cleaning to keep your home fresh, tidy, and comfortable.",
    options: [
      { bedrooms: "2 Bedrooms", duration: "2 hr 30 min", price: "EUR 80" },
      { bedrooms: "3 Bedrooms", duration: "3 hr", price: "EUR 100" },
      { bedrooms: "4 Bedrooms", duration: "3 hr 30 min", price: "EUR 130" }
    ]
  },
  deep: {
    label: "Deep Cleaning",
    description: "A more detailed and intensive cleaning focused on built-up dirt and hard-to-reach areas.",
    options: [
      { bedrooms: "2 Bedrooms", duration: "3 hr", price: "EUR 140" },
      { bedrooms: "3 Bedrooms", duration: "3 hr 30 min", price: "EUR 160" },
      { bedrooms: "4 Bedrooms", duration: "4 hr", price: "EUR 190" }
    ]
  },
  move: {
    label: "Move In / Move Out Cleaning",
    description: "Complete top-to-bottom cleaning for empty properties before moving in or after moving out.",
    options: [
      { bedrooms: "2 Bedrooms", duration: "4 hr", price: "EUR 160" },
      { bedrooms: "3 Bedrooms", duration: "5 hr", price: "EUR 210" },
      { bedrooms: "4 Bedrooms", duration: "6 hr", price: "EUR 250" }
    ]
  }
};

const contactEmail = "triplecleaning.info@gmail.com";
const whatsappNumber = "0892721358";
const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00"
];

const weekendOptionCount = 16;

const pricingRows = document.querySelector("#pricingRows");
const serviceSelect = document.querySelector("#service");
const bedroomsSelect = document.querySelector("#bedrooms");
const timeSelect = document.querySelector("#time");
const dateInput = document.querySelector("#date");
const summary = document.querySelector("#bookingSummary");
const form = document.querySelector("#bookingForm");
const requestResult = document.querySelector("#requestResult");
const requestResultTitle = document.querySelector("#requestResultTitle");
const requestResultMessage = document.querySelector("#requestResultMessage");
const requestText = document.querySelector("#requestText");
const sendRequestButton = document.querySelector("#sendRequestButton");
const formStatus = document.querySelector("#formStatus");

function renderPricing() {
  const rows = Object.values(serviceCatalog).flatMap((service) =>
    service.options.map((option) => `
      <tr>
        <td>${service.label}</td>
        <td>${option.bedrooms}</td>
        <td>${option.duration}</td>
        <td>${option.price}</td>
      </tr>
    `)
  );

  pricingRows.innerHTML = rows.join("");
}

function populateControls() {
  serviceSelect.innerHTML = Object.entries(serviceCatalog)
    .map(([value, service]) => `<option value="${value}">${service.label}</option>`)
    .join("");

  timeSelect.innerHTML = timeSlots
    .map((slot) => `<option value="${slot}">${slot}</option>`)
    .join("");

  dateInput.innerHTML = buildWeekendOptions()
    .map((option) => `<option value="${option.value}">${option.label}</option>`)
    .join("");

  updateBedroomOptions();
}

function buildWeekendOptions() {
  const options = [];
  const formatter = new Intl.DateTimeFormat("en-IE", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (options.length < weekendOptionCount) {
    const day = cursor.getDay();
    if (day === 0 || day === 6) {
      const value = formatDateValue(cursor);
      options.push({
        value,
        label: formatter.format(cursor)
      });
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return options;
}

function formatDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function selectedService() {
  return serviceCatalog[serviceSelect.value];
}

function selectedOption() {
  return selectedService().options.find((option) => option.bedrooms === bedroomsSelect.value);
}

function updateBedroomOptions() {
  bedroomsSelect.innerHTML = selectedService().options
    .map((option) => `<option value="${option.bedrooms}">${option.bedrooms}</option>`)
    .join("");
  updateSummary();
}

function isWeekend(dateValue) {
  if (!dateValue) {
    return false;
  }

  const date = new Date(`${dateValue}T00:00:00`);
  const day = date.getDay();
  return day === 0 || day === 6;
}

function updateSummary() {
  const service = selectedService();
  const option = selectedOption();
  const dateValue = dateInput.value;
  const dateMessage = dateValue
    ? isWeekend(dateValue)
      ? `Preferred date: ${dateValue}`
      : "Please choose a Saturday or Sunday."
    : "Choose a preferred Saturday or Sunday.";

  summary.innerHTML = `
    <strong>${service.label} - ${option.bedrooms}</strong>
    <p>${option.duration} at ${option.price}</p>
    <p>${dateMessage}</p>
    <p>Status after sending: Pending Approval</p>
  `;

  summary.querySelectorAll("p").forEach((line) => {
    if (line.textContent.includes("Please choose")) {
      line.classList.add("error");
    }
  });
}

function clearFieldErrors() {
  form.querySelectorAll(".field-error").forEach((row) => row.classList.remove("field-error"));
}

function markFieldError(fieldId) {
  const field = document.querySelector(`#${fieldId}`);
  field.closest(".form-row").classList.add("field-error");
  return field;
}

function validateBookingForm() {
  clearFieldErrors();
  formStatus.className = "form-status";
  const requiredFields = ["date", "name", "email", "address"];
  const invalidFields = requiredFields.filter((fieldId) => {
    const field = document.querySelector(`#${fieldId}`);
    return !field.value.trim();
  });

  if (dateInput.value && !isWeekend(dateInput.value)) {
    invalidFields.push("date");
  }

  if (invalidFields.length > 0) {
    const firstInvalid = markFieldError(invalidFields[0]);
    invalidFields.slice(1).forEach(markFieldError);
    summary.innerHTML = `
      <strong class="error">Please complete the highlighted fields.</strong>
      <p class="error">Booking requests are available on Saturday or Sunday, 09:00-18:00.</p>
      <p>Status after sending: Pending Approval</p>
    `;
    requestResult.hidden = true;
    formStatus.textContent = "Please complete the highlighted fields.";
    formStatus.classList.add("error");
    firstInvalid.focus();
    return false;
  }

  return true;
}

function bookingBody() {
  const service = selectedService();
  const option = selectedOption();
  const fields = new FormData(form);

  return [
    "New Triple Cleaning booking request",
    "",
    "Status: Pending Approval",
    `Please confirm availability by WhatsApp: ${whatsappNumber}`,
    `Service: ${service.label}`,
    `Home size: ${option.bedrooms}`,
    `Duration: ${option.duration}`,
    `Price: ${option.price}`,
    `Preferred date: ${fields.get("date")}`,
    `Preferred time: ${fields.get("time")}`,
    "",
    `Name: ${fields.get("name")}`,
    `Email: ${fields.get("email")}`,
    `Phone: ${fields.get("phone") || "Not provided"}`,
    `Address: ${fields.get("address")}`,
    "",
    `Notes: ${fields.get("notes") || "None"}`
  ].join("\n");
}

function showRequestResult(title, message, body) {
  requestResultTitle.textContent = title;
  requestResultMessage.textContent = message;
  requestText.value = body;
  requestResult.hidden = false;
  requestResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function whatsappUrl(message) {
  return `https://wa.me/353892721358?text=${encodeURIComponent(message)}`;
}

function handleSubmit(event) {
  if (event) {
    event.preventDefault();
  }

  if (!validateBookingForm()) {
    return;
  }

  const rawBody = bookingBody();
  const submitButton = sendRequestButton;

  showRequestResult(
    "Request ready for WhatsApp",
    "Open WhatsApp with your request ready to send.",
    rawBody
  );
  formStatus.textContent = "Opening WhatsApp with your request ready to send.";
  formStatus.className = "form-status";
  formStatus.classList.add("success");
  submitButton.textContent = "Send";
  updateSummary();
  window.open(whatsappUrl(rawBody), "_blank", "noopener");
}

renderPricing();
populateControls();
updateSummary();

serviceSelect.addEventListener("change", updateBedroomOptions);
bedroomsSelect.addEventListener("change", updateSummary);
dateInput.addEventListener("change", updateSummary);
timeSelect.addEventListener("change", updateSummary);
form.addEventListener("submit", handleSubmit);
sendRequestButton.addEventListener("click", handleSubmit);

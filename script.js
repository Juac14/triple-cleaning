const serviceCatalog = {
  standard: {
    label: "Standard Cleaning",
    description: "Regular maintenance cleaning to keep your home fresh, tidy, and comfortable.",
    options: [
      { bedrooms: "2 Bedrooms", price: "€ 80.00 - € 120.00", estimatedTime: "1:20 - 2:00" },
      { bedrooms: "3 Bedrooms", price: "€ 100.00 - € 150.00", estimatedTime: "1:30 - 2:30" },
      { bedrooms: "4 Bedrooms", price: "€ 130.00 - € 180.00", estimatedTime: "2:15 - 3:00" },
      { bedrooms: "5 Bedrooms", price: "€ 180.00 - € 240.00", estimatedTime: "3:00 - 4:00" },
      { bedrooms: "6 Bedrooms", price: "€ 210.00 - € 270.00", estimatedTime: "3:15 - 4:30" }
    ]
  },
  deep: {
    label: "Deep Cleaning",
    description: "A more detailed and intensive cleaning focused on built-up dirt and hard-to-reach areas.",
    options: [
      { bedrooms: "2 Bedrooms", price: "€ 140.00 - € 180.00", estimatedTime: "2:20 - 3:00" },
      { bedrooms: "3 Bedrooms", price: "€ 180.00 - € 210.00", estimatedTime: "3:00 - 3:30" },
      { bedrooms: "4 Bedrooms", price: "€ 210.00 - € 250.00", estimatedTime: "3:30 - 4:15" },
      { bedrooms: "5 Bedrooms", price: "€ 240.00 - € 300.00", estimatedTime: "4:00 - 5:00" },
      { bedrooms: "6 Bedrooms", price: "€ 270.00 - € 330.00", estimatedTime: "4:30 - 5:30" }
    ]
  },
  move: {
    label: "Move In Cleaning (New construction)",
    description: "Complete top-to-bottom cleaning for newly constructed properties before moving in.",
    options: [
      { bedrooms: "2 Bedrooms", price: "€ 300.00", estimatedTime: "2:30" },
      { bedrooms: "3 Bedrooms", price: "€ 360.00", estimatedTime: "3:30" },
      { bedrooms: "4 Bedrooms", price: "€ 420.00", estimatedTime: "4:00" },
      { bedrooms: "5 Bedrooms", price: "€ 480.00", estimatedTime: "5:00" }
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

let calendarCursor = new Date();
calendarCursor.setDate(1);

const pricingRows = document.querySelector("#pricingRows");
const serviceSelect = document.querySelector("#service");
const bedroomsSelect = document.querySelector("#bedrooms");
const bathroomsSelect = document.querySelector("#bathrooms");
const propertySizeSelect = document.querySelector("#propertySize");
const timeSelect = document.querySelector("#time");
const dateInput = document.querySelector("#date");
const bookingCalendar = document.querySelector("#bookingCalendar");
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
        <td>${option.price}</td>
        <td>${option.estimatedTime}</td>
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

  renderBookingCalendar();
  updateBedroomOptions();
}

function formatDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function renderBookingCalendar() {
  const monthFormatter = new Intl.DateTimeFormat("en-IE", {
    month: "long",
    year: "numeric"
  });
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const year = calendarCursor.getFullYear();
  const month = calendarCursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = firstDay.getDay();
  const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const cells = [];

  for (let index = 0; index < leadingBlanks; index += 1) {
    cells.push('<span class="calendar-day empty" aria-hidden="true"></span>');
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    const value = formatDateValue(date);
    const weekend = isWeekend(value);
    const past = date < today;
    const selected = dateInput.value === value;
    const disabled = !weekend || past;
    const classes = ["calendar-day"];

    if (selected) {
      classes.push("selected");
    }
    if (disabled) {
      classes.push("disabled");
    }

    cells.push(`
      <button
        class="${classes.join(" ")}"
        type="button"
        data-date="${value}"
        ${disabled ? "disabled" : ""}
        aria-label="${value}${disabled ? " unavailable" : " available"}"
      >${day}</button>
    `);
  }

  bookingCalendar.innerHTML = `
    <div class="calendar-header">
      <button class="calendar-nav" type="button" data-calendar-nav="previous" aria-label="Previous month">&lt;</button>
      <strong>${monthFormatter.format(calendarCursor)}</strong>
      <button class="calendar-nav" type="button" data-calendar-nav="next" aria-label="Next month">&gt;</button>
    </div>
    <div class="calendar-grid">
      ${weekdayLabels.map((label) => `<span class="calendar-weekday">${label}</span>`).join("")}
      ${cells.join("")}
    </div>
  `;
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
    <p>Full bathrooms: ${bathroomsSelect.value}</p>
    <p>Property size: ${propertySizeSelect.value} sq ft</p>
    <p><strong>Estimated price: ${option.price}</strong></p>
    <p>Final price depends on the number of bathrooms, property size, and its current condition.</p>
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
  const requiredFields = ["propertySize", "date", "name", "email", "address"];
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
    `Service: ${service.label}`,
    `Home size: ${option.bedrooms}`,
    `Full bathrooms: ${fields.get("bathrooms")}`,
    `Property size: ${fields.get("propertySize")} sq ft`,
    `Estimated price: ${option.price}`,
    "Final price depends on the number of bathrooms, property size, and its current condition.",
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

function bookingFields() {
  const service = selectedService();
  const option = selectedOption();
  const fields = new FormData(form);

  return {
    "form-name": "booking-request",
    status: "Pending Approval",
    service: service.label,
    bedrooms: option.bedrooms,
    full_bathrooms: fields.get("bathrooms"),
    property_size_sq_ft: fields.get("propertySize"),
    estimated_price: option.price,
    preferred_date: fields.get("date"),
    preferred_time: fields.get("time"),
    customer_name: fields.get("name"),
    customer_email: fields.get("email"),
    customer_phone: fields.get("phone") || "Not provided",
    customer_address: fields.get("address"),
    notes: fields.get("notes") || "None",
    request_message: bookingBody()
  };
}

async function submitBookingCopy() {
  const body = new URLSearchParams(bookingFields());

  await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString()
  });
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
  submitBookingCopy().catch(() => {
    formStatus.textContent = "Opening WhatsApp. Email copy will be available after the site is loaded from Netlify.";
  });
  window.open(whatsappUrl(rawBody), "_blank", "noopener");
}

renderPricing();
populateControls();
updateSummary();

serviceSelect.addEventListener("change", updateBedroomOptions);
bedroomsSelect.addEventListener("change", updateSummary);
bathroomsSelect.addEventListener("change", updateSummary);
propertySizeSelect.addEventListener("change", updateSummary);
dateInput.addEventListener("change", updateSummary);
bookingCalendar.addEventListener("click", (event) => {
  const navButton = event.target.closest("[data-calendar-nav]");
  const dateButton = event.target.closest("[data-date]");

  if (navButton) {
    calendarCursor.setMonth(calendarCursor.getMonth() + (navButton.dataset.calendarNav === "next" ? 1 : -1));
    renderBookingCalendar();
    return;
  }

  if (dateButton && !dateButton.disabled) {
    dateInput.value = dateButton.dataset.date;
    renderBookingCalendar();
    updateSummary();
  }
});
timeSelect.addEventListener("change", updateSummary);
form.addEventListener("submit", handleSubmit);
sendRequestButton.addEventListener("click", handleSubmit);

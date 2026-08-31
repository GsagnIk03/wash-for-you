// @ts-nocheck
const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL || "support@washforu.com";

// One resolved vehicle line from the booking form — "Same as Vehicle #1"
// checkboxes have already been applied client-side, so every field here is a
// concrete value ready to print.
interface VehiclePayload {
  vehicleLabel: string; // "Vehicle #1", "Vehicle #2", …
  service: string;
  vehicleType?: string; // "Bike" | "Scooty" | ""
  vehicleModel?: string;
  vehicleNumber?: string;
  address: string;
  locality?: string;
  preferredDate?: string;
  price?: string; // e.g. "₹299"
}

interface BookingPayload {
  mode?: "service" | "general";
  from_name: string;
  from_email: string;
  phone: string;
  message?: string;
  vehicles?: VehiclePayload[];
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// The booking form's <input type="datetime-local"> sends a plain
// "YYYY-MM-DDTHH:mm" string with NO timezone info — it already represents
// the customer's intended (IST) wall-clock time. Feeding that through
// `new Date(...)` on the server (which runs in UTC on Vercel) and then
// re-converting to "Asia/Kolkata" double-applies the +5:30 offset, shifting
// the time shown in the email 5.5 hours later than what was actually picked.
// Format the raw components directly instead — no Date/timezone conversion.
function formatPreferredDate(preferred_date?: string): string {
  if (!preferred_date) return "Not specified";
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(preferred_date);
  if (!m) return preferred_date;
  const year = Number(m[1]);
  const monthIdx = Number(m[2]) - 1;
  const day = Number(m[3]);
  let hour = Number(m[4]);
  const minute = Number(m[5]);
  const weekday =
    WEEKDAY_NAMES[new Date(Date.UTC(year, monthIdx, day)).getUTCDay()];
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;
  const minuteStr = String(minute).padStart(2, "0");
  return `${weekday}, ${MONTH_NAMES[monthIdx]} ${day}, ${year}, ${hour}:${minuteStr} ${ampm}`;
}

function priceToNumber(price?: string): number {
  if (!price) return 0;
  const digits = price.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Wash For U <support@washforu.com>",
      to,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend error: ${err}`);
  }
  return res.json();
}

// Vercel Node.js runtime does not auto-parse JSON bodies — read raw stream
function parseBody(req: any): Promise<BookingPayload> {
  return new Promise((resolve, reject) => {
    if (req.body && typeof req.body === "object") {
      return resolve(req.body as BookingPayload);
    }
    let raw = "";
    req.on("data", (chunk: any) => {
      raw += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(raw || "{}"));
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

// One bordered block per vehicle — used inside both the owner and customer
// emails so a multi-vehicle booking reads as a clear itemized list rather
// than one flattened row.
function vehicleBlockHtml(v: VehiclePayload): string {
  const dateFormatted = formatPreferredDate(v.preferredDate);
  const rows = [
    ["Service", v.service, "#2979D8", 700],
    v.vehicleType ? ["Vehicle Type", v.vehicleType, "#0A2540", 600] : null,
    v.vehicleModel ? ["Vehicle Model", v.vehicleModel, "#0A2540", 600] : null,
    v.vehicleNumber
      ? ["Vehicle Number", v.vehicleNumber, "#0A2540", 600]
      : null,
    [
      "Address",
      `${v.address}${v.locality ? ` — ${v.locality}` : ""}`,
      "#0A2540",
      600,
    ],
    ["Preferred Date & Time", dateFormatted, "#0A2540", 600],
    v.price ? ["Price", v.price, "#2979D8", 700] : null,
  ].filter((r): r is [string, string, string, number] => r !== null);

  return `
    <div style="border: 1px solid #e8f1fb; border-radius: 10px; padding: 16px 18px; margin-bottom: 14px;">
      <div style="font-weight: 800; color: #2979D8; font-size: 12px; letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 10px;">${v.vehicleLabel}</div>
      <table style="width: 100%; border-collapse: collapse;">
        ${rows
          .map(
            ([label, value, color, weight]) => `
          <tr>
            <td style="padding: 6px 0; color: #4A6FA5; font-size: 13px; width: 42%; vertical-align: top;">${label}</td>
            <td style="padding: 6px 0; color: ${color}; font-weight: ${weight}; font-size: ${weight >= 700 ? "14px" : "13px"};">${value}</td>
          </tr>`,
          )
          .join("")}
      </table>
    </div>
  `;
}

module.exports = async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let payload: BookingPayload;
  try {
    payload = await parseBody(req);
  } catch (e: any) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const { from_name, from_email, phone, message, vehicles } = payload;
  const mode = payload.mode === "general" ? "general" : "service";

  if (!from_name || !from_email || !phone) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // ─── General Question — no vehicle/cart data at all ────────────────────
  if (mode === "general") {
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const ownerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f3f8ff; padding: 32px; border-radius: 16px;">
        <div style="background: linear-gradient(135deg, #0A2540, #1A4F8A); border-radius: 12px; padding: 28px 32px; margin-bottom: 24px;">
          <h1 style="color: #fff; font-size: 22px; margin: 0 0 4px;">New General Question — Wash For U</h1>
          <p style="color: rgba(255,255,255,0.65); margin: 0; font-size: 14px;">A visitor has a question rather than a booking.</p>
        </div>
        <div style="background: #fff; border-radius: 12px; padding: 28px 32px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #e8f1fb; color: #4A6FA5; font-size: 13px; width: 40%;">Name</td><td style="padding: 10px 0; border-bottom: 1px solid #e8f1fb; font-weight: 600; color: #0A2540;">${from_name}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #e8f1fb; color: #4A6FA5; font-size: 13px;">Phone / WhatsApp</td><td style="padding: 10px 0; border-bottom: 1px solid #e8f1fb; font-weight: 600; color: #0A2540;">${phone}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #e8f1fb; color: #4A6FA5; font-size: 13px;">Email</td><td style="padding: 10px 0; border-bottom: 1px solid #e8f1fb; font-weight: 600; color: #0A2540;">${from_email}</td></tr>
            <tr><td style="padding: 10px 0; color: #4A6FA5; font-size: 13px; vertical-align: top;">Question</td><td style="padding: 10px 0; font-weight: 600; color: #0A2540;">${message}</td></tr>
          </table>
          <div style="margin-top: 24px; background: #e8f1fb; border-radius: 8px; padding: 14px 18px; font-size: 13px; color: #4A6FA5;">
            Reply directly to this email or WhatsApp <strong style="color: #0A2540;">${phone}</strong>.
          </div>
        </div>
        <p style="text-align: center; color: #4A6FA5; font-size: 12px; margin-top: 20px;">Wash For U · South Kolkata · support@washforu.com</p>
      </div>
    `;

    const customerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f3f8ff; padding: 32px; border-radius: 16px;">
        <div style="background: linear-gradient(135deg, #0A2540, #1A4F8A); border-radius: 12px; padding: 28px 32px; margin-bottom: 24px; text-align: center;">
          <h1 style="color: #fff; font-size: 22px; margin: 0 0 8px;">We've Got Your Question!</h1>
          <p style="color: rgba(255,255,255,0.75); margin: 0; font-size: 14px;">Hi ${from_name}, thanks for reaching out — we'll get back to you shortly.</p>
        </div>
        <div style="background: #fff; border-radius: 12px; padding: 28px 32px;">
          <h2 style="color: #0A2540; font-size: 16px; margin: 0 0 12px;">Your Message</h2>
          <p style="color: #4A6FA5; font-size: 14px; line-height: 1.6; margin: 0;">${message}</p>
          <div style="margin-top: 24px; background: #e8f7f0; border: 1px solid #27AE60; border-radius: 8px; padding: 14px 18px; font-size: 13px; color: #1A7245;">
            We'll reply via WhatsApp or call within <strong>30 minutes</strong>. If urgent, reach us at <strong>+91 94775 88518</strong>.
          </div>
        </div>
        <p style="text-align: center; color: #4A6FA5; font-size: 12px; margin-top: 20px;">Wash For U · South Kolkata · support@washforu.com</p>
      </div>
    `;

    try {
      await Promise.all([
        sendEmail(BUSINESS_EMAIL, `New Question from ${from_name}`, ownerHtml),
        sendEmail(
          from_email,
          "We've Got Your Question — Wash For U",
          customerHtml,
        ),
      ]);
      return res.status(200).json({ success: true });
    } catch (err: any) {
      console.error("Email send failed:", err);
      return res
        .status(500)
        .json({ error: err.message || "Failed to send email" });
    }
  }

  // ─── Service booking — one or more itemized vehicles ───────────────────
  if (!vehicles || !Array.isArray(vehicles) || vehicles.length === 0) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  for (const v of vehicles) {
    if (!v.address || !v.service) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  }

  const grandTotal = vehicles.reduce(
    (sum, v) => sum + priceToNumber(v.price),
    0,
  );
  const vehicleBlocks = vehicles.map(vehicleBlockHtml).join("");
  const vehicleWord = vehicles.length === 1 ? "vehicle" : "vehicles";

  const ownerHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f3f8ff; padding: 32px; border-radius: 16px;">
      <div style="background: linear-gradient(135deg, #0A2540, #1A4F8A); border-radius: 12px; padding: 28px 32px; margin-bottom: 24px;">
        <h1 style="color: #fff; font-size: 22px; margin: 0 0 4px;">New Booking — Wash For U</h1>
        <p style="color: rgba(255,255,255,0.65); margin: 0; font-size: 14px;">A customer has submitted a booking request for ${vehicles.length} ${vehicleWord}.</p>
      </div>
      <div style="background: #fff; border-radius: 12px; padding: 28px 32px;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr><td style="padding: 10px 0; border-bottom: 1px solid #e8f1fb; color: #4A6FA5; font-size: 13px; width: 40%;">Customer Name</td><td style="padding: 10px 0; border-bottom: 1px solid #e8f1fb; font-weight: 600; color: #0A2540;">${from_name}</td></tr>
          <tr><td style="padding: 10px 0; border-bottom: 1px solid #e8f1fb; color: #4A6FA5; font-size: 13px;">Phone / WhatsApp</td><td style="padding: 10px 0; border-bottom: 1px solid #e8f1fb; font-weight: 600; color: #0A2540;">${phone}</td></tr>
          <tr><td style="padding: 10px 0; color: #4A6FA5; font-size: 13px;">Email</td><td style="padding: 10px 0; font-weight: 600; color: #0A2540;">${from_email}</td></tr>
        </table>
        ${vehicleBlocks}
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-top: 2px solid #0A2540; margin-top: 4px;">
          <span style="font-weight: 700; color: #0A2540; font-size: 14px;">Grand Total</span>
          <span style="font-weight: 800; color: #2979D8; font-size: 17px;">₹${grandTotal}</span>
        </div>
        ${message ? `<div style="margin-top: 18px;"><div style="color: #4A6FA5; font-size: 13px; margin-bottom: 4px;">Notes</div><div style="font-weight: 600; color: #0A2540; font-size: 14px;">${message}</div></div>` : ""}
        <div style="margin-top: 24px; background: #e8f1fb; border-radius: 8px; padding: 14px 18px; font-size: 13px; color: #4A6FA5;">
          Reply directly to this email or WhatsApp <strong style="color: #0A2540;">${phone}</strong> to confirm the booking.
        </div>
      </div>
      <p style="text-align: center; color: #4A6FA5; font-size: 12px; margin-top: 20px;">Wash For U · South Kolkata · support@washforu.com</p>
    </div>
  `;

  const customerHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f3f8ff; padding: 32px; border-radius: 16px;">
      <div style="background: linear-gradient(135deg, #0A2540, #1A4F8A); border-radius: 12px; padding: 28px 32px; margin-bottom: 24px; text-align: center;">
        <h1 style="color: #fff; font-size: 22px; margin: 0 0 8px;">Booking Received!</h1>
        <p style="color: rgba(255,255,255,0.75); margin: 0; font-size: 14px;">Hi ${from_name}, we've got your request for ${vehicles.length} ${vehicleWord} and will confirm shortly.</p>
      </div>
      <div style="background: #fff; border-radius: 12px; padding: 28px 32px;">
        <h2 style="color: #0A2540; font-size: 16px; margin: 0 0 14px;">Your Booking Summary</h2>
        ${vehicleBlocks}
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-top: 2px solid #0A2540; margin-top: 4px;">
          <span style="font-weight: 700; color: #0A2540; font-size: 14px;">Grand Total</span>
          <span style="font-weight: 800; color: #2979D8; font-size: 17px;">₹${grandTotal}</span>
        </div>
        <div style="margin-top: 24px; background: #e8f7f0; border: 1px solid #27AE60; border-radius: 8px; padding: 14px 18px; font-size: 13px; color: #1A7245;">
          We'll confirm your booking via WhatsApp or call within <strong>30 minutes</strong>. If urgent, reach us at <strong>+91 94775 88518</strong>.
        </div>
      </div>
      <p style="text-align: center; color: #4A6FA5; font-size: 12px; margin-top: 20px;">Wash For U · South Kolkata · support@washforu.com</p>
    </div>
  `;

  try {
    await Promise.all([
      sendEmail(
        BUSINESS_EMAIL,
        `New Booking from ${from_name} — ${vehicles.length} ${vehicleWord}`,
        ownerHtml,
      ),
      sendEmail(from_email, "Booking Confirmed — Wash For U", customerHtml),
    ]);
    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("Email send failed:", err);
    return res
      .status(500)
      .json({ error: err.message || "Failed to send email" });
  }
};

// @ts-nocheck
const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL || "support@washforu.com";

interface BookingPayload {
  from_name: string;
  from_email: string;
  phone: string;
  service: string;
  vehicle: string;
  vehicleNumber?: string;
  preferred_date?: string;
  message?: string;
}

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Wash For You <support@washforu.com>",
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

module.exports = async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    from_name,
    from_email,
    phone,
    service,
    vehicle,
    vehicleNumber,
    preferred_date,
    message,
  }: BookingPayload = req.body;

  if (!from_name || !from_email || !phone || !service || !vehicle) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const dateFormatted = preferred_date
    ? new Date(preferred_date).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "full",
        timeStyle: "short",
      })
    : "Not specified";

  const ownerHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f3f8ff; padding: 32px; border-radius: 16px;">
      <div style="background: linear-gradient(135deg, #0A2540, #1A4F8A); border-radius: 12px; padding: 28px 32px; margin-bottom: 24px;">
        <h1 style="color: #fff; font-size: 22px; margin: 0 0 4px;">🚗 New Booking — Wash For You</h1>
        <p style="color: rgba(255,255,255,0.65); margin: 0; font-size: 14px;">A customer has submitted a booking request.</p>
      </div>
      <div style="background: #fff; border-radius: 12px; padding: 28px 32px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 10px 0; border-bottom: 1px solid #e8f1fb; color: #4A6FA5; font-size: 13px; width: 40%;">👤 Customer Name</td><td style="padding: 10px 0; border-bottom: 1px solid #e8f1fb; font-weight: 600; color: #0A2540;">${from_name}</td></tr>
          <tr><td style="padding: 10px 0; border-bottom: 1px solid #e8f1fb; color: #4A6FA5; font-size: 13px;">📞 Phone / WhatsApp</td><td style="padding: 10px 0; border-bottom: 1px solid #e8f1fb; font-weight: 600; color: #0A2540;">${phone}</td></tr>
          <tr><td style="padding: 10px 0; border-bottom: 1px solid #e8f1fb; color: #4A6FA5; font-size: 13px;">✉️ Email</td><td style="padding: 10px 0; border-bottom: 1px solid #e8f1fb; font-weight: 600; color: #0A2540;">${from_email}</td></tr>
          <tr><td style="padding: 10px 0; border-bottom: 1px solid #e8f1fb; color: #4A6FA5; font-size: 13px;">🧽 Service</td><td style="padding: 10px 0; border-bottom: 1px solid #e8f1fb; font-weight: 600; color: #2979D8;">${service}</td></tr>
          <tr><td style="padding: 10px 0; border-bottom: 1px solid #e8f1fb; color: #4A6FA5; font-size: 13px;">🚙 Vehicle Type</td><td style="padding: 10px 0; border-bottom: 1px solid #e8f1fb; font-weight: 600; color: #0A2540;">${vehicle}</td></tr>
          ${vehicleNumber ? `<tr><td style="padding: 10px 0; border-bottom: 1px solid #e8f1fb; color: #4A6FA5; font-size: 13px;">🔢 Vehicle Number</td><td style="padding: 10px 0; border-bottom: 1px solid #e8f1fb; font-weight: 600; color: #0A2540;">${vehicleNumber}</td></tr>` : ""}
          <tr><td style="padding: 10px 0; border-bottom: 1px solid #e8f1fb; color: #4A6FA5; font-size: 13px;">📅 Preferred Date & Time</td><td style="padding: 10px 0; border-bottom: 1px solid #e8f1fb; font-weight: 600; color: #0A2540;">${dateFormatted}</td></tr>
          ${message ? `<tr><td style="padding: 10px 0; color: #4A6FA5; font-size: 13px;">📝 Notes</td><td style="padding: 10px 0; font-weight: 600; color: #0A2540;">${message}</td></tr>` : ""}
        </table>
        <div style="margin-top: 24px; background: #e8f1fb; border-radius: 8px; padding: 14px 18px; font-size: 13px; color: #4A6FA5;">
          Reply directly to this email or WhatsApp <strong style="color: #0A2540;">${phone}</strong> to confirm the booking.
        </div>
      </div>
      <p style="text-align: center; color: #4A6FA5; font-size: 12px; margin-top: 20px;">Wash For You · South Kolkata · support@washforu.com</p>
    </div>
  `;

  const customerHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f3f8ff; padding: 32px; border-radius: 16px;">
      <div style="background: linear-gradient(135deg, #0A2540, #1A4F8A); border-radius: 12px; padding: 28px 32px; margin-bottom: 24px; text-align: center;">
        <div style="font-size: 40px; margin-bottom: 12px;">✅</div>
        <h1 style="color: #fff; font-size: 22px; margin: 0 0 8px;">Booking Received!</h1>
        <p style="color: rgba(255,255,255,0.75); margin: 0; font-size: 14px;">Hi ${from_name}, we've got your request and will confirm shortly.</p>
      </div>
      <div style="background: #fff; border-radius: 12px; padding: 28px 32px;">
        <h2 style="color: #0A2540; font-size: 16px; margin: 0 0 18px;">Your Booking Summary</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 10px 0; border-bottom: 1px solid #e8f1fb; color: #4A6FA5; font-size: 13px; width: 40%;">🧽 Service</td><td style="padding: 10px 0; border-bottom: 1px solid #e8f1fb; font-weight: 600; color: #2979D8;">${service}</td></tr>
          <tr><td style="padding: 10px 0; border-bottom: 1px solid #e8f1fb; color: #4A6FA5; font-size: 13px;">🚙 Vehicle</td><td style="padding: 10px 0; border-bottom: 1px solid #e8f1fb; font-weight: 600; color: #0A2540;">${vehicle}${vehicleNumber ? ` (${vehicleNumber})` : ""}</td></tr>
          <tr><td style="padding: 10px 0; color: #4A6FA5; font-size: 13px;">📅 Preferred Date</td><td style="padding: 10px 0; font-weight: 600; color: #0A2540;">${dateFormatted}</td></tr>
        </table>
        <div style="margin-top: 24px; background: #e8f7f0; border: 1px solid #27AE60; border-radius: 8px; padding: 14px 18px; font-size: 13px; color: #1A7245;">
          We'll confirm your booking via WhatsApp or call within <strong>30 minutes</strong>. If urgent, reach us at <strong>+91 94775 88518</strong>.
        </div>
      </div>
      <p style="text-align: center; color: #4A6FA5; font-size: 12px; margin-top: 20px;">Wash For You · South Kolkata · support@washforu.com</p>
    </div>
  `;

  try {
    await Promise.all([
      sendEmail(BUSINESS_EMAIL, `🚗 New Booking from ${from_name} — ${service}`, ownerHtml),
      sendEmail(from_email, "✅ Booking Confirmed — Wash For You", customerHtml),
    ]);
    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("Email send failed:", err);
    return res.status(500).json({ error: err.message || "Failed to send email" });
  }
};
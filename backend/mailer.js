const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendBookingConfirmation({ bookerName, bookerEmail, eventTitle, startTime, endTime, hostEmail }) {
  const dateStr = new Date(startTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' });
  const endStr = new Date(endTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', timeStyle: 'short' });

  await transporter.sendMail({
    from: `"Cal Clone" <${process.env.EMAIL_USER}>`,
    to: bookerEmail,
    subject: `Booking Confirmed: ${eventTitle}`,
    html: `<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
      <h2 style="background:#6366f1;color:white;padding:16px;border-radius:8px;text-align:center;">✅ Booking Confirmed!</h2>
      <p>Hi <strong>${bookerName}</strong>, your meeting is scheduled.</p>
      <div style="background:#f9fafb;padding:16px;border-radius:8px;">
        <p><strong>📅 Event:</strong> ${eventTitle}</p>
        <p><strong>🕐 Time:</strong> ${dateStr} – ${endStr} IST</p>
      </div></div>`
  });

  await transporter.sendMail({
    from: `"Cal Clone" <${process.env.EMAIL_USER}>`,
    to: hostEmail,
    subject: `New Booking: ${eventTitle} with ${bookerName}`,
    html: `<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
      <h2 style="background:#111827;color:white;padding:16px;border-radius:8px;text-align:center;">📬 New Meeting Booked!</h2>
      <div style="background:#f9fafb;padding:16px;border-radius:8px;">
        <p><strong>👤 Name:</strong> ${bookerName}</p>
        <p><strong>📧 Email:</strong> ${bookerEmail}</p>
        <p><strong>📅 Event:</strong> ${eventTitle}</p>
        <p><strong>🕐 Time:</strong> ${dateStr} – ${endStr} IST</p>
      </div></div>`
  });

  console.log(`✅ Emails sent to ${bookerEmail} and ${hostEmail}`);
}

module.exports = { sendBookingConfirmation };
import nodemailer from "nodemailer";

function getTransporter() {
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_APP_PASSWORD;

  if (!emailUser || !emailPassword) {
    throw new Error("Email configuration is missing");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  });
}

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetLink: string
) {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"Employee Portal" <${process.env.EMAIL_USER}>`,

    // This is the employee email dynamically received
    // from the forgot-password request.
    to: email,

    subject: "Reset your Employee Portal password",

    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:30px;">
        <h2 style="color:#6D28D9;">
          Employee Portal
        </h2>

        <h3>Hello ${name},</h3>

        <p>
          We received a request to reset your Employee Portal password.
        </p>

        <p>
          Click the button below to create a new password.
        </p>

        <div style="margin:30px 0;">
          <a
            href="${resetLink}"
            style="
              background:#7C3AED;
              color:white;
              text-decoration:none;
              padding:14px 24px;
              border-radius:10px;
              font-weight:bold;
            "
          >
            Reset Password
          </a>
        </div>

        <p>
          This link expires in 15 minutes.
        </p>

        <p style="color:#64748B;font-size:13px;">
          If you did not request this password reset,
          you can ignore this email.
        </p>
      </div>
    `,
  });
}

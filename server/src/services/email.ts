import sgMail from "@sendgrid/mail";

const apiKey =
  process.env.SENDGRID_API_KEY ?? "";

const fromEmail =
  process.env.SENDGRID_FROM_EMAIL ?? "";

if (!apiKey) {
  throw new Error(
    "SENDGRID_API_KEY is missing"
  );
}

if (!fromEmail) {
  throw new Error(
    "SENDGRID_FROM_EMAIL is missing"
  );
}

sgMail.setApiKey(apiKey);

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetLink: string
) {
  await sgMail.send({
    to: email,

    from: {
      email: fromEmail,
      name: "Employee Portal",
    },

    subject:
      "Reset your Employee Portal password",

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 30px;
        color: #0F172A;
      ">
        <div style="
          background: linear-gradient(
            135deg,
            #6D28D9,
            #A855F7,
            #EC4899
          );
          padding: 24px;
          border-radius: 16px 16px 0 0;
          color: white;
        ">
          <h2 style="margin:0;">
            Employee Portal
          </h2>

          <p style="margin:8px 0 0;">
            Password Reset Request
          </p>
        </div>

        <div style="
          border:1px solid #E2E8F0;
          border-top:0;
          padding:30px;
          border-radius:0 0 16px 16px;
        ">
          <h3>
            Hello ${name},
          </h3>

          <p>
            We received a request to reset your
            Employee Portal password.
          </p>

          <p>
            Click the button below to create
            a new password.
          </p>

          <div style="
            text-align:center;
            margin:30px 0;
          ">
            <a
              href="${resetLink}"
              style="
                display:inline-block;
                background:#7C3AED;
                color:#FFFFFF;
                text-decoration:none;
                padding:14px 24px;
                border-radius:10px;
                font-weight:bold;
              "
            >
              Reset Password
            </a>
          </div>

          <p style="
            font-size:13px;
            color:#64748B;
          ">
            This password reset link expires in 15 minutes.
          </p>

          <p style="
            font-size:13px;
            color:#64748B;
          ">
            If you did not request this password reset,
            you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
  });
}
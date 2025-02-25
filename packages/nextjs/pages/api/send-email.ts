import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import * as yup from "yup";
import { config } from "~~/config/config";

const emailSchema = yup.object().shape({
  email: yup.string().email().required(),
  subject: yup.string().min(3).max(255).required(),
  message: yup.string().required(),
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: config.email.host ?? "",
  port: Number(config.email.port),
  secure: false,
  auth: {
    user: config.email.user ?? "",
    pass: config.email.pass ?? "",
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email, subject, message } = await emailSchema.validate(req.body);

    await transporter.sendMail({
      from: email,
      to: config.email.recipient,
      subject,
      text: message,
    });

    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ error: error.errors });
    }

    console.error("Email sending error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

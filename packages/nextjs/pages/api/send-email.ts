import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import * as yup from "yup";
import { config } from "~~/config/config";

const schema = yup.object().shape({
  email: yup.string().email().required(),
  subject: yup.string().required().min(3).max(255),
  message: yup.string().required(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      await schema.validate(req.body);
      const { email, subject, message } = req.body;
      const user = config.email.user ?? "";
      const pass = config.email.pass ?? "";
      const host = config.email.host ?? "";
      const port = config.email.port ?? "";
      const transporter = nodemailer.createTransport({
        host,
        auth: {
          user,
          pass,
        },
        secure: false,
        port: Number(port),
      });
      const mailOptions = {
        from: email,
        to: config.email.recipient,
        subject: subject,
        text: message,
      };
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({
          error: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : null,
        });
      }
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

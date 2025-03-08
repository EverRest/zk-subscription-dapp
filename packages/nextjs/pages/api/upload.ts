import formidable, { Fields, Files } from "formidable";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const form = new formidable.IncomingForm();
  // TODO: change uploading file to save a link
  form.parse(req, (err: any, fields: Fields, files: Files) => {
    if (err) {
      return res.status(500).json({ error: "File upload failed" });
    }
    const title = fields.title?.[0] || "Untitled";
    const description = fields.description?.[0] || "No description";
    const category = fields.category?.[0] || "Uncategorized";
    const imageFile = files.image?.[0];
    console.log("Title:", title);
    console.log("Description:", description);
    console.log("Category:", category);
    console.log("File:", imageFile?.filepath);

    res.status(200).json({ message: "Upload successful", filename: imageFile?.newFilename });
  });
}

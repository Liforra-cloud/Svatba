import formidable from 'formidable';
import { google } from 'googleapis';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadToGoogleDrive = async (fileData, fileName) => {
  // Načteme celý JSON klíče ze jediné proměnné
  const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

  // Použijeme GoogleAuth, aby se klíč zpracoval interně (vyhneme se ERR_OSSL_UNSUPPORTED)
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive'],
  });
  const authClient = await auth.getClient();
  const drive = google.drive({ version: 'v3', auth: authClient });

  // Nahrajeme soubor do sdílené složky
  return drive.files.create({
    requestBody: {
      name: fileName,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
    },
    media: {
      mimeType: fileData.mimetype,
      body: fs.createReadStream(fileData.filepath),
    },
  });
};

export default async function handler(req, res) {
  const form = formidable({ multiples: false });
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      return res.status(500).json({ error: 'Chyba při zpracování souboru' });
    }
    try {
      const file = files.photo;
      const result = await uploadToGoogleDrive(
        file,
        file.originalFilename || `photo_${Date.now()}.jpg`
      );
      res.status(200).json({ data: result.data });
    } catch (error) {
      console.error('Error uploading to Drive:', error);
      res.status(500).json({ error: 'Chyba při uploadu na Google Drive' });
    }
  });
}

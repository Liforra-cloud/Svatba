import formidable from 'formidable';
import { google } from 'googleapis';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadToGoogleDrive = async (fileData, fileName) => {
  console.log('DEBUG: GOOGLE_CLIENT_EMAIL =', process.env.GOOGLE_CLIENT_EMAIL);
  console.log('DEBUG: GOOGLE_PRIVATE_KEY starts =', process.env.GOOGLE_PRIVATE_KEY?.slice(0, 30), '…');
  console.log('DEBUG: GOOGLE_DRIVE_FOLDER_ID =', process.env.GOOGLE_DRIVE_FOLDER_ID);

  const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/drive']
  );

  const drive = google.drive({ version: 'v3', auth });

  const response = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
    },
    media: {
      mimeType: fileData.mimetype,
      body: fs.createReadStream(fileData.filepath),
    },
  });
  return response.data;
};

export default async function handler(req, res) {
  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      return res.status(500).json({ error: 'Chyba při zpracování souboru' });
    }

    console.log('DEBUG: Parsed fields =', fields);
    console.log('DEBUG: Parsed files =', files);

    try {
      const file = files.photo;
      console.log('DEBUG: Uploading file =', file.originalFilename);
      const result = await uploadToGoogleDrive(
        file,
        file.originalFilename || `photo_${Date.now()}.jpg`
      );
      console.log('DEBUG: Upload result =', result);
      res.status(200).json({ data: result });
    } catch (error) {
      console.error('Error uploading to Drive:', error);
      res.status(500).json({ error: 'Chyba při uploadu na Google Drive' });
    }
  });
}

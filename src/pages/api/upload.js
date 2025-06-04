import formidable from 'formidable';
import { google } from 'googleapis';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadToGoogleDrive = async (fileData, fileName) => {
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
      return res.status(500).json({ error: 'Error parsing the files' });
    }

    try {
      const file = files.photo;
      const result = await uploadToGoogleDrive(file, file.originalFilename);
      res.status(200).json({ data: result });
    } catch (error) {
      console.error('Error uploading to Drive:', error);
      res.status(500).json({ error: 'Error uploading to Google Drive' });
    }
  });
}

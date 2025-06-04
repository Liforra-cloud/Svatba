import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);

  const handleCapture = async (event) => {
    const file = event.target.files[0];
    setFile(file);

    const formData = new FormData();
    formData.append('photo', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      alert('Fotka úspěšně nahrána!');
    } else {
      alert('Nepodařilo se nahrát fotku.');
    }
  };

  return (
    <div className="p-5 text-center">
      <h1 className="text-2xl font-bold mb-5">Nahrajte fotku ze svatby!</h1>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCapture}
        className="border p-2 rounded"
      />
    </div>
  );
}

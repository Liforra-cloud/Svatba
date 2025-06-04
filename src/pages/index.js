// pages/index.js

import { useState } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleFileChange = async (e) => {
    setMessage('')
    setError('')
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('photo', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const json = await res.json()
      if (res.ok) {
        setMessage('Fotka byla úspěšně nahrána!')
      } else {
        setError('Nahrání se nezdařilo. Zkuste to prosím znovu.')
      }
    } catch (err) {
      console.error(err)
      setError('Nastala chyba, zkontrolujte konzoli nebo zkuste znovu.')
    } finally {
      setUploading(false)
      e.target.value = '' // reset input
    }
  }

  return (
    <>
      <Head>
        <title>Upload fotky</title>
        <meta name="description" content="Jednoduchá stránka pro nahrání fotografií na Google Drive" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Upload na Google Drive</h1>
          <p className={styles.description}>
            Klikněte na tlačítko níže a vyfoťte nebo vyberte existující fotku.
          </p>

          <label className={styles.uploadLabel}>
            Nahrát fotku
            <input
              type="file"
              name="photo"
              accept="image/*"
              className={styles.fileInput}
              onChange={handleFileChange}
              disabled={uploading}
            />
            {uploading && <span className={styles.spinner} />}
          </label>

          {message && <p className={styles.message}>{message}</p>}
          {error && <p className={styles.error}>{error}</p>}
        </div>
      </div>
    </>
  )
}

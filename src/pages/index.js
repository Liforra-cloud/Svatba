// src/pages/index.js

import { useState, useRef } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Reference na skryté <input> elementy
  const cameraInputRef = useRef(null)
  const folderInputRef = useRef(null)

  // Jednoduchá funkce pro nahrání jednoho souboru
  const uploadSingleFile = async (file) => {
    const formData = new FormData()
    formData.append('photo', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error('Server vrátil chybu')
      return true
    } catch {
      return false
    }
  }

  // Handler pro pořízení jedné fotky (kamera)
  const handleCameraChange = async (e) => {
    setMessage('')
    setError('')
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    const success = await uploadSingleFile(file)
    if (success) {
      setMessage('Fotka byla úspěšně nahrána!')
    } else {
      setError('Nahrání se nezdařilo. Zkuste to prosím znovu.')
    }
    setUploading(false)
    e.target.value = '' // reset input
  }

  // Handler pro výběr více souborů (složka)
  const handleFolderChange = async (e) => {
    setMessage('')
    setError('')
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploading(true)
    let allSuccess = true

    for (const file of files) {
      const success = await uploadSingleFile(file)
      if (!success) {
        allSuccess = false
      }
    }

    if (allSuccess) {
      setMessage('Všechny soubory byly úspěšně nahrány!')
    } else {
      setError('Některé soubory se nepodařilo nahrát. Zkontrolujte prosím konzoli.')
    }
    setUploading(false)
    e.target.value = '' // reset input
  }

  return (
    <>
      <Head>
        <title>Svatební album – Upload</title>
        <meta name="description" content="Přidejte svatební fotku do sdíleného alba" />
      </Head>

      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Svatební album</h1>
          <p className={styles.description}>
            <strong>Přidejte svatební fotku do sdíleného alba.</strong>
          </p>

          {/* Ikonka složky (více souborů) */}
          <label
            className={styles.iconButton}
            onClick={() => folderInputRef.current.click()}
            title="Vyberte více souborů"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M9.828 4a.5.5 0 0 1 .354.146l.646.647H14a1 1 0 0 1 1 1v1h-1V6H1v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-3.172l-1-1H9.828z" />
              <path d="M1 5v-.5A1.5 1.5 0 0 1 2.5 3h3A1.5 1.5 0 0 1 7 4.5V5H1z" />
            </svg>
          </label>
          <input
            type="file"
            multiple
            className={styles.fileInput}
            ref={folderInputRef}
            onChange={handleFolderChange}
            accept="image/*"
            disabled={uploading}
          />

          {/* Ikonka fotoaparátu (jedna fotka) */}
          <label
            className={styles.iconButton}
            onClick={() => cameraInputRef.current.click()}
            title="Pořídit novou fotku"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M10.5 2h-5l-.5-.5h-3L1 2H0v2h1v8a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V4h1V2h-1l-1-1h-3l-.5.5zM8 12a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7zm0-1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
            </svg>
          </label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className={styles.fileInput}
            ref={cameraInputRef}
            onChange={handleCameraChange}
            disabled={uploading}
          />

          {uploading && (
            <div style={{ marginTop: '1rem' }}>
              <span className={styles.spinner} /> Probíhá nahrávání...
            </div>
          )}
          {message && <p className={styles.message}>{message}</p>}
          {error && <p className={styles.error}>{error}</p>}
        </div>
      </div>
    </>
  )
}

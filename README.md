# Photo Upload App

Toto je jednoduchá Next.js aplikace, která umožní hostům pořizovat a nahrávat fotky na Google Drive.

## Struktura projektu

```
- photo-upload-app/
  - src/
    - components/      # Další komponenty, které můžete přidat později
    - pages/
      - index.js       # Hlavní stránka s tlačítkem pro nahrávání
      - api/
        - upload.js    # Serverless API pro nahrávání fotek na Google Drive
  - public/            # Statické soubory
  - package.json       # Závislosti a skripty
  - vercel.json        # Konfigurace pro Vercel
  - README.md          # Tento dokument
```

## Nastavení Google Drive API

1. Vytvořte si Google Cloud projekt a povolte Drive API.
2. Vytvořte si Service Account, vygenerujte klíč ve formátu JSON.
3. Do sdílené složky na Google Drive sdílejte přístup pro e-mail servisního účtu.
4. Získané hodnoty z JSON souboru exportujte do následujících environmentálních proměnných:
   - `GOOGLE_CLIENT_EMAIL`
   - `GOOGLE_PRIVATE_KEY` (zachovejte \n pro nové řádky)
   - `GOOGLE_DRIVE_FOLDER_ID` (ID složky, kam budou nahrány fotky)

Příklad:
```
GOOGLE_CLIENT_EMAIL="your-service-account@your-project.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhki...\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_FOLDER_ID="1A2B3C4D5E6F7G8H9IJ0"
```

## Lokální spuštění

1. Nainstalujte závislosti:
```
npm install
```

2. Spusťte vývojový server:
```
npm run dev
```

3. Aplikace poběží na `http://localhost:3000`

## Deploy na Vercel

1. Přihlašte se do Vercel a vytvořte nový projekt z GitHub repozitáře.
2. Do nastavení projektu přidejte environmentální proměnné podle dokumentu výše.
3. Deploy automaticky nasadí aplikaci.

## Další funkce

Tento základní projekt nabízí jednoduché nahrávání fotek. V budoucnu můžete přidat:
- Ukázkovou galerii nahraných fotek
- Automatické vytváření alb
- Uživatelské autentizace
- Další možnosti úprav fotografií

# LocalFileConvert

LocalFileConvert is a browser-based file conversion application that allows users to transform files between various formats directly in their browser without uploading data to any server.

## Core Features

- **Local File Conversion**: All conversions happen directly in the browser, ensuring privacy and security.
- **Multiple Format Support**: Converts between image formats (JPG/PNG), PDF, and text.
- **OCR Capability**: Can extract text from images using Tesseract.js.
- **Drag & Drop Interface**: Simple user interface for file uploading and conversion.

## Supported Conversions

- JPG → PDF, PNG, TXT
- PNG → PDF, JPG, TXT
- JPEG → PDF, PNG, TXT

## Application Flow

1. User uploads a file via drag & drop or file selector on the home page.
2. The app shows available conversion formats based on the uploaded file type.
3. User selects a target format and initiates conversion.
4. A progress bar displays the conversion status.
5. Upon completion, the converted file is available for download or text copy.

## Technical Implementation

The app is built with:

- Next.js and React 19
- TypeScript for type safety
- Tailwind CSS for styling
- Various libraries including:
  - pdf-lib for PDF operations
  - tesseract.js for OCR text extraction
  - canvas-confetti for success animations

## Key Components

- `FileConverter`: Main component orchestrating the conversion process.
- `useFileConverter`: Custom hook containing conversion logic.
- Tabs for `Upload` and `Convert` steps.
- Dark/light theme support with `ThemeToggle`.

The app has a strong focus on privacy, performing all conversions locally without server interaction, making it suitable for sensitive documents.

[localfileconvert.com](https://localfileconvert.com/)

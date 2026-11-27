# ADR 0003: Text extraction from photos and PDFs

**Status:** Proposed - needs verification before M2

## Context

The spec recommends Google ML Kit for on-device OCR of Hebrew and English. To our knowledge, ML Kit's text recognition does not support Hebrew script (it covers Latin, Chinese, Devanagari, Japanese and Korean). The material is often handwritten notes photographed with a phone, which classic OCR handles poorly. AI generation already requires a network connection and already sends the study material to the LLM.

## Options

1. **LLM vision on the server (preferred).** Upload page images; the server asks a vision-capable LLM to transcribe them, then runs generation on the text. Best handwriting and mixed Hebrew/English quality; no extra privacy exposure since the material goes to the LLM anyway.
2. **Cloud OCR service** (for example Google Cloud Vision, which supports Hebrew) on the server, then LLM generation. Adds a second vendor that sees the material.
3. **Tesseract with Hebrew data.** Free and on-device or on-server, but weak on handwriting and photos.

PDFs with a text layer are extracted directly without OCR in all options.

## Decision (pending)

Go with option 1 after confirming in M2 with a few real pages from the student's notebooks: Hebrew handwriting, English print, and mixed pages. Keep extraction behind the same server AI interface so it can be swapped.

## Consequences

- Import needs a network connection. Capture still works offline: photos are queued and processed when the network returns.
- The extracted text is stored on the Material record for traceability, alongside the source images.

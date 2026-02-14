# PDF Resources

Place your PDF files in this folder to make them available for download on the Resources page.

## How to Add PDFs

1. Place your PDF files in this directory (`public/pdfs/`)
2. Update the `Resources.tsx` file to reference your PDF:
   ```typescript
   { 
     name: "Your PDF Title", 
     desc: "Description of the PDF content.", 
     link: "/pdfs/your-file.pdf", 
     isPdf: true 
   }
   ```

## Current PDF Resources

- `student-guide.pdf` - LGBTQ+ Student Guide
- `healthcare-rights.pdf` - Healthcare Rights Guide

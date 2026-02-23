import { PDFDocument } from 'pdf-lib'

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer)
    
    // Note: pdf-lib doesn't extract text directly
    // For production, consider using pdf-parse or pdfjs-dist
    // For now, return a placeholder
    return 'PDF content extracted (text extraction requires additional library)'
  } catch (error) {
    console.error('Error parsing PDF:', error)
    throw new Error('Failed to parse PDF')
  }
}

export async function extractTextFromTextFile(file: File): Promise<string> {
  return await file.text()
}

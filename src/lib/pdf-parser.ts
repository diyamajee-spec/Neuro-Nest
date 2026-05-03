import pdf from 'pdf-parse';

export async function parseResume(buffer: Buffer): Promise<string> {
  try {
    const data = await pdf(buffer);
    // Clean up the text: remove extra whitespace, normalize line endings
    const cleanText = data.text
      .replace(/\s+/g, ' ')
      .trim();
    return cleanText;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF resume');
  }
}

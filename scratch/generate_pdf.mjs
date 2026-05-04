import { jsPDF } from "jspdf";
import fs from 'fs';

function generateResumePDF() {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.text("John Doe - Software Engineer", 20, 20);

  doc.setFontSize(16);
  doc.text("Experience", 20, 40);
  doc.setFontSize(12);
  doc.text("- Senior Frontend Developer at TechCorp (3 years)", 20, 50);
  doc.text("- Fullstack Developer at StartupX (2 years)", 20, 60);

  doc.setFontSize(16);
  doc.text("Skills", 20, 80);
  doc.setFontSize(12);
  doc.text("React, Next.js, TypeScript, Node.js, PostgreSQL, Docker", 20, 90);

  doc.setFontSize(16);
  doc.text("Education", 20, 110);
  doc.setFontSize(12);
  doc.text("B.S. Computer Science, University of Technology", 20, 120);

  const pdfOutput = doc.output();
  fs.writeFileSync('Sample_Resume.pdf', pdfOutput, 'binary');
  console.log("Sample_Resume.pdf generated successfully!");
}

generateResumePDF();

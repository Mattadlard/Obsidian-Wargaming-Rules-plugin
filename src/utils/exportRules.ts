import { PDFDocument } from 'pdf-lib';

export async function exportRules(categories: Record<string, string[]>): Promise<void> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  page.drawText('Exported Wargame Rules:', { x: 50, y: 750 });

  let yPosition = 700;
  Object.keys(categories).forEach((category) => {
    page.drawText(category, { x: 50, y: yPosition });
    yPosition -= 20;

    categories[category].forEach((subCategory) => {
      page.drawText(`- ${subCategory}`, { x: 50, y: yPosition });
      yPosition -= 20;
    });
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'Wargame_Rules.pdf';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

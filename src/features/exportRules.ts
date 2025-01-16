import { PDFDocument } from "pdf-lib";

export async function exportRules(): Promise<void> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  page.drawText("Exported Rules:", { x: 50, y: 750 });

  // Sample rules
  const rules = ["Rule 1: Description", "Rule 2: Description"];
  rules.forEach((rule, index) => {
    page.drawText(rule, { x: 50, y: 700 - index * 20 });
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "Wargame_Rules.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

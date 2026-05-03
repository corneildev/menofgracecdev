import { jsPDF } from "jspdf";
import type { ProductWithImages } from "@/lib/products";
import { CATEGORY_LABELS } from "@/lib/products";

<<<<<<< HEAD
const fmtFcfa = (n: number) => `${n.toLocaleString("fr-FR").replace(/\u202f|\u00a0/g, " ")} FCFA`;
const fmtUsd = (n: number) => `$${n.toLocaleString("en-US")}`;

async function loadImage(src: string): Promise<{ data: string; w: number; h: number } | null> {
=======
const fmtFcfa = (n: number) =>
  `${n.toLocaleString("fr-FR").replace(/\u202f|\u00a0/g, " ")} FCFA`;
const fmtUsd = (n: number) => `$${n.toLocaleString("en-US")}`;

async function loadImage(
  src: string,
): Promise<{ data: string; w: number; h: number } | null> {
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  try {
    const res = await fetch(src);
    const blob = await res.blob();
    const dataUrl: string = await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
    const dims: { w: number; h: number } = await new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
      img.onerror = () => resolve({ w: 4, h: 5 });
      img.src = dataUrl;
    });
    return { data: dataUrl, w: dims.w, h: dims.h };
  } catch {
    return null;
  }
}

export async function generateWishlistPdf(items: ProductWithImages[]) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // Palette
  const ink: [number, number, number] = [15, 14, 12];
  const bone: [number, number, number] = [240, 235, 226];
  const muted: [number, number, number] = [160, 152, 138];
  const hairline: [number, number, number] = [70, 66, 60];

  const fillBg = () => {
    doc.setFillColor(...ink);
    doc.rect(0, 0, pageW, pageH, "F");
  };

  // ---------- Cover ----------
  fillBg();
  doc.setTextColor(...bone);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("— MEN OF GRACE —", pageW / 2, 90, { align: "center" });

  doc.setFont("times", "italic");
  doc.setFontSize(36);
  doc.text("Saved Pieces", pageW / 2, pageH / 2 - 20, { align: "center" });

  doc.setDrawColor(...hairline);
  doc.setLineWidth(0.4);
  doc.line(pageW / 2 - 30, pageH / 2, pageW / 2 + 30, pageH / 2);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.text("A Private Folio", pageW / 2, pageH / 2 + 24, { align: "center" });

<<<<<<< HEAD
  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
=======
  const date = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  doc.setFontSize(7);
  doc.text(date.toUpperCase(), pageW / 2, pageH - 70, { align: "center" });

  // ---------- Product pages ----------
  for (const p of items) {
    doc.addPage();
    fillBg();

    const margin = 50;
    const imgBoxW = pageW * 0.5 - margin - 10;
    const imgBoxH = pageH - margin * 2;

    // Image
    const img = await loadImage(p.primaryImage);
    if (img) {
      const ratio = img.w / img.h;
      let w = imgBoxW;
      let h = w / ratio;
      if (h > imgBoxH) {
        h = imgBoxH;
        w = h * ratio;
      }
      const x = margin + (imgBoxW - w) / 2;
      const y = margin + (imgBoxH - h) / 2;
      const fmt = img.data.startsWith("data:image/png") ? "PNG" : "JPEG";
      try {
        doc.addImage(img.data, fmt, x, y, w, h);
      } catch {
        // ignore
      }
    } else {
      doc.setFillColor(30, 28, 25);
      doc.rect(margin, margin, imgBoxW, imgBoxH, "F");
    }

    // Right column
    const colX = pageW * 0.5 + 20;
    const colW = pageW - colX - margin;
    let y = margin + 20;

    doc.setTextColor(...muted);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(CATEGORY_LABELS[p.category].toUpperCase(), colX, y);
    y += 28;

    doc.setTextColor(...bone);
    doc.setFont("times", "italic");
    let titleSize = 26;
    doc.setFontSize(titleSize);
    while (doc.getTextWidth(p.name) > colW && titleSize > 14) {
      titleSize -= 1;
      doc.setFontSize(titleSize);
    }
    const titleLines = doc.splitTextToSize(p.name, colW);
    doc.text(titleLines, colX, y);
    y += titleLines.length * (titleSize + 2) + 10;

    doc.setDrawColor(...hairline);
    doc.line(colX, y, colX + 40, y);
    y += 22;

    // Price
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(...bone);
    doc.text(fmtFcfa(p.price_fcfa), colX, y);
    y += 14;
    doc.setFontSize(9);
    doc.setTextColor(...muted);
    doc.text(fmtUsd(p.price_usd), colX, y);
    y += 26;

    // Story
    if (p.story) {
      doc.setFontSize(9);
      doc.setTextColor(220, 215, 205);
      const storyLines = doc.splitTextToSize(p.story, colW);
      doc.text(storyLines, colX, y, { lineHeightFactor: 1.5 });
      y += storyLines.length * 12 + 18;
    }

    // The Cloth
    if (p.fabric_composition || p.fabric_weight || p.fabric_mill) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...muted);
      doc.text("— THE CLOTH —", colX, y);
      y += 14;
      doc.setFontSize(9);
      doc.setTextColor(...bone);
      const clothParts = [
        [p.fabric_composition, p.fabric_weight].filter(Boolean).join(" · "),
        p.fabric_mill,
      ].filter(Boolean) as string[];
      const cloth = clothParts.join("\n");
      const clothLines = doc.splitTextToSize(cloth, colW);
      doc.text(clothLines, colX, y, { lineHeightFactor: 1.5 });
      y += clothLines.length * 12 + 18;
    }

    // Details
    if (p.details.length > 0) {
      doc.setFontSize(7);
      doc.setTextColor(...muted);
      doc.text("— CONSTRUCTION —", colX, y);
      y += 14;
      doc.setFontSize(9);
      doc.setTextColor(...bone);
      for (const d of p.details.slice(0, 4)) {
        const lines = doc.splitTextToSize(`·  ${d}`, colW);
        doc.text(lines, colX, y, { lineHeightFactor: 1.4 });
        y += lines.length * 12 + 2;
        if (y > pageH - margin) break;
      }
    }
  }

  // ---------- Summary ----------
  doc.addPage();
  fillBg();
  const margin = 60;
  doc.setTextColor(...muted);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text("— INVESTMENT SUMMARY —", pageW / 2, 90, { align: "center" });

  doc.setFont("times", "italic");
  doc.setFontSize(28);
  doc.setTextColor(...bone);
  doc.text("The Selection", pageW / 2, 130, { align: "center" });

  let y = 200;
  doc.setDrawColor(...hairline);
  doc.line(margin, y - 20, pageW - margin, y - 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.text("PIECE", margin, y - 6);
  doc.text("FCFA", pageW - margin - 160, y - 6, { align: "right" });
  doc.text("USD", pageW - margin, y - 6, { align: "right" });
  doc.line(margin, y, pageW - margin, y);
  y += 20;

  let totalF = 0;
  let totalU = 0;
  doc.setFontSize(10);
  for (const p of items) {
    if (y > pageH - 120) break;
    doc.setTextColor(...bone);
    doc.setFont("times", "italic");
    doc.text(p.name, margin, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...bone);
<<<<<<< HEAD
    doc.text(fmtFcfa(p.price_fcfa), pageW - margin - 160, y, { align: "right" });
=======
    doc.text(fmtFcfa(p.price_fcfa), pageW - margin - 160, y, {
      align: "right",
    });
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
    doc.setTextColor(...muted);
    doc.text(fmtUsd(p.price_usd), pageW - margin, y, { align: "right" });
    totalF += p.price_fcfa;
    totalU += p.price_usd;
    y += 22;
  }

  y += 6;
  doc.line(margin, y, pageW - margin, y);
  y += 22;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.text("TOTAL", margin, y);
  doc.setFontSize(11);
  doc.setTextColor(...bone);
  doc.text(fmtFcfa(totalF), pageW - margin - 160, y, { align: "right" });
  doc.setTextColor(...muted);
  doc.text(fmtUsd(totalU), pageW - margin, y, { align: "right" });

  doc.setFontSize(7);
  doc.setTextColor(...muted);
<<<<<<< HEAD
  doc.text(
    "menofgrace.com",
    pageW / 2,
    pageH - 60,
    { align: "center" },
  );
=======
  doc.text("menofgrace.com", pageW / 2, pageH - 60, { align: "center" });
>>>>>>> 9091cf2 (Initial commit of graceful-threads)

  doc.save("men-of-grace-wishlist.pdf");
}

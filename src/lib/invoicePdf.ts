import { jsPDF } from "jspdf";

const fmtFcfa = (n: number) =>
  `${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} FCFA`;
const fmtUsd = (n: number) =>
  `$${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

export type InvoiceItem = {
  product_name: string;
  quantity: number;
  unit_price_fcfa: number;
  unit_price_usd: number;
  size?: string | null;
  fit?: string | null;
  lapel?: string | null;
  lining?: string | null;
  monogram?: string | null;
};

export type InvoiceData = {
  order_number: string;
  created_at: string; // ISO
  customer_full_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_country: string;
  notes?: string | null;
  subtotal_fcfa: number;
  delivery_fcfa: number;
  total_fcfa: number;
  subtotal_usd: number;
  total_usd: number;
  payment_method?: string | null;
  status: string;
  items: InvoiceItem[];
};

export function generateInvoicePdf(data: InvoiceData): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // Editorial palette (aligned with wishlistPdf.ts)
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
  const margin = 60;

  doc.setTextColor(...bone);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("— MEN OF GRACE —", pageW / 2, 90, { align: "center" });

  doc.setFont("times", "italic");
  doc.setFontSize(36);
  doc.text("Invoice", pageW / 2, 160, { align: "center" });

  doc.setDrawColor(...hairline);
  doc.setLineWidth(0.4);
  doc.line(pageW / 2 - 30, 178, pageW / 2 + 30, 178);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.text(`Order ${data.order_number}`, pageW / 2, 200, { align: "center" });

  const dateStr = new Date(data.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  doc.setFontSize(7);
  doc.text(dateStr.toUpperCase(), pageW / 2, 218, { align: "center" });

  // ---------- Two columns: Billed to / Ship to ----------
  let y = 270;
  const colW = (pageW - margin * 2 - 40) / 2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...muted);
  doc.text("— BILLED TO —", margin, y);
  doc.text("— DELIVERED TO —", margin + colW + 40, y);
  y += 16;

  doc.setFont("times", "italic");
  doc.setFontSize(13);
  doc.setTextColor(...bone);
  doc.text(data.customer_full_name, margin, y);
  doc.text(data.customer_full_name, margin + colW + 40, y);
  y += 16;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(220, 215, 205);
  doc.text(data.customer_email, margin, y);
  const addrLines = doc.splitTextToSize(data.shipping_address, colW);
  doc.text(addrLines, margin + colW + 40, y);
  y += 14;
  doc.text(data.customer_phone, margin, y);
  doc.text(`${data.shipping_city}, ${data.shipping_country}`, margin + colW + 40, y + addrLines.length * 12 - 14);

  // ---------- Items table ----------
  y += 60;
  doc.setDrawColor(...hairline);
  doc.line(margin, y - 10, pageW - margin, y - 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.text("PIECE", margin, y);
  doc.text("QTY", pageW - margin - 220, y, { align: "right" });
  doc.text("UNIT", pageW - margin - 110, y, { align: "right" });
  doc.text("TOTAL", pageW - margin, y, { align: "right" });
  y += 6;
  doc.line(margin, y, pageW - margin, y);
  y += 18;

  for (const it of data.items) {
    if (y > pageH - 220) {
      doc.addPage();
      fillBg();
      y = margin;
    }
    const lineFcfa = it.unit_price_fcfa * it.quantity;
    doc.setFont("times", "italic");
    doc.setFontSize(12);
    doc.setTextColor(...bone);
    doc.text(it.product_name, margin, y);

    const meta = [it.fit, it.lapel, it.lining, it.size ? `Size ${it.size}` : null, it.monogram ? `Monogram ${it.monogram}` : null]
      .filter(Boolean)
      .join(" · ");
    if (meta) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...muted);
      doc.text(meta, margin, y + 13);
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...bone);
    doc.text(String(it.quantity), pageW - margin - 220, y, { align: "right" });
    doc.text(fmtFcfa(it.unit_price_fcfa), pageW - margin - 110, y, { align: "right" });
    doc.text(fmtFcfa(lineFcfa), pageW - margin, y, { align: "right" });

    y += meta ? 32 : 22;
  }

  // ---------- Totals ----------
  if (y > pageH - 200) {
    doc.addPage();
    fillBg();
    y = margin;
  }

  y += 10;
  doc.setDrawColor(...hairline);
  doc.line(margin, y, pageW - margin, y);
  y += 22;

  const totalsX = pageW - margin - 220;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.text("Subtotal", totalsX, y);
  doc.setTextColor(...bone);
  doc.text(fmtFcfa(data.subtotal_fcfa), pageW - margin, y, { align: "right" });
  y += 18;

  doc.setTextColor(...muted);
  doc.text("Delivery", totalsX, y);
  doc.setTextColor(...bone);
  doc.text(data.delivery_fcfa > 0 ? fmtFcfa(data.delivery_fcfa) : "Offered", pageW - margin, y, {
    align: "right",
  });
  y += 22;

  doc.line(totalsX, y - 10, pageW - margin, y - 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.text("TOTAL", totalsX, y);
  doc.setFont("times", "italic");
  doc.setFontSize(16);
  doc.setTextColor(...bone);
  doc.text(fmtFcfa(data.total_fcfa), pageW - margin, y + 4, { align: "right" });
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.text(fmtUsd(data.total_usd), pageW - margin, y + 4, { align: "right" });

  // ---------- Notes / Status ----------
  y += 50;
  if (y < pageH - 120) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...muted);
    doc.text("— STATUS —", margin, y);
    y += 14;
    doc.setFont("times", "italic");
    doc.setFontSize(11);
    doc.setTextColor(...bone);
    doc.text(humanStatus(data.status), margin, y);

    if (data.notes) {
      y += 26;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...muted);
      doc.text("— NOTES —", margin, y);
      y += 14;
      doc.setFontSize(9);
      doc.setTextColor(220, 215, 205);
      const notesLines = doc.splitTextToSize(data.notes, pageW - margin * 2);
      doc.text(notesLines, margin, y, { lineHeightFactor: 1.5 });
    }
  }

  // ---------- Footer ----------
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...muted);
  doc.text(
    "MEN OF GRACE · Cocody, Abidjan · menofgrace.com",
    pageW / 2,
    pageH - 60,
    { align: "center" },
  );
  doc.text(
    "Confection 6–8 weeks · Private fitting included · Worldwide shipping",
    pageW / 2,
    pageH - 46,
    { align: "center" },
  );

  return doc;
}

function humanStatus(s: string) {
  switch (s) {
    case "pending_payment":
      return "Awaiting payment confirmation";
    case "paid":
      return "Payment confirmed";
    case "in_production":
      return "In production at the atelier";
    case "ready_for_delivery":
      return "Ready for delivery";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    default:
      return s;
  }
}

export function downloadInvoicePdf(data: InvoiceData) {
  const doc = generateInvoicePdf(data);
  doc.save(`invoice-${data.order_number}.pdf`);
}

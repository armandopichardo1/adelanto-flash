import jsPDF from "jspdf";
import type { ContractData, ContractRecord } from "./contract-template";

export function generateContractPDF(data: ContractData, contract: ContractRecord): void {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const W = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentW = W - margin * 2;
  let y = 20;

  const addText = (text: string, opts?: { bold?: boolean; size?: number; align?: "center" | "left" | "right"; maxWidth?: number }) => {
    const size = opts?.size ?? 10;
    const bold = opts?.bold ?? false;
    doc.setFontSize(size);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    const maxW = opts?.maxWidth ?? contentW;
    const lines = doc.splitTextToSize(text, maxW);
    const lineH = size * 0.45;
    
    // Check page break
    if (y + lines.length * lineH > 260) {
      doc.addPage();
      y = 20;
    }
    
    if (opts?.align === "center") {
      lines.forEach((line: string) => {
        doc.text(line, W / 2, y, { align: "center" });
        y += lineH;
      });
    } else {
      doc.text(lines, margin, y);
      y += lines.length * lineH;
    }
  };

  const addSpacer = (h = 4) => { y += h; };

  const formattedSalary = new Intl.NumberFormat("es-DO", {
    style: "currency", currency: "DOP", minimumFractionDigits: 2,
  }).format(data.employeeSalary);

  // Header
  addText("ACUERDO DE ADELANTO DE SALARIO", { bold: true, size: 14, align: "center" });
  addSpacer(2);
  addText("Conforme al Código de Trabajo de la República Dominicana (Ley 16-92)", { size: 8, align: "center" });
  addText("y la Resolución No. 07/2007 del Ministerio de Trabajo", { size: 8, align: "center" });
  addSpacer(6);

  // Intro
  addText(`En la ciudad de Santo Domingo, Distrito Nacional, a los ${data.date}, las partes abajo indicadas convienen en celebrar el presente acuerdo:`);
  addSpacer(4);

  // Parties
  addText("ENTRE:", { bold: true, size: 11 });
  addSpacer(2);
  addText("PRIMERA PARTE (EL EMPLEADOR):", { bold: true });
  addText(`${data.employerName}, empresa debidamente constituida y organizada de conformidad con las leyes de la República Dominicana, con RNC No. ${data.employerRNC}, representada por su Director de Recursos Humanos, en lo adelante denominada "El Empleador".`);
  addSpacer(3);
  addText("SEGUNDA PARTE (EL EMPLEADO):", { bold: true });
  addText(`${data.employeeName}, dominicano(a), mayor de edad, portador(a) de la Cédula de Identidad y Electoral No. ${data.employeeCedula}, empleado(a) del departamento de ${data.employeeDepartment}, en lo adelante denominado(a) "El Empleado".`);
  addSpacer(4);

  // Object
  addText("OBJETO DEL ACUERDO:", { bold: true, size: 11 });
  addSpacer(2);
  addText(`El presente acuerdo tiene por objeto regular las condiciones bajo las cuales El Empleado podrá solicitar y recibir adelantos parciales de su salario a través de la plataforma digital "Adelanto Ya", operada como intermediario tecnológico autorizado por El Empleador.`);
  addSpacer(4);

  // Clauses
  addText("CLÁUSULAS:", { bold: true, size: 11 });
  addSpacer(2);

  const clauses = [
    { title: "PRIMERA: AUTORIZACIÓN DE DESCUENTO.", body: `El Empleado autoriza libre y voluntariamente a El Empleador a descontar de su salario las sumas correspondientes a los adelantos recibidos, más las comisiones de servicio aplicables, conforme a lo dispuesto en el Artículo 201 del Código de Trabajo, el cual establece que los descuentos al salario del trabajador deben ser autorizados por este.` },
    { title: "SEGUNDA: LÍMITE DE ADELANTOS.", body: `El monto máximo de cada adelanto no excederá el ${data.maxAdvancePercent}% del salario mensual del Empleado, actualmente de ${formattedSalary}. Los descuentos totales por concepto de adelantos no superarán el 30% del salario neto quincenal, en cumplimiento con el Principio V del Código de Trabajo sobre la intangibilidad del salario mínimo.` },
    { title: "TERCERA: COMISIÓN DE SERVICIO.", body: `El Empleado reconoce que el servicio de adelanto de nómina genera una comisión de servicio transparente, la cual será informada de forma clara y detallada antes de confirmar cada solicitud. Dicha comisión no constituye interés en los términos de la Ley Monetaria y Financiera (Ley 183-02), por tratarse de un servicio de gestión y administración de nómina.` },
    { title: "CUARTA: FRECUENCIA Y MODALIDAD.", body: `Los descuentos se aplicarán de forma quincenal a través de la nómina regular del Empleador. En caso de terminación del contrato de trabajo, cualquier saldo pendiente será descontado de las prestaciones laborales correspondientes, conforme al Artículo 86 del Código de Trabajo.` },
    { title: "QUINTA: PROTECCIÓN DE DATOS.", body: `Ambas partes se comprometen a proteger la información personal y financiera compartida en virtud de este acuerdo, conforme a la Ley 172-13 sobre Protección Integral de los Datos Personales.` },
    { title: "SEXTA: VOLUNTARIEDAD.", body: `El presente acuerdo es de naturaleza estrictamente voluntaria. El Empleado podrá revocar esta autorización en cualquier momento mediante notificación escrita al Departamento de Recursos Humanos, sin que ello afecte su relación laboral.` },
    { title: "SÉPTIMA: VIGENCIA.", body: `Este acuerdo tendrá vigencia mientras dure la relación laboral entre las partes o hasta que sea revocado por cualquiera de ellas con quince (15) días de antelación.` },
    { title: "OCTAVA: JURISDICCIÓN.", body: `Para cualquier controversia derivada del presente acuerdo, las partes se someten a la jurisdicción de los Juzgados de Trabajo del Distrito Nacional, República Dominicana.` },
  ];

  clauses.forEach(clause => {
    addText(clause.title, { bold: true });
    addText(clause.body);
    addSpacer(3);
  });

  // Signature section
  addSpacer(8);

  // Check page break for signatures
  if (y + 50 > 260) {
    doc.addPage();
    y = 20;
  }

  const sigY = y;
  const leftX = margin;
  const rightX = W / 2 + 10;
  const sigWidth = 60;
  const sigHeight = 25;

  // Employer signature
  if (contract.employerSignatureDataUrl) {
    try {
      doc.addImage(contract.employerSignatureDataUrl, "PNG", leftX, sigY, sigWidth, sigHeight);
    } catch { /* signature image not available */ }
  }
  doc.setDrawColor(51, 51, 51);
  doc.line(leftX, sigY + sigHeight + 2, leftX + sigWidth, sigY + sigHeight + 2);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Firma del Empleador", leftX + sigWidth / 2, sigY + sigHeight + 6, { align: "center" });
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(data.employerName, leftX + sigWidth / 2, sigY + sigHeight + 11, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`RNC: ${data.employerRNC}`, leftX + sigWidth / 2, sigY + sigHeight + 15, { align: "center" });
  if (contract.employerSignedAt) {
    doc.setFontSize(7);
    doc.setTextColor(100);
    doc.text(`Firmado: ${new Date(contract.employerSignedAt).toLocaleDateString("es-DO")}`, leftX + sigWidth / 2, sigY + sigHeight + 19, { align: "center" });
    doc.setTextColor(0);
  }

  // Employee signature
  if (contract.employeeSignatureDataUrl) {
    try {
      doc.addImage(contract.employeeSignatureDataUrl, "PNG", rightX, sigY, sigWidth, sigHeight);
    } catch { /* signature image not available */ }
  }
  doc.line(rightX, sigY + sigHeight + 2, rightX + sigWidth, sigY + sigHeight + 2);
  doc.setFontSize(8);
  doc.text("Firma del Empleado", rightX + sigWidth / 2, sigY + sigHeight + 6, { align: "center" });
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(data.employeeName, rightX + sigWidth / 2, sigY + sigHeight + 11, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Cédula: ${data.employeeCedula}`, rightX + sigWidth / 2, sigY + sigHeight + 15, { align: "center" });
  if (contract.employeeSignedAt) {
    doc.setFontSize(7);
    doc.setTextColor(100);
    doc.text(`Firmado: ${new Date(contract.employeeSignedAt).toLocaleDateString("es-DO")}`, rightX + sigWidth / 2, sigY + sigHeight + 19, { align: "center" });
    doc.setTextColor(0);
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(150);
    doc.text(
      `Adelanto Ya — Contrato de Adelanto de Salario — Página ${i} de ${pageCount}`,
      W / 2, 272, { align: "center" }
    );
    doc.setTextColor(0);
  }

  // Download
  const fileName = `Contrato_${data.employeeName.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
}


import { CalculatorResult } from './calculationUtils';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'sonner';

// Define PDF generation options
interface PDFOptions {
  fileName: string;
  includeCharts?: boolean;
}

// Function to generate PDF report based on calculator results
export const generatePDF = async (
  results: CalculatorResult,
  userInputs: {
    email: string;
    kmPerYear: number;
    electricityCost: number;
    wallboxCost: number;
  },
  options: PDFOptions = { fileName: 'wallbox-roi-analyse.pdf', includeCharts: true }
): Promise<Blob> => {
  // Create new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Add header and title
  doc.setFontSize(22);
  doc.setTextColor(139, 92, 246); // GoElektrik purple
  doc.text('Wallbox ROI Analyse', 105, 20, { align: 'center' });

  // Add subtitle
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text('Persönliche Wirtschaftlichkeitsberechnung', 105, 30, { align: 'center' });

  // Add date
  const currentDate = new Date().toLocaleDateString('de-DE');
  doc.setFontSize(10);
  doc.text(`Erstellt am: ${currentDate}`, 20, 40);

  // Add user inputs section
  doc.setFontSize(14);
  doc.setTextColor(139, 92, 246); // GoElektrik purple
  doc.text('Ihre Eingaben:', 20, 50);

  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text(`E-Mail: ${userInputs.email}`, 25, 60);
  doc.text(`Jährliche Fahrleistung: ${userInputs.kmPerYear.toLocaleString('de-DE')} km`, 25, 67);
  doc.text(`Stromkosten zu Hause: ${userInputs.electricityCost.toLocaleString('de-DE')} €/kWh`, 25, 74);
  doc.text(`Wallbox-Installationskosten: ${userInputs.wallboxCost.toLocaleString('de-DE')} €`, 25, 81);

  // Add key results
  doc.setFontSize(14);
  doc.setTextColor(139, 92, 246); // GoElektrik purple
  doc.text('Wichtigste Ergebnisse:', 20, 95);

  // Format results for display
  const formattedSavingsPerYear = results.savingsPerYear.toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR',
  });
  const formattedTotalSavings = results.totalSavings.toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR',
  });
  const formattedBreakEven = results.breakEvenYear.toLocaleString('de-DE', {
    maximumFractionDigits: 1,
  });

  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text(`Jährliche Ersparnis: ${formattedSavingsPerYear}`, 25, 105);
  doc.text(`Gesamtersparnis über 10 Jahre: ${formattedTotalSavings}`, 25, 113);
  doc.text(`Amortisationszeit: ${formattedBreakEven} Jahre`, 25, 121);

  // Add savings table
  doc.setFontSize(14);
  doc.setTextColor(139, 92, 246); // GoElektrik purple
  doc.text('Detaillierte Kosteneinsparungen:', 20, 135);

  // Create table data
  const tableData = [];
  for (let i = 0; i < results.yearsData.length; i++) {
    tableData.push([
      results.yearsData[i].toString(),
      results.homeCosts[i].toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }),
      results.publicCosts[i].toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }),
      results.cumulativeSavings[i].toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }),
    ]);
  }

  // Use autoTable for creating the table
  // @ts-ignore
  doc.autoTable({
    startY: 140,
    head: [['Jahr', 'Kosten Heimladen', 'Kosten öffentliches Laden', 'Kumulative Ersparnis']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [139, 92, 246], // GoElektrik purple
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    alternateRowStyles: {
      fillColor: [240, 240, 250],
    },
  });

  // We need to get the Y position after the table
  // Since lastAutoTable is not properly typed, we need to access it differently
  // @ts-ignore
  const finalY = (doc as any).lastAutoTable?.finalY || 200;
  
  // Add conclusion
  const pageHeight = doc.internal.pageSize.height;
  let yPosition = finalY + 15;
  
  // Add a new page if there's not enough space
  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(14);
  doc.setTextColor(139, 92, 246); // GoElektrik purple
  doc.text('Fazit:', 20, yPosition);

  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  const conclusion = [
    'Mit Ihrer eigenen Wallbox sparen Sie nicht nur Geld, sondern',
    'genießen auch den Komfort des Heimladens und schützen Ihr Fahrzeug',
    'vor den Risiken öffentlicher Ladestationen. Die Investition zahlt sich',
    `bereits nach ${formattedBreakEven} Jahren aus und bringt Ihnen langfristig`,
    'erhebliche Einsparungen.'
  ];
  
  for (let i = 0; i < conclusion.length; i++) {
    doc.text(conclusion[i], 25, yPosition + 10 + (i * 6));
  }

  // Add footer
  const footerYPosition = pageHeight - 10;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('GoElektrik Wallbox ROI Kalkulator | © ' + new Date().getFullYear(), 105, footerYPosition, { align: 'center' });

  // Save the PDF
  return doc.output('blob');
};

// Function to send PDF via email
export const sendPDFViaEmail = async (
  email: string,
  pdfBlob: Blob
): Promise<boolean> => {
  // In a real implementation, this would send the PDF via an email API
  // For this demo, we'll simulate success
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("PDF wurde per E-Mail verschickt", {
      description: "Überprüfen Sie Ihren Posteingang."
    });
    
    // Return success
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    
    toast.error("Fehler beim Versenden der E-Mail", {
      description: "Bitte versuchen Sie es später erneut."
    });
    
    return false;
  }
};

// Function to download PDF directly
export const downloadPDF = (pdfBlob: Blob, fileName: string): void => {
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
};

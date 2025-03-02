
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CalculatorResult } from '@/utils/calculationUtils';
import { generatePDF, downloadPDF } from '@/utils/pdfUtils';
import { Download, FileDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PDFGeneratorProps {
  results: CalculatorResult;
  userInputs: {
    email: string;
    kmPerYear: number;
    electricityCost: number;
    wallboxCost: number;
  };
  className?: string;
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({ results, userInputs, className }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  useEffect(() => {
    // Reset PDF blob when inputs change
    setPdfBlob(null);
  }, [results, userInputs]);

  const handleGeneratePDF = async () => {
    if (pdfBlob) {
      // If we already have the PDF, just download it
      downloadPDF(pdfBlob, 'wallbox-roi-analyse.pdf');
      return;
    }

    setIsGenerating(true);
    
    try {
      const blob = await generatePDF(results, userInputs);
      setPdfBlob(blob);
      downloadPDF(blob, 'wallbox-roi-analyse.pdf');
      
      toast.success("PDF-Download erfolgreich", {
        description: "Ihre ROI-Analyse wurde heruntergeladen."
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Fehler beim Generieren des PDFs", {
        description: "Bitte versuchen Sie es erneut."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant="outline"
      className={`flex items-center justify-center border-wallbox text-wallbox hover:bg-wallbox hover:text-white ${className}`}
      onClick={handleGeneratePDF}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          PDF wird generiert...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          PDF herunterladen
        </>
      )}
    </Button>
  );
};

export default PDFGenerator;

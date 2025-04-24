
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { RepairRequest } from "@/types";

interface DownloadReportButtonProps {
  request: RepairRequest;
}

export function DownloadReportButton({ request }: DownloadReportButtonProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    
    try {
      // In a real implementation, this would call an API endpoint to generate the PDF
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      // Mock download by creating a text blob (in a real app, this would be a PDF)
      const reportContent = `
        Road Repair Report
        -----------------
        Request ID: ${request.id}
        Title: ${request.title}
        Location: ${request.location}
        Submitted: ${new Date(request.submittedAt).toLocaleDateString()}
        Status: ${request.status}
        Description: ${request.description}
        ${request.estimatedCompletionDate ? `Completed: ${new Date(request.estimatedCompletionDate).toLocaleDateString()}` : ''}
      `;
      
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `repair-report-${request.id}.txt`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Report downloaded",
        description: "Your repair report has been downloaded successfully.",
      });
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Download failed",
        description: "There was a problem generating your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      onClick={handleDownload} 
      disabled={isGenerating || request.status !== 'completed'}
      variant={request.status !== 'completed' ? "outline" : "default"}
    >
      <Download className="mr-2 h-4 w-4" />
      {isGenerating ? "Generating..." : "Download Report"}
    </Button>
  );
}


import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mayorLinks } from "@/routes/sidebarLinks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { FileText, Download, FileChart, Mail } from "lucide-react";

export default function GenerateReportsPage() {
  const [reportType, setReportType] = useState<string>("summary");
  const [timeRange, setTimeRange] = useState<string>("monthly");
  const [includeImages, setIncludeImages] = useState<boolean>(true);
  const [includeCharts, setIncludeCharts] = useState<boolean>(true);
  const [recipients, setRecipients] = useState<string>("");
  const [comments, setComments] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    
    // Simulate report generation delay
    setTimeout(() => {
      setIsGenerating(false);
      toast.success("Report generated successfully. Ready for download.");
    }, 2000);
  };

  const handleSendReport = () => {
    toast.success(`Report sent to ${recipients.split(',').length} recipients`);
  };

  const reportTypes = [
    { value: "summary", label: "Summary Report", description: "A high-level overview of repair activities" },
    { value: "detailed", label: "Detailed Report", description: "In-depth analysis of all repair operations" },
    { value: "financial", label: "Financial Report", description: "Cost analysis of repair activities" },
    { value: "performance", label: "Performance Report", description: "Staff and resource performance metrics" },
    { value: "district", label: "District Report", description: "Analysis by geographical district" },
  ];

  const timeRanges = [
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "annual", label: "Annual" },
    { value: "custom", label: "Custom Date Range" },
  ];

  return (
    <DashboardLayout sidebarLinks={mayorLinks} title="Mayor Dashboard">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Generate Reports</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.info("Templates saved")}>
            Save Template
          </Button>
          <Button onClick={handleGenerateReport} disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate Report"}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Report Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Report Type</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reportTypes.map((type) => (
                      <div
                        key={type.value}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          reportType === type.value ? "border-primary bg-primary/5" : ""
                        }`}
                        onClick={() => setReportType(type.value)}
                      >
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full mr-2 ${
                            reportType === type.value ? "bg-primary" : "bg-muted"
                          }`}></div>
                          <span className="font-medium">{type.label}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 pl-6">
                          {type.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Time Range</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {timeRanges.map((range) => (
                      <div
                        key={range.value}
                        className={`p-3 border rounded-lg text-center cursor-pointer transition-colors ${
                          timeRange === range.value ? "border-primary bg-primary/5" : ""
                        }`}
                        onClick={() => setTimeRange(range.value)}
                      >
                        {range.label}
                      </div>
                    ))}
                  </div>
                  
                  {timeRange === "custom" && (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label htmlFor="start-date">Start Date</Label>
                        <Input type="date" id="start-date" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="end-date">End Date</Label>
                        <Input type="date" id="end-date" className="mt-1" />
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Report Content</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-charts"
                        checked={includeCharts}
                        onCheckedChange={(checked) => setIncludeCharts(checked as boolean)}
                      />
                      <Label htmlFor="include-charts">Include charts and graphs</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-images"
                        checked={includeImages}
                        onCheckedChange={(checked) => setIncludeImages(checked as boolean)}
                      />
                      <Label htmlFor="include-images">Include repair request images</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="include-comments" />
                      <Label htmlFor="include-comments">Include staff comments</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="include-financial" />
                      <Label htmlFor="include-financial">Include financial details</Label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Report Format</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 border rounded-lg text-center cursor-pointer border-primary bg-primary/5">
                      PDF
                    </div>
                    <div className="p-3 border rounded-lg text-center cursor-pointer">
                      Excel
                    </div>
                    <div className="p-3 border rounded-lg text-center cursor-pointer">
                      CSV
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="comments">Additional Comments</Label>
                  <Textarea
                    id="comments"
                    placeholder="Any additional information to include in the report"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Report Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="recipients">Email Recipients (comma separated)</Label>
                  <Input
                    id="recipients"
                    placeholder="e.g. council@city.gov, manager@city.gov"
                    value={recipients}
                    onChange={(e) => setRecipients(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label>Delivery Options</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="schedule" />
                      <Label htmlFor="schedule">Schedule recurring delivery</Label>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={handleSendReport}
                  disabled={!recipients.trim()}
                >
                  <Mail className="mr-2 h-4 w-4" /> Send Report
                </Button>
                
                <div className="text-center pt-4">
                  <p className="text-sm text-muted-foreground">
                    Reports will be archived in your report history
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <FileChart className="h-4 w-4 mr-2 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Monthly Summary - Apr</p>
                      <p className="text-xs text-muted-foreground">Generated on Apr 15</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="p-3 border rounded-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <FileChart className="h-4 w-4 mr-2 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Q1 Financial Report</p>
                      <p className="text-xs text-muted-foreground">Generated on Apr 2</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="p-3 border rounded-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <FileChart className="h-4 w-4 mr-2 text-primary" />
                    <div>
                      <p className="text-sm font-medium">District Performance</p>
                      <p className="text-xs text-muted-foreground">Generated on Mar 28</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Button variant="link" className="w-full mt-4">
                View All Reports
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

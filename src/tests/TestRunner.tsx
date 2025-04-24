
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { adminLinks } from "@/routes/sidebarLinks";
import { FileText, Download, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { toast } from "sonner";

// Mock test data - in a real app, this would come from actual test runs
type TestResult = {
  name: string;
  component: string;
  status: 'passed' | 'failed' | 'pending';
  duration: number; // milliseconds
  error?: string;
};

const mockUnitTests: TestResult[] = [
  { name: 'renders PENDING status correctly', component: 'StatusBadge', status: 'passed', duration: 15 },
  { name: 'renders COMPLETED status correctly', component: 'StatusBadge', status: 'passed', duration: 12 },
  { name: 'renders with positive trend', component: 'StatsCard', status: 'passed', duration: 24 },
  { name: 'renders with negative trend', component: 'StatsCard', status: 'passed', duration: 18 },
  { name: 'updates request status when API called', component: 'RepairRequestContext', status: 'passed', duration: 45 },
];

const mockIntegrationTests: TestResult[] = [
  { name: 'opens dialog when button is clicked', component: 'CreateWorkOrderDialog', status: 'passed', duration: 120 },
  { name: 'allows resource selection and form submission', component: 'CreateWorkOrderDialog', status: 'passed', duration: 150 },
  { name: 'renders statistics page with charts', component: 'MayorStatistics', status: 'passed', duration: 200 },
  { name: 'changes report type when selected', component: 'MayorStatistics', status: 'passed', duration: 180 },
  { name: 'changes time period when selected', component: 'MayorStatistics', status: 'passed', duration: 75 },
];

export default function TestRunner() {
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [unitTests, setUnitTests] = useState<TestResult[]>([]);
  const [integrationTests, setIntegrationTests] = useState<TestResult[]>([]);
  const [completedTests, setCompletedTests] = useState(0);
  const [totalTests, setTotalTests] = useState(0);

  const runTests = async () => {
    setIsRunningTests(true);
    setUnitTests([]);
    setIntegrationTests([]);
    setCompletedTests(0);
    
    // Calculate total tests
    const total = mockUnitTests.length + mockIntegrationTests.length;
    setTotalTests(total);
    
    // Simulate running unit tests with delays
    let completed = 0;
    
    for (const test of mockUnitTests) {
      await new Promise(resolve => setTimeout(resolve, 300)); // simulate test execution time
      setUnitTests(prev => [...prev, test]);
      completed++;
      setCompletedTests(completed);
    }
    
    // Simulate running integration tests with delays
    for (const test of mockIntegrationTests) {
      await new Promise(resolve => setTimeout(resolve, 400)); // simulate test execution time
      setIntegrationTests(prev => [...prev, test]);
      completed++;
      setCompletedTests(completed);
    }
    
    setIsRunningTests(false);
    toast.success("All tests completed successfully");
  };

  const exportReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: unitTests.length + integrationTests.length,
        passed: [...unitTests, ...integrationTests].filter(t => t.status === 'passed').length,
        failed: [...unitTests, ...integrationTests].filter(t => t.status === 'failed').length,
        pending: [...unitTests, ...integrationTests].filter(t => t.status === 'pending').length,
      },
      unitTests,
      integrationTests,
    };
    
    const jsonString = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success("Test report exported successfully");
  };

  const getPassRate = () => {
    const allTests = [...unitTests, ...integrationTests];
    if (allTests.length === 0) return 0;
    
    const passedTests = allTests.filter(t => t.status === 'passed').length;
    return Math.round((passedTests / allTests.length) * 100);
  };

  const getTotalDuration = () => {
    return [...unitTests, ...integrationTests].reduce((sum, test) => sum + test.duration, 0);
  };

  return (
    <DashboardLayout sidebarLinks={adminLinks} title="Test Suite">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Test Runner</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={exportReport}
            disabled={isRunningTests || (unitTests.length === 0 && integrationTests.length === 0)}
          >
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
          <Button 
            onClick={runTests}
            disabled={isRunningTests}
          >
            {isRunningTests ? "Running Tests..." : "Run All Tests"}
          </Button>
        </div>
      </div>
      
      {isRunningTests && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Running tests...</span>
                <span>{completedTests} / {totalTests}</span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-300 ease-in-out"
                  style={{ width: `${(completedTests / totalTests) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {(unitTests.length > 0 || integrationTests.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                Pass Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{getPassRate()}%</div>
              <p className="text-sm text-muted-foreground">
                {[...unitTests, ...integrationTests].filter(t => t.status === 'passed').length} / {[...unitTests, ...integrationTests].length} tests passing
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <Clock className="mr-2 h-5 w-5 text-blue-500" />
                Execution Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{(getTotalDuration() / 1000).toFixed(2)}s</div>
              <p className="text-sm text-muted-foreground">
                Total test execution time
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <FileText className="mr-2 h-5 w-5 text-purple-500" />
                Test Coverage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">85%</div>
              <p className="text-sm text-muted-foreground">
                Estimated code coverage
              </p>
            </CardContent>
          </Card>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Unit Tests</CardTitle>
          </CardHeader>
          <CardContent>
            {unitTests.length > 0 ? (
              <div className="space-y-3">
                {unitTests.map((test, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{test.name}</p>
                        <p className="text-sm text-muted-foreground">Component: {test.component}</p>
                      </div>
                      <div className={`px-2 py-1 text-xs rounded-full ${
                        test.status === 'passed' ? 'bg-green-100 text-green-700' :
                        test.status === 'failed' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {test.status}
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Duration: {test.duration}ms
                    </div>
                    {test.error && (
                      <div className="mt-2 p-2 bg-red-50 text-red-700 text-xs rounded border border-red-200">
                        {test.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-2">No unit tests have been run</p>
                {!isRunningTests && (
                  <Button variant="outline" size="sm" onClick={runTests}>Run Tests</Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Integration Tests</CardTitle>
          </CardHeader>
          <CardContent>
            {integrationTests.length > 0 ? (
              <div className="space-y-3">
                {integrationTests.map((test, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{test.name}</p>
                        <p className="text-sm text-muted-foreground">Component: {test.component}</p>
                      </div>
                      <div className={`px-2 py-1 text-xs rounded-full ${
                        test.status === 'passed' ? 'bg-green-100 text-green-700' :
                        test.status === 'failed' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {test.status}
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Duration: {test.duration}ms
                    </div>
                    {test.error && (
                      <div className="mt-2 p-2 bg-red-50 text-red-700 text-xs rounded border border-red-200">
                        {test.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-2">No integration tests have been run</p>
                {!isRunningTests && (
                  <Button variant="outline" size="sm" onClick={runTests}>Run Tests</Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

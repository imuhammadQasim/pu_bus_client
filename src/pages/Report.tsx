import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AlertCircle, Bus, User, ShieldAlert, MessageSquare, CheckCircle2, History, Send, Camera, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

interface Report {
  id: string;
  type: string;
  busNumber: string;
  description: string;
  urgency: string;
  status: "Pending" | "Resolved";
  createdAt: string;
}

const ReportPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { position: userLocation, isLoading: isLocating, getLocation, clearLocation } = useGeolocation();
  
  const [reports, setReports] = useState<Report[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    busNumber: "",
    description: "",
    urgency: "Medium"
  });

  useEffect(() => {
    const savedReports = localStorage.getItem("pu_bus_reports");
    if (savedReports) {
      setReports(JSON.parse(savedReports));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please select a report type and provide a description.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newReport: Report = {
      id: Math.random().toString(36).substr(2, 9),
      type: formData.type,
      busNumber: formData.busNumber || "N/A",
      description: formData.description,
      urgency: formData.urgency,
      status: "Pending",
      createdAt: new Date().toLocaleString()
    };

    const updatedReports = [newReport, ...reports];
    setReports(updatedReports);
    localStorage.setItem("pu_bus_reports", JSON.stringify(updatedReports));

    toast({
      title: "Report Submitted",
      description: "Your report has been sent to the admin. Thank you for your feedback!",
    });

    setFormData({
      type: "",
      busNumber: "",
      description: "",
      urgency: "Medium"
    });
    setIsSubmitting(false);
  };

  const handleLocateMe = () => {
    if (userLocation) {
      clearLocation();
    } else {
      getLocation();
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'high': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'low': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Bus Condition': return <Bus className="h-4 w-4" />;
      case 'Conductor Behavior': return <User className="h-4 w-4" />;
      case 'Driver': return <ShieldAlert className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      <Navbar 
        onLocateMe={handleLocateMe}
        isLocating={isLocating}
        hasLocation={!!userLocation}
        onShowCampuses={() => {}}
        onShowHostels={() => {}}
        onShowGrounds={() => {}}
        onShowGates={() => {}}
        onShowAllRoutes={() => {}}
        onMenuToggle={() => {}}
      />

      <main className="flex-1 container max-w-6xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Badge variant="outline" className="mb-4 py-1 px-4 rounded-full bg-primary/5 text-primary border-primary/20 font-medium">
            Student Feedback Portal
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
            Help Us <span className="text-primary">Improve</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Your safety and comfort are our priority. Report issues directly to the administration to ensure a better travel experience for everyone.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Report Form */}
          <div className="lg:col-span-3 space-y-8 animate-in fade-in slide-in-from-left-4 duration-1000">
            <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-white dark:bg-slate-900 overflow-hidden relative group">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-blue-500 to-indigo-600" />
              
              <CardHeader className="pt-10 pb-6">
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <AlertCircle className="h-6 w-6 text-primary" />
                  Submit a New Report
                </CardTitle>
                <CardDescription className="text-base">
                  Fill out the details below. Our team will review it shortly.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        What are you reporting?
                      </Label>
                      <Select value={formData.type} onValueChange={(v) => handleSelectChange("type", v)}>
                        <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/20 transition-all">
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bus Condition">Bus Condition</SelectItem>
                          <SelectItem value="Conductor Behavior">Conductor Behavior</SelectItem>
                          <SelectItem value="Driver">Driver / Driving Issue</SelectItem>
                          <SelectItem value="Route/Timing">Route or Timing Issue</SelectItem>
                          <SelectItem value="Other">Other Feedback</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="busNumber" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        Bus Number / Route (Optional)
                      </Label>
                      <Input
                        id="busNumber"
                        name="busNumber"
                        placeholder="e.g. Bus 42 or Allama Iqbal Route"
                        value={formData.busNumber}
                        onChange={handleInputChange}
                        className="h-12 bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urgency" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      Urgency Level
                    </Label>
                    <div className="flex gap-3">
                      {['Low', 'Medium', 'High'].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => handleSelectChange("urgency", level)}
                          className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold text-sm transition-all duration-300 ${
                            formData.urgency === level 
                              ? 'border-primary bg-primary/5 text-primary' 
                              : 'border-transparent bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      Description of the Issue
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Please describe what happened in detail..."
                      rows={5}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/20 transition-all resize-none p-4"
                    />
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <Camera className="h-8 w-8 text-slate-400 mb-2 group-hover:text-primary transition-colors" />
                    <p className="text-xs font-bold text-slate-500">Attach Photos (Coming Soon)</p>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black text-lg rounded-2xl shadow-xl shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <div className="h-6 w-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Submit Report to Admin
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="p-6 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-900/30 flex gap-4 items-start">
              <ShieldAlert className="h-6 w-6 text-amber-600 shrink-0" />
              <div>
                <p className="text-sm font-bold text-amber-900 dark:text-amber-200">Confidentiality Policy</p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                  All reports are treated with strict confidentiality. Your identity will only be visible to authorized administrators to investigate the matter.
                </p>
              </div>
            </div>
          </div>

          {/* History Sidebar */}
          <div className="lg:col-span-2 space-y-6 animate-in fade-in slide-in-from-right-4 duration-1000">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Recent Reports
              </h3>
              <Badge variant="secondary" className="font-bold">
                {reports.length} Submissions
              </Badge>
            </div>

            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
              {reports.length === 0 ? (
                <div className="py-20 text-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-8 w-8 text-slate-300" />
                  </div>
                  <p className="text-slate-500 font-bold">No reports submitted yet.</p>
                  <p className="text-xs text-slate-400 mt-1 px-6">Your submission history will appear here once you send a report.</p>
                </div>
              ) : (
                reports.map((report) => (
                  <Card key={report.id} className="border-none bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all group overflow-hidden border-l-4 border-l-transparent hover:border-l-primary">
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg ${getUrgencyColor(report.urgency)}`}>
                            {getTypeIcon(report.type)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                              {report.type}
                            </p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                              ID: {report.id}
                            </p>
                          </div>
                        </div>
                        <Badge className={`${report.status === 'Resolved' ? 'bg-green-500' : 'bg-amber-500'} text-white border-none text-[10px] h-5 px-2`}>
                          {report.status}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                        {report.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Clock className="h-3 w-3" />
                          <span className="text-[10px] font-bold">{report.createdAt}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Bus className="h-3 w-3" />
                          <span className="text-[10px] font-bold">{report.busNumber}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            <Card className="bg-primary/5 border-primary/10 border shadow-none rounded-3xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary shrink-0">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Admin Response</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Average response time is 24-48 hours for non-emergency reports.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReportPage;

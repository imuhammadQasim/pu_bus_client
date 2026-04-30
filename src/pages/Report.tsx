import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AlertCircle, Bus, User as UserIcon, ShieldAlert, MessageSquare, CheckCircle2, History, Send, Camera, Clock, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import apiService from "@/services";
import { useNavigate } from "react-router-dom";
import { routes as staticRoutes } from "@/data/routeData";

interface Report {
  id: string;
  type: string;
  subject: string;
  conductorName?: string;
  busNumber?: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
  route?: {
    id: string;
    name: string;
  };
}

interface Route {
  id: string;
  name: string;
}

const ReportPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { position: userLocation, isLoading: isLocating, getLocation, clearLocation } = useGeolocation();
  
  const [reports, setReports] = useState<Report[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  
  const [formData, setFormData] = useState({
    type: "other",
    subject: "",
    conductorName: "",
    busNumber: "",
    description: "",
    priority: "medium",
    routeId: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoadingReports(true);
      
      // Fetch routes first (usually public)
      try {
        const routesRes = await apiService.getRoutes();
        let extractedRoutes: Route[] = [];
        
        if (Array.isArray(routesRes)) {
          extractedRoutes = routesRes;
        } else if (routesRes && typeof routesRes === 'object') {
          // Check various common data property names
          const possibleData = routesRes.data || routesRes.routes || routesRes.allRoutes || routesRes.all_routes;
          
          if (Array.isArray(possibleData)) {
            extractedRoutes = possibleData;
          } else if (possibleData && typeof possibleData === 'object') {
            // Check one level deeper
            extractedRoutes = possibleData.routes || possibleData.allRoutes || possibleData.all_routes || [];
          } else {
            // Check if routesRes itself has the property but it was not in .data
            extractedRoutes = routesRes.routes || routesRes.allRoutes || routesRes.all_routes || [];
          }
        }
        
        if (extractedRoutes.length === 0) {
          console.warn("No routes found from API, falling back to static data");
          setRoutes(staticRoutes as any);
        } else {
          setRoutes(extractedRoutes);
        }
      } catch (err) {
        console.error("Error fetching routes:", err);
        setRoutes(staticRoutes as any);
      }

      // Fetch reports if user is logged in
      if (user) {
        try {
          const reportsRes = await apiService.getMyReports();
          setReports(reportsRes.data?.reports || reportsRes.data || reportsRes.reports || []);
        } catch (err) {
          console.error("Error fetching reports:", err);
        }
      }
    } catch (error) {
      console.error('General error in fetchData:', error);
    } finally {
      setIsLoadingReports(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to submit a report.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.description || !formData.subject) {
      toast({
        title: "Missing Information",
        description: "Please provide a subject and description.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await apiService.createReport(formData);
      toast({
        title: "Report Submitted",
        description: "Your report has been sent to the admin. Thank you for your feedback!",
      });

      setFormData({
        type: "other",
        subject: "",
        conductorName: "",
        busNumber: "",
        description: "",
        priority: "medium",
        routeId: ""
      });
      fetchData(); // Refresh history
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error || "Something went wrong.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLocateMe = () => {
    if (userLocation) {
      clearLocation();
    } else {
      getLocation();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'low': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'bus': return <Bus className="h-4 w-4" />;
      case 'conductor': return <UserIcon className="h-4 w-4" />;
      case 'driver': return <ShieldAlert className="h-4 w-4" />;
      case 'route': return <MapPin className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-slate-950 selection:bg-primary/20">
      <Navbar 
        onLocateMe={handleLocateMe}
        isLocating={isLocating}
        hasLocation={!!userLocation}
        onShowCampuses={() => navigate('/?show=campuses')}
        onShowHostels={() => navigate('/?show=hostels')}
        onShowGrounds={() => navigate('/?show=grounds')}
        onShowGates={() => navigate('/?show=gates')}
        onShowAllRoutes={() => navigate('/?show=allRoutes')}
        onMenuToggle={() => {}}
      />

      <main className="flex-1 container max-w-6xl mx-auto px-4 py-12 md:py-20 z-10">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Badge variant="outline" className="mb-4 py-1 px-4 rounded-full bg-primary/5 text-primary border-primary/20 font-bold uppercase tracking-wider text-xs">
            Student Feedback Portal
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
            Help Us <span className="text-primary italic">Improve</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            Your safety and comfort are our priority. Report issues directly to the administration to ensure a better travel experience for everyone.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Report Form */}
          <div className="lg:col-span-3 space-y-8 animate-in fade-in slide-in-from-left-4 duration-1000">
            <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-white dark:bg-slate-900 rounded-3xl overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-blue-500 to-indigo-600" />
              
              <CardHeader className="pt-10 pb-6">
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <AlertCircle className="h-6 w-6 text-primary" />
                  Submit a Detailed Report
                </CardTitle>
                <CardDescription className="text-base font-medium">
                  Provide exact details to help our team find a solution faster.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                        What are you reporting?
                      </Label>
                      <Select value={formData.type} onValueChange={(v) => handleSelectChange("type", v)}>
                        <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-semibold">
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="conductor">Conductor Behavior</SelectItem>
                          <SelectItem value="driver">Driver / Driving Issue</SelectItem>
                          <SelectItem value="bus">Bus Condition</SelectItem>
                          <SelectItem value="route">Route or Timing Issue</SelectItem>
                          <SelectItem value="app">App Bug/Feedback</SelectItem>
                          <SelectItem value="other">Other Feedback</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                        Urgency / Priority
                      </Label>
                      <Select value={formData.priority} onValueChange={(v) => handleSelectChange("priority", v)}>
                        <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-semibold">
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="low" className="text-blue-600 font-bold">Low</SelectItem>
                          <SelectItem value="medium" className="text-amber-600 font-bold">Medium</SelectItem>
                          <SelectItem value="high" className="text-red-600 font-bold">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                      Subject / Title
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Brief title of the issue"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="h-12 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                      required
                    />
                  </div>

                  {(formData.type === 'conductor' || formData.type === 'driver' || formData.type === 'bus') && (
                    <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2">
                      <div className="space-y-2">
                        <Label htmlFor="conductorName" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                          Name (Optional)
                        </Label>
                        <Input
                          id="conductorName"
                          name="conductorName"
                          placeholder="e.g. Staff Name"
                          value={formData.conductorName}
                          onChange={handleInputChange}
                          className="h-12 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="busNumber" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                          Bus Number (Optional)
                        </Label>
                        <Input
                          id="busNumber"
                          name="busNumber"
                          placeholder="e.g. LED-1234"
                          value={formData.busNumber}
                          onChange={handleInputChange}
                          className="h-12 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="routeId" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                      Route Involved
                    </Label>
                    <Select value={formData.routeId} onValueChange={(v) => handleSelectChange("routeId", v)}>
                      <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-semibold">
                        <SelectValue placeholder="Select Route (if applicable)" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl max-h-[300px]">
                        {routes.map(r => (
                          <SelectItem key={String(r.id)} value={String(r.id)} className="rounded-lg cursor-pointer">
                            {r.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                      Description of the Issue
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Please describe exactly what happened..."
                      rows={5}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all resize-none p-4 font-medium"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black text-lg rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
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

            <div className="p-6 bg-amber-50 dark:bg-amber-950/20 rounded-3xl border border-amber-200 dark:border-amber-900/30 flex gap-4 items-start">
              <ShieldAlert className="h-6 w-6 text-amber-600 shrink-0 mt-1" />
              <div>
                <p className="text-sm font-bold text-amber-900 dark:text-amber-200 uppercase tracking-tight">Confidentiality Policy</p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1 font-medium leading-relaxed">
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
                My Submissions
              </h3>
              <Badge variant="secondary" className="font-bold rounded-lg px-2.5 py-1">
                {reports.length} Reports
              </Badge>
            </div>

            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
              {isLoadingReports ? (
                <div className="py-20 text-center">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : reports.length === 0 ? (
                <div className="py-20 text-center bg-white dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-8 w-8 text-slate-300" />
                  </div>
                  <p className="text-slate-500 font-bold">No reports yet.</p>
                  <p className="text-xs text-slate-400 mt-1 px-6 font-medium">Your submission history will appear here once you send a report.</p>
                </div>
              ) : (
                reports.map((report) => (
                  <Card key={report.id} className="border-none bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all group overflow-hidden border-l-4 border-l-transparent hover:border-l-primary rounded-2xl">
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg border ${getPriorityColor(report.priority)}`}>
                            {getTypeIcon(report.type)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                              {report.subject || report.type}
                            </p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                              {report.type.toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <Badge className={`${report.status === 'resolved' ? 'bg-green-500' : 'bg-amber-500'} text-white border-none text-[10px] font-bold rounded-full h-5`}>
                          {report.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed font-medium">
                        {report.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                        <div className="flex items-center gap-1.5 text-slate-400 font-bold">
                          <Clock className="h-3 w-3" />
                          <span className="text-[10px]">{new Date(report.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 font-bold">
                          <MapPin className="h-3 w-3" />
                          <span className="text-[10px] line-clamp-1 max-w-[80px]">
                            {report.route?.name || report.busNumber || 'N/A'}
                          </span>
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
                    <h4 className="font-bold text-slate-900 dark:text-white">Quick Review</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium leading-tight">Admin team reviews reports daily to maintain high standards.</p>
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

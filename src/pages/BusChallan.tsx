import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Bus, MapPin, ReceiptText } from "lucide-react";
import { useOperatingStatus } from "@/hooks/useOperatingStatus";
import { useGeolocation } from "@/hooks/useGeolocation";

const BusChallan = () => {
  const { position: userLocation, isLoading: isLocating, getLocation, clearLocation } = useGeolocation();
  const operatingStatus = useOperatingStatus();

  const handleChallanClick = () => {
    window.open("https://fee.pu.edu.pk/login/transport", "_blank");
  };

  const handleLocateMe = () => {
    if (userLocation) {
      clearLocation();
    } else {
      getLocation();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
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
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4 text-primary">
            <ReceiptText className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
            Bus Fee Challan
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Generate and manage your monthly transport fee challans through the official Punjab University fee portal.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Inside Lahore Card */}
          <Card className="border-none shadow-[0_15px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.2)] bg-white dark:bg-slate-900 overflow-hidden group hover:scale-[1.02] transition-all duration-300 flex flex-col">
            <div className="h-2 bg-primary w-full" />
            <CardHeader className="pt-8 pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <MapPin className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-bold">Inside Lahore Usage</CardTitle>
              <CardDescription className="text-base">
                For students residing within Lahore city limits using local routes.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {[
                  "Monthly recurring fee",
                  "Valid for all local city routes",
                  "Standard student discount applied",
                  "Instant digital receipt generation"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pt-4 pb-8">
              <Button 
                onClick={handleChallanClick}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                Generate Lahore Challan
                <ExternalLink className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* Outside Lahore Card */}
          <Card className="border-none shadow-[0_15px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.2)] bg-white dark:bg-slate-900 overflow-hidden group hover:scale-[1.02] transition-all duration-300 flex flex-col">
            <div className="h-2 bg-amber-500 w-full" />
            <CardHeader className="pt-8 pb-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                <Bus className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-bold">Outside Lahore Usage</CardTitle>
              <CardDescription className="text-base">
                For students commuting from suburban areas and outskirts of Lahore.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {[
                  "Monthly based fee challan",
                  "Extended distance coverage",
                  "Valid for specialized long-haul routes",
                  "Integrated with university database"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pt-4 pb-8">
              <Button 
                onClick={handleChallanClick}
                className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 border-none"
              >
                Generate Outside Challan
                <ExternalLink className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-16 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            <strong>Note:</strong> You will be redirected to the official PU Fee Portal (fee.pu.edu.pk). 
            Please ensure you have your student CNIC/Registration number ready.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BusChallan;

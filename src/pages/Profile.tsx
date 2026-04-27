import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Edit2, X, Save, Heart, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/services/index";
import { Route } from "@/data/routeData";

export const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile, removeFavoriteRoute, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiRoutes, setApiRoutes] = useState<Route[]>([]);
  const [favoriteRoutes, setFavoriteRoutes] = useState<Route[]>([]);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phoneNumber: user?.phoneNumber || "",
  });

  React.useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const fetchRoutes = async () => {
      try {
        const routesData = await apiService.getRoutes();
        let routes: Route[] = [];
        if (Array.isArray(routesData)) {
          routes = routesData;
        } else if (routesData?.data) {
          routes = Array.isArray(routesData.data) ? routesData.data : routesData.data.routes || [];
        }
        setApiRoutes(routes);

        // Filter favorite routes
        const favorites = routes.filter(route =>
          user.favoriteRoutes?.includes(route.id)
        );
        setFavoriteRoutes(favorites);
      } catch (error) {
        console.error("Failed to fetch routes:", error);
      }
    };

    fetchRoutes();
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
      });
      toast({ title: "Success", description: "Profile updated successfully" });
      setIsEditing(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to update profile" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({ title: "Goodbye", description: "You have been logged out" });
    navigate("/");
  };

  const handleRemoveFavorite = (routeId: number) => {
    removeFavoriteRoute(routeId);
    setFavoriteRoutes(favoriteRoutes.filter(r => r.id !== routeId));
    toast({ title: "Removed", description: "Route removed from favorites" });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-slate-500 font-bold animate-pulse">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const dummyNavbarProps = {
    onLocateMe: () => {},
    isLocating: false,
    hasLocation: false,
    onShowCampuses: () => {},
    onShowHostels: () => {},
    onShowGrounds: () => {},
    onShowGates: () => {},
    onShowAllRoutes: () => {},
    onMenuToggle: () => {},
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] dark:bg-slate-950 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-3xl" />

      <Navbar {...dummyNavbarProps} />

      <main className="flex-1 container mx-auto px-4 py-10 max-w-4xl z-10">
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Your Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Manage your personal information and favorite routes</p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* User Details Card */}
          <Card className="border-none shadow-[0_15px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-500">
            <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold">Personal Information</CardTitle>
                    <CardDescription>Keep your contact details up to date</CardDescription>
                  </div>
                </div>
                <Button
                  variant={isEditing ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (isEditing) {
                      setFormData({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        phoneNumber: user.phoneNumber,
                      });
                    }
                    setIsEditing(!isEditing);
                  }}
                  className="rounded-xl font-bold transition-all active:scale-95"
                >
                  {isEditing ? (
                    <>
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-semibold ml-1">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`h-12 rounded-xl transition-all ${isEditing ? "bg-white border-primary/20 shadow-sm" : "bg-slate-50 border-slate-100"}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-semibold ml-1">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`h-12 rounded-xl transition-all ${isEditing ? "bg-white border-primary/20 shadow-sm" : "bg-slate-50 border-slate-100"}`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold ml-1">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled
                    className="h-12 rounded-xl bg-slate-50 border-slate-100 text-slate-500 font-medium"
                  />
                  <p className="text-[11px] text-slate-400 ml-1 italic">* Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sm font-semibold ml-1">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`h-12 rounded-xl transition-all ${isEditing ? "bg-white border-primary/20 shadow-sm" : "bg-slate-50 border-slate-100"}`}
                  />
                </div>

                {isEditing && (
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-4"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-5 w-5" />
                        Save Profile
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Favorite Routes Card */}
          <Card className="border-none shadow-[0_15px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-700 delay-150">
            <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                  <Heart className="h-6 w-6 fill-current" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    Favorite Routes
                    <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">{favoriteRoutes.length}</span>
                  </CardTitle>
                  <CardDescription>Your most used bus routes</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {favoriteRoutes.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                  <div className="bg-white dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Heart className="h-8 w-8 text-slate-200" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No favorite routes yet</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-xs mx-auto">Add routes to your favorites to access them quickly from here.</p>
                  <Button
                    onClick={() => navigate("/")}
                    className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 font-bold"
                  >
                    Explore Routes
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favoriteRoutes.map((route) => (
                    <div
                      key={route.id}
                      className="group flex flex-col p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div 
                          className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white"
                          style={{ backgroundColor: route.color }}
                        >
                          Route {route.id}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFavorite(route.id)}
                          className="h-8 w-8 p-0 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Heart className="h-4 w-4 fill-current" />
                        </Button>
                      </div>
                      <h4 className="font-extrabold text-lg text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-primary transition-colors">
                        {route.name}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                        {route.desc}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700">
                        <span className="text-xs font-bold text-slate-400">
                          {route.waypoints.length} Main Stops
                        </span>
                        <Button 
                          variant="link" 
                          className="h-auto p-0 text-primary font-bold text-xs group-hover:translate-x-1 transition-transform"
                          onClick={() => navigate("/")}
                        >
                          View on Map →
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="mt-4 flex justify-center">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 font-bold gap-2 py-6 px-8 rounded-2xl"
            >
              <LogOut className="h-5 w-5" />
              Sign Out from Portal
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;

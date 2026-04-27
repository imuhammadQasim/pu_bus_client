import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Edit2, X, Save, Heart } from "lucide-react";
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
  const { user, logout, updateProfile, removeFavoriteRoute } = useAuth();
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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800">
      <Navbar {...dummyNavbarProps} />

      <div className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header Card */}
        <Card className="mb-6 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold">Profile</CardTitle>
                <CardDescription>View and manage your information</CardDescription>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* User Details Card */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Personal Information</CardTitle>
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
                className="flex items-center gap-2"
              >
                {isEditing ? (
                  <>
                    <X className="h-4 w-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              {isEditing && (
                <Button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Favorite Routes Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Favorite Routes ({favoriteRoutes.length})
            </CardTitle>
            <CardDescription>Your favorite bus routes</CardDescription>
          </CardHeader>
          <CardContent>
            {favoriteRoutes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="mb-4">No favorite routes yet</p>
                <Button
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="mx-auto"
                >
                  View Routes
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {favoriteRoutes.map((route) => (
                  <div
                    key={route.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    style={{
                      borderLeftColor: route.color,
                      borderLeftWidth: "4px",
                    }}
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{route.name}</h4>
                      <p className="text-sm text-muted-foreground">{route.desc}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {route.waypoints.length} stops
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFavorite(route.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <Heart className="h-4 w-4 fill-current" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;

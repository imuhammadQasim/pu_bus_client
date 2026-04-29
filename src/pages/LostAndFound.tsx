import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Calendar, Phone, PackageOpen } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

import apiService from '@/services';

interface Route {
  id: string;
  name: string;
}

interface Item {
  id: string;
  type: 'lost' | 'found';
  category: string;
  title: string;
  routeId: string;
  route?: { name: string };
  description: string;
  contact: string;
  createdAt: string;
  status: 'active' | 'resolved';
  userId: string;
}

const CATEGORIES = ['ID Card', 'Wallet', 'Bag', 'Electronics', 'Books', 'Other'];

export default function LostAndFound() {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('lost');

  // Form State
  const [formData, setFormData] = useState({
    type: 'lost',
    category: '',
    title: '',
    routeId: '',
    description: '',
    contact: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [itemsRes, routesRes] = await Promise.all([
        apiService.getLostAndFound(),
        apiService.getRoutes()
      ]);
      
      setItems(itemsRes.data?.items || itemsRes.data || itemsRes.items || []);
      
      const routesData = routesRes;
      let extractedRoutes: Route[] = [];
      if (Array.isArray(routesData)) {
        extractedRoutes = routesData;
      } else if (routesData?.data) {
        extractedRoutes = Array.isArray(routesData.data) ? routesData.data : routesData.data.routes || [];
      } else if (routesData?.routes) {
        extractedRoutes = routesData.routes;
      }
      setRoutes(extractedRoutes);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to post an item');
      return;
    }
    
    if (!formData.category || !formData.title || !formData.routeId) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const res = await apiService.addLostAndFound(formData);
      setItems([res.data, ...items]);
      setIsModalOpen(false);
      toast.success('Item posted successfully!');
      setFormData({ type: 'lost', category: '', title: '', routeId: '', description: '', contact: '' });
      // Refresh to get full object with relations if needed, or just rely on state
      fetchData();
    } catch (error: any) {
      toast.error(error || 'Failed to post item');
    }
  };

  const handleResolve = async (id: string) => {
    try {
      await apiService.updateLostAndFound(id, { status: 'resolved' });
      setItems(items.map(item => item.id === id ? { ...item, status: 'resolved' as const } : item));
      toast.success('Marked as resolved!');
    } catch (error: any) {
      toast.error(error || 'Failed to resolve item');
    }
  };

  const filteredItems = items.filter(item => item.type === activeTab);

  const handleNavAction = (actionName: string) => {
    // Navigate to home with a query param to trigger the action
    const routeMap: Record<string, string> = {
      campuses: 'campuses',
      hostels: 'hostels',
      grounds: 'grounds',
      gates: 'gates',
      allRoutes: 'allRoutes'
    };
    navigate(`/?show=${routeMap[actionName] || ''}`);
  };

  const navProps = {
    onLocateMe: () => navigate('/?locate=true'),
    isLocating: false,
    hasLocation: false,
    onShowCampuses: () => handleNavAction('campuses'),
    onShowHostels: () => handleNavAction('hostels'),
    onShowGrounds: () => handleNavAction('grounds'),
    onShowGates: () => handleNavAction('gates'),
    onShowAllRoutes: () => handleNavAction('allRoutes'),
    onMenuToggle: () => {}
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] dark:bg-slate-950 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-3xl" />
      
      <Navbar {...navProps} />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Lost & Found</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Report lost items or help return found belongings to fellow students.</p>
          </div>
          
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20 gap-2 h-12 px-6 font-bold transition-all active:scale-95">
                <Plus className="w-5 h-5" />
                Report Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-2xl border-none shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Report an Item</DialogTitle>
                <DialogDescription>Please provide details about the item you lost or found.</DialogDescription>
              </DialogHeader>
              
              {!user ? (
                <div className="py-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-xl mt-4 border border-dashed border-slate-200 dark:border-slate-800">
                  <PackageOpen className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-600 dark:text-slate-400 font-medium mb-4">You must be logged in to post an item.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    <Button 
                      type="button" 
                      variant="ghost"
                      onClick={() => setFormData({...formData, type: 'lost'})} 
                      className={`h-10 rounded-lg font-bold transition-all ${formData.type === 'lost' ? 'bg-white dark:bg-slate-700 shadow-sm text-red-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      I Lost Something
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost"
                      onClick={() => setFormData({...formData, type: 'found'})} 
                      className={`h-10 rounded-lg font-bold transition-all ${formData.type === 'found' ? 'bg-white dark:bg-slate-700 shadow-sm text-green-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      I Found Something
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold ml-1 text-slate-700 dark:text-slate-300">Title</label>
                    <Input placeholder="e.g. Black Leather Wallet" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="h-11 rounded-xl bg-slate-50 focus:bg-white dark:bg-slate-900" required />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold ml-1 text-slate-700 dark:text-slate-300">Category</label>
                      <Select value={formData.category} onValueChange={(val) => setFormData({...formData, category: val})}>
                        <SelectTrigger className="h-11 rounded-xl bg-slate-50 focus:bg-white dark:bg-slate-900"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {CATEGORIES.map(c => <SelectItem key={c} value={c} className="rounded-lg cursor-pointer">{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold ml-1 text-slate-700 dark:text-slate-300">Route</label>
                      <Select value={formData.routeId} onValueChange={(val) => setFormData({...formData, routeId: val})}>
                        <SelectTrigger className="h-11 rounded-xl bg-slate-50 focus:bg-white dark:bg-slate-900"><SelectValue placeholder="Select Route" /></SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {routes.map(r => <SelectItem key={String(r.id)} value={String(r.id)} className="rounded-lg cursor-pointer">{r.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold ml-1 text-slate-700 dark:text-slate-300">Description</label>
                    <Textarea placeholder="More details..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="rounded-xl resize-none bg-slate-50 focus:bg-white dark:bg-slate-900" rows={3} required />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold ml-1 text-slate-700 dark:text-slate-300">Contact Info</label>
                    <Input placeholder="Phone or email (visible to others)" value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} className="h-11 rounded-xl bg-slate-50 focus:bg-white dark:bg-slate-900" required />
                  </div>
                  
                  <Button type="submit" className="w-full h-12 rounded-xl text-md font-bold mt-4 shadow-lg shadow-primary/20">Submit Report</Button>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full animate-in fade-in zoom-in-95 duration-500 delay-150">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2 h-14 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-100 dark:border-slate-800 shadow-sm p-1">
            <TabsTrigger value="lost" className="rounded-xl font-bold data-[state=active]:bg-red-500 data-[state=active]:text-white transition-all">Lost Items</TabsTrigger>
            <TabsTrigger value="found" className="rounded-xl font-bold data-[state=active]:bg-green-500 data-[state=active]:text-white transition-all">Found Items</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-8">
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-slate-500 font-medium">Loading items...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 shadow-sm">
                <PackageOpen className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">No {activeTab} items reported yet</h3>
                <p className="text-slate-500 mt-2 font-medium">Be helpful and report if you {activeTab === 'lost' ? 'lose' : 'find'} anything.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item, i) => (
                  <div key={item.id} className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="outline" className={`rounded-full px-3 py-1 font-extrabold tracking-wider text-[10px] uppercase border-2 ${item.type === 'lost' ? 'text-red-600 border-red-200 bg-red-50' : 'text-green-600 border-green-200 bg-green-50'}`}>
                        {item.type === 'lost' ? 'LOST ITEM' : 'FOUND ITEM'}
                      </Badge>
                      {item.status === 'resolved' && (
                        <Badge className="bg-slate-800 text-white hover:bg-slate-800 rounded-full font-bold">Resolved</Badge>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2 line-clamp-1">{item.title}</h3>
                    
                    <div className="flex items-center text-xs font-bold text-primary bg-primary/5 w-fit px-2.5 py-1 rounded-md mb-4 border border-primary/10">
                      <MapPin className="w-3.5 h-3.5 mr-1.5" />
                      {item.route?.name || 'Unknown Route'}
                    </div>
                    
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 flex-1 font-medium leading-relaxed">
                      {item.description}
                    </p>
                    
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                      <div className="flex items-center text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wide">
                        <Calendar className="w-3.5 h-3.5 mr-1.5" />
                        {new Date(item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                      
                      <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center text-sm font-bold text-slate-700 dark:text-slate-300 truncate pr-2">
                          <Phone className="w-4 h-4 mr-2 text-amber-500 shrink-0" />
                          <span className="truncate">{item.contact}</span>
                        </div>
                        
                        {user && (user.id === item.userId || user.email === item.userId) && item.status !== 'resolved' && (
                          <Button size="sm" onClick={() => handleResolve(item.id)} className="h-8 rounded-lg text-xs font-bold shadow-sm shrink-0">
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}

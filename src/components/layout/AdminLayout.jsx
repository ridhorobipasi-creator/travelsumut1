import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, Package, Car, FileText, MapPin, MessageSquare,
  Star, Users, Settings, Menu, X, Palmtree, ShoppingCart, Compass, ChevronLeft, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: ShoppingCart, label: 'Pesanan', path: '/admin/orders' },
  { icon: Package, label: 'Paket Wisata', path: '/admin/packages' },
  { icon: Car, label: 'Rental', path: '/admin/rentals' },
  { icon: Compass, label: 'Custom Trip', path: '/admin/custom-trips' },
  { icon: MapPin, label: 'Wilayah', path: '/admin/regions' },
  { icon: FileText, label: 'Artikel', path: '/admin/articles' },
  { icon: Star, label: 'Review', path: '/admin/reviews' },
  { icon: MessageSquare, label: 'Pesan', path: '/admin/messages' },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen z-50 bg-card border-r transition-all duration-300 flex flex-col
        ${collapsed ? 'w-[72px]' : 'w-64'}
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className={`flex items-center h-16 px-4 border-b ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <Link to="/admin" className="flex items-center gap-2">
              <Palmtree className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg">Admin</span>
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={() => { setCollapsed(!collapsed); setMobileOpen(false); }} className="hidden lg:flex">
            <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} className="lg:hidden">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t space-y-1">
          {!collapsed && (
            <Link to="/" className="block text-sm text-muted-foreground hover:text-primary transition-colors px-3 py-2">
              ← Kembali ke Website
            </Link>
          )}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 bg-card/95 backdrop-blur-md border-b flex items-center px-4 lg:px-6">
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)} className="lg:hidden mr-2">
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex-1 flex items-center gap-4">
            <h1 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest hidden md:block">Real-time Dashboard</h1>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-50 text-[10px] font-bold text-green-600 border border-green-100 uppercase tracking-tighter">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
               Live Sync Active
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
               <Users className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

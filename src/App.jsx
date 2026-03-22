import { Routes, Route } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';
import AdminGuard from './components/layout/AdminGuard';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import PackagesAdmin from './pages/admin/Packages';
import RegionsAdmin from './pages/admin/Regions';
import RentalsAdmin from './pages/admin/Rentals';
import CustomTripsAdmin from './pages/admin/CustomTrips';
import ArticlesAdmin from './pages/admin/Articles';
import ReviewsAdmin from './pages/admin/Reviews';
import MessagesAdmin from './pages/admin/Messages';

import PackagesList from './pages/public/PackagesList';
import PackageDetail from './pages/public/PackageDetail';
import RentalsList from './pages/public/RentalsList';
import CustomTripForm from './pages/public/CustomTripForm';
import BlogList from './pages/public/BlogList';

import { Toaster } from './components/ui/toaster';

// Fallback pages (can be improved later)
const NotFound = () => <div className="flex h-screen items-center justify-center font-bold text-2xl">404 - Halaman Tidak Ditemukan</div>;

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/packages" element={<PackagesList />} />
          <Route path="/packages/:id" element={<PackageDetail />} />
          <Route path="/rentals" element={<RentalsList />} />
          <Route path="/custom-trip" element={<CustomTripForm />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Routes */}
        <Route element={<AdminGuard />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/orders" element={<Orders />} />
            <Route path="/admin/packages" element={<PackagesAdmin />} />
            <Route path="/admin/rentals" element={<RentalsAdmin />} />
            <Route path="/admin/custom-trips" element={<CustomTripsAdmin />} />
            <Route path="/admin/regions" element={<RegionsAdmin />} />
            <Route path="/admin/articles" element={<ArticlesAdmin />} />
            <Route path="/admin/reviews" element={<ReviewsAdmin />} />
            <Route path="/admin/messages" element={<MessagesAdmin />} />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;

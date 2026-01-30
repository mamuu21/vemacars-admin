import { Routes, Route, Navigate } from 'react-router-dom'

import AuthLayout from './layouts/AuthLayout'
import RegisterPage from './pages/register'
import LoginPage from './pages/login'


import DashboardLayout from './pages/dashboard/dashlayout'
import DashboardPage from './pages/dashboard/home'
import { VehiclesPage } from './pages/vehicles/index'
import InvoicePage from './pages/invoices'
import CustomersPage from './pages/customers'
import WebsiteEditor from './pages/website-editor'
import WebsiteVehiclesPage from './pages/website-editor/vehicles'
import WebsiteVehicleEditor from './pages/website-editor/vehicles/editor'
import HeroSectionPage from './pages/website-editor/hero'
import BlogListPage from './pages/website-editor/blog'
import BlogPostForm from './pages/website-editor/blog/form'
import Unauthorized from './pages/Unauthorized'

function App() {
  return (
    <>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* <Route path="/" element={<Landing />} /> */}
        </Route>

        {/* Redirect Root to Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/invoices" element={<InvoicePage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/website-editor" element={<WebsiteEditor />} />
          <Route path="/website/vehicles" element={<WebsiteVehiclesPage />} />
          <Route path="/website/vehicles/:id" element={<WebsiteVehicleEditor />} />
          <Route path="/website/hero" element={<HeroSectionPage />} />
          <Route path="/website/blogs" element={<BlogListPage />} />
          <Route path="/website/blogs/new" element={<BlogPostForm />} />
          <Route path="/website/blogs/:id/edit" element={<BlogPostForm />} />
        </Route>

        {/* Unauthorized Route */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Add other route groups like dashboard here */}
      </Routes>
    </>
  )
}

export default App

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Products from "../pages/Products/Products";
import Categories from "../pages/Categories/Categories";
import Gallery from "../pages/Gallery/Gallery";
import Reviews from "../pages/Reviews/Reviews";
import ChatLeads from "../pages/ChatLeads/ChatLeads";
import Bookings from "../pages/Bookings/Bookings";
import ContactMessages from "../pages/ContactMessages/ContactMessages";
import Settings from "../pages/Settings/Settings";
import Analytics from "../pages/Analytics/Analytics";

import Layout from "../components/Layout/Layout";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";

function NotFound() {
  return <h1>404 Not Found</h1>;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Layout>
                <Categories />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Layout>
                <Products />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/gallery"
          element={
            <ProtectedRoute>
              <Layout>
                <Gallery />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reviews"
          element={
            <ProtectedRoute>
              <Layout>
                <Reviews />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat-leads"
          element={
            <ProtectedRoute>
              <Layout>
                <ChatLeads />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <Layout>
                <Bookings />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/contact-messages"
          element={
            <ProtectedRoute>
              <Layout>
                <ContactMessages />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Layout>
                <Analytics />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Products from "../pages/Products/Products";
import Gallery from "../pages/Gallery/Gallery";

import Layout from "../components/Layout/Layout";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";

function Categories() {
  return <h1>Categories</h1>;
}

function Bookings() {
  return <h1>Bookings</h1>;
}

function ContactMessages() {
  return <h1>Contact Messages</h1>;
}

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

        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}
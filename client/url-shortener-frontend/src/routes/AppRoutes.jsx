import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import UrlShortener from "../components/UrlShortener";
import { Register } from "../pages/Register";
import { NavBar } from "../components/NavBar";
import Redirect from "../components/Redirect";

const AppRoutes = () => (
  <BrowserRouter>
    <NavBar />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/home" element={<UrlShortener />} />
      <Route path="/register" element={<Register />} />
      <Route path="/redirect/:url" element={<Redirect />} />
      {/* Add a default route to redirect to home or login */}
      <Route path="/" element={<UrlShortener />} />
      {/* Optional: Add a catch-all route for 404 pages */}
      <Route path="*" element={<div className="p-10 text-center">Page not found</div>} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
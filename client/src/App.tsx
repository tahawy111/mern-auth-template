import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import { UserProvider, useUser } from "./components/contexts/UserContext";

function App() {
  const { user } = useUser();
  console.log(user);
  
  return (
        <><Routes>
      <Route
        path="/"
        element={ user ? <Dashboard /> : <Navigate to="/login" /> } />
      <Route
        path="/login"
        element={ user ? <Navigate to="/" /> : <Login /> } />
      <Route
        path="/register"
        element={ user ? <Navigate to="/" /> : <Register /> } />
    </Routes><Toaster /></>
  );
}

export default App;

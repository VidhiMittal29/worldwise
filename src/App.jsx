import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CitiesProvider } from "./Contexts/CitiesContext";
import { AuthProvider } from "./Contexts/FakeAuthContext";
import ProtectedRoute from "./pages/ProtectedRoute";

import CityList from "./Components/CityList";
import CountryList from "./Components/CountryList";
import City from "./Components/City";
import Form from "./Components/Form";
import SpinnerFullPage from "./Components/SpinnerFullPage";



// import HomePage from "./pages/HomePage";
// import Pricing from "./pages/Pricing";
// import Product from "./pages/Product";
// import AppLayout from "./pages/AppLayout";
// import PageNotFound from "./pages/PageNotFound";
// import Login from "./pages/Login";

const HomePage=lazy(()=>import("./pages/HomePage"));
const Pricing=lazy(()=>import("./pages/Pricing"));
const Product=lazy(()=>import("./pages/Product"));
const AppLayout=lazy(()=>import("./pages/AppLayout"));
const Login=lazy(()=>import("./pages/Login"));
const PageNotFound=lazy(()=>import("./pages/PageNotFound"));

function App() {
  return (
    <AuthProvider>
    <CitiesProvider>
      <BrowserRouter>
      <Suspense fallback={<SpinnerFullPage/>}>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="product" element={<Product />} />
          <Route path="login" element={<Login />} />
          <Route path="app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<Navigate replace to="cities" />} />
            <Route path="cities" element={<CityList />} />
            <Route path="cities/:id" element={<City />} />
            <Route path="countries" element={<CountryList />} />
            <Route path="form" element={<Form />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </CitiesProvider>
    </AuthProvider>
  );
}

export default App;

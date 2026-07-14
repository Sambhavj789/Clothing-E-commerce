import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Login from "./pages/Login";
import Products from "./pages/Products";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminLayout from "./layouts/AdminLayout";
function App() {
  const loc = window.location.pathname;
  const isAdminRoute = loc.includes("admin");
  return (
    <BrowserRouter>
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Products />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="products" element={<AdminProducts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

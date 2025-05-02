import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductList from "./pages/ProductList.js";
import OrderPage from "./pages/OrderPage";
import UserOrdersPage from "./pages/UsersOrdersPage.jsx";
import NavBar from "./components/NavBar";
import AllOrdersPage from "./pages/AllOrdersPage.tsx";

export default function App() {
    return (
        <Router>
            <NavBar />
            <div className="p-4">
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/my-orders" element={<UserOrdersPage />} />
                    <Route path="/orders" element={<OrderPage />} /> {/* Placing new orders */}
                    <Route path="/admin/orders" element={<AllOrdersPage />} />
                </Routes>
            </div>
        </Router>
    );
}

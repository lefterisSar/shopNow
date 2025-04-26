import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProductList from "./pages/ProductList";
import OrderPage from "./pages/OrderPage";
import UserOrdersPage from "./pages/UsersOrdersPage.jsx";
import NavBar from "./components/NavBar";

export default function App() {
    return (
        <Router>
            <NavBar />
            <div className="p-4">
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/my-orders" element={<UserOrdersPage />} />
                    <Route path="/orders" element={<OrderPage />} /> {/* Placing new orders */}
                </Routes>
            </div>
        </Router>
    );
}

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProductList from "./pages/ProductList"; // placeholder
import OrderPage from "./pages/OrderPage";     // placeholder

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/orders" element={<OrderPage />} />
            </Routes>
        </Router>
    );
}

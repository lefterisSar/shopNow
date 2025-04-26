import { useEffect, useState } from "react";
import orderAxios from "../api/orderAxios"; // ✅ Axios for OrderService

export default function UserOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await orderAxios.get("/api/orders/user");
                setOrders(res.data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch orders. Are you logged in?");
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">My Orders</h2>

            {error && <p className="text-red-500">{error}</p>}

            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {orders.map((order) => (
                        <div key={order.id} className="border p-4 rounded shadow">
                            <p><strong>Status:</strong> {order.status}</p>
                            <p><strong>Total:</strong> ${order.total}</p>
                            <p><strong>Placed At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                            <p><strong>Order ID:</strong> {order.id}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

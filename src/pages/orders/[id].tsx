import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { useStoreContext } from "../../context";
import Navbar from "../../components/Navbar";

const OrderDetailPage = () => {
    const params = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const { loading, setLoading } = useStoreContext();
    const navigate = useNavigate();

    const fetchOrder = async () => {
        const orderId = params?.id;
        if (!orderId) return navigate("*");
        if (orderId.length !== 24) return navigate("*");
        
        setLoading(true);
        const response = await fetch(`http://k8s.orb.local/api/v1/orders/?q=${orderId}&q_type=id`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })

        if (!response.ok) {
            console.log("Failed to fetch order");
            return navigate("*");
        } else {
            const data = await response.json();
            console.log("Order data:", data);
            setOrder(data.data);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchOrder();
    }, []);
    return (
        <main className="h-screen w-screen">
            <Navbar />
            {(loading || !order) ? (
                <div className="flex items-center flex-col justify-center">
                    <p className="text-center">Loading Order Data...</p>
                </div>
            ) : (
                <div className="w-full flex flex-col p-4 space-y-4">
                    <h1 className="text-3xl font-semibold tracking-wide">Order Details</h1>
                    <div className="flex space-x-4 items-center">
                        <p># {order._id}</p>
                        <p>
                            <span className={`p-1.5 text-xs font-medium uppercase tracking-wider ${order.status === "paid" ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"} rounded-lg bg-opacity-50`}>{order.status}</span>
                        </p>
                    </div>
                    <h3 className="text-xl font-semibold">Items</h3>
                    <table className="table-auto w-full">
                        <thead className="bg-gray-50 border-b-2 border-gray-200">
                            <tr>
                                <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left">#</th>
                                <th className="p-3 text-sm font-semibold tracking-wide text-left">Item Name</th>
                                <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">Quantity</th>
                                <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">Price</th>
                                <th className="w-32 p-3 text-sm font-semibold tracking-wide text-left">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {order.items.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="whitespace-nowrap p-3 text-sm text-slate-700">{idx + 1}</td>
                                    <td className="whitespace-nowrap p-3 text-sm text-slate-700">{item.name}</td>
                                    <td className="whitespace-nowrap p-3 text-sm text-slate-700">{item.quantity}</td>
                                    <td className="whitespace-nowrap p-3 text-sm text-slate-700">{order.currency.toUpperCase()} {item.price}</td>
                                    <td className="whitespace-nowrap p-3 text-sm text-slate-700">{order.currency.toUpperCase()} {item.price * item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <hr />
                    <h3 className="text-xl font-semibold">Payment Details</h3>
                    <table>
                        <tbody>
                            <tr>
                                <td className="whitespace-nowrap p-3 text-lg text-slate-800">
                                    Subtotal
                                </td>
                                <td>
                                    {order.currency.toUpperCase()} {order.sub_total}
                                </td>
                            </tr>
                            <tr>
                                <td className="whitespace-nowrap p-3 text-lg text-slate-800">
                                    Tax
                                </td>
                                <td>
                                    {order.currency.toUpperCase()} {order.tax}
                                </td>
                            </tr>
                            <tr>
                                <td className="whitespace-nowrap p-3 text-lg text-slate-800">
                                    Grand Total
                                </td>
                                <td>
                                    {order.currency.toUpperCase()} {order.grand_total}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    )
}

export default OrderDetailPage
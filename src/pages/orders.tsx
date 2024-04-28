import { useEffect, useState } from "react"
import { useStoreContext } from "../context";
import Navbar from "../components/Navbar";

const OrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const { profile, loading, setLoading } = useStoreContext();

    const fetchOrders = async () => {
        setLoading(true);
        const url = `http://k8s.orb.local/api/v1/orders/?q=${profile?._id}&q_type=user`
        console.log(url)
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            setOrders(data.data as Order[]);
        } else {
            alert('Error fetching orders...');
        }
        setLoading(false);
    }

    useEffect(() => {
        if (!profile) return;
        fetchOrders();
    }, [profile]);

    return (
        <main className="w-screen h-screen">
            <Navbar />
            {loading ? (
                <div className="w-full p-4 text-center flex flex-col justify-center items-center">
                    <p>Loading Orders...</p>
                </div>
            ) : (
                <>
                    <div className="w-full p-4">
                        <div className="overflow-auto rounded-lg shadow hidden md:block">
                            <table className="table-auto w-full">
                                <thead className="bg-gray-50 border-b-2 border-gray-200">
                                    <tr>
                                        <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left">#</th>
                                        <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left">ID</th>
                                        <th className="p-3 text-sm font-semibold tracking-wide text-left">Items</th>
                                        <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">Amount</th>
                                        <th className="w-32 p-3 text-sm font-semibold tracking-wide text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {orders.map((order, idx) => (
                                        <tr key={order._id}>
                                            <td className="whitespace-nowrap p-3 text-sm text-slate-700">{idx + 1}</td>
                                            <td className="whitespace-nowrap p-3 text-sm text-slate-700">
                                                <a href={`/orders/${order._id}`} className="font-bold text-sm hover:underline text-blue-500">{order._id}</a>
                                            </td>
                                            <td className="whitespace-nowrap p-3 text-sm text-slate-700">
                                                <p className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
                                                    {/* Slice all the orders into groups of 4 */}
                                                    {order.items.map((item, idx) => (
                                                        <p key={idx} className="inline-block p-1 w-48 bg-gray-200 text-gray-800 text-xs rounded-lg bg-opacity-50 mr-1">
                                                            <span><a href={`/product/${item.product_id}`} className="hover:underline hover:text-blue-500">{item.name}</a></span> x {item.quantity}
                                                        </p>
                                                    ))}
                                                </p>
                                            </td>
                                            <td className="whitespace-nowrap p-3 text-sm text-slate-700 font-bold">{order.currency.toUpperCase()} {order.grand_total}</td>
                                            <td className="whitespace-nowrap p-3 text-sm text-slate-700">
                                                <span className={`p-1.5 text-xs font-medium uppercase tracking-wider ${order.status === "paid" ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"} rounded-lg bg-opacity-50`}>{order.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-gray-50">
                                        <td className="whitespace-nowrap p-3 text-sm text-slate-700 font-bold" colSpan={5}>
                                            <p>Total Orders: {orders.length}</p>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:hidden">
                            {orders.map(order => (
                                <div key={order._id} className="bg-white space-y-3 p-4 rounded-lg shadow">
                                    <div className="flex items-center space-x-2 text-sm">
                                        <div>
                                            <a className="font-bold text-sm hover:underline text-blue-500" href={`/order/${order._id}`}>#{order._id}</a>
                                        </div>
                                        <div>Date</div>
                                        <div>
                                            <span className={`p-1.5 text-xs font-medium uppercase tracking-wider ${order.status === "paid" ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"} rounded-lg bg-opacity-50`}>{order.status}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p>Order Items</p>
                                        <p className="text-sm space-y-1 text-slate-900">
                                            {order.items.map((item, idx) => (
                                                <span key={idx} className="inline-block p-1 w-48 bg-gray-200 text-gray-800 text-xs rounded-lg bg-opacity-50 mr-1">
                                                    <span><a href={`/product/${item.product_id}`} className="hover:underline hover:text-blue-500">{item.name}</a></span> x {item.quantity}
                                                </span>
                                            ))}
                                        </p>
                                    </div>
                                    <div className="text-sm font-medium text-slate-900">
                                        {order.currency.toUpperCase()} {order.grand_total}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </main>
    )
}

export default OrdersPage
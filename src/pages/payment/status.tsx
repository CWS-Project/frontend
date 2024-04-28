import { useNavigate, useSearchParams } from "react-router-dom"
import { TiTickOutline } from "react-icons/ti";
import { ImCross } from "react-icons/im";


const PaymentStatusPage = () => {
    const [sP, _] = useSearchParams();
    const navigate = useNavigate();

    return (
        <main className="h-screen w-screen flex flex-col items-center justify-center space-y-8">
            {sP.get("redirect_status") === "succeeded" ? (
                <div className="h-20 w-20 bg-green-500 flex items-center justify-center text-white rounded-full">
                    <TiTickOutline size={48} className="text-white" />
                </div>
            ) : (
                <div className="h-20 w-20 bg-red-500 flex items-center justify-center text-white rounded-full">
                    <ImCross size={48} className="text-white" />
                </div>
            )}
            <h1 className="text-3xl">Payment {sP.get("redirect_status") === "succeeded" ? "Succeeded" : "Failed"}</h1>
            <p className="font-light text-sm">Payment Id: {sP.get("payment_intent")}</p>
            <button className="bg-slate-800 text-gray-50 rounded-lg p-2 hover:bg-slate-600 transition-all duration-100 ease-in-out" onClick={() => navigate("/orders")}>Go to Orders</button>
        </main>
    )
}

export default PaymentStatusPage
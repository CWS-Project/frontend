import { PaymentElement } from "@stripe/react-stripe-js"
import { SyntheticEvent, useState } from "react"
import { useStripe, useElements } from "@stripe/react-stripe-js";

const CheckoutForm = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState<string>("");
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/payment/status`
            }
        })

        if (error) {
            console.error(error);
            setMessage(error.message as string);

        }

        setIsProcessing(false);
        localStorage.removeItem("cart");
    }


    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement />
            <button className="mt-3 w-full p-3 rounded-xl bg-slate-600 hover:bg-slate-800 text-gray-50 transition-all duration-100 ease-in-out" id="submit" disabled={isProcessing}>
                <span id="button-text">
                    {isProcessing ? "Processing" : "Pay Now"}
                </span>
            </button>

            {message && (
                <div id="payment-message">{message}</div>
            )}
        </form>
    )
}

export default CheckoutForm
import { useEffect, useState } from "react";
import CartItem from "../components/CartItem";
import Navbar from "../components/Navbar";
import { useStoreContext } from "../context"
import { useLocation, useNavigate } from "react-router-dom";
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from "../components/CheckoutForm";

const CartPage = () => {
    const { authenticated, profile, cart, loading, setLoading } = useStoreContext();
    const stripePromise = loadStripe('pk_test_51P8i19SJ0mjuUqeVRTGBUgxyIuUmT3uK92KV6tmDH91yr9M3WBUe1lQ0cwbGNqn2QiolJm1YzXk99L0Z3suhGloU00AZlAllrO');
    const [clientSecret, setClientSecret] = useState("");
    const [cartTotal, setCartTotal] = useState(0);
    const [tax, setTax] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Triggering CartPage useEffect");
        setLoading(true);
        
        const subTotal = Math.round((cart.reduce((acc, item) => acc + (item.price * item.quantity), 0) + Number.EPSILON)*100) / 100;
        const taxAmt = Math.round(((subTotal*0.18) + Number.EPSILON)*100) / 100;
        setCartTotal(_ => subTotal);
        setTax(_ => taxAmt);
        if (!authenticated || profile) {
            setLoading(false);
        }
    }, [cart, profile, location])

    const proceedToCheckout = async () => {
        if (authenticated) {
            await Promise.all(cart.map(async (item) => {
                console.log(`Adding ${item.product_id} to ss-cart...`);
                const response = await fetch(`http://k8s.orb.local/api/v1/customer/cart/${profile?._id}`, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({product_id: item.product_id, quantity: item.quantity})
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log("SS Cart updation data", data);
                } else {
                    alert('Error adding creating order...');
                    return;
                }
            }));

            //  Place order
            console.log("Placing Order...");
            const repsonse = await fetch('http://k8s.orb.local/api/v1/orders/', {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({user_id: profile?._id})
            })

            if (repsonse.ok) {
                // Take Payment
                const data = await repsonse.json();
                console.log("Order created", data);

                const paymentResp = await fetch(`http://k8s.orb.local/api/v1/payments/intent/${data.data.payment_id}`)
                const clientSecretResp = await paymentResp.json();
                console.log("Client Secret", clientSecretResp.data.client_secret);
                setClientSecret(clientSecretResp.data.client_secret);

                // localStorage.removeItem('cart');
            } else {
                alert('Error creating order');
            }

        } else {
            navigate("/login");
        }
    }


    return (
        <div className="h-screen w-screen">
            <Navbar />

            {loading ? (
                <div className="flex items-center justify-center">
                    <p>Loading...</p>
                </div>
            ) : cart.length === 0 ? (
                <div className="flex items-center justify-center">
                    <p>No items in cart, go shopping :)</p>
                </div>
            ) : (
                <div className="flex flex-col md:flex-row">
                    <div className="flex-[0.7] p-3 h-full">
                        <h3 className="text-3xl">Cart Items</h3>
                        <hr />
                        <div className="mt-4 space-y-3">
                            {cart.map((cartItem, i) => (
                                <CartItem key={i} item={cartItem} />
                            ))}
                        </div>
                    </div>
                    <div className="bg-gray-100 p-3 flex-[0.3] h-full">
                        <h3 className="text-3xl">Order Summary</h3>
                        <hr />
                        <div className="mt-4 space-y-3">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>INR {cartTotal}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="italic">Tax (GST 18%)</span>
                                <span className="italic">INR {tax}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-bold">Total</span>
                                <span className="font-bold">INR {Math.round((cartTotal + tax + Number.EPSILON) * 100) / 100}</span>
                            </div>
                            {!clientSecret ? (
                                <button onClick={proceedToCheckout} className="w-full p-3 rounded-xl bg-slate-600 hover:bg-slate-800 text-gray-50 transition-all duration-100 ease-in-out">
                                {authenticated ? "Proceed to Checkout" : "Login to Checkout"}
                            </button>
                            ) : (
                                <Elements stripe={stripePromise} options={{
                                    clientSecret: clientSecret as string,
                                }}>
                                    <CheckoutForm />
                                </Elements>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CartPage
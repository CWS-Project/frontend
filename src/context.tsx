import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type StoreContextType = {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
    cart: Cart[];
    addToCart: (product: Product, quantity?: number) => Promise<void>;
    removeFromCart: (product_id: string) => Promise<void>;
    authenticated: boolean;
    setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    numCartItems: number;
    profile: Profile | null;
    logout: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
    const [authenticated, setAuthenticated] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<Cart[]>([]);
    const [numCartItems, setNumCartItems] = useState(0);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<Profile | null>(null);

    const navigate = useNavigate();

    const refreshSession = async () => {
        const access_token = localStorage.getItem("access_token");
        const refresh_token = localStorage.getItem("refresh_token");

        if (!access_token || !refresh_token) {
            setAuthenticated(false);
            return navigate("/login");
        }

        const body = { refresh_token }
        const response = await fetch("http://k8s.orb.local/api/v1/auth/refresh", {
            headers: {
                "Authorization": `Bearer ${access_token}`,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(body)
        })

        if (!response.ok) {
            setAuthenticated(false);
            return navigate("/login");
        } else {
            console.log("Session Refreshed")
            const data = await response.json();
            localStorage.setItem("access_token", data.data.access_token);
            localStorage.setItem("refresh_token", data.data.refresh_token);
            localStorage.setItem("expires_at", JSON.stringify(new Date().getTime() + 60 * 60 * 1000));
            setAuthenticated(true);
            return navigate("/");
        }
    }

    const addToCart = async (product: Product, quantity?: number) => {
        console.log(quantity);
        let qty = 1;
        if (quantity) {
            qty = quantity;
        }
        const ssCartResponse = await fetch(`http://k8s.orb.local/api/v1/customer/cart/${profile?._id}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ product_id: product._id, quantity: qty })
        })
        const ssCartData = await ssCartResponse.json();
        if (!ssCartResponse.ok) {
            console.log(ssCartData);
            return alert("Error adding to cart...");
        }
        // Add to localstorage
        const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

        // Check if product already exists in cart
        const existingProduct = existingCart.find((p: Cart) => p.product_id === product._id);
        if (existingProduct) {
            const updatedCart = existingCart.map((p: Cart) => {
                if (p.product_id === product._id) {
                    return { ...p, quantity: p.quantity + qty, timestamp: new Date().getTime(), name: product.name, price: product.price, main_image: product?.images[0] };
                }
                return p;
            });
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            return setCart(updatedCart);
        }

        const newCart = [...existingCart, { product_id: product._id, quantity: 1, timestamp: new Date().getTime(), name: product.name, price: product.price, main_image: product?.images[0] }]
        localStorage.setItem("cart", JSON.stringify(newCart));
        console.log(newCart);
        setCart(newCart);   
    }

    const removeFromCart = async (product_id: string) => {
        const ssCartResponse = await fetch(`http://k8s.orb.local/api/v1/customer/cart/${profile?._id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ product_id })
        })
        const ssCartData = await ssCartResponse.json();
        if (!ssCartResponse.ok) {
            console.log(ssCartData);
            return alert("Error removing from cart...");
        }
        const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const updatedCart = existingCart.filter((p: Cart) => p.product_id !== product_id);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return setCart(updatedCart);
    }

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("expires_at");
        setAuthenticated(false);
        return navigate("/login");
    }

    useEffect(() => {
        console.log("StoreProvider useEffect triggered");

        if (localStorage.getItem("access_token") && localStorage.getItem("refresh_token")) {
            ; (async () => {
                const expired = JSON.parse(localStorage.getItem("expires_at") || "0");
                if (new Date().getTime() > expired) {
                    console.log("Session Expired, Refreshing...")
                    await refreshSession();
                    return navigate(0);
                }
                const response = await fetch("http://k8s.orb.local/api/v1/auth/me/", {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("access_token")}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    const user = data.data;
                    setAuthenticated(true);

                    setProfile({
                        _id: user._id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        phone: user.phone,
                        address: user.address,
                        created_at: user.created_at
                    });
                }
            })();
        }

        const fetchProducts = async () => {
            const response = await fetch("http://k8s.orb.local/api/v1/products/listing/");
            const data = await response.json();
            setProducts(data.data as Product[]);
            setLoading(false);
        }
            ; (async () => {
                fetchProducts();
            })();

            setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
    }, []);

    useEffect(() => {
        setNumCartItems(_ => cart.length);
    }, [cart]);

    return (
        <StoreContext.Provider value={{
            loading,
            setLoading,
            products,
            setProducts,
            cart,
            addToCart,
            removeFromCart,
            authenticated,
            setAuthenticated,
            numCartItems,
            profile,
            logout
        }}>
            {children}
        </StoreContext.Provider>
    )
}

export const useStoreContext = () => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error("useStoreContext must be used within a StoreProvider");
    }
    return context;
}

export default StoreProvider;
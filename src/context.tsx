import { createContext, useContext, useState, useEffect } from "react";

type StoreContextType = {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
    cart: Cart[];
    addToCart: (product: Product) => void;
    removeFromCart: (product: Product) => void;
    authenticated: boolean;
    setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    numCartItems: number;
    profile: Profile | null;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
    const [authenticated, setAuthenticated] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<Cart[]>([]);
    const [numCartItems, setNumCartItems] = useState(0);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<Profile | null>(null);

    let lastCartUpdate: Date | never;

    const addToCart = (product: Product) => {
        // Add to localstorage
        const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");

        // Check if product already exists in cart
        const existingProduct = existingCart.find((p: Cart) => p.product_id === product._id);
        if (existingProduct) {
            const updatedCart = existingCart.map((p: Cart) => {
                if (p.product_id === product._id) {
                    return { ...p, quantity: p.quantity + 1, timestamp: new Date().getTime(), name: product.name, price: product.price, main_image: product?.images[0] };
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

    const removeFromCart = (product: Product) => {
        const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existingProduct = existingCart.find((p: Cart) => p.product_id === product._id);
        if (existingProduct) {
            const updatedCart = existingCart.map((p: Cart) => {
                if (p.product_id === product._id) {
                    return { ...p, quantity: p.quantity - 1, timestamp: new Date().getTime(), name: product.name, price: product.price, main_image: product?.images[0] };
                }
                return p;
            }).filter((p: Cart) => p.quantity > 0);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            return setCart(updatedCart);
        }
    }

    useEffect(() => {
        // let cartPushInterval;

        console.log("StoreProvider useEffect triggered");

        // cartPushInterval = setTimeout(() => {
        //     console.log("Triggered Timeout every 10s");
        //     if (!authenticated) return;
        //     if (cart.length === 0) return;
        //     cart.forEach(async (cartItem) => {
        //         if (cartItem.timestamp > lastCartUpdate.getTime()) {
        //             const response = await fetch("http://k8s.orb.local/api/v1/customer/cart/${profile._id}/", {
        //                 method: "POST",
        //                 headers: {
        //                     "Content-Type": "application/json"
        //                 },
        //                 body: JSON.stringify(cartItem)
        //             });
        //             const data = await response.json();
        //             console.log(data);
        //         }
        //     })
        //     lastCartUpdate = new Date();
        // }, 10000);

        if (localStorage.getItem("access_token") && localStorage.getItem("refresh_token")) {
            setAuthenticated(true);
            ; (async () => {
                const response = await fetch("http://k8s.orb.local/api/v1/auth/me/", {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("access_token")}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    const user = data.data;

                    setProfile({
                        _id: user._id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        phone: user.phone,
                        address: user.address
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
        return () => {
            // if (cartPushInterval) {
            //     clearInterval(cartPushInterval);
            // }
        }
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
            profile
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
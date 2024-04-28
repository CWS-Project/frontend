type Product = {
    _id: string;
    name: string;
    price: number;
    images: string[];
    description: string;
    category: string;
}

type Cart = {
    product_id: string;
    quantity: number;
    name: string;
    price: number;
    timestamp: number;
    main_image: string;
}

type Address = {
    line1: string;
    line2?: string;
    city: string;
    district: string;
    state: string;
    postal_code: string;
    country: string;
}

type Profile = {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string
    address: Address;
    created_at: string;
}

type OrderItem = {
    product_id: string;
    quantity: number;
    price: number;
    name: string;
}

type Order = {
    _id: string;
    user_id: string;
    items: OrderItem[];
    sub_total: number;
    tax: number;
    grand_total: number;
    currency: string;
    status: string;
    payment_id: string;
}
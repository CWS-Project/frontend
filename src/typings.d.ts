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
}
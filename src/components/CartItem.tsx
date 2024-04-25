import { MdDelete } from "react-icons/md";


type Props = {
    item: Cart
}

const CartItem = ({ item }: Props) => {
    return (
        <div className='flex items-start justify-between border-b pb-1'>
            <div className="flex items-start space-x-2">
                <img src={item.main_image} className='h-48 w-48 rounded-lg' />
                <div>
                    <h5 className='text-xl font-bold'>{item.name}</h5>
                    <p>Price: INR {item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                </div>
            </div>
            <button className="p-2 rounded-xl bg-red-700 hover:bg-red-800">
                <MdDelete size={20} className="text-white" />
            </button>
        </div>
    )
}

export default CartItem
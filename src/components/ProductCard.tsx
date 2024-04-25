import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useStoreContext } from '../context';

type Props = {
    product: Product;
}

const responsive = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 3000 },
        items: 1
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 1
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 1
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1
    }
};

const ProductCard = ({ product }: Props) => {
    const {addToCart} = useStoreContext();

    return (
        <div className='bg-gray-100 rounded-xl p-2 space-y-3'>
            <Carousel className='rounded-xl h-80 w-full' responsive={responsive}>
                {product.images.map((imgUrl, i) => (
                    <img key={i} src={imgUrl} className='object-cover' />
                ))}
            </Carousel>

            <h5 className='text-xl font-bold'>{product.name}</h5>
            <p>{product.description.substring(0, 40)}...</p>
            <p className='font-bold italic'>INR {product.price}</p>
            <div className='flex items-center justify-between'>
                <button className='p-3 rounded-xl bg-slate-600 hover:bg-slate-800 text-gray-50 transition-all duration-100 ease-in-out' onClick={() => {addToCart(product)}}>Add to Cart</button>
                <a href={`/product/${product._id}`} className='p-3 rounded-xl bg-yellow-600 hover:bg-yellow-800 text-gray-50 transition-all duration-100 ease-in-out'>More Info</a>
            </div>
        </div>
    )
}

export default ProductCard
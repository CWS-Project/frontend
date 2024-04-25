import ProductCard from "./ProductCard";

type Props = {
    products: Product[];
}

const Listing = ({products}: Props) => {
  return (
    <div className="p-4 grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
            <ProductCard key={product._id} product={product} />
        ))}
    </div>
  )
}

export default Listing
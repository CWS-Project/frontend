import { useParams } from "react-router-dom"
import { useStoreContext } from "../../context";
import { useEffect, useState } from "react";
import ImageViewer from "../../components/ImageViewer";
import Navbar from "../../components/Navbar";

const ProductInfoPage = () => {
  const params = useParams();
  const { loading, setLoading, addToCart } = useStoreContext();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  console.log(params.id);

  const fetchProductDetail = async () => {
    if (!params.id) return;
    setLoading(true);
    const response = await fetch(`http://k8s.orb.local/api/v1/products/${params.id}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('access_token')}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      setProduct(data.data as Product);
    } else {
      alert('Error fetching product details...');
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchProductDetail();
  }, [])
  return (
    <main className="w-screen h-screen">
      <Navbar />
      {(loading || !product) ? (
        <p>Loading Product...</p>
      ) : (
        <section className="mt-4 flex flex-col md:flex-row items-start justify-center space-x-40">
          {/* Images */}
          {product?.images && <ImageViewer images={product?.images} />}
          {/* Product Details */}
          <div className="">
            <h2 className="text-3xl font-bold">{product?.name}</h2>
            <p className="text-lg text-gray-500">{product?.description}</p>
            <p className="text-lg font-semibold text-slate-700">INR {product?.price}</p>

            <hr className="my-4" />
            <p>Quantity</p>
            <input type="number" min={0} max={100} value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} className="rounded-lg p-2 shadow-md" />
            <button disabled={quantity === 0} onClick={async () => await addToCart(product, quantity)} className="ml-2 bg-slate-800 rounded-lg p-2 text-gray-50">Add to Cart</button>
          </div>
        </section>
      )}
    </main>
  )
}

export default ProductInfoPage
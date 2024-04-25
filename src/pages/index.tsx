import { useEffect } from "react";
import Navbar from "../components/Navbar"
import { useLocation } from 'react-router-dom'
import { useStoreContext } from "../context";
import Listing from "../components/Listing";

const IndexPage = () => {
  const location = useLocation();
  const { products, loading } = useStoreContext();

  useEffect(() => {
  }, [location]);

  return (
    <main className="flex flex-col w-screen h-screen">
      <Navbar />
      {/* Product Listing */}
      {loading ? (
        <p>Loading....</p>
      ) : (
        <Listing products={products} />
      )}
    </main>
  )
}

export default IndexPage
import { FaCartShopping } from "react-icons/fa6";
import { IoMdSearch } from "react-icons/io";
import { useStoreContext } from "../context";

const Navbar = () => {
    const search = async () => {}
    const {authenticated, numCartItems, logout} = useStoreContext();

  return (
    <nav className="flex items-center justify-between w-screen p-4 bg-slate-800 text-gray-50">
        {/* Name of Store */}
        <a href="/">
            <span className="text-xl font-bold">eCommerce Store</span>
        </a>

        {/* Search Box */}
        <div className="flex flex-[0.3] items-center justify-between bg-gray-50 rounded-xl">
            <input type="text" className="rounded-xl w-full text-slate-800 focus:outline-none px-2 py-2" placeholder="Search..." />
            <button onClick={search}>
                <IoMdSearch size={20} className="text-slate-800" />
            </button>
        </div>

        {/* User Profile / Login, Signup button */}
        <div className="flex gap-4">
        {authenticated ? (
            <>
            <a href="/profile">
                <span>Profile</span>
            </a>
            <a href="/orders">
                <span>Orders</span>
            </a>
            <button onClick={logout}>
                <span>Logout</span>
            </button>
            </>
        ) : (
            <>
                <a href="/login">
                    <span>Login</span>
                </a>
                <a href="/register">
                    <span>Register</span>
                </a>
            </>
        )}
        
        {/* Cart */}
        <a href="/cart" className="flex items-center gap-2">
            <span>Cart <span>({numCartItems})</span></span>
            <FaCartShopping />
        </a>
        </div>
    </nav>
  )
}

export default Navbar
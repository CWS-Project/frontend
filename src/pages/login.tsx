import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useStoreContext } from "../context";

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();
    const {authenticated, setAuthenticated} = useStoreContext();

    const login = async () => {
        if (!email || !password) return alert('Please fill in all fields');
        // Check email validation
        if (!email.includes('@')) return alert('Invalid email address');
        // Check password length
        if (password.length < 6) return alert('Password must be at least 6 characters long');

        // Login
        console.log('Logging in with email:', email, 'and password:', password);
        const response = await fetch('http://k8s.orb.local/api/v1/auth/token', {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${btoa(`${email}:${password}`)}`
            }
        })

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('access_token', data.data.access_token);
            localStorage.setItem('refresh_token', data.data.refresh_token);
            setAuthenticated(true);
            navigate("/");
        } else {
            alert('Invalid email or password');
            return;
        }
    }

    useEffect(() => {
        if (authenticated) {
            navigate("/");
        }
    }, [])

  return (
    <main className="h-screen w-screen flex space-y-8 flex-col items-center justify-center">
        <h2 className="text-3xl font-bold">Sign in to your eCommerce Account</h2>
        <div className="flex flex-col gap-3 w-96">
            <div className="flex flex-col w-full space-y-1">
                <label htmlFor="email">Email</label>
                <input className="rounded-lg p-2 shadow-md" placeholder="someone@example.com" onChange={(e) => setEmail(e.target.value)} type="email" id="email" name="email" />
            </div>
            <div className="flex flex-col w-full space-y-1">
                <label htmlFor="password">Password</label>
                <input className="rounded-lg p-2 shadow-md" placeholder="Password" onChange={(e) => setPassword(e.target.value)} type="password" id="password" name="password" />
            </div>

            <button onClick={login} className="mt-3 bg-slate-800 rounded-lg p-3 text-gray-50">Sign in</button>
            <p className="text-center text-sm text-gray-500">Not a Member? <a href="/signup" className="hover:underline text-slate-800">Register Now.</a></p>
        </div>
    </main>
  )
}

export default LoginPage
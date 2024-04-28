import { useState } from "react";
import Navbar from "../components/Navbar";
import { useStoreContext } from "../context"
import { FaHome } from "react-icons/fa";
import { TbPassword } from "react-icons/tb";



const ProfilePage = () => {
    const { profile, logout } = useStoreContext();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [processing, setProcessing] = useState(false);

    const changePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) return alert('Please fill in all fields');
        if (newPassword !== confirmPassword) return alert('Passwords do not match');
        if (newPassword.length < 6) return alert('Password must be at least 6 characters long');

        // Change Password
        setProcessing(true);
        console.log('Changing password');
        const response = await fetch('http://k8s.orb.local/api/v1/auth/me', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`
            },
            body: JSON.stringify({
                old_password: oldPassword,
                new_password: newPassword
            })
        })

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            setProcessing(false);
            alert('Password changed successfully, logging out...');
            logout();
        } else {
            alert('Password change failed');
            return;
        }
    }

    return (
        <main className="h-screen w-screen">
            <Navbar />
            <div className="mt-4 p-4">
                <h1 className="text-3xl mb-1">My Profile</h1>
                <hr />
                <div className="flex justify-around space-y-3 md:space-y-0 mt-4 md:space-x-8 flex-col md:flex-row">
                    <div className="bg-white p-2 rounded-lg flex flex-col space-y-2">
                        <div className="flex items-center space-x-4">
                            <img src={`https://api.dicebear.com/8.x/initials/svg?seed=${profile?.first_name}%20${profile?.last_name}`} className="h-20 w-20 rounded-full object-contain" />
                            <h3 className="text-xl">{profile?.first_name} {profile?.last_name}</h3>
                        </div>

                        <p>Email: {profile?.email}</p>
                        <p>Phone: {profile?.phone}</p>
                    </div>
                    <div className="w-1 bg-gray-100 border border-gray-100"></div>
                    <div className="bg-white p-2 flex flex-col rounded-lg space-y-3">
                        <div className="flex items-center space-x-4">
                            <div className="bg-slate-800 rounded-full h-20 w-20 flex justify-center items-center p-3 text-gray-50">
                                <FaHome size={48} />
                            </div>
                            <h3 className="text-xl">Address</h3>
                        </div>

                        <div className="">
                            <p>{profile?.address.line1},</p>
                            <p>{profile?.address?.line2 ? profile.address.line2 + "," : ""}</p>
                            <p>{profile?.address.city},</p>
                            <p>{profile?.address.state},</p>
                            <p>{profile?.address?.district},</p>
                            <p className="font-bold">{profile?.address.country}</p>
                            <p className="font-semibold">Postal Code: {profile?.address.postal_code}</p>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="bg-white p-2 flex items-center justify-normal w-full rounded-lg space-y-3">
                        <div className="flex-[0.4] flex items-center space-x-4">
                            <div className="bg-blue-800 rounded-full h-20 w-20 flex justify-center items-center p-3 text-gray-50">
                                <TbPassword size={48} />
                            </div>
                            <h3 className="text-xl">Change Password</h3>
                        </div>

                        <div className="flex-[0.6] w-full flex flex-col space-y-4">
                                <div className="flex flex-col w-full space-y-1">
                                    <label htmlFor="old-password">Current Password</label>
                                    <input className="rounded-lg p-2 shadow-md" placeholder="Password" onChange={(e) => setOldPassword(e.target.value)} type="password" id="old-password" name="old-password" />
                                </div>
                                <div className="flex flex-col w-full space-y-1">
                                    <label htmlFor="new-password">New Password</label>
                                    <input className="rounded-lg p-2 shadow-md" placeholder="Password" onChange={(e) => setNewPassword(e.target.value)} type="password" id="new-password" name="new-password" />
                                </div>
                                <div className="flex flex-col w-full space-y-1">
                                    <label htmlFor="c-password">Confirm Password</label>
                                    <input className="rounded-lg p-2 shadow-md" placeholder="Password" onChange={(e) => setConfirmPassword(e.target.value)} type="password" id="c-password" name="c-password" />
                                </div>
                                <button disabled={processing} onClick={changePassword} className="bg-blue-800 hover:bg-blue-600 transition-all duration-100 ease-in-out text-gray-50 p-2 rounded-lg">Change Password</button>
                        </div>
                    </div>
            </div>
        </main>
    )
}

export default ProfilePage
import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { allContext } from '../pages/Allcontext'
import { toast, ToastContainer } from 'react-toastify'

const Header = () => {
    const navigate = useNavigate()
    const token = JSON.parse(localStorage.getItem("token"))
    const handleRemove = () => {
        localStorage.removeItem("token")
        toast.success("Logout successfully 🥳", {
            onClose: () => {
                navigate("/signin");
            }
        });
    }
    return (
        <div>
            <ToastContainer />
            <header className="bg-white shadow-md px-6 py-4 flex items-center justify-between">

                <div className="text-xl font-bold text-blue-600">
                    <Link to="/">Logo</Link>
                </div>
                <nav className="flex gap-4 text-gray-700 font-medium">
                    {!token && (
                        <>
                            <Link to="/signin" className="hover:text-blue-500 transition">Sign In</Link>
                            <Link to="/signup" className="hover:text-blue-500 transition">Sign Up</Link>
                        </>
                    )}
                    {token && (
                        <>
                            <Link to="/contact" className="hover:text-blue-500 transition">Contact List</Link>
                            <Link to="/create" className="hover:text-blue-500 transition">Create List</Link>
                            <div className="hover:text-blue-500 transition" onClick={handleRemove}>Logout</div>
                        </>
                    )}

                </nav>
            </header>
        </div>
    )
}

export default Header
import axios from 'axios'
import React, { useContext } from 'react'
import { useState } from 'react'
import { allContext } from './Allcontext'
import { useNavigate } from 'react-router-dom'
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS

const Signin = () => {
    const { success, setSuccess, setId } = useContext(allContext)
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [token, settoken] = useState("")
    const navigate = useNavigate()
    const handleSubmit = (e) => {
        e.preventDefault()
        let obj = {
            email,
            password
        }
        axios.post("http://localhost:8080/user/signin", obj, {
            withCredentials: true
        })
            .then((res) => {
                console.log(res.data.success)
                if (res.data.success == true) {
                    toast.success(res.data.message, {
                        autoClose: 2000,
                        onClose: () => {
                            navigate("/contact")
                        }
                    });
                } else {
                    toast.error(res.data.message, {
                        autoClose: 2000,
                    });
                }

                settoken(res.data.token);
                setId(res.data.data._id);
                setSuccess(res.data.success);

                localStorage.setItem("token", JSON.stringify(res.data.token));
                localStorage.setItem("id", JSON.stringify(res.data.data._id));
            })
            .catch((err) => console.log(err))

    }
    return (
        <div>
            <ToastContainer />
            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
                <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign In</h2>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block mb-1 font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => setemail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block mb-1 font-medium">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => setpassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signin
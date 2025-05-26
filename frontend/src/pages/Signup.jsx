import axios from 'axios'
import React, { useContext } from 'react'
import { useState } from 'react'
import { allContext } from './Allcontext'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'

const Signup = () => {
    const navigate = useNavigate()
    const { success, setSuccess, token, setToken, id, setId } = useContext(allContext)
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [conformPassword, setconformPassword] = useState("")
    const handleSubmit = (e) => {
        e.preventDefault()
        let obj = {
            email,
            password,
            conformPassword
        }
        axios.post("http://localhost:8080/user/signup", obj)
            .then((res) => {
                if (res.data.success == true) {
                    toast.success(res.data.message, {
                        onClose: () => {
                            navigate("/contact");
                        }
                    })
                }
                setSuccess(res.data?.success);
                setId(res.data?.data?._id);
                // Now auto-sign in the user
                axios.post("http://localhost:8080/user/signin", { email, password }, { withCredentials: true })
                    .then((loginRes) => {
                        setToken(loginRes.data.token);
                        setId(loginRes.data.data._id);
                        setSuccess(loginRes.data.success);
                        localStorage.setItem("token", JSON.stringify(loginRes.data.token));
                        localStorage.setItem("id", JSON.stringify(loginRes.data.data._id));
                    })
                    .catch((err) => console.log("Auto-signin error:", err));
            })
            .catch((err) => {
                console.log(err.response.data)
                if (err.response.data.success == false) {
                    toast.error(err.response.data.message)
                }
            })

    }
    // useEffect(() => {
    // }, [])
    return (
        <div>
            <ToastContainer />
            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
                <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
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

                        <div>
                            <label htmlFor="confirmPassword" className="block mb-1 font-medium">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => setconformPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                        >
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup
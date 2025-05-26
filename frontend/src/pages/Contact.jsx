import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dropzone, FileMosaic } from "@files-ui/react";
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { toast, ToastContainer } from "react-toastify";

const Contact = () => {
    const MySwal = withReactContent(Swal)
    const defaultImage = "../../public/dp.jpg";

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm();

    const [files, setFiles] = useState([]);
    const [view, setView] = useState(false);
    const [data, setData] = useState([]);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [imageRemoved, setImageRemoved] = useState(false);


    const id = JSON.parse(localStorage.getItem("id"));
    const navigate = useNavigate();

    const showData = () => {
        axios
            .get(`http://localhost:8080/contact/all/${id}`)
            .then((res) => setData(res?.data?.data || []))
            .catch((err) => console.log(err));
    };

    const handleDelete = async (contactId) => {

        let result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });
        if (!result.isConfirmed) return
        axios
            .delete(`http://localhost:8080/contact/delete/${contactId}`)
            .then((res) => {
                showData(res.data)
                if (res.data.success == true) {
                    toast.success(res.data.message, {
                        autoClose: 1000
                    })
                }
            })
            .catch((err) => console.log(err));
    };

    const handleUpdate = (userId) => {
        const user = data.find((u) => u._id === userId);
        if (user) {
            setSelectedUser(user);
            setValue("email", user.email);
            setValue("name", user.name);
            setValue("number", user.number);
            setFiles([]); // Reset files array for new upload
            setPreviewImage(`http://localhost:8080/photos/${user.image}`); // Existing image preview
            setShowUpdateForm(true);
        }
    };

    const updateFiles = (incomingFiles) => {
        setFiles(incomingFiles);
        if (incomingFiles.length > 0) {
            setValue("image", incomingFiles[0].file);
            const filePreviewUrl = URL.createObjectURL(incomingFiles[0].file);
            setPreviewImage(filePreviewUrl);
            setImageRemoved(false);  // Image exists, so not removed
        } else {
            setValue("image", null);
            setPreviewImage(null);
            setImageRemoved(true);  // User removed the image
        }
    };

    const onSubmit = (formData) => {
        if (!selectedUser) return;

        const updateFormData = new FormData();
        updateFormData.append("email", formData.email);
        updateFormData.append("name", formData.name);
        updateFormData.append("number", formData.number);
        if (formData.image) {
            updateFormData.append("image", formData.image);
        }

        // Send removeImage flag as string (since FormData only supports strings or blobs)
        updateFormData.append("removeImage", imageRemoved ? "true" : "false");


        axios
            .patch(`http://localhost:8080/contact/update/${selectedUser._id}`, updateFormData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((res) => {
                if (res.data.success == true) {
                    toast.success(res.data.message, {
                        autoClose: 1000
                    })
                }
                showData();
                reset();
                setFiles([]);
                setSelectedUser(null);
                setShowUpdateForm(false);
                setPreviewImage(null);
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        showData();
    }, [id]);

    return (
        <div className="p-4 max-w-screen-xl mx-auto">
            <ToastContainer />
            {/* Toggle View Button */}
            <div className="mb-4 text-center">
                <button
                    onClick={() => setView(!view)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                >
                    {view ? "Normal View" : "Table View"}
                </button>
            </div>

            {/* Table or Card View */}
            {view ? (
                <div className="overflow-x-auto rounded border border-gray-200">
                    <table className="w-full min-w-[600px] text-sm text-left text-gray-700 border-collapse">
                        <thead className="text-xs uppercase bg-gray-100 text-gray-600 sticky top-0">
                            <tr>
                                <th className="px-4 py-2">Image</th>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Email</th>
                                <th className="px-4 py-2">Number</th>
                                <th className="px-4 py-2">User ID</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((user, idx) => (
                                <tr key={idx} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-2">
                                        <img
                                            src={user.image ? `http://localhost:8080/photos/${user.image}` : defaultImage}
                                            alt={user.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    </td>
                                    <td className="px-4 py-2 truncate max-w-[100px]" title={user.name}>{user.name}</td>
                                    <td className="px-4 py-2 truncate max-w-[150px]" title={user.email}>{user.email}</td>
                                    <td className="px-4 py-2">{user.number}</td>
                                    <td className="px-4 py-2 truncate max-w-[120px]" title={user.userId}>{user.userId}</td>
                                    <td className="px-4 py-2 space-x-2 whitespace-nowrap">
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                            onClick={() => handleDelete(user._id)}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                            onClick={() => handleUpdate(user._id)}
                                        >
                                            Update
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {data.map((user, idx) => (
                        <div key={idx} className="bg-white shadow-md rounded-xl border border-gray-200 p-6 flex flex-col items-center">
                            <img
                                src={user.image ? `http://localhost:8080/photos/${user.image}` : defaultImage}
                                alt={user.name}
                                className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
                            />
                            <div className="text-center mt-4 w-full">
                                <h2 className="text-lg font-bold text-gray-800 truncate">{user.name}</h2>
                                <p className="text-sm text-gray-600 mt-1 truncate">{user.email}</p>
                                <p className="text-xs text-gray-400 mt-1 truncate">User ID: {user.userId}</p>
                                {user.number && <p className="text-xs text-gray-400 mt-1 truncate">Number: {user.number}</p>}
                            </div>
                            <div className="mt-4 flex justify-center space-x-4 w-full">
                                <button
                                    className="bg-red-500 text-white px-4 py-1 rounded-full text-sm hover:bg-red-600 transition flex-1"
                                    onClick={() => handleDelete(user._id)}
                                >
                                    Delete
                                </button>
                                <button
                                    className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm hover:bg-blue-600 transition flex-1"
                                    onClick={() => handleUpdate(user._id)}
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Update Modal */}
            {showUpdateForm && (
                <div className="fixed inset-0 bg-blur-10 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md relative max-h-[90vh] overflow-y-auto">
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-3xl leading-none"
                            onClick={() => {
                                setShowUpdateForm(false);
                                setSelectedUser(null);
                                reset();
                                setFiles([]);
                                setPreviewImage(null);
                            }}
                            aria-label="Close update form"
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-semibold mb-4 text-center">Update Contact</h2>
                        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label className="block mb-1 font-medium">Image</label>
                                <Dropzone
                                    onChange={updateFiles}
                                    maxFiles={1}
                                    maxFileSize={5000000}
                                    accept=".png,.jpg,.jpeg,.gif,.svg"
                                    maxWidth={300}
                                    maxHeight={300}
                                >
                                    {previewImage ? (
                                        <img
                                            src={previewImage || defaultImage}
                                            // alt="No Image"
                                            className="w-28 h-28 object-cover rounded-full mx-auto mb-2"
                                        />
                                    ) : (
                                        <p className="text-center text-gray-400 mb-2">Click or drag to upload image</p>
                                    )}
                                    {/* <FileMosaic files={files} /> */}
                                </Dropzone>
                            </div>
                            <div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    {...register("email", { required: "Email is required" })}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring ${errors.email ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    {...register("name", { required: "Name is required" })}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring ${errors.name ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
                            </div>
                            <div>
                                <input
                                    type="number"
                                    placeholder="Number"
                                    {...register("number", { required: "Number is required" })}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring ${errors.number ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors.number && <p className="text-red-600 text-sm mt-1">{errors.number.message}</p>}
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
                                >
                                    Update Contact
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Contact;

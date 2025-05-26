import { Dropzone, FileMosaic } from '@files-ui/react';
import axios from 'axios';
import React, { useContext, useState } from 'react';
import { allContext } from './Allcontext';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';

const Create = () => {
    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm();
    const navigate = useNavigate();
    const { setId } = useContext(allContext);

    const [files, setFiles] = useState([]);
    const [fileError, setFileError] = useState("");

    const updateFiles = (incomingFiles) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/jpg'];

        if (incomingFiles.length > 0) {
            const file = incomingFiles[0].file;

            if (allowedTypes.includes(file.type)) {
                setFiles(incomingFiles);
                setValue("image", file);
                setFileError("");
            } else {
                setFiles([]);
                setValue("image", null);
                setFileError("Only .jpg, .jpeg, .png, .svg files are allowed.");
            }
        } else {
            setFiles([]);
            setValue("image", null);
            setFileError("");
        }
    };

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("email", data.email);
        formData.append("name", data.name);
        formData.append("number", data.number);
        if (data.image) {
            formData.append("image", data.image);
        }

        axios.post("http://localhost:8080/contact/create", formData, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then((res) => {
                if (res.data.success == true) {
                    toast.success(res.data.message, {
                        autoClose: 2000,
                        onClose: () => {
                            navigate("/contact");
                        }
                    })
                } else {
                    toast.warning(res.data.message)
                }
                setId(res.data?.data?.userId);
                reset();
                setFiles([]);
                setFileError("");
            })
            .catch((err) => console.log(err));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <ToastContainer />
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Update Contact</h2>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label className="block mb-1 font-medium">Image</label>
                        <Dropzone
                            onChange={updateFiles}
                            value={files}
                            maxFiles={1}
                            accept=".jpg,.jpeg,.png,.svg"
                            maxFileSize={1024 * 1024}
                        >
                            {files.map((file) => (
                                <FileMosaic key={file.id} {...file} preview />
                            ))}
                        </Dropzone>
                        {fileError && <p className="text-red-500 text-sm mt-1">{fileError}</p>}
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Email</label>
                        <input
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.(com)$/,
                                    message: "Enter a valid email ending with .com",
                                },
                            })}
                            type="text"
                            className="w-full border border-gray-300 rounded px-4 py-2"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Name</label>
                        <input
                            {...register("name", { required: "Name is required" })}
                            type="text"
                            className="w-full border border-gray-300 rounded px-4 py-2"
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Number</label>
                        <input
                            {...register("number", {
                                required: "Number is required",
                                pattern: {
                                    value: /^[0-9]{10}$/,
                                    message: "Enter valid 10-digit number",
                                },
                            })}
                            type="text"
                            className="w-full border border-gray-300 rounded px-4 py-2"
                        />
                        {errors.number && <p className="text-red-500 text-sm">{errors.number.message}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        Create
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Create;

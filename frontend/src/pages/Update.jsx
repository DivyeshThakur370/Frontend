import React, { useEffect, useState } from 'react';
import { Dropzone, FileMosaic } from '@files-ui/react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateContact = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
    const [files, setFiles] = useState([]);

    // Fetch existing contact data
    useEffect(() => {
        axios.get(`http://localhost:8080/contact/one/${id}`, {
            withCredentials: true
        })
            .then((res) => {
                const { email, name, number, image } = res?.data?.data || {};
                setValue("email", email);
                setValue("name", name);
                setValue("number", number);

                if (image) {
                    const fileName = image.split("/").pop(); // Extract file name
                    setFiles([{
                        id: 1,
                        name: fileName,
                        size: 10000,
                        type: "image/jpeg", // Adjust based on actual type if needed
                        previewUrl: `http://localhost:8080/uploads/${image}`,
                    }]);
                }
            })
            .catch(err => console.log(err));
    }, [id, setValue]);

    // Update image files
    const updateFiles = (incomingFiles) => {
        setFiles(incomingFiles);
        if (incomingFiles.length > 0) {
            setValue("image", incomingFiles[0].file);
        } else {
            setValue("image", null);
        }
    };

    // Form submit handler
    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("email", data.email);
        formData.append("name", data.name);
        formData.append("number", data.number);
        if (data.image) {
            formData.append("image", data.image);
        }

        axios.patch(`http://localhost:8080/contact/update/${id}`, formData, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
            .then(res => {
                console.log(res.data);
                navigate("/contact");
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
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
                                <FileMosaic key={file.id} {...file} previewUrl />
                            ))}
                        </Dropzone>
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
                                    message: "Enter a valid 10-digit number",
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
                        Update
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateContact;

// Public.js
import React from 'react'
import { Navigate } from 'react-router-dom'

const Public = ({ children }) => {
    const token = JSON.parse(localStorage.getItem("token"));
    const isValid = token !== null && token !== "undefined"; // or add token length check
    return isValid ? <Navigate to="/contact" /> : children;
}

export default Public;

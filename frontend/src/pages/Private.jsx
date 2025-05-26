import React from 'react'
import Signin from './Signin'
import { Navigate } from 'react-router-dom'

const Private = ({ children }) => {
    let isValide = JSON.parse(localStorage.getItem("token"))
    return isValide ? children : <Navigate to={"/signin"} />
}

export default Private
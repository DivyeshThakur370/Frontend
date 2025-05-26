import { createContext, useEffect, useState } from "react";

export const allContext = createContext()

const AllContextProvider = ({ children }) => {
    const [success, setSuccess] = useState(false);
    const [token, setToken] = useState('');
    const [id, setId] = useState('');
    useEffect(() => {
        const storedId = JSON.parse(localStorage.getItem("id"));
        setId(storedId)
    }, [])
    return (
        <allContext.Provider value={{ success, setSuccess, token, setToken, id, setId }}>
            {children}
        </allContext.Provider>
    )
}

export default AllContextProvider
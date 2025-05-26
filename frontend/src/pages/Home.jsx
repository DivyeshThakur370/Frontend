import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <div className='h-[84vh]'>
            <main className="flex-grow flex items-center justify-center bg-gray-100 text-center px-4 h-[100%]">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to the Homepage</h1>
                    <p className="text-gray-600 text-lg mb-6">This is a simple homepage using React and Tailwind CSS.</p>
                    <Link to="/signup" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                        Get Started
                    </Link>
                </div>
            </main>
        </div>
    )
}

export default Home
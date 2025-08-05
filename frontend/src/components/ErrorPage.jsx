// src/components/ErrorPage.jsx
import React from 'react';
import { Link } from 'react-router';

const ErrorPage = () => {
    return (
        <div className="h-screen w-full flex flex-col justify-center items-center bg-gray-100 text-center px-4">
            <h1 className="text-5xl font-bold animate-bounce  text-yellow-500 mb-4">🚧<br /> Site Under Development</h1>
            <p className="text-lg text-red-700 mb-6">
                This page is currently under development or does not exist.
            </p>
            <Link
                to="/"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
                Go back to Dashboard
            </Link>
        </div>
    );
};

export default ErrorPage;

import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddEntityPage() {
    const navigate = useNavigate();
    const [formdata, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        visited: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formdata, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted with data:', formdata);

        const { name, description, location, visited } = formdata;

        // Validation check
        if (!name || !description || !location) {
            console.log('Please fill all the fields');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/new-places', formdata);
            console.log('Response:', response.data);
            navigate('/places');
        } catch (err) {
            console.error('Error submitting the form:', err);
        }
    };
    
    return (
        <div className="p-6 font-sans bg-gradient-to-b from-[#24002a] via-[#000000] to-[#000000] min-h-screen text-white">
            <h1 className="text-3xl font-bold text-purple-400 mb-6 text-center">Add New Place</h1>
            <form
                onSubmit={handleSubmit}
                className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700"
            >
                <div className="mb-4">
                    <label htmlFor="name" className="block text-purple-300 font-medium mb-2">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formdata.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-600 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="location" className="block text-purple-300 font-medium mb-2">
                        Location
                    </label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formdata.location}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-600 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block text-purple-300 font-medium mb-2">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formdata.description}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-600 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-purple-300 font-medium mb-2">
                        Visited
                    </label>
                    <div className="flex space-x-4">
                    <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, visited: true }))} 
                        className={`px-4 py-2 rounded-lg shadow-md font-semibold transition-all duration-300 ${
                        formdata.visited
                        ? "bg-gradient-to-r from-gray-900 to-purple-950 hover:from-gray-900 hover:to-purple-950 text-white"
                        : "bg-gray-700 text-gray-400"
                        }`}
                        >
                            Yes
                        </button>

                <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, visited: false }))}
                        className={`px-4 py-2 rounded-lg shadow-md font-semibold ${
                        !formdata.visited
                        ? "bg-gradient-to-r from-gray-900 to-purple-950 hover:from-gray-900 hover:to-purple-950 text-white"
                        : "bg-gray-700 text-gray-400"
                    }`}
                    >
                        No
                </button>

                    </div>
                </div>

                <div className="flex justify-between">
                <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-gray-900 to-purple-950 text-white font-semibold rounded-lg shadow-md hover:from-gray-900 hover:to-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                    Submit
                </button>

                    <button
                        type="button"
                        onClick={() => setFormData({ name: "", location: "", description: "", visited: false })}
                        className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddEntityPage;
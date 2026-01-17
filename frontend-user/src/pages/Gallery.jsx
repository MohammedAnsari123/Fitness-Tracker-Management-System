import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, Plus, Trash2, Upload } from 'lucide-react';

const Gallery = () => {
    const [photos, setPhotos] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ weight: '', notes: '' });
    const [file, setFile] = useState(null);

    const fetchPhotos = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get('https://fitness-tracker-management-system-xi0y.onrender.com/api/gallery', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPhotos(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchPhotos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        const data = new FormData();
        data.append('weight', formData.weight);
        data.append('notes', formData.notes);
        if (file) {
            data.append('image', file);
        } else {
            alert("Please select an image");
            return;
        }

        try {
            await axios.post('https://fitness-tracker-management-system-xi0y.onrender.com/api/gallery', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setShowForm(false);
            setFormData({ weight: '', notes: '' });
            setFile(null);
            fetchPhotos();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this photo?')) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`https://fitness-tracker-management-system-xi0y.onrender.com/api/gallery/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPhotos();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Camera className="text-purple-500" /> Progress Gallery
                </h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shadow-sm"
                >
                    <Plus size={20} /> Add Photo
                </button>
            </div>

            {showForm && (
                <div className="bg-white border border-slate-100 p-6 rounded-2xl animate-fade-in shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-purple-500 transition-colors cursor-pointer relative group">
                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                accept="image/*"
                            />
                            <div className="flex flex-col items-center">
                                {file ? (
                                    <>
                                        <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-2">
                                            <Upload size={24} />
                                        </div>
                                        <p className="text-purple-600 font-medium">{file.name}</p>
                                        <p className="text-slate-400 text-sm mt-1">Click to change</p>
                                    </>
                                ) : (
                                    <>
                                        <Camera className="mx-auto text-slate-400 mb-2 group-hover:text-purple-500 transition-colors" size={32} />
                                        <p className="text-slate-500 group-hover:text-purple-600 transition-colors font-medium">Click or drag photo here to upload</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="number"
                                value={formData.weight}
                                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                placeholder="Current Weight (kg)"
                                className="bg-slate-50 border-slate-200 text-slate-800 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                            <input
                                type="text"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Notes (e.g. Feeling strong!)"
                                className="bg-slate-50 border-slate-200 text-slate-800 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={() => setShowForm(false)} className="text-slate-500 hover:text-slate-700 px-4 py-2 font-medium">Cancel</button>
                            <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl font-medium shadow-md shadow-purple-500/20">Save</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {photos.map(p => (
                    <div key={p._id} className="bg-white border border-slate-100 p-4 rounded-2xl group shadow-sm hover:shadow-md transition-all">
                        <div className="aspect-square bg-slate-100 rounded-xl mb-4 overflow-hidden relative">
                            <img src={p.photoUrl} alt="Progress" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button onClick={() => handleDelete(p._id)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-900 font-bold">{new Date(p.date).toLocaleDateString()}</p>
                                {p.weight && <p className="text-sm text-purple-600 font-medium">{p.weight} kg</p>}
                                {p.notes && <p className="text-xs text-slate-500 mt-1">{p.notes}</p>}
                            </div>
                        </div>
                    </div>
                ))}
                {photos.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
                        <Camera className="mx-auto mb-3 text-slate-300" size={48} />
                        <p className="font-medium">No photos yet. Start tracking your progress!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Gallery;

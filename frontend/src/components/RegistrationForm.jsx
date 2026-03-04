import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config';
import qrImage from '../assets/image.png';
import {
    User,
    CreditCard,
    FileText,
    Phone,
    Mail,
    Upload,
    QrCode,
    CheckCircle,
    Loader2,
} from 'lucide-react';

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        aadhaarFront: null,
        aadhaarBack: null,
        panCard: null,
        passbook: null,
        paymentScreenshot: null
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const validate = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
        if (!formData.aadhaarFront) newErrors.aadhaarFront = "Aadhaar Front image is required";
        if (!formData.aadhaarBack) newErrors.aadhaarBack = "Aadhaar Back image is required";
        if (!formData.panCard) newErrors.panCard = "PAN Card image is required";
        if (!formData.passbook) newErrors.passbook = "Passbook 1st page image is required";
        if (!formData.paymentScreenshot) {
            newErrors.paymentScreenshot = "Payment screenshot is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        // Clear error for the field being edited
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            setIsSubmitting(true);

            // Prepare FormData as per requirement
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });

            try {
                const response = await fetch(`${API_BASE_URL}/register`, {
                    method: 'POST',
                    body: data,
                });

                const result = await response.json();

                if (response.ok) {
                    setIsSubmitting(false);
                    setIsSuccess(true);
                    // Reset form after success
                    setFormData({
                        fullName: '',
                        aadhaarFront: null,
                        aadhaarBack: null,
                        panCard: null,
                        passbook: null,
                        paymentScreenshot: null
                    });

                    // Clear errors
                    setErrors({});

                    // Hide success message after 5 seconds
                    setTimeout(() => setIsSuccess(false), 5000);
                } else {
                    setIsSubmitting(false);
                    alert(result.message || 'Registration failed');
                }
            } catch (error) {
                console.error('Submission error:', error);
                setIsSubmitting(false);
                alert('Connection error. Please ensure the backend is running.');
            }
        }
    };

    const FormDropdown = () => (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-t-2xl"></div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
                <FormDropdown />

                {/* Left Section: Form */}
                <div className="flex-1 p-6 lg:p-10">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">HEL PVT LTD</h1>
                        <p className="text-slate-500 mt-2 font-medium">Please fill in the registration details below</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">


                        {/* Full Name */}
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <User size={16} className="text-purple-500" /> Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-xl border ${errors.fullName ? 'border-red-500 bg-red-50' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`}
                                placeholder="John Doe"
                            />
                            {errors.fullName && <p className="text-xs text-red-500 font-medium">{errors.fullName}</p>}
                        </div>




                        {/* Document Upload Section */}
                        <div className="pt-4 border-t border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <FileText size={20} className="text-purple-500" /> Identity Documents
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Aadhaar Front */}
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        Aadhaar Front <span className="text-red-500">*</span>
                                    </label>
                                    <div className={`relative border-2 border-dashed ${errors.aadhaarFront ? 'border-red-300 bg-red-50' : 'border-slate-200'} rounded-xl p-4 text-center hover:border-purple-400 transition-all group`}>
                                        <input
                                            type="file"
                                            name="aadhaarFront"
                                            onChange={handleChange}
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="space-y-1">
                                            <Upload className="mx-auto text-slate-400 group-hover:text-purple-500 transition-colors" size={24} />
                                            <p className="text-xs text-slate-600 truncate">
                                                {formData.aadhaarFront ? formData.aadhaarFront.name : "Upload Front"}
                                            </p>
                                        </div>
                                    </div>
                                    {errors.aadhaarFront && <p className="text-xs text-red-500 font-medium">{errors.aadhaarFront}</p>}
                                </div>

                                {/* Aadhaar Back */}
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        Aadhaar Back <span className="text-red-500">*</span>
                                    </label>
                                    <div className={`relative border-2 border-dashed ${errors.aadhaarBack ? 'border-red-300 bg-red-50' : 'border-slate-200'} rounded-xl p-4 text-center hover:border-purple-400 transition-all group`}>
                                        <input
                                            type="file"
                                            name="aadhaarBack"
                                            onChange={handleChange}
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="space-y-1">
                                            <Upload className="mx-auto text-slate-400 group-hover:text-purple-500 transition-colors" size={24} />
                                            <p className="text-xs text-slate-600 truncate">
                                                {formData.aadhaarBack ? formData.aadhaarBack.name : "Upload Back"}
                                            </p>
                                        </div>
                                    </div>
                                    {errors.aadhaarBack && <p className="text-xs text-red-500 font-medium">{errors.aadhaarBack}</p>}
                                </div>

                                {/* PAN Card */}
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        PAN Card <span className="text-red-500">*</span>
                                    </label>
                                    <div className={`relative border-2 border-dashed ${errors.panCard ? 'border-red-300 bg-red-50' : 'border-slate-200'} rounded-xl p-4 text-center hover:border-purple-400 transition-all group`}>
                                        <input
                                            type="file"
                                            name="panCard"
                                            onChange={handleChange}
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="space-y-1">
                                            <Upload className="mx-auto text-slate-400 group-hover:text-purple-500 transition-colors" size={24} />
                                            <p className="text-xs text-slate-600 truncate">
                                                {formData.panCard ? formData.panCard.name : "Upload PAN Card"}
                                            </p>
                                        </div>
                                    </div>
                                    {errors.panCard && <p className="text-xs text-red-500 font-medium">{errors.panCard}</p>}
                                </div>

                                {/* Passbook */}
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        Passbook 1st Page <span className="text-red-500">*</span>
                                    </label>
                                    <div className={`relative border-2 border-dashed ${errors.passbook ? 'border-red-300 bg-red-50' : 'border-slate-200'} rounded-xl p-4 text-center hover:border-purple-400 transition-all group`}>
                                        <input
                                            type="file"
                                            name="passbook"
                                            onChange={handleChange}
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="space-y-1">
                                            <Upload className="mx-auto text-slate-400 group-hover:text-purple-500 transition-colors" size={24} />
                                            <p className="text-xs text-slate-600 truncate">
                                                {formData.passbook ? formData.passbook.name : "Upload Passbook"}
                                            </p>
                                        </div>
                                    </div>
                                    {errors.passbook && <p className="text-xs text-red-500 font-medium">{errors.passbook}</p>}
                                </div>
                            </div>
                        </div>

                        {/* QR Code and File Upload (Payment) */}
                        <div className="pt-4 border-t border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <CreditCard size={20} className="text-blue-500" /> Payment & QR
                            </h3>

                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                {/* QR Code Display */}
                                <div className="w-full md:w-1/3 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center">
                                    <div className="bg-white p-3 rounded-xl shadow-sm mb-3">
                                        <div className="w-32 h-32 bg-white rounded flex items-center justify-center">
                                            <img src={qrImage} alt="Payment QR" className="w-full h-full object-contain" />
                                        </div>
                                    </div>

                                </div>

                                {/* Upload Section */}
                                <div className="flex-1 w-full space-y-1">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        Payment Screenshot <span className="text-red-500">*</span>
                                    </label>
                                    <div className={`relative border-2 border-dashed ${errors.paymentScreenshot ? 'border-red-300 bg-red-50' : 'border-slate-200'} rounded-xl p-6 text-center hover:border-purple-400 transition-all group`}>
                                        <input
                                            type="file"
                                            name="paymentScreenshot"
                                            onChange={handleChange}
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="space-y-2">
                                            <Upload className="mx-auto text-slate-400 group-hover:text-purple-500 transition-colors" size={32} />
                                            <p className="text-sm text-slate-600">
                                                {formData.paymentScreenshot ? (
                                                    <span className="font-medium text-purple-600 underline text-xs">{formData.paymentScreenshot.name}</span>
                                                ) : (
                                                    <span className="text-xs">Click to upload payment screenshot</span>
                                                )}
                                            </p>
                                            <p className="text-[10px] text-slate-400 italic">PNG, JPG or JPEG (Max 2MB)</p>
                                        </div>
                                    </div>
                                    {errors.paymentScreenshot && <p className="text-xs text-red-500 font-medium">{errors.paymentScreenshot}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-4 mt-6 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-blue-500 text-white font-bold text-lg shadow-xl hover:shadow-purple-200 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-90 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Processing...
                                </>
                            ) : (
                                'Submit Registration'
                            )}
                        </button>
                    </form>

                </div>


                {/* Success Popup */}
                {isSuccess && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl scale-110 animate-in zoom-in duration-300 text-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="text-green-500" size={48} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Success!</h2>
                            <p className="text-slate-600 mb-8">Your registration has been submitted successfully. We will review your application soon.</p>
                            <button
                                onClick={() => setIsSuccess(false)}
                                className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RegistrationForm;

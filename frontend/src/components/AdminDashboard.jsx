import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../config';
import { LogOut, Eye, X, Download, Calendar, Mail, Phone, CreditCard, FileText, Briefcase, User as UserIcon, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminDashboard = ({ onLogout }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [isDeleting, setIsDeleting] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [limit, setLimit] = useState(10);

    useEffect(() => {
        fetchUsers(pagination.page, limit, searchTerm);
    }, [pagination.page, limit]);

    // Debounced search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (pagination.page !== 1) {
                setPagination(prev => ({ ...prev, page: 1 }));
            } else {
                fetchUsers(1, limit, searchTerm);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const [error, setError] = useState(null);

    const fetchUsers = async (page = 1, currentLimit = 10, search = '') => {
        setLoading(true);
        setError(null);
        const url = `${API_BASE_URL}/all?page=${page}&limit=${currentLimit}&search=${search}`;
        console.log('Fetching from:', url);
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch data');
            const data = await response.json();
            if (data.success) {
                setUsers(data.data);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
            setIsDeleting(id);
            try {
                const response = await fetch(`${API_BASE_URL}/${id}`, {
                    method: 'DELETE',
                });
                const data = await response.json();
                if (data.success) {
                    // If we delete the last item on a page, go back to previous page
                    if (users.length === 1 && pagination.page > 1) {
                        setPagination(prev => ({ ...prev, page: prev.page - 1 }));
                    } else {
                        fetchUsers(pagination.page);
                    }
                } else {
                    alert(data.message || 'Failed to delete');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Connection error');
            } finally {
                setIsDeleting(null);
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('isAdmin');
        onLogout(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                    HEL PVT LTD – Admin
                </h1>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 font-semibold transition-all"
                >
                    <LogOut size={18} /> Logout
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6 lg:p-8">
                <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-[calc(100vh-100px)]">
                    <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold text-slate-800">Registration Records</h2>
                            <p className="text-sm text-slate-400">Manage and filter your applicant submissions</p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                            <div className="relative w-full sm:w-64">
                                <input
                                    type="text"
                                    placeholder="Search by name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none text-sm transition-all"
                                />
                                <UserIcon className="absolute left-3 top-2.5 text-slate-400" size={16} />
                            </div>

                            <select
                                value={limit}
                                onChange={(e) => setLimit(Number(e.target.value))}
                                className="px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none text-sm bg-white cursor-pointer"
                            >
                                <option value={5}>5 per page</option>
                                <option value={10}>10 per page</option>
                                <option value={20}>20 per page</option>
                                <option value={50}>50 per page</option>
                            </select>

                            <span className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-xs font-black whitespace-nowrap">
                                {pagination.total} TOTAL
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-left">
                            <thead className="sticky top-0 bg-white z-10 shadow-sm">
                                <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-bold tracking-wider">
                                    <th className="px-6 py-4">S.No</th>
                                    <th className="px-6 py-4">Full Name</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                                <p className="font-medium">Loading data...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-red-500">
                                            <div className="flex flex-col items-center gap-2">
                                                <p className="font-bold">Error: {error}</p>
                                                <button
                                                    onClick={() => fetchUsers(pagination.page, limit, searchTerm)}
                                                    className="text-xs bg-red-100 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                                                >
                                                    Retry
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium italic">No records found</td>
                                    </tr>
                                ) : (
                                    users.map((user, index) => (
                                        <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4 text-slate-400 font-medium">
                                                {(pagination.page - 1) * 10 + index + 1}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-800 text-base">{user.fullName}</td>
                                            <td className="px-6 py-4">
                                                <div className="text-slate-500 font-medium">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => setSelectedUser(user)}
                                                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
                                                        title="View Details"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user._id)}
                                                        disabled={isDeleting === user._id}
                                                        className={`p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all ${isDeleting === user._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        title="Delete Record"
                                                    >
                                                        {isDeleting === user._id ? (
                                                            <div className="w-4.5 h-4.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                                        ) : (
                                                            <Trash2 size={18} />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Modern Pagination Controls */}
                    <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between bg-slate-50/50 gap-4">
                        <p className="text-sm text-slate-500 font-medium order-2 sm:order-1">
                            Showing <span className="text-slate-900 font-bold">{(pagination.page - 1) * limit + 1}</span> to <span className="text-slate-900 font-bold">{Math.min(pagination.page * limit, pagination.total)}</span> of <span className="text-slate-900 font-bold">{pagination.total}</span> entries
                        </p>

                        <div className="flex items-center gap-2 order-1 sm:order-2">
                            <button
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                disabled={pagination.page === 1}
                                className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:bg-slate-50 disabled:cursor-not-allowed transition-all shadow-sm font-semibold text-sm"
                            >
                                <ChevronLeft size={16} /> <span>Prev</span>
                            </button>

                            <div className="flex items-center gap-1.5 mx-1">
                                {[...Array(pagination.pages)].map((_, i) => {
                                    const pageNum = i + 1;
                                    // Logic to show page numbers with dots
                                    if (
                                        pageNum === 1 ||
                                        pageNum === pagination.pages ||
                                        (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)
                                    ) {
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                                                className={`w-10 h-10 rounded-xl text-sm font-bold transition-all flex items-center justify-center ${pagination.page === pageNum ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-lg ring-2 ring-purple-200 ring-offset-1' : 'bg-white border border-slate-200 text-slate-600 hover:border-purple-300 hover:text-purple-600 shadow-sm'}`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    } else if (
                                        pageNum === pagination.page - 2 ||
                                        pageNum === pagination.page + 2
                                    ) {
                                        return <span key={pageNum} className="text-slate-400 font-bold px-1">...</span>;
                                    }
                                    return null;
                                })}
                            </div>

                            <button
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                disabled={pagination.page === pagination.pages || pagination.pages === 0}
                                className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:bg-slate-50 disabled:cursor-not-allowed transition-all shadow-sm font-semibold text-sm"
                            >
                                <span>Next</span> <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Details Modal (Popup) */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col">
                        <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-center z-20">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                                Applicant Details
                            </h2>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <DetailItem icon={<UserIcon className="text-purple-500" />} label="Full Name" value={selectedUser.fullName} />
                                    <DetailItem icon={<Calendar className="text-purple-500" />} label="Registration Date" value={new Date(selectedUser.createdAt).toLocaleString()} />
                                </div>

                                <div className="space-y-8 flex flex-col">
                                    <ImageSection title="Aadhaar Front" url={selectedUser.aadhaarFront} />
                                    <ImageSection title="Aadhaar Back" url={selectedUser.aadhaarBack} />
                                    <ImageSection title="PAN Card" url={selectedUser.panCard} />
                                    <ImageSection title="Passbook" url={selectedUser.passbook} />
                                    <ImageSection title="Payment Screenshot" url={selectedUser.paymentScreenshot} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ImageSection = ({ title, url }) => (
    <div className="border-b border-slate-100 pb-8 last:border-0">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Download size={14} className="text-purple-500" /> {title}
        </h3>
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-slate-50 relative mb-4">
            <img
                src={url}
                alt={title}
                className="w-full h-auto object-contain"
            />
        </div>
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-sm text-purple-600 font-bold hover:text-purple-700 transition-colors"
        >
            <Download size={16} /> View/Download High Res
        </a>
    </div>
);

const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-5 p-3 rounded-xl hover:bg-slate-50 transition-colors">
        <div className="p-2.5 bg-white shadow-sm border border-slate-100 rounded-lg shrink-0">{icon}</div>
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
            <p className="text-lg font-bold text-slate-800 leading-tight">{value || 'N/A'}</p>
        </div>
    </div>
);

export default AdminDashboard;

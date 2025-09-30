import * as React from "react";
import { useState, useEffect } from 'react';
import { useAuthorizedApi } from '../hooks/useAuthorizedApi';
import { useRoles } from '../hooks/useRoles';
import type { User, UserRegistrationRequest, UserFormData } from '../types/user.types';
import { UserPlus, Trash2, Users, X, AlertCircle } from 'lucide-react';

export const UserManagement = () => {
    const api = useAuthorizedApi();
    const { isAdmin } = useRoles();

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [formData, setFormData] = useState<UserFormData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        role: 'Basic'
    });

    // Load users on mount
    useEffect(() => {
        if (isAdmin) {
            void loadUsers();
        }
    }, [isAdmin]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get<User[]>('/users');
            setUsers(response.data);
        } catch (err) {
            console.error('Failed to load users:', err);
            setError('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        try {
            setLoading(true);

            const request: UserRegistrationRequest = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                role: formData.role
            };

            await api.post<User>('/users/register', request);

            setSuccess(`User "${formData.username}" created successfully!`);
            setShowCreateForm(false);
            resetForm();
            await loadUsers();
        } catch (err: any) {
            console.error('Failed to create user:', err);
            setError(err.response?.data?.message || 'Failed to create user');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId: number, username: string) => {
        if (!confirm(`Are you sure you want to delete user "${username}"?`)) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await api.delete(`/users/${userId}`);
            setSuccess(`User "${username}" deleted successfully!`);
            await loadUsers();
        } catch (err: any) {
            console.error('Failed to delete user:', err);
            setError(err.response?.data?.message || 'Failed to delete user');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            role: 'Basic'
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    if (!isAdmin) {
        return (
            <div className="border border-black p-4">
                <p className="text-sm">You don't have permission to manage users.</p>
            </div>
        );
    }

    return (
        <div className="border border-black">
            {/* Header */}
            <div className="border-b border-black p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Users size={20} />
                    <h2 className="font-medium">User Management</h2>
                </div>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="h-9 px-4 bg-black text-white border border-black hover:opacity-90 transition-opacity flex items-center gap-2"
                    type="button"
                >
                    <UserPlus size={16} />
                    Create User
                </button>
            </div>

            {/* Alerts */}
            {error && (
                <div className="p-4 bg-red-50 border-b border-black flex items-start gap-2">
                    <AlertCircle size={20} className="text-red-600 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                    <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
                        <X size={16} />
                    </button>
                </div>
            )}

            {success && (
                <div className="p-4 bg-green-50 border-b border-black flex items-start gap-2">
                    <AlertCircle size={20} className="text-green-600 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm text-green-800">{success}</p>
                    </div>
                    <button onClick={() => setSuccess(null)} className="text-green-600 hover:text-green-800">
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Create Form */}
            {showCreateForm && (
                <div className="p-4 border-b border-black bg-gray-50">
                    <form onSubmit={handleCreateUser} className="grid gap-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="username">
                                    Username *
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    minLength={3}
                                    maxLength={50}
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="w-full h-9 px-3 border border-black bg-white"
                                    placeholder="johndoe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="email">
                                    Email *
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full h-9 px-3 border border-black bg-white"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="firstName">
                                    First Name *
                                </label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    required
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="w-full h-9 px-3 border border-black bg-white"
                                    placeholder="John"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="lastName">
                                    Last Name *
                                </label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    required
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="w-full h-9 px-3 border border-black bg-white"
                                    placeholder="Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="password">
                                    Password *
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    minLength={8}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full h-9 px-3 border border-black bg-white"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="confirmPassword">
                                    Confirm Password *
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    minLength={8}
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="w-full h-9 px-3 border border-black bg-white"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1" htmlFor="role">
                                    Role *
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    required
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="w-full h-9 px-3 border border-black bg-white"
                                >
                                    <option value="Basic">Basic</option>
                                    <option value="Creator">Creator</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="h-9 px-4 bg-black text-white border border-black hover:opacity-90 transition-opacity disabled:opacity-60"
                            >
                                {loading ? 'Creating...' : 'Create User'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowCreateForm(false);
                                    resetForm();
                                    setError(null);
                                }}
                                className="h-9 px-4 border border-black hover:bg-black hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Users List */}
            <div className="p-4">
                {loading && !showCreateForm ? (
                    <p className="text-sm text-center py-4">Loading users...</p>
                ) : users.length === 0 ? (
                    <p className="text-sm text-center py-4">No users found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                            <tr className="border-b border-black">
                                <th className="text-left p-2 text-sm font-medium">Username</th>
                                <th className="text-left p-2 text-sm font-medium">Name</th>
                                <th className="text-left p-2 text-sm font-medium">Email</th>
                                <th className="text-left p-2 text-sm font-medium">Status</th>
                                <th className="text-left p-2 text-sm font-medium">Created</th>
                                <th className="text-right p-2 text-sm font-medium">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-black/30 last:border-b-0">
                                    <td className="p-2 text-sm font-medium">{user.username}</td>
                                    <td className="p-2 text-sm">{user.firstName} {user.lastName}</td>
                                    <td className="p-2 text-sm">{user.email}</td>
                                    <td className="p-2 text-sm">
                                            <span className={`inline-block px-2 py-0.5 text-xs ${
                                                user.active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {user.active ? 'Active' : 'Inactive'}
                                            </span>
                                    </td>
                                    <td className="p-2 text-sm">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-2 text-right">
                                        <button
                                            onClick={() => handleDeleteUser(user.id, user.username)}
                                            disabled={loading}
                                            className="p-1 hover:bg-red-50 text-red-600 hover:text-red-800 transition-colors disabled:opacity-60"
                                            title="Delete user"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
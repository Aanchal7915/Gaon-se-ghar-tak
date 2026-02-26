import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';

const SettingsManagement = () => {
    const [settings, setSettings] = useState({
        dailyOrderLimit: 50
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await apiClient.get('/settings');
                setSettings(response.data);
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            await apiClient.put('/settings', settings);
            setMessage('Settings updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Failed to update settings:', error);
            setMessage('Failed to update settings.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading settings...</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">System Settings</h2>

            {message && (
                <div className={`p-4 mb-4 rounded-md ${message.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
                <div>
                    <label htmlFor="dailyOrderLimit" className="block text-sm font-medium text-gray-700">
                        Daily Order Limit
                    </label>
                    <div className="mt-1">
                        <input
                            type="number"
                            name="dailyOrderLimit"
                            id="dailyOrderLimit"
                            value={settings.dailyOrderLimit}
                            onChange={handleChange}
                            min="1"
                            className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                            required
                        />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                        Maximum number of orders allowed per day before "Orders Full" message is shown.
                    </p>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={saving}
                        className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${saving ? 'opacity-70' : ''}`}
                    >
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SettingsManagement;

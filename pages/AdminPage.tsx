
import React from 'react';
import { useAppContext } from '../context/AppContext';
import AdminLogin from '../components/AdminLogin';
import AdminPanel from '../components/AdminPanel';
import AdminSetup from '../components/AdminSetup';

const AdminPage: React.FC = () => {
    const { isAdminAuthenticated, config } = useAppContext();

    if (!config) {
        return <AdminSetup />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {isAdminAuthenticated ? <AdminPanel /> : <AdminLogin />}
        </div>
    );
};

export default AdminPage;

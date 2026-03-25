import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="flex bg-neutral-900 min-h-screen text-white">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-grow ml-64 min-h-screen bg-white text-neutral-dark rounded-tl-[3.5rem] overflow-hidden shadow-2xl relative">
        <div className="p-8 md:p-12 lg:p-16">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

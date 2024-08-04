import React from "react";
import Layout from "../components/Layout/Layout";

const NotificationsPage: React.FC = () => {
    const notifications: any[] = [];
    
  return (
    <Layout>
      <div className="fixed top-0 right-0 p-4">
        {notifications.map((notification: any, index: any) => (
          <div
            key={index}
            className="bg-blue-500 text-white p-4 rounded shadow-lg mb-4"
          >
            {notification}
          </div>
        ))}
      </div>
      {/* Other components */}
    </Layout>
  );
};

export default NotificationsPage;

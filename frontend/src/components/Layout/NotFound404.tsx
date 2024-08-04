import React from "react";
import Layout from "./Layout";

const NotFound404: React.FC = () => {
  return (
    <Layout>
      <div className="w-full h-screen flex justify-center items-center">
        <p className="text-3xl font-extrabold mr-2">Not Found</p>
        <p className="text-3xl">|</p>
        <p className="text-3xl font-extrabold ml-2">404</p>
      </div>
    </Layout>
  );
};

export default NotFound404;

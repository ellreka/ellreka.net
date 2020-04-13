import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { NextPage } from "next";

const About: NextPage = () => {
  return (
    <Layout>
      <div className="m-auto">
        <div className="bg-gray-100 w-full max-w-lg">
          <h2>Profile</h2>
          <p>ここはプロフィールです。</p>
        </div>
      </div>
    </Layout>
  );
};

export default About;

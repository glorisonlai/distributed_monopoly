import React from "react";
import Head from "next/head";

const Background: React.FC<{
  title: string;
  description: string;
  favicon: string;
}> = ({ title, description, children }) => (
  <div className="bg-gray-700 h-screen w-screen">
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link
        rel="icon"
        href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏠</text></svg>"
      ></link>
    </Head>
    {children}
  </div>
);

export default Background;

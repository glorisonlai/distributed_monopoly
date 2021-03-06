import type { FC } from "react";

import Head from "next/head";

const Background: FC<{
  title?: string;
  description?: string;
  favicon?: string;
  emoji?: string;
}> = ({ title, description, favicon, children, emoji = "🏠️" }) => (
  <div className="relative flex flex-auto flex-col bg-gray-700 w-screen h-full">
    <Head>
      <title>{title || "Capitalism"}</title>
      <meta name="description" content={description || ""} />
      <link
        rel="icon"
        href={
          favicon ||
          `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${emoji}</text></svg>`
        }
      />
    </Head>
    {children}
  </div>
);

export default Background;

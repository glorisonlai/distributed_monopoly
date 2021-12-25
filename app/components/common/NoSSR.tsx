import dynamic from "next/dynamic";
import React from "react";

const NoSsr = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export const NoSsrComponent = dynamic(() => Promise.resolve(NoSsr), {
  ssr: false,
});

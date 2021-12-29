import dynamic from "next/dynamic";
import React, { FC } from "react";

const NoSsr: FC<{}> = ({ children }) => <>{children}</>;

export const NoSsrComponent = dynamic(() => Promise.resolve(NoSsr), {
  ssr: false,
});

import type { FC } from "react";

import dynamic from "next/dynamic";

const NoSsr: FC<{}> = ({ children }) => <>{children}</>;

export const NoSsrComponent = dynamic(() => Promise.resolve(NoSsr), {
  ssr: false,
});

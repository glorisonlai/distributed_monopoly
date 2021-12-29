import type { FC } from "react";

const Sidebar = ({
  children,
  title,
}: {
  children: React.ReactNode[];
  title: string;
}) => {
  return (
    <nav className="flex flex-col">
      <h2>{title}</h2>
      <hr />
      {children &&
        children.map((child, index) => (
          <>
            <ul>{child}</ul>
            <hr key={index} />
          </>
        ))}
    </nav>
  );
};

export default Sidebar;

import { FC, useState } from "react";
import { Disclosure, Transition } from "@headlessui/react";

const Sidemenu: FC<{}> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button
            hidden={open}
            className={`flex flex-row justify-between bg-gray-800 hover:bg-gray-900 text-white py-2 px-4 rounded items-center`}
          >
            &lt;&lt;
          </Disclosure.Button>
          <Transition
            show={open}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-0"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-0"
          >
            <Disclosure.Panel
              static
              className="absolute top-[calc(5rem+1px)] right-[1rem] w-40 shadow-xl flex flex-col bg-gray-800 p-2 z-50"
            >
              {children}
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
};

export default Sidemenu;

import { FC } from "react";
import { Disclosure, Transition } from "@headlessui/react";

const Sidemenu: FC<{}> = ({ children }) => {
  // const [isOpen, setIsOpen] = useState(false);

  return (
    <Disclosure defaultOpen={true}>
      {({ open }) => (
        <>
          {/* <Transition
            show={open}
            enter="transition ease-out duration-100 transform"
            enterFrom="translate-x-0"
            enterTo="-translate-x"
            leave="transition ease-in duration-75 tranform"
            leaveFrom="-translate-x-200"
            leaveTo="translate-x-0"
          > */}
          <Disclosure.Button
            className={`absolute ${
              open ? "right-60" : "right-0"
            } top-1/2 tranform -translate-y-1/2 ${
              open
                ? "bg-gray-700 hover:bg-gray-800"
                : "bg-gray-800 hover:bg-gray-700"
            } text-white py-2 px-4 rounded-l-full h-40 text-3xl`}
          >
            {open ? "➡️" : "⬅️"}
          </Disclosure.Button>
          {/* </Transition> */}
          {/* <Transition
            show={open}
            enter="transition ease-out duration-100 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in duration-75 tranform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          > */}
          <Disclosure.Panel
            // static
            className="w-fit h-full shadow-xl flex flex-col bg-gray-800"
          >
            <div className="relative">{children}</div>
          </Disclosure.Panel>
          {/* </Transition> */}
        </>
      )}
    </Disclosure>
  );
};

export default Sidemenu;

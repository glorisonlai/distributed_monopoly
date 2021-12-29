import { FC, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

const Popup: FC<{
  title: string;
  description: string;
  callBack?: Function;
  prompt?: string;
}> = ({ title, description, children, callBack, prompt }) => {
  // The open/closed state lives outside of the Dialog and is managed by you
  const [isOpen, setIsOpen] = useState(true);
  // const isOpen = true;

  // const setIsOpen = (_) => {};
  console.log("isOpen", isOpen);

  const handleSubmit = () => {
    if (callBack) callBack();
    setIsOpen(false);
  };

  return (
    /*
      Pass `isOpen` to the `open` prop, and use `onClose` to set
      the state back to `false` when the user clicks outside of
      the dialog or presses the escape key.
    */
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="fixed z-10 top-1/4 left-1/4 right-0 bottom-0 flex flex-col items-center justify-center text-white w-1/2 h-fit bg-gray-900 p-4 pb-8 rounded"
    >
      <Transition
        show={isOpen}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-95"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-95"
        leaveTo="opacity-0"
      >
        <Dialog.Overlay />
        <div className="flex flex-row w-full justify-between p-4">
          <Dialog.Title className={"text-3xl font-bold"}>{title}</Dialog.Title>
          <button className="text-4xl" onClick={() => setIsOpen(false)}>
            ❌
          </button>
        </div>
        <hr className="divide-y-2" />
        <br className="h-4" />
        <Dialog.Description className="text-center">
          {description}
        </Dialog.Description>

        {children}

        {/*
        You can render additional buttons to dismiss your dialog by setting
        `isOpen` to `false`.
      */}
        <button
          className=" mt-4 bg-gray-600 hover:bg-gray-700 w-fit py-2 px-4 rounded items-center justify-center flex"
          onClick={handleSubmit}
        >
          {prompt}
        </button>
      </Transition>
    </Dialog>
  );
};

export default Popup;

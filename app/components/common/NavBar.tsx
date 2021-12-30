import { useContext } from "react";
import ContractContext from "../../lib/context/contractProvider";
import { login, logout } from "../../lib/contract/utils";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import { CgUserlane } from "react-icons/cg";
import { IoMdArrowDropdown } from "react-icons/Io";

const NavBar = () => {
  const { walletConnection, currentUser, nearConfig, contract } =
    useContext(ContractContext);

  console.log(contract.contractId);

  const UserMenu = () => (
    <div className="flex flex-col text-white items-stretch">
      <Menu>
        {({ open }) => (
          <>
            <Menu.Button
              className={`flex flex-row justify-between ${
                open ? "bg-gray-900" : "bg-gray-800"
              } hover:bg-gray-900 text-white py-2 px-4 rounded items-center`}
            >
              <div className="flex flex-col px-1">
                <p className="font-bold flex flex-row justify-evenly items-center">
                  <CgUserlane color="lightgreen" />
                  {currentUser.accountId}
                </p>
                <p className="text-slate-400">{nearConfig.nodeUrl}</p>
              </div>
              <IoMdArrowDropdown size={30} color="white" />
            </Menu.Button>
            <Transition
              show={open}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                static
                className="absolute top-[calc(5rem+1px)] right-[1rem] w-40 shadow-xl flex flex-col bg-gray-800 p-2 z-50"
              >
                <Menu.Item>
                  <Link href="/wallet" passHref={true}>
                    <button className="flex justify-evenly hover:bg-gray-900 items-center py-1 text-xl">
                      <p className="text-2xl">⚙️</p>
                      Account
                    </button>
                  </Link>
                </Menu.Item>
                <hr className="divide-y-4 divide-slate-700" />
                <Menu.Item>
                  <button
                    className="flex justify-evenly hover:bg-gray-900 items-center py-1 text-xl"
                    onClick={() => logout(walletConnection)}
                  >
                    <p className="text-2xl">🏃</p> Logout
                  </button>
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );

  const LoginButton = () => (
    <button
      className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded"
      onClick={() => login(walletConnection)}
    >
      Login with NEAR
    </button>
  );

  return (
    <>
      <nav className="relative w-full flex flex-initial items-center justify-between flex-wrap h-20 bg-gray-700 p-1 px-5">
        <div className="flex flex-row justify-start items">
          <Link href="/" passHref={true}>
            <p className="text-5xl cursor-pointer">🏠</p>
          </Link>
          {walletConnection.isSignedIn() && (
            <Link href="/game" passHref={true}>
              <button className=" ml-8 p-2 text-white text-xl cursor-pointer border-2 outline-white hover:bg-gray-800">
                Game Lobby
              </button>
            </Link>
          )}
        </div>
        {!walletConnection.isSignedIn() ? <LoginButton /> : <UserMenu />}
      </nav>
      <hr className="divide-y-2 divide-slate-700" />
    </>
  );
};

export default NavBar;

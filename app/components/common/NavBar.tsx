import { useContext } from "react";
import ContractContext from "../../lib/context/contractProvider";
import { login, logout } from "../../lib/contract/utils";

const NavBar = () => {
  const { walletConnection, currentUser } = useContext(ContractContext);

  return (
    <nav className="flex items-center justify-between flex-wrap bg-gray-800 p-6">
      {!walletConnection.isSignedIn() ? (
        <button className="bg-red-400" onClick={() => login(walletConnection)}>
          Login
        </button>
      ) : (
        <>
          <button
            className="bg-green-300"
            onClick={() => logout(walletConnection)}
          >
            Logout
          </button>
          <p className="text-white">{currentUser.accountId}</p>
          <p className="text-white">{currentUser.balance}</p>
        </>
      )}
    </nav>
  );
};

export default NavBar;

import Link from "next/link";
import { useContext } from "react";
import { GoMarkGithub } from "react-icons/go";
import ContractContext from "../../lib/context/contractProvider";

const Footer = () => {
  const { contract } = useContext(ContractContext);
  return (
    <>
      <hr className="divide-y-2 divide-slate-700" />
      <footer className="flex flex-col justify-evenly items-center bg-gray-700 p-2 px-10">
        <p className="text-white">© 2021 Glorison Lai</p>
        <br />
        <div className="flex flex-row items-center py-1">
          <Link
            href="https://github.com/glorisonlai/distributed_monopoly"
            passHref={true}
          >
            <>
              <GoMarkGithub
                size={"2rem"}
                className="cursor-pointer"
                color={"white"}
              />
            </>
          </Link>
          <div className="w-3" />
          <Link
            href={`https://explorer.testnet.near.org/accounts/${
              contract?.contractId || ""
            }`}
            passHref={true}
          >
            <button className="text-4xl">🇳</button>
          </Link>
        </div>
      </footer>
    </>
  );
};

export default Footer;

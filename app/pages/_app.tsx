import "../styles/globals.css";
import type { AppProps } from "next/app";
import ContractContext from "../lib/context/contractProvider";
import { useContract } from "../lib/hooks/useContract";
import NavBar from "../components/common/NavBar";
import Spinny from "../components/house/scene";
import Background from "../components/common/Bg";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const contract = useContract();

  return contract ? (
    <ContractContext.Provider value={contract}>
      <NavBar />
      <Component {...pageProps} />
    </ContractContext.Provider>
  ) : (
    <Background
      title="Capitalism"
      description="Loading"
      favicon="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏠</text></svg>"
    >
      <Spinny />
    </Background>
  );
};

export default MyApp;

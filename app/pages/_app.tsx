import "../styles/globals.css";
import type { AppProps } from "next/app";
import ContractContext from "../lib/context/contractProvider";
import { useContract } from "../lib/hooks/useContract";
import NavBar from "../components/common/NavBar";
import Scene from "../components/house/scene";
import { Box } from "../components/house/examples";
import Background from "../components/common/Bg";
import Footer from "../components/common/Footer";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const contract = useContract();

  return (
    <div className="flex min-h-screen h-full flex-col">
      {contract ? (
        <ContractContext.Provider value={contract}>
          <NavBar />
          <Component {...pageProps} />
          <Footer />
        </ContractContext.Provider>
      ) : (
        <Background description="Loading...">
          <Scene>
            <Box />
          </Scene>
        </Background>
      )}
    </div>
  );
};

export default MyApp;

import { ReactElement, useContext, useEffect, useState } from "react";
import ContractContext from "../../lib/context/contractProvider";
import { House } from "../../lib/contract/types";
import { Option } from "../../lib/contract/types";
import Sidemenu from "../common/Sidemenu";
import type { FC } from "react";
import Scene from "../common/Scene";
import { Sign } from "./examples";
import useMediaQuery from "../../lib/hooks/useMediaQuery";
import Link from "next/link";
import { BOATLOAD_OF_GAS } from "../../lib/contract/utils";
import Big from "big.js";
import GLTFParser from "../common/GLTFParser";
import { Html } from "@react-three/drei";
import RemoteGLTFLoader from "../common/GLTFLoader";
import ErrorBoundary from "../common/ErrorBoundary";

const House: FC<{ houseId?: string; gameId: string; playerOnHouse: boolean }> =
  ({ houseId, gameId, playerOnHouse }) => {
    const { contract, currentUser } = useContext(ContractContext);
    const [house, setHouse] = useState<Option<House>>(null);

    useEffect(() => {
      (async () => {
        if (!houseId) return;
        const res = await contract.get_house({ house_id: houseId });
        if (res.success) {
          console.log(res.result);
          setHouse(res.result);
        } else {
          console.error(res.error);
        }
      })();
    }, [contract, houseId]);

    const buyLand = async () => {
      if (houseId) {
        console.error("Theres already a house here");
        return;
      }
      const res = await contract.buy_land(
        { game_id: gameId },
        BOATLOAD_OF_GAS,
        Big("200")
          .times(10 * 24)
          .toFixed()
      );
      if (!res.success) {
        console.error(res.error);
      }
    };

    const buyHouse = async () => {
      if (!houseId) {
        console.error("No house here!");
        return;
      }
      const res = await contract.buy_house({ house_id: houseId });
      if (!res.success) {
        console.error(res.error);
      }
    };

    const HouseDeetsMenu: FC<{ children: ReactElement<any, any> }> = ({
      children,
    }) => {
      const renderCollapsibleMenu = useMediaQuery(1400);

      return renderCollapsibleMenu ? <Sidemenu>{children}</Sidemenu> : children;
    };

    const BuyHouseScreen: FC<{ house: House }> = ({ house }) => (
      <div className="relative text-white p-2">
        <h1 className="font-bold">{house.name}</h1>
        <br />
        <h2>Owned by {house.purchase_history.at(-1)}</h2>
        <br />
        <h2>Purchase Price: {house.price}Ⓝ</h2>
        {playerOnHouse &&
          currentUser.accountId !== house.purchase_history.at(-1) && (
            <button
              className="p-2 left-4 top-4 text-white rounded bg-green-300 hover:bg-green-400 z-50 m-4"
              onClick={buyHouse}
            >
              Buy House
            </button>
          )}
        {currentUser.accountId === house.purchase_history.at(-1) && (
          <Link href={`/house/edit/${house.id}`} passHref={true}>
            <button className="p-2 left-4 top-4 text-white rounded bg-green-300 hover:bg-green-400 z-50 m-4">
              Edit House
            </button>
          </Link>
        )}
        <br />
        <hr className="divide-x-2" />
        <div>
          <h2 className="font-bold">Purchase History</h2>
          {house.purchase_history.map((buyer, i) => (
            <div key={i} className="flex">
              <p>{buyer}</p>
            </div>
          ))}
        </div>
      </div>
    );

    const BuyLandScreen: FC<{}> = () => (
      <div className="flex flex-col items-center">
        <h1 className="text-white font-bold text-center">Hey, land!</h1>
        {playerOnHouse && (
          <button
            className="p-2 mt-4 text-white rounded bg-green-300 hover:bg-green-400 z-50 center"
            onClick={buyLand}
          >
            Buy Land (200Ⓝ)
          </button>
        )}
      </div>
    );

    return (
      <div className="w-full h-full flex flex-row">
        {!houseId ? (
          <Scene bgColor={["black"]} showGround={false} showBlur={false}>
            <Sign url="/dumbjoke.jpg" />{" "}
          </Scene>
        ) : (
          <ErrorBoundary>
            <Scene bgColor={["black"]} showGround={true} showBlur={true}>
              {house?.code ? (
                <RemoteGLTFLoader code={house.code} />
              ) : (
                <Html className="text-white font-bold" center>
                  No code here!
                </Html>
              )}
            </Scene>
          </ErrorBoundary>
        )}
        <HouseDeetsMenu>
          <div className="relative w-60">
            {!houseId ? (
              <BuyLandScreen />
            ) : house ? (
              <BuyHouseScreen house={house} />
            ) : (
              <h1 className="text-white font-bold text-center">Loading...</h1>
            )}
          </div>
        </HouseDeetsMenu>
      </div>
    );
  };

export default House;

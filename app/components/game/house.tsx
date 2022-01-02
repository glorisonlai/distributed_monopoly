import {
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ContractContext from "../../lib/context/contractProvider";
import { House } from "../../lib/contract/types";
import { Option } from "../../lib/contract/types";
import Sidemenu from "../common/Sidemenu";
import type { FC } from "react";
import Scene from "../common/Scene";
import { FloatingText, Triangle, Sign } from "./examples";
import { useGLTF } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import useMediaQuery from "../../lib/hooks/useMediaQuery";
// import { useGLTF } from "@react-three/drei";
// import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

const House = ({ houseId, gameId }: { houseId?: string; gameId: string }) => {
  const { contract } = useContext(ContractContext);
  const [house, setHouse] = useState<Option<House>>(null);
  const code = useRef("");

  useEffect(() => {
    (async () => {
      if (!houseId) return;
      const res = await contract.get_house({ house_id: houseId });
      if (res.success) {
        setHouse(res.result);
        code.current = res.result.code;
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
    console.log("Buying land");
    const res = await contract.buy_land({ game_id: gameId });
    if (!res.success) {
      console.error(res.error);
    }
  };

  const buyHouse = async () => {
    if (!houseId) {
      console.error("No house here!");
      return;
    }
    console.log("Buying house");
    const res = await contract.buy_house({ house_id: houseId });
    if (!res.success) {
      console.error(res.error);
    }
  };

  const HouseDeetsMenu: FC<{ children: ReactElement<any, any> }> = ({
    children,
  }) => {
    const renderCollapsibleMenu = useMediaQuery(1400);
    console.log(renderCollapsibleMenu);

    return renderCollapsibleMenu ? <Sidemenu>{children}</Sidemenu> : children;
  };

  const BuyHouseScreen: FC<{ house: House }> = ({ house }) => (
    <div className="">
      <h1>{house.name}</h1>
      <h2>
        Owned by {house.purchase_history[house.purchase_history.length - 1]}
      </h2>
      <h2>Purchase Price: {house.price}N</h2>
      <button
        className="absolute p-2 left-4 top-4 text-white rounded bg-green-300 hover:bg-green-400 z-50"
        onClick={buyHouse}
      >
        Buy House
      </button>
      <hr className="divide-x-2" />
      <div>
        <h2>Purchase History</h2>
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
      <button
        className="p-2 mt-4 text-white rounded bg-green-300 hover:bg-green-400 z-50 center"
        onClick={buyLand}
      >
        Buy Land (200N)
      </button>
    </div>
  );

  const GLTF = () => {
    const gltf = useLoader(GLTFLoader, "/scenecopy.gltf");
    return <primitive object={gltf.scene} />;
  };

  return (
    <div className="w-full h-full flex flex-row">
      {!houseId ? (
        <Scene
          bgColor={["black"]}
          exportTo={code}
          showGround={false}
          showBlur={false}
        >
          <Sign url="/dumbjoke.jpg" />{" "}
        </Scene>
      ) : (
        <Scene
          bgColor={["black"]}
          exportTo={code}
          showGround={true}
          showBlur={true}
        >
          {/* {!houseId ? <Sign url="/dumbjoke.jpg" /> : <Triangle />} */}
          <GLTF />
          {/* <Triangle /> */}
          {/* <Sign url="/dumbjoke.jpg" /> */}
        </Scene>
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

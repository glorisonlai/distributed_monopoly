import router from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Scene from "../../../components/common/Scene";
import ContractContext from "../../../lib/context/contractProvider";
import { Option, House } from "../../../lib/contract/types";

const EditHouse = () => {
  const { contract, currentUser } = useContext(ContractContext);
  const { house_id } = router.query;
  const code = useRef("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    (async () => {
      if (typeof house_id !== "string") return;
      const res = await contract.get_house({ house_id });
      if (res.success) {
        if (res.result.purchase_history.at(-1) === currentUser.accountId) {
          code.current = res.result.code;
        } else {
          setError("You don't own this house!");
        }
      } else {
        setError(res.error);
      }
    })();
  }, [contract, house_id, currentUser.accountId]);

  const ErrorMessage = () => (
    <div className="flex flex-col items-center justify-center">
      <p>{error}</p>
    </div>
  );

  const GLTF = () => {
    const gltf = useRef<any>();
    const loader = new GLTFLoader();
    loader.parse(
      code.current,
      "/",
      ({ scene }) => (gltf.current = scene),
      (e) => setError(e.message)
    );
    return <primitive object={gltf} />;
  };

  const RenderScreen = () => (
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
  );
};

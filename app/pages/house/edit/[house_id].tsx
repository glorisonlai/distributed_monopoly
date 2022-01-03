import router from "next/router";
import { useContext, useEffect, useRef } from "react";
import Background from "../../../components/common/Bg";
import Scene from "../../../components/common/Scene";
import ContractContext from "../../../lib/context/contractProvider";
import { Html } from "@react-three/drei";
import GLTFParser from "../../../components/common/GLTFParser";
import { useFormFields } from "../../../lib/hooks/useFormFields";

const EditHouse = () => {
  const { contract, currentUser } = useContext(ContractContext);
  const { house_id } = router.query;
  const codeBox = useRef<HTMLTextAreaElement>(null!);
  const codeSrc = useRef<HTMLInputElement>(null!);
  const {
    formFields: { code, error },
    setFormFields,
  } = useFormFields({ code: "", error: "" });

  useEffect(() => {
    (async () => {
      if (typeof house_id !== "string") return;
      const res = await contract.get_house({ house_id });
      if (res.success) {
        if (res.result.purchase_history.at(-1) === currentUser.accountId) {
          codeSrc.current.value = res.result.code;
          const codeRes = await fetch(res.result.code);

          if (codeRes.status === 200) {
            const code = await codeRes.text();
            codeBox.current.value = code;
            setFormFields({ code, error: "" });
          } else {
            setFormFields({ code: "", error: "Could not fetch code" });
          }
        } else {
          setFormFields({
            code: "",
            error: "You are not the owner",
          });
        }
      } else {
        setFormFields({ code: "", error: res.error });
      }
    })();
  }, [contract, currentUser.accountId, house_id, setFormFields]);

  const RenderScreen = () => (
    <Scene
      bgColor={["black"]}
      // exportTo={code}
      showGround={true}
      showBlur={true}
    >
      {error ? (
        <Html center>{error}</Html>
      ) : (
        <GLTFParser code={codeBox?.current?.value || ""} />
      )}
    </Scene>
  );

  const EditScreen = () => <textarea ref={codeBox} defaultValue={code} />;

  const uploadCode = async () => {
    if (typeof house_id !== "string") {
      console.error("Invalid House ID");
      return;
    }

    const res = await contract.renovate_house({
      house_id: house_id,
      code_src: codeSrc.current.value,
    });
    if (!res.success) {
      console.error(res.error);
    }
  };

  const renderCode = () => {
    setFormFields({ code: codeBox.current.value, error: "" });
  };

  return (
    <Background
      title="Edit House"
      description={typeof house_id === "object" ? "" : house_id}
      emoji="✏️"
    >
      <main className="flex flex-auto">
        <div className="absolute p-2 flex flex-col">
          <button
            className="p-2 text-white rounded bg-green-300 hover:bg-green-400 z-50 center"
            onClick={uploadCode}
          >
            Update House Code
          </button>
          <button
            className="p-2 mt-4 text-white rounded bg-green-300 hover:bg-green-400 z-50 center"
            onClick={renderCode}
          >
            Render Code
          </button>
        </div>
        <div className="absolute left-1/2 flex flex-col">
          <p className=" text-white z-50 w-1/2">
            For my sanity, upload GLTF to a public URL and paste the URL here.
          </p>
          <input className="w-1/2 z-50 p-2" ref={codeSrc} defaultValue={""} />
        </div>
        <div className="flex-1 ">
          <RenderScreen />
        </div>
        <EditScreen />
      </main>
    </Background>
  );
};

export default EditHouse;

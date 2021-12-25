import { useEffect, useState } from "react";
import { initContract } from "../wallet/utils";
import type { NearContext } from "../wallet/utils";

export const useContract = () => {
  const [contract, setContract] = useState<NearContext | null>(null);

  useEffect(() => {
    (async () => {
      const contract = await initContract();
      console.log("contract:, ", contract);
      setContract(contract);
    })();
  }, []);

  return contract;
};

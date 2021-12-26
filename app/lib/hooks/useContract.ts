import { useEffect, useState } from "react";
import { initContract } from "../contract/utils";
import type { NearContext } from "../contract/types";

export const useContract = () => {
  const [contract, setContract] = useState<NearContext | null>(null);

  useEffect(() => {
    (async () => {
      const contract = await initContract();
      setContract(contract);
    })();
  }, []);

  return contract;
};

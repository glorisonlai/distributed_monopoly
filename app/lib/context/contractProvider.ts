import { createContext } from "react";
import { NearContext } from "../wallet/utils";

const ContractContext = createContext<NearContext>({} as NearContext);

export default ContractContext;

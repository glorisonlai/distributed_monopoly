import { createContext } from "react";
import { NearContext } from "../contract/types";

const ContractContext = createContext<NearContext>({} as NearContext);

export default ContractContext;

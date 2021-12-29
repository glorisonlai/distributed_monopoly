import { FC, useContext } from "react";
import { Game } from "../../lib/contract/types";
import Scene from "../house/scene";
import { Box, Mess, Triangle } from "../house/examples";
import Gamemap from "./gamemap";
import ContractContext from "../../lib/context/contractProvider";

const Gameboard: FC<{ game: Game }> = ({ game }) => {
  const { currentUser } = useContext(ContractContext);
  if (!currentUser?.accountId) {
    return <div>You must be logged in to play!</div>;
  }

  console.log(game);
  console.log(currentUser);

  return (
    <div className="flex flex-auto">
      <div className="relative w-full max-w-screen-2xl">
        <Scene className="" bgColor={["black"]}>
          {/* <Box position={[0, 0, 0]} /> */}
          {/* <Mess position={[0, 0, 0]} /> */}
          <Triangle />
        </Scene>
        <Gamemap
          className="absolute bottom-4 left-4"
          position={game.player_pos[currentUser.accountId]}
          houses={{ 1: "blah" }}
        />
      </div>
    </div>
  );
};
export default Gameboard;

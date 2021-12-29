import { FC, useContext } from "react";
import { Game } from "../../lib/contract/types";
import Scene from "../common/Scene";
import { Box, Mess, Triangle } from "./examples";
import Gamemap from "./gamemap";
import ContractContext from "../../lib/context/contractProvider";
import Dice from "./dice";

const Gameboard: FC<{ game: Game }> = ({ game }) => {
  const { currentUser, contract } = useContext(ContractContext);
  if (!currentUser?.accountId) {
    return <div>You must be logged in to play!</div>;
  }

  console.log(game);
  console.log(currentUser);

  const GameActionMenu = () => {
    const yourTurn = false;
    return (
      <div className="absolute top-0 right-8 flex-row">
        <button
          className="text-white rounded bg-red-300 hover:bg-red-400"
          onClick={() => contract.leave_game({ game_id: game.id })}
        >
          Leave Game
        </button>
        {yourTurn ? (
          <div className="border-[1px] border-white rounded-full">
            <Dice />
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="flex flex-row">First Person</div>
            <div className="flex flex-row">YOU</div>
          </div>
        )}
      </div>
    );
  };

  const HouseDeetsMenu = () => <div>hello</div>;

  return (
    <div className="flex flex-auto">
      <div className="relative w-full max-w-screen-2xl">
        {/* <Scene className="" bgColor={["black"]}>
          {/* <Box position={[0, 0, 0]} /> */}
        {/* <Mess position={[0, 0, 0]} /> */}
        {/* <Triangle />
        </Scene> */}
        {game.player_pos.hasOwnProperty(currentUser.accountId) ? (
          <GameActionMenu />
        ) : (
          <button
            className="text-white rounded bg-green-300 hover:bg-green-400"
            onClick={() => contract.join_game({ game_id: game.id })}
          >
            Join Game
          </button>
        )}
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

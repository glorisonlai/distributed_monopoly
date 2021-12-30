import { FC, useContext, useState } from "react";
import { Game } from "../../lib/contract/types";
import Scene from "../common/Scene";
import { Box, Mess, Triangle } from "./examples";
import Gamemap from "./gamemap";
import ContractContext from "../../lib/context/contractProvider";
import Dice from "./dice";
import Sidemenu from "../common/Sidemenu";

const Gameboard: FC<{ game: Game }> = ({ game }) => {
  const { currentUser, contract } = useContext(ContractContext);
  if (!currentUser?.accountId) {
    return <div>You must be logged in to play!</div>;
  }

  console.log(game);
  console.log(currentUser);

  const GameActionMenu = () => {
    const [roll, setRoll] = useState(2);
    const yourTurn = false;

    const rollDice = async () => {
      console.log("rolling");
      const res = await contract.roll_dice({ game_id: game.id });
      if (res.success) {
        setRoll(res.result);
      } else {
        console.error(res.error);
      }
    };

    return (
      <>
        <button
          className="absolute p-2 top-4 left-4 flex flex-row text-white rounded bg-red-300 hover:bg-red-400 z-50"
          onClick={() => contract.leave_game({ game_id: game.id })}
        >
          Leave Game
        </button>
        <div className="absolute w-full flex flex-col items-center text-white z-40">
          {yourTurn ? (
            <button
              className="w-10 h-10 rounded-full flex justify-center items-center border-2 cursor-pointer"
              onClick={rollDice}
            >
              <Dice roll={roll} />
            </button>
          ) : (
            <div className="font-bold text-lg">
              <div className="flex flex-row">First Person</div>
              <hr className="divide-x-4" />
              <div className="flex flex-row">YOU</div>
            </div>
          )}
        </div>
      </>
    );
  };

  const HouseDeetsMenu = () => (
    <div className="absolute h-full right-0 flex flex-col justify-center text-white z-40">
      <Sidemenu>
        <h1>House innit</h1>
      </Sidemenu>
    </div>
  );

  return (
    <div className="flex flex-auto">
      <div className="relative w-full max-w-screen-2xl">
        <HouseDeetsMenu />
        {game.player_pos.hasOwnProperty(currentUser.accountId) ? (
          <GameActionMenu />
        ) : (
          <button
            className="absolute p-2 top-4 text-white rounded bg-green-300 hover:bg-green-400 z-50"
            onClick={() => contract.join_game({ game_id: game.id })}
          >
            Join Game
          </button>
        )}
        <Scene bgColor={["black"]}>
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

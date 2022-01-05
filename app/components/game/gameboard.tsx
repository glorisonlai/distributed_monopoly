import type { FC } from "react";
import type { Game } from "../../lib/contract/types";

import { useContext, useState } from "react";
import ModelHouse from "./house";
import Gamemap from "./gamemap";
import ContractContext from "../../lib/context/contractProvider";
import Dice from "./dice";

const Gameboard: FC<{ game: Game }> = ({ game }) => {
  const { currentUser, contract } = useContext(ContractContext);
  const [position, setPosition] = useState(
    currentUser.accountId ? game.player_pos[currentUser.accountId] || 0 : 0
  );
  if (!currentUser?.accountId) {
    return <div>You must be logged in to play!</div>;
  }

  const GameActionMenu = () => {
    const [roll, setRoll] = useState(0);
    const yourTurn = game.player_queue.findIndex(
      (p) => p === currentUser.accountId
    );

    const rollDice = async () => {
      const res = await contract.roll_dice({ game_id: game.id });
      if (!res.success) {
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
          {yourTurn === 0 ? (
            <button
              className="w-fit h-10 mt-4 p-2 rounded flex justify-center items-center border-2 cursor-pointer font-bold hover:bg-slate-700"
              onClick={rollDice}
            >
              Roll to move!
            </button>
          ) : (
            <div className="font-bold text-lg">
              <div className="flex flex-row">1: {game.player_queue[0]}</div>
              <hr className="divide-x-4" />
              <p className="">{yourTurn + 1}: You</p>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <main className="flex flex-auto">
      <div className="relative w-full">
        {game.player_pos.hasOwnProperty(currentUser.accountId) ? (
          <GameActionMenu />
        ) : (
          <button
            className="absolute p-2 left-4 top-4 text-white rounded bg-green-300 hover:bg-green-400 z-50"
            onClick={() => contract.join_game({ game_id: game.id })}
          >
            Join Game
          </button>
        )}
        <ModelHouse
          houseId={game.occupied_land[position]}
          gameId={game.id}
          playerOnHouse={game.player_pos[currentUser.accountId] === position}
        />
        <Gamemap
          className="absolute bottom-4 left-4"
          playerPos={game.player_pos[currentUser.accountId]}
          position={position}
          houses={game.occupied_land}
          moveTo={setPosition}
        />
      </div>
    </main>
  );
};
export default Gameboard;

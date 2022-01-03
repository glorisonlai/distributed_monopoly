import { useContext, useEffect, useState } from "react";
import ContractContext from "../../lib/context/contractProvider";
import { Option, Game, Error } from "../../lib/contract/types";
import { useRouter } from "next/router";
import Gameboard from "../../components/game/gameboard";
import Background from "../../components/common/Bg";
import Link from "next/link";

const GamePage = () => {
  const router = useRouter();
  const { game_id } = router.query;
  const { contract } = useContext(ContractContext);
  const [game, setGame] = useState<Option<Game>>(null);
  const [error, setError] = useState<Option<Error>>(null);

  useEffect(() => {
    (async () => {
      if (typeof game_id !== "string") return;
      const response = await contract.get_game({ game_id });
      if (response.success) {
        setGame(response.result);
        setError(null);
      } else {
        setError(response.error);
        setGame(null);
      }
    })();
  }, [game_id, contract]);

  return (
    <Background title={game ? game.name : "Game"} description={"Game innit"}>
      {error ? (
        <div className="text-white font-bold flex flex-col w-full justify-center items-center">
          Error: {error}
          <Link href="/game" passHref={true}>
            <button className="rounded p-2 border-2 mt-4 border-white hover:bg-gray-800">
              Back to Lobby
            </button>
          </Link>
        </div>
      ) : game ? (
        <Gameboard game={game} />
      ) : (
        <div>Loading...</div>
      )}
    </Background>
  );
};

export default GamePage;

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
      const response = await contract.view_game({ game_id });
      if (response.success) {
        setGame(response.result);
      } else {
        setError(response.error);
      }
    })();
  }, [game_id, contract]);
  console.log("game", game);

  return (
    <Background title={game ? game.name : "Game"} description={"Game innit"}>
      {error ? (
        <div>Error: {error}</div>
      ) : game ? (
        <>
          <div className="flex flex-row flex-initial justify-between">
            <Link href="/game"> &lt;- Back</Link>
            <h1>{game.name}</h1>
          </div>
          <Gameboard game={game} />
        </>
      ) : (
        <div>Loading...</div>
      )}
    </Background>
  );
};

export default GamePage;

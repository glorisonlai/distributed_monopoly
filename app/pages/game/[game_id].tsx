import { useContext, useEffect, useState } from "react";
import ContractContext from "../../lib/context/contractProvider";
import { Option, Game, Error } from "../../lib/contract/types";
import { useRouter } from "next/router";
import Gameboard from "./gameboard";

const GamePage = () => {
  const router = useRouter();
  const { contract } = useContext(ContractContext);
  const [game, setGame] = useState<Option<Game>>(null);
  const [error, setError] = useState<Option<Error>>(null);

  useEffect(() => {
    (async () => {
      const { game_id } = router.query;
      if (typeof game_id !== "string") return;
      const response = await contract.view_game({ game_id });
      if (response.success) {
        setGame(response.message);
      } else {
        setError(response.error);
      }
    })();
  });

  return error ? (
    <div>Error: {error}</div>
  ) : game ? (
    <Gameboard game={game} />
  ) : (
    <div>Loading...</div>
  );
};

export default GamePage;

import Background from "../../components/common/Bg";
import Link from "next/link";
import { FormEvent, useContext, useEffect, useState } from "react";
import type { NearContext } from "../../lib/wallet/utils";
import ContractContext from "../../lib/context/contractProvider";

const GameLobby = () => {
  const { contract, walletConnection, currentUser } =
    useContext(ContractContext);

  const [currentGreeting, setCurrentGreeting] = useState<string>("");

  console.log(contract);

  useEffect(() => {
    (async () => {
      contract
        .get_greeting({ account_id: currentUser.accountId })
        .then((greeting: string) => {
          console.log(greeting);
          setCurrentGreeting(greeting);
        });
    })();
  }, [contract, currentUser]);

  const searchGame = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Searching game...");
    contract
      .get_greeting({ account_id: currentUser.accountId })
      .then((greeting) => {
        console.log(greeting);
        contract.set_greeting({
          message: greeting + "a",
        });
      });
  };

  console.log(currentGreeting);

  return (
    <Background
      title="Lobby"
      description="Game Lobby"
      favicon="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏠</text></svg>"
    >
      <h1>Game Lobby</h1>
      <form onSubmit={searchGame}>
        <label htmlFor="game_code">Select Existing Game: </label>
        <input type="search" id="game_code" name="game_code" />
        <label htmlFor="error" hidden={true}></label>
        <input type="submit" value="Join" />
      </form>
    </Background>
  );
};

export default GameLobby;

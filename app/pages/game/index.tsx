import Background from "../../components/common/Bg";
import { FormEvent, useContext, useEffect } from "react";
import ContractContext from "../../lib/context/contractProvider";
import { useFormFields } from "../../lib/hooks/useFormFields";

const GameLobby = () => {
  const { contract, walletConnection, currentUser } =
    useContext(ContractContext);

  const { formFields, setFormFields, formChangeHandler } = useFormFields({
    gameId: "",
    newGameName: "",
  });

  useEffect(() => {
    (async () => {
      if (!currentUser?.accountId) return;
      contract
        .get_user({ account_id: currentUser.accountId })
        .then((greeting) => {
          console.log(greeting);
        });
    })();
  }, [contract, currentUser]);

  const searchGame = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Searching game...");
    const thing = await contract.join_game({
      game_name: "test",
      game_id: formFields.gameId,
    });
    setFormFields((form) => ({ ...form, gameId: "" }));
  };

  const createGame = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Creating game...");
    await contract.create_game({ game_name: formFields.newGameName });
    setFormFields((form) => ({ ...form, newGameName: "" }));
  };

  return (
    <Background
      title="Lobby"
      description="Game Lobby"
      favicon="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏠</text></svg>"
    >
      <h1>Game Lobby</h1>
      <form onSubmit={searchGame}>
        <label htmlFor="game_code">Select Existing Game: </label>
        <input
          type="search"
          id="game_code"
          name="game_code"
          value={formFields.gameId}
          onChange={formChangeHandler("gameId")}
        />
        <label htmlFor="error" hidden={true}></label>
        <input type="submit" value="Join" />
      </form>

      <form onSubmit={createGame}>
        <label htmlFor="game_name">Create New Game: </label>
        <input
          id="game_name"
          name="game_name"
          value={formFields.newGameName}
          onChange={formChangeHandler("newGameName")}
        />
        <label htmlFor="error" hidden={true}></label>
        <input type="submit" value="Create" />
      </form>
    </Background>
  );
};

export default GameLobby;

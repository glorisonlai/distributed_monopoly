import Background from "../../components/common/Bg";
import { FC, FormEvent, useContext, useEffect, useState } from "react";
import ContractContext from "../../lib/context/contractProvider";
import { useFormFields } from "../../lib/hooks/useFormFields";
import Router from "next/router";
import { Game, Option, User } from "../../lib/contract/types";
import Link from "next/link";
import { NoSsrComponent } from "../../components/common/NoSSR";
import Popup from "../../components/common/Popup";

const GameLobby = () => {
  const { contract, currentUser } = useContext(ContractContext);

  const [user, setUser] = useState<Option<User>>(null);
  const [recentGames, setRecentGames] = useState<Game[]>([]);

  const { formFields, setFormFields, formChangeHandler } = useFormFields({
    gameId: "",
    newGameName: "",
  });

  useEffect(() => {
    (async () => {
      if (!currentUser?.accountId) return;
      contract.get_user({ account_id: currentUser.accountId }).then((res) => {
        console.log(res);
        if (res.success) {
          setUser(res.result);
        } else {
          console.error(res.error);
        }
      });
    })();
  }, [contract, currentUser]);

  useEffect(() => {
    user &&
      (async () => {
        Promise.all(
          user.games.map((gameId) => contract.view_game({ game_id: gameId }))
        ).then((games) =>
          setRecentGames(
            games
              .filter((res) => res.success)
              .map((game) => game.result as Game)
          )
        );
      })();
  }, [user, contract]);

  const searchGame = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Searching game...");
    const { success, result, error } = await contract.view_game({
      game_id: formFields.gameId,
    });
    if (success) {
      Router.push(`/game/${result!.id}`);
    }
    setFormFields((form) => ({ ...form, gameId: "" }));
  };

  const createGame = async (e: FormEvent) => {
    e.preventDefault();
    console.log("Creating game...");
    const { success } = await contract.create_game({
      game_name: formFields.newGameName,
    });

    setFormFields((form) => ({ ...form, newGameName: "" }));
  };

  const registerUser = async () => {
    console.log(`Registering user '${currentUser.accountId}'...`);
    await contract.register_user();
  };

  const RecentGameMenu: FC<{ recentGames?: Game[] }> = ({ recentGames }) => (
    <div className="flex flex-col">
      <h1>Recent Games</h1>
      <hr className="divide-y-2" />
      {recentGames &&
        recentGames.map((game) => (
          <Link key={game.id} href={`/game/${game.id}`} passHref={true}>
            <div className="flex cursor-pointer">
              <div className="flex flex-row">
                <h3>{game.name}</h3>
              </div>
            </div>
          </Link>
        ))}
    </div>
  );

  const RegisterUserForm = () => {
    const onboarding = window.localStorage.getItem("onboarding");
    const first_time =
      onboarding === null || onboarding !== currentUser?.accountId;
    window.localStorage.setItem("onboarding", currentUser?.accountId || "");
    return (
      <>
        {first_time && (
          <Popup
            title={"Account not registered!"}
            description="You must register your NEAR account before you can make any bids or games. You can visit servers tho."
            callBack={registerUser}
            prompt="Register Account"
          />
        )}
        <div
          className="bg-gray-900 h-fit text-white flex flex-col justify-start items-center p-4 my-2 rounded"
          onSubmit={registerUser}
        >
          <h2 className="font-bold text-2xl">
            Account {currentUser.accountId} is unregistered!
          </h2>
          <p>
            You must register your NEAR account before you can make any bids or
            games.
          </p>
          <p>You can visit servers tho.</p>
          <button
            className="bg-gray-500 hover:bg-gray-700 font-bold py-2 px-4 rounded my-3"
            onClick={registerUser}
          >
            Register User
          </button>
        </div>
      </>
    );
  };

  return (
    <Background title="Lobby" description="Game Lobby">
      <div className="flex flex-row justify-around">
        <RecentGameMenu recentGames={recentGames} />
        <div className="flex flex-col">
          {!!user || (
            <NoSsrComponent>
              <RegisterUserForm />
            </NoSsrComponent>
          )}
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
        </div>
      </div>
    </Background>
  );
};

export default GameLobby;

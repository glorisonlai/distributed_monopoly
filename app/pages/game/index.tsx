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

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<Option<User>>(null);
  const [recentGames, setRecentGames] = useState<Game[]>([]);

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
        setLoading(false);
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

  const registerUser = async () => {
    console.log(`Registering user '${currentUser.accountId}'...`);
    await contract.register_user();
  };

  const RecentGameMenu: FC<{ recentGames: Game[] }> = ({ recentGames }) => (
    <div className="flex flex-col text-white rounded border-[1px] p-4">
      <h1 className="font-bold text-2xl">Recent Games</h1>
      <div className="h-[600px] overflow-auto">
        {recentGames.length ? (
          recentGames.map((game) => (
            <>
              <hr className="divide-y-2 mt-2" />
              <Link key={game.id} href={`/game/${game.id}`} passHref={true}>
                <div className="flex cursor-pointer hover:bg-slate-800 p-2">
                  <div className="flex flex-col">
                    <h3 className="font-bold">{game.name}</h3>
                    <p className="text-slate-300 text-sm">{game.id}</p>
                  </div>
                </div>
              </Link>
            </>
          ))
        ) : (
          <>
            <h3>Nothing to see here!</h3>
            <h4>Try creating a new game!</h4>
          </>
        )}
      </div>
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

  const GameLobbyForm = () => {
    enum Screens {
      viewGame = "View Game",
      createGame = "Create Game",
    }

    const { formFields, setFormFields, formChangeHandler } = useFormFields({
      gameId: "",
      newGameName: "",
    });
    const [screenId, setScreenId] = useState<Screens>(Screens.viewGame);
    const [error, setError] = useState<string>("");

    const searchGame = async (e: FormEvent) => {
      e.preventDefault();
      console.log("Searching game...");
      const res = await contract.view_game({
        game_id: formFields.gameId,
      });
      if (res.success) {
        Router.push(`/game/${res.result.id}`);
      } else {
        setError(res.error);
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

    return (
      <div className="rounded border-[1px] border-slate-200 h-fit text-white w-96">
        <div className="flex flex-row flex-grow justify-evenly">
          <button
            className={`w-full ${
              screenId === Screens.viewGame
                ? "bg-gray-700 cursor-default"
                : "bg-gray-800 hover:bg-gray-900"
            } font-bold py-2 px-4 rounded`}
            onClick={() => setScreenId(Screens.viewGame)}
          >
            {Screens.viewGame}
          </button>
          <button
            className={`w-full ${
              screenId === Screens.createGame
                ? "bg-gray-700 cursor-default"
                : "bg-gray-800 hover:bg-gray-900"
            } font-bold py-2 px-4 rounded`}
            onClick={() => setScreenId(Screens.createGame)}
          >
            {Screens.createGame}
          </button>
        </div>
        <div className="pt-4">
          {
            {
              "View Game": (
                <form className="px-1" onSubmit={searchGame}>
                  <label htmlFor="game_code">Game ID: </label>
                  <input
                    type="search"
                    id="game_code"
                    name="game_code"
                    value={formFields.gameId}
                    onChange={formChangeHandler("gameId")}
                    className="mx-2 p-1 rounded text-black"
                  />
                  <br />
                  <label
                    className="right-0 text-right text-sm text-red-500 font-bold"
                    htmlFor="error"
                    // hidden={!error}
                  >
                    {error}
                  </label>
                  <br />
                  <div className="flex flex-row bg-gray-800 hover:bg-gray-900 p-2 font-bold">
                    <input
                      className="w-full cursor-pointer"
                      type="submit"
                      value="Join"
                    />
                  </div>
                </form>
              ),

              "Create Game": (
                <form className="px-1" onSubmit={createGame}>
                  <label htmlFor="game_name">Create New Game: </label>
                  <input
                    id="game_name"
                    name="game_name"
                    value={formFields.newGameName}
                    onChange={formChangeHandler("newGameName")}
                    className="mx-2 p-1 rounded text-black"
                  />
                  <br />
                  <label
                    className="right-0 text-right text-sm text-red-500 font-bold"
                    htmlFor="error"
                    // hidden={!error}
                  >
                    {error}
                  </label>
                  <br />
                  <div className="flex flex-row bg-gray-800 hover:bg-gray-900 p-2 font-bold">
                    <input
                      className="w-full cursor-pointer"
                      type="submit"
                      value="Create Game"
                    />
                  </div>
                </form>
              ),
            }[screenId]
          }
        </div>
      </div>
    );
  };

  return (
    <Background title="Lobby" description="Game Lobby">
      <div className="flex flex-row justify-around py-8 h-full">
        <RecentGameMenu recentGames={recentGames} />
        <div className="flex flex-col h-full">
          {!user && !loading && (
            <NoSsrComponent>
              <RegisterUserForm />
            </NoSsrComponent>
          )}
          <GameLobbyForm />
        </div>
      </div>
    </Background>
  );
};

export default GameLobby;

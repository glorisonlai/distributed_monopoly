import Background from "../components/common/Bg";
import { NoSsrComponent } from "../components/common/NoSSR";

const Wallet = () => {
  const User = () => {
    const currentUrl = new URL(window.location.href);
    console.log("hello");
    const message = `NODE_ENV=local near create_account {newAccountId} --masterAccount {masterAccountId} --publicKey ${currentUrl.searchParams.get(
      "public_key"
    )} --initialAmount 10000000000000000000`;

    const done = () => {
      const successUrl = new URL(currentUrl.searchParams.get("success_url")!);
      successUrl.searchParams.set(
        "account_id",
        (document.getElementById("accountId")! as HTMLInputElement).value
      );
      successUrl.searchParams.set(
        "public_key",
        currentUrl.searchParams.get("public_key")!
      );
      window.location.assign(successUrl.toString());
    };

    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div>
          <code id="shell-command">{message}</code>
        </div>
        <input
          type="text"
          id="accountId"
          name="accountId"
          placeholder="Account id"
        ></input>
        <button type="button" onClick={() => done()}>
          done
        </button>
      </div>
    );
  };

  return (
    <Background
      title={"wallet"}
      description={""}
      favicon={
        "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏠</text></svg>"
      }
    >
      <div>
        For local account login, Please run the following command in NEAR CLI,
        then enter account id here.
      </div>
      <NoSsrComponent>
        <User />
      </NoSsrComponent>
    </Background>
  );
};

export default Wallet;

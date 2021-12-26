import "regenerator-runtime/runtime";
import React, { useContext } from "react";
import { login, logout } from "../lib/contract/utils";

import getConfig from "../lib/contract/config";
import ContractContext from "../lib/context/contractProvider";
const { networkId } = getConfig(process.env.NODE_ENV || "development");

export default function App() {
  const { walletConnection, contract, nearConfig, currentUser } =
    useContext(ContractContext);
  // use React Hooks to store greeting in component state
  const [greeting, set_greeting] = React.useState<string>();

  // when the user has not yet interacted with the form, disable the button
  const [buttonDisabled, setButtonDisabled] = React.useState(true);

  // after submitting the form, we want to show Notification
  const [showNotification, setShowNotification] = React.useState(false);

  // The useEffect hook can be used to fire side-effects during render
  // Learn more: https://reactjs.org/docs/hooks-intro.html
  React.useEffect(
    () => {
      // in this case, we only care to query the contract when signed in
      if (walletConnection.isSignedIn()) {
        // contract is set by initContract in index.js
        contract
          .get_greeting({ account_id: currentUser.accountId })
          .then((greetingFromContract: string) => {
            set_greeting(greetingFromContract);
          });
      }
    },

    // The second argument to useEffect tells React when to re-run the effect
    // Use an empty array to specify "only run on first render"
    // This works because signing into NEAR Wallet reloads the page
    []
  );

  // if not signed in, return early with sign-in prompt
  if (!walletConnection.isSignedIn()) {
    return (
      <main>
        <h1>Welcome to NEAR!</h1>
        <p>
          To make use of the NEAR blockchain, you need to sign in. The button
          below will sign you in using NEAR Wallet.
        </p>
        <p>
          By default, when your app runs in &quot;development&quot; mode, it
          connects to a test network (&quot;testnet&quot;) wallet. This works
          just like the main network (&quot;mainnet&quot;) wallet, but the NEAR
          Tokens on testnet aren&apos;t convertible to other currencies –
          they&apos;re just for testing!
        </p>
        <p>Go ahead and click the button below to try it out:</p>
        <p style={{ textAlign: "center", marginTop: "2.5em" }}>
          <button onClick={() => login(walletConnection)}>Sign in</button>
        </p>
      </main>
    );
  }

  return (
    // use React Fragment, <>, to avoid wrapping elements in unnecessary divs
    <>
      <button
        className="link"
        style={{ float: "right" }}
        onClick={() => logout(walletConnection)}
      >
        Sign out
      </button>
      <main>
        <h1>
          <label
            htmlFor="greeting"
            style={{
              color: "var(--secondary)",
              borderBottom: "2px solid var(--secondary)",
            }}
          >
            {greeting}
          </label>
          {
            " " /* React trims whitespace around tags; insert literal space character when needed */
          }
          {currentUser.accountId}!
        </h1>
        <form
          onSubmit={async (event) => {
            event.preventDefault();

            // get elements from the form using their id attribute
            const { fieldset, greeting } = (event.target as HTMLFormElement)
              .elements;

            // hold onto new user-entered value from React's SynthenticEvent for use after `await` call
            const newGreeting = greeting.value;

            // disable the form while the value gets updated on-chain
            fieldset.disabled = true;

            try {
              // make an update call to the smart contract
              await contract.set_greeting({
                // pass the value that the user entered in the greeting field
                message: newGreeting,
              });
            } catch (e) {
              alert(
                "Something went wrong! " +
                  "Maybe you need to sign out and back in? " +
                  "Check your browser console for more info."
              );
              throw e;
            } finally {
              // re-enable the form, whether the call succeeded or failed
              fieldset.disabled = false;
            }

            // update local `greeting` variable to match persisted value
            set_greeting(newGreeting);

            // show Notification
            setShowNotification(true);

            // remove Notification again after css animation completes
            // this allows it to be shown again next time the form is submitted
            setTimeout(() => {
              setShowNotification(false);
            }, 11000);
          }}
        >
          <fieldset id="fieldset">
            <label
              htmlFor="greeting"
              style={{
                display: "block",
                color: "var(--gray)",
                marginBottom: "0.5em",
              }}
            >
              Change greeting
            </label>
            <div style={{ display: "flex" }}>
              <input
                autoComplete="off"
                defaultValue={greeting}
                id="greeting"
                onChange={(e) => setButtonDisabled(e.target.value === greeting)}
                style={{ flex: 1 }}
              />
              <button
                disabled={buttonDisabled}
                style={{ borderRadius: "0 5px 5px 0" }}
              >
                Save
              </button>
            </div>
          </fieldset>
        </form>
        <p>
          Look at that! A Hello World app! This greeting is stored on the NEAR
          blockchain. Check it out:
        </p>
        <ol>
          <li>
            Look in <code>src/App.js</code> and <code>src/utils.js</code> –
            you&apos;ll see <code>get_greeting</code> and{" "}
            <code>set_greeting</code> being called on <code>contract</code>.
            What&apos;s this?
          </li>
          <li>
            Ultimately, this <code>contract</code> code is defined in{" "}
            <code>assembly/main.ts</code> – this is the source code for your{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://docs.near.org/docs/develop/contracts/overview"
            >
              smart contract
            </a>
            .
          </li>
          <li>
            When you run <code>yarn dev</code>, the code in{" "}
            <code>assembly/main.ts</code> gets deployed to the NEAR testnet. You
            can see how this happens by looking in <code>package.json</code> at
            the <code>scripts</code> section to find the <code>dev</code>{" "}
            command.
          </li>
        </ol>
        <hr />
        <p>
          To keep learning, check out{" "}
          <a target="_blank" rel="noreferrer" href="https://docs.near.org">
            the NEAR docs
          </a>{" "}
          or look through some{" "}
          <a target="_blank" rel="noreferrer" href="https://examples.near.org">
            example apps
          </a>
          .
        </p>
      </main>
      {showNotification && (
        <Notification
          contractId={contract.contractId}
          accountId={currentUser.accountId}
        />
      )}
    </>
  );
}

// this component gets rendered by App after the form is submitted
function Notification({
  contractId,
  accountId,
}: {
  contractId: string;
  accountId: string;
}) {
  const urlPrefix = `https://explorer.${networkId}.near.org/accounts`;
  return (
    <aside>
      <a target="_blank" rel="noreferrer" href={`${urlPrefix}/${accountId}`}>
        {accountId}
      </a>
      {
        " " /* React trims whitespace around tags; insert literal space character when needed */
      }
      called method: &apos;set_greeting&apos; in contract:{" "}
      <a target="_blank" rel="noreferrer" href={`${urlPrefix}/${contractId}`}>
        {contractId}
      </a>
      <footer>
        <div>✔ Succeeded</div>
        <div>Just now</div>
      </footer>
    </aside>
  );
}

Distributed Monopoly
==================

First foray into Near development.

Users can upload their GLTF models and sell to other users.

NOT an NFT marketplace - Although you can certainly try to make money.


Quick Start
===========

To run this project locally:

1. Prerequisites: Make sure you've installed [Node.js] ≥ 12
2. Install dependencies: `npm install`
3. Run the local development server: `npm run dev` (see `package.json` for a
   full list of `scripts` you can run with `npm`)


Exploring The Code
==================

1. The "backend" code lives in the `/contract` folder. See the README there for
   more info.
   - Main entry point is `lib.rs`
   - Models are split into `games` and `users`.

2. The frontend code lives in the `/app` folder. 
   - `/app/lib/contract/utils.ts` is a where the contract gets hooked into.
   - `/app/lib/contract/types.ts` is where you'll find the associated contract functions.
   - Otherwise, you can explore around `/app/pages/...` and see the components rendered.

3. Tests: Should probably do them 😉


TODO
==================

- Figure out a better way to upload GLTF models. Issue with distributed storage is you'd be separating the contract from the storage, which isn't great. Presumably you'd also need a server to validate the upload is legitimate.

- Add dedicated validation and parsing for GLTF models. Would be nice to render GLTF as functional components (ala [react-three-fiber]).
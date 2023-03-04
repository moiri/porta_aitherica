# Porta Aitherica

A simple tool to assist a dungeon master of the German role-play game "[Das schwarze Auge"](https://de.wikipedia.org/wiki/Das_Schwarze_Auge).

The tool provides the following functionality:

- Upload an XML file of a hero generated with the [helden tool](https://www.helden-software.de/index.php/download/)
- Enable/disable hero to assemble a group.
- Show overview of all active heroes.
- Compute probabilities of hero abilities (Talente)
- Show a graph with a probability trace of success
   - for each hero
   - at least one hero
   - all heroes

## Usage

This repository includes only a frontend application and all data is stored in the local storage of the browser.
If the local storage is deleted, all uploaded heroes are lost.

### `npm run start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

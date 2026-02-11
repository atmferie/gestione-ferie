-<<<<<<< HEAD
-# Getting Started with Create React App
+# ATM - Gestione Ferie
 
-This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
+Applicazione full-stack per la gestione ferie con:
+- **Frontend** React (`frontend`)
+- **Backend** Node.js + Express (`backend`)
 
-## Available Scripts
+## Requisiti
+- Node.js 18+
+- npm
 
-In the project directory, you can run:
+## Configurazione variabili ambiente
 
-### `npm start`
+### Frontend (`frontend/.env`)
+Puoi creare un file `.env` in `frontend`:
 
-Runs the app in the development mode.\
-Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
+```bash
+REACT_APP_API_BASE_URL=http://localhost:3001
+```
 
-The page will reload when you make changes.\
-You may also see any lint errors in the console.
+Se non impostata, il frontend usa `http://localhost:3001` di default.
 
-### `npm test`
+### Backend (`backend/.env` oppure variabili di shell)
+Variabili supportate:
 
-Launches the test runner in the interactive watch mode.\
-See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
+```bash
+PORT=3001
+CORS_ORIGIN=http://localhost:3000
+```
 
-### `npm run build`
+Valori di default:
+- `PORT=3001`
+- `CORS_ORIGIN=http://localhost:3000`
 
-Builds the app for production to the `build` folder.\
-It correctly bundles React in production mode and optimizes the build for the best performance.
+## Avvio locale
 
-The build is minified and the filenames include the hashes.\
-Your app is ready to be deployed!
+### 1) Backend
+```bash
+cd backend
+npm install
+npm start
+```
 
-See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
+### 2) Frontend
+In un secondo terminale:
+```bash
+cd frontend
+npm install
+npm start
+```
 
-### `npm run eject`
+App disponibile su `http://localhost:3000`.
 
-**Note: this is a one-way operation. Once you `eject`, you can't go back!**
+## Login demo
+Utenti hardcoded lato backend:
+- `mario / 1234` (dipendente)
+- `admin / admin` (admin)
 
-If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.
+## Test minimi
+Frontend:
+```bash
+cd frontend
+npm test -- --watch=false
+```
 
-Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.
-
-You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.
-
-## Learn More
-
-You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
-
-To learn React, check out the [React documentation](https://reactjs.org/).
-
-### Code Splitting
-
-This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)
-
-### Analyzing the Bundle Size
-
-This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)
-
-### Making a Progressive Web App
-
-This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)
-
-### Advanced Configuration
-
-This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)
-
-### Deployment
-
-This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)
-
-### `npm run build` fails to minify
-
-This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
-=======
-# atm
->>>>>>> c46b23bc94625a45af2e21d4c53afe31216dff2e
+## Note implementative
+- Persistenza sessione frontend via `localStorage` (`atm_user`).
+- Login verso backend su `${REACT_APP_API_BASE_URL}/api/login`.
 
EOF
)
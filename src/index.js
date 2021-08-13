import { StrictMode } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import netlifyIdentity from "netlify-identity-widget";

window.netlifyIdentity = netlifyIdentity;
// You must run this once before trying to interact with the widget
netlifyIdentity.init();

const rootElement = document.getElementById("root");

ReactDOM.render(<App />, rootElement);

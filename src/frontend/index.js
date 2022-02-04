/*
 * App
 */

"use strict";

require("@babel/polyfill");
require("whatwg-fetch");

const React = require("react");
const ReactDOM = require("react-dom");
const App = require("../components/app/app.jsx");
const props = JSON.parse(document.getElementById("props").innerHTML);

ReactDOM.hydrate(<App {...props} />, document.getElementById("js-content"));

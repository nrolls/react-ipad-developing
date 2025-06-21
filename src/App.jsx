import { hot } from "react-hot-loader/root";
import React, { useState } from "react";
import SearchComponent from "./SearchComponent.jsx"
import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div>
        <p>Have a night cap</p>
        <SearchComponent />
    </div>
  );
}

export default hot(App);

import React from "react";
import "./App.css";
import { BrowseSection, Header } from "./components";

const App = () => {
  return (
    <div className="app">
      <Header />
      <BrowseSection />
    </div>
  );
};

export default App;

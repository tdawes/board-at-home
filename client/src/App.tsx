import * as React from "react";
import HomePage from "./pages/HomePage";
import { Route } from "@prodo/route";
import GamePage from "./pages/GamePage";

export default () => {
  return (
    <div>
      <Route exact path="/" component={HomePage} />
      <Route path="/game/:code" component={GamePage as any} />
    </div>
  );
};

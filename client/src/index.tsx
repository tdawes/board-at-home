import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import { createBrowserHistory } from "history";
import { model } from "./model";
import { v4 as uuid } from "uuid";
import { ThemeProvider } from "theme-ui";
import theme from "./theme";

const history = createBrowserHistory();

const isProduction = process.env.NODE_ENV === "production";

const { Provider } = model.createStore({
  logger: !isProduction,
  initState: {},
  initLocal: {
    userId: uuid(),
  },
  route: {
    history,
  },
});

ReactDOM.render(
  <Provider>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById("root"),
);

import React, { useContext, useReducer } from "react";
import ReactDOM from "react-dom";

// Components
import NavBar from "./components/NavBar";
import TimeBar from "./components/TimeBar";
import Timer from "./components/Timer";

//Add context, reducer and usePersist(LocalStorage)
import Store from "./context";
import reducer from "./reducer";
import { usePersistedContext, usePersistedReducer } from "./usePersist";

// Theme
import { ThemeProvider } from "@material-ui/core/styles";
import { createMuiTheme, CssBaseline, Container } from "@material-ui/core";

const App = () => {
  const globalStore = usePersistedContext(useContext(Store), "state");

  const [state, dispatch] = usePersistedReducer(
    useReducer(reducer, globalStore),
    "state"
  );

  // Theme
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: state.paint, //"#f05b56",
        contrastText: "#ffffff",
      },
      type: state.theme, // "light" or "dark"
    },
  });

  return (
    <Container>
      <Store.Provider value={{ state, dispatch }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <NavBar />
          <TimeBar />
          <Timer />
        </ThemeProvider>
      </Store.Provider>
    </Container>
  );
};
ReactDOM.render(<App />, document.querySelector("#root"));

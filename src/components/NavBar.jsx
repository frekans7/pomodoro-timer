import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Timer, Brightness4, Brightness7, GitHub } from "@material-ui/icons";
import {
  Grid,
  Tooltip,
  Paper,
  IconButton,
  Typography,
} from "@material-ui/core";
import Store from "../context";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper0: {
    padding: theme.spacing(2),
    margin: "auto",
    maxWidth: 960,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  grid0: {
    justifyContent: "space-between",
    position: "relative",
  },
}));

const NavBar = () => {
  const classes = useStyles();
  const { state, dispatch } = useContext(Store);

  let mode;
  const changeTheme = (mode) => {
    if (state.theme === "dark") {
      mode = "light";
    } else {
      mode = "dark";
    }
    dispatch({ type: "THEME", payload: mode });
  };

  const ToggleButton = () => {
    if (state.theme === "dark") {
      return <Brightness7 />;
    } else {
      return <Brightness4 />;
    }
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper0}>
        <Grid container spacing={2} className={classes.grid0}>
          <div>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <Timer />
              <Typography variant="h6">Pomodoro Timer</Typography>
            </IconButton>
          </div>
          <div>
            <Tooltip title="Source Code">
              <IconButton
                edge="end"
                color="inherit"
                component="a"
                href="https://github.com/frekans7"
              >
                <GitHub />
              </IconButton>
            </Tooltip>
            <Tooltip title="Toggle light/dark theme">
              <IconButton
                edge="end"
                color="inherit"
                onClick={() => changeTheme(mode)}
              >
                <ToggleButton />
              </IconButton>
            </Tooltip>
          </div>
        </Grid>
      </Paper>
      <br />
    </div>
  );
};
export default NavBar;

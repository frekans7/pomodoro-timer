import React, { useContext, useState } from "react";
import { Grid } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import Store from "../context";

const TimeBar = () => {
  const { state, dispatch } = useContext(Store);
  var timeType = state.timeType;
  const [alignment, setAlignment] = useState(timeType);

  if (alignment !== timeType) {
    // Automatic Transition
    setAlignment(timeType);
  }

  const handleAlignment = (e, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };

  const changeTime = (e) => {
    var timeLoad;
    if (e === "pomodoro") {
      timeLoad = {
        timeType: "pomodoro",
        timeStamp: 1500000,
        paint: "#f05b56",
      };
    } else if (e === "shortBreak") {
      timeLoad = {
        timeType: "shortBreak",
        timeStamp: 300000,
        paint: "#4da6a9",
      };
    } else {
      // e ==="longBreak"
      timeLoad = {
        timeType: "longBreak",
        timeStamp: 900000,
        paint: "#498fc1",
      };
    }
    dispatch({ type: "TIME", payload: timeLoad });
  };

  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="flex-start"
      spacing={2}
    >
      <div style={{ marginTop: "30px", marginBottom: "-70px" }}>
        <ToggleButtonGroup
          value={alignment}
          exclusive
          onChange={handleAlignment}
          aria-label="text alignment"
        >
          <ToggleButton value="pomodoro" onClick={() => changeTime("pomodoro")}>
            Pomodoro
          </ToggleButton>
          <ToggleButton
            value="shortBreak"
            onClick={() => changeTime("shortBreak")}
          >
            Short Break
          </ToggleButton>
          <ToggleButton
            value="longBreak"
            onClick={() => changeTime("longBreak")}
          >
            Long Break
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
    </Grid>
  );
};
export default TimeBar;

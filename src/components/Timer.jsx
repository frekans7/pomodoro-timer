import React, { useState, useEffect, useContext } from "react";
import { Button, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Push from "push.js";
import Store from "../context";

///// Progress start
import { lighten, withStyles } from "@material-ui/core/styles";
import { LinearProgress } from "@material-ui/core";

const BorderLinearProgress = withStyles({
  root: {
    flexGrow: 1,
    backgroundColor: lighten("#b0bec5", 0.75),
  },
  bar: {
    borderRadius: 20,
  },
})(LinearProgress);
///// Progess finish

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(3),
    },
    flexGrow: 1,
  },
  margin: {
    margin: "auto",
    maxWidth: 960,
    height: 5,
  },
}));

const Timer = () => {
  const { state, dispatch } = useContext(Store);
  var timeStamp = state.timeStamp;
  var timeType = state.timeType;

  // Local State (time,type,isActive)
  const [time, setTime] = useState(timeStamp);
  const [type, setType] = useState(timeType);
  const [isActive, setIsActive] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [shortBreakCount, setShortBreakCount] = useState(0);

  if (type !== timeType) {
    // Update to localState
    setType(timeType);
    setTime(timeStamp);
    setIsActive(false);
  }

  const getTime = () => {
    let m = Math.floor(time / 1000 / 60) % 60;
    let s = Math.floor(time / 1000) % 60;
    let min = m < 10 ? "0" + m : m;
    let sec = s < 10 ? "0" + s : s;
    return min + ":" + sec;
  };

  const toggle = () => {
    let control = Push.Permission.has();
    if (control === false) {
      Push.create("Thank you for using the Pomodoro Timer!", {
        icon: "pomodoro.png",
        onClick: function () {
          window.focus();
          this.close();
        },
      });
    }
    setIsActive(!isActive);
    let sound = new Audio("button.mp3");
    sound.play();
  };

  const reset = (timeStamp, timeType) => {
    setTime(timeStamp);
    setType(timeType);
    setIsActive(false);
  };

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime(time - 1000);
        if (time === 0) {
          reset(timeStamp, timeType);
          // <-------- Automatic Transition (start) ----------->
          switch (timeType) {
            case "pomodoro":
              if (pomodoroCount < 4 && shortBreakCount < 3) {
                setPomodoroCount(pomodoroCount + 1);
                dispatch({
                  type: "TIME",
                  payload: {
                    timeType: "shortBreak",
                    timeStamp: 300000,
                    paint: "#4da6a9",
                  },
                });
                Push.create("Time to take a Short Break!", {
                  icon: "pomodoro.png",
                });
                let sound = new Audio("break.mp3");
                sound.play();
              } else {
                dispatch({
                  type: "TIME",
                  payload: {
                    timeType: "longBreak",
                    timeStamp: 900000,
                    paint: "#498fc1",
                  },
                });
                Push.create("Time to take a Long Break!", {
                  icon: "pomodoro.png",
                });
                let sound = new Audio("break.mp3");
                sound.play();
              }
              break;

            case "shortBreak":
              if (shortBreakCount < 3) {
                setShortBreakCount(shortBreakCount + 1);
                dispatch({
                  type: "TIME",
                  payload: {
                    timeType: "pomodoro",
                    timeStamp: 1500000,
                    paint: "#f05b56",
                  },
                });
                Push.create("Time to Work!", {
                  icon: "pomodoro.png",
                });
                let sound = new Audio("bell.mp3");
                sound.play();
              }
              break;

            case "longBreak":
              dispatch({
                type: "TIME",
                payload: {
                  timeType: "pomodoro",
                  timeStamp: 1500000,
                  paint: "#f05b56",
                },
              });
              Push.create("Time to Work!", {
                icon: "pomodoro.png",
              });
              let sound = new Audio("bell.mp3");
              sound.play();
              setPomodoroCount(0);
              setShortBreakCount(0);
              break;
            default:
              return;
          }
          // <-------- Automatic Transition (finish) ----------->
        }
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [
    dispatch,
    isActive,
    pomodoroCount,
    shortBreakCount,
    time,
    timeStamp,
    timeType,
    type,
  ]);
  const classes = useStyles();

  ///Progres calculation
  let progressCalculation = [((timeStamp - time) * 100) / timeStamp];
  let lifeTime = Number(progressCalculation); // Object to Number type transformation

  return (
    <div>
      <div className={classes.root}>
        <BorderLinearProgress
          className={classes.margin}
          variant="determinate"
          value={lifeTime}
        />
      </div>

      <Grid container direction="row" justify="center" alignItems="flex-start">
        <div>
          <p style={{ fontSize: "700%" }}>{getTime()}</p>
          <div className={classes.root}>
            <Button variant="contained" color="primary" onClick={toggle}>
              {isActive ? "Pause" : "Start"}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => reset(timeStamp, timeType)}
            >
              Reset
            </Button>
          </div>
        </div>
      </Grid>
    </div>
  );
};
export default Timer;

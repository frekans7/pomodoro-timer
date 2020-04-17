import React from "react";

const Store = React.createContext({
  timeType: "pomodoro", // "shortBreak" or "longBreak"
  timeStamp: 1500000,
  paint: "#f05b56", // "#4da6a9" or "#498fc1"
  theme: "light", //  "dark"
});

export default Store;

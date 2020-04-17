const reducer = (state, action) => {
  switch (action.type) {
    case "TIME":
      if (!action.payload) {
        return state;
      }
      return {
        ...state,
        timeType: action.payload.timeType,
        timeStamp: action.payload.timeStamp,
        paint: action.payload.paint,
      };
    case "THEME":
      return {
        ...state,
        theme: action.payload,
      };
    default:
      return state;
  }
};
export default reducer;

import { useEffect } from "react";

export const usePersistedContext = (context, key = "state") => {
  const persistedContext = localStorage.getItem(key);
  return persistedContext ? JSON.parse(persistedContext) : context;
};

export const usePersistedReducer = ([state, dispatch], key = "state") => {
  useEffect(() => localStorage.setItem(key, JSON.stringify(state)), [
    key,
    state,
  ]);
  return [state, dispatch];
};

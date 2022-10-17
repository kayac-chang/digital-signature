type Reducer<State, Action> = (state: State, action: Action) => State;
type Listener = () => void;
export default function createStore<State, Action>(
  reducer: Reducer<State, Action>,
  initial: State
) {
  let listeners: Listener[] = [];
  let currentState = initial;
  const unsubscribe = (target: Listener) => () => {
    listeners = listeners.filter((l) => l !== target);
  };
  return {
    getState: () => currentState,
    dispatch: (action: Action) => {
      currentState = reducer(currentState, action);
      listeners.forEach((listener) => listener());
    },
    subscribe: (newListener: Listener) => {
      listeners.push(newListener);
      return unsubscribe(newListener);
    },
  };
}

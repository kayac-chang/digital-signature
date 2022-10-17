import createStore from "~/utils/store";

type Vec2 = {
  x: number;
  y: number;
};
type State =
  | {
      status: "pending";
    }
  | {
      status: "drawing";
      position: Vec2;
    };

type Action =
  | {
      type: "pointerstart";
      position: Vec2;
    }
  | {
      type: "pointerend";
    }
  | {
      type: "pointermove";
      position: Vec2;
    };

const initial: State = {
  status: "pending",
};
function drawReducer(state: State, action: Action): State {
  if (action.type === "pointerstart") {
    return { status: "drawing", position: action.position };
  }
  if (state.status === "drawing" && action.type === "pointermove") {
    return { status: "drawing", position: action.position };
  }
  if (action.type === "pointerend") {
    return { status: "pending" };
  }
  return state;
}

type DropProps<Context> = {
  getPosition: () => Vec2 | undefined | null;
  createContext: () => Context;
};
function draw<Context>({ getPosition, createContext }: DropProps<Context>) {
  const store = createStore(drawReducer, initial);

  let context: Context | undefined;

  function onPointerStart() {
    const position = getPosition();
    if (!position) return;
    store.dispatch({
      type: "pointerstart",
      position,
    });
    context = createContext();
  }
  function onPointerEnd() {
    store.dispatch({ type: "pointerend" });
    context = undefined;
  }
  function onPointerMove() {
    const position = getPosition();
    position &&
      store.dispatch({
        type: "pointermove",
        position,
      });
  }

  type UpdateArg = {
    state: State;
    context: Context;
  };
  type UpdateFn = (arg: UpdateArg) => void;
  function update(fn: UpdateFn) {
    store.subscribe(() => {
      if (!context) return;

      const state = store.getState();
      fn({ state, context });
    });
  }

  return { update, onPointerStart, onPointerEnd, onPointerMove };
}

export default draw;

import { useEffect, useMemo, useState } from "react";

function notify(storeName, hookCall, payload = {}) {
  let event = document.createEvent("Event");
  event.initEvent(storeName, true, true);
  event.hookCall = hookCall;
  event.payload = payload;
  document.dispatchEvent(event);
}
function useGlobalState(
  initialValue,
  storeName = "",
  persist = false,
  actions = {}
) {
  if (!localStorage[`store-${storeName}`] && persist) {
    localStorage[`store-${storeName}`] = JSON.stringify(initialValue);
  }
  const hookCall = useMemo(() => `${Math.random()}`.split(".")[1], []);
  const [store, setStore] = useState(
    persist ? JSON.parse(localStorage[`store-${storeName}`]) : initialValue
  );

  const updateStore = (update) => {
    setStore((c) => {
      //   const newValue = Array.isArray(update)
      //   ? [...c, ...update]
      //   : typeof update === "object"
      //   ? { ...c, update }
      //   : update;
      const newValue = update(c);
      notify(storeName, hookCall, newValue);
      if (persist) {
        localStorage[`store-${storeName}`] = JSON.stringify(newValue);
      }
      return newValue;
    });
  };

  useEffect(() => {
    const storageListener = (e) => {
      if (e.hookCall !== hookCall) {
        setStore(e.payload);
      }
    };
    window.addEventListener(storeName, storageListener);
    return () => window.removeEventListener(hookCall, storageListener);
  }, []);

  const set = (value) => {
    if (typeof value === "object") {
      updateStore(value);
    } else if (typeof value === "function") {
      updateStore(value);
    }
  };

  const __actions = useMemo(
    () =>
      Object.fromEntries(
        Object.keys(actions).map((key) => [
          key,
          (args) =>
            actions[key]({
              args,
              state: store,
              dispatch: set,
            }),
        ])
      ),
    []
  );

  return [store, set, __actions];
}

/**
 * 
 * @param {  {

  name: string;

  default: any;

  localStoragePersistence?: boolean;
  
  actions?: {
    [name: string]: (st: {
      args: any;
      state: T;
      dispatch: Dispatch<SetStateAction<T>>;
    }) => void;
  };
} } init 
 * @returns {[
      T,
      (cb: (c: T) => T | T) => void,

      { [name: string]: (args: any) => void }
    ]}
 */
export function atom(init) {
  return () =>
    useGlobalState(
      init.default,
      init.name,
      init.localStoragePersistence,
      init.actions
    );
}

export function useAtom(atom) {
  return atom();
}

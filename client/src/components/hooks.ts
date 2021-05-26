import { useRef, useEffect } from "react";

type Callback = () => void;

export const useInterval = (callback: Callback, delay: number) => {
  const savedCallback: React.MutableRefObject<Callback> = useRef(callback);

  useEffect(() => {
    const tick = () => {
      savedCallback.current();
    };

    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [callback, delay]);
};

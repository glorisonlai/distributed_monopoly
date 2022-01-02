import { useState, useCallback, useEffect } from "react";

const useMediaQuery = (width: number) => {
  const [targetReached, setTargetReached] = useState(false);

  const updateTarget = useCallback(() => {
    setTargetReached(window.innerWidth < width);
  }, [width]);

  useEffect(() => {
    window.addEventListener("resize", updateTarget);

    // Check on mount (callback is not called until a change occurs)
    // if (media.matches) {
    //   setTargetReached(true);
    // }

    return () => window.removeEventListener("resize", updateTarget);
  }, [updateTarget]);

  return targetReached;
};

export default useMediaQuery;

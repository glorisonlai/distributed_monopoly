import type { FC } from "react";

import { useEffect, useState } from "react";

const Dice: FC<{ roll: number }> = ({ roll }) => {
  const [rando, setRando] = useState(1);
  useEffect(() => {
    if (roll) return;

    const rolling = window.setInterval(() => {
      setRando(Math.floor(Math.random() * 6) + 1);
    }, 100);
    return () => clearInterval(rolling);
  }, [roll]);

  return <p className="font-bold">{roll || rando}</p>;
};

export default Dice;

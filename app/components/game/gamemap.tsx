import { FC } from "react";

const Gamemap: FC<{
  className: string;
  position: number;
  houses: { [key: number]: string };
}> = ({ className, position, houses }) => {
  const length = 9;
  const height = 5;
  const padding = 30;

  const calculatePosition = (position: number) => ({
    x:
      position < length
        ? (length - position - 1) * padding
        : position < length + height - 1
        ? 0
        : position < 2 * length + height - 2
        ? (position - (length + height - 2)) * padding
        : (length - 1) * padding,

    y:
      position < length
        ? (height - 1) * padding
        : position < length + height - 1
        ? (height - (position - length + 2)) * padding
        : position < 2 * length + height - 2
        ? 0
        : (position - (2 * length + height - 3)) * padding,
  });

  const Tile = (position: number, occupied: boolean) => (
    <rect
      {...calculatePosition(position)}
      width={padding}
      height={padding}
      fill={occupied ? "#988BC7" : "#D0EFDC"}
      stroke="#A9B5AA"
      strokeWidth="3"
      key={position}
    />
  );

  const Player = (position: number) => {
    const { x, y } = calculatePosition(position);
    return (
      <rect
        x={x + padding / 2}
        y={y + padding / 2}
        width={padding / 2}
        height={padding / 2}
        transform={`rotate(-45 ${x + padding / 3} ${y + padding})`}
        fill="#CCFF00"
        stroke="#DBFF00"
        strokeWidth="0.5"
      />
    );
  };

  return (
    <svg
      width={padding * length}
      height={padding * height}
      viewBox={`0 0 ${padding * length} ${padding * height}`}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {[...Array(2 * length + 2 * height - 4)].map((_, i) =>
        Tile(i, i in houses)
      )}
      {Player(position)}
    </svg>
  );
};

export default Gamemap;

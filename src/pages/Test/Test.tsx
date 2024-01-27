import { useEffect, useMemo, useState } from "react";
import classes from "./Home.module.css";

type HomeProps = {
  radius: number;
};

export default function Home({ radius }: HomeProps) {
  const [test, setTest] = useState(true);

  useEffect(() => {
    console.log("OnInit");

    return () => {
      console.log("OnDestroy");
    };
  }, [test]);

  const value = useMemo(() => {
    console.log("izracunao vrednost");
    return 3.14 * radius * radius;
  }, [radius]);

  return (
    <>
      <div
        className={`${classes.testClass}`}
        onClick={() => setTest((test) => !test)}
      >
        Home
      </div>
      <div>{value}</div>
    </>
  );
}

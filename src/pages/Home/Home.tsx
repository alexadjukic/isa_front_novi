import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {

  useEffect(() => {
    console.log("OnInit");

    return () => {
      console.log("OnDestroy");
    };
  });

  return (
    <><div>
        <Link to={`/`}>Company list</Link>
        <br></br>
        <Link to={`/scheduled-appointments`}>Scheduled appointments</Link>
      </div>
    </>
  );
}

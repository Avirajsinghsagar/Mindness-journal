import React, { useEffect, useState } from "react";

function Breathing() {
  const [phase, setPhase] = useState("Inhale");
  const [scale, setScale] = useState(1);

  useEffect(() => {
    let timeout1, timeout2, timeout3;

    const cycle = () => {
      setPhase("Inhale");
      setScale(1.4);

      timeout1 = setTimeout(() => {
        setPhase("Hold");
      }, 4000);

      timeout2 = setTimeout(() => {
        setPhase("Exhale");
        setScale(1);
      }, 11000);
    };

    cycle();
    const interval = setInterval(cycle, 19000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h2>🌬️ Breathing Exercise</h2>
      <div style={{
        width: "200px", height: "200px", borderRadius: "50%",
        margin: "40px auto",
        background: "linear-gradient(135deg, #7dd3fc, #a78bfa)",
        transform: `scale(${scale})`,
        transition: "transform 4s ease-in-out"
      }}></div>
      <h3>{phase}</h3>
      <p>Inhale 4s • Hold 7s • Exhale 8s</p>
    </div>
  );
}

export default Breathing;
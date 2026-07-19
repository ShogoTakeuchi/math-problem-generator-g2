const colors = ["#f47f6b", "#5bbfb2", "#f6c85f", "#8c73cf", "#58a6dc"];

export function Confetti() {
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: 24 }, (_, index) => (
        <i
          key={index}
          style={
            {
              "--confetti-x": `${4 + ((index * 17) % 92)}%`,
              "--confetti-delay": `${(index % 6) * 0.045}s`,
              "--confetti-color": colors[index % colors.length],
              "--confetti-turn": `${180 + (index % 5) * 70}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

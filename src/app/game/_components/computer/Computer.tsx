import { useBackground } from "./BackgroundContext";

export function Computer() {
  const { background } = useBackground();

  return (
    <div 
      className="relative w-full h-full"
      style={{
        backgroundImage: background ? `url(${background})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* ... existing content ... */}
    </div>
  );
} 
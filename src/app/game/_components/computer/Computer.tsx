import { useAppState } from "./AppStateContext";

export function Computer() {
  const { background } = useAppState();

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
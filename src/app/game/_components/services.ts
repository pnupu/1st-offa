
export const playSound = (path: string) => {
  const audio = new Audio(path);
  audio.play().catch((error) => {
    console.error("Error playing sound:", error);
  });
};

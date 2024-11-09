import { AppStateProvider } from './_components/computer/AppStateContext';

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppStateProvider>{children}</AppStateProvider>;
} 
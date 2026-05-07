import { createFileRoute } from "@tanstack/react-router";
import GameApp from "@/game/GameApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Clicker Clash: Overload" },
      { name: "description", content: "Real-time competitive clicker for up to 8 players. Sabotage rivals, stack power-ups, dominate the leaderboard." },
      { property: "og:title", content: "Clicker Clash: Overload" },
      { property: "og:description", content: "Real-time competitive clicker for up to 8 players." },
    ],
  }),
  component: GameApp,
});

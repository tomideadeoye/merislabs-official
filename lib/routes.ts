export const ROUTES = {
  HOME: "/",
  WEB_APPS: "/web-apps",
  DECKS: "/decks",
  DESIGNS: "/designs",
  ADMIN: "/admin",
  BLOG: "https://medium.com/@tomideadeoye",
  LINKS: "https://linktr.ee/tomideadeoye",
  // Add more routes as needed
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];

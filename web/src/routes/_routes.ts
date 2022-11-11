export interface Route {
  path: string;
  forAny?: boolean;
  forGuests?: boolean;
}

export interface Routes {
  welcome: Route;
  login: Route;
  signup: Route;
  dashboard: Route;
  notFound: Route;
}

export const routes: Routes = {
  welcome: { path: "/welcome", forGuests: true },
  login: { path: "/login", forGuests: true },
  signup: { path: "/signup", forGuests: true },
  dashboard: { path: "/dashboard" },
  notFound: { path: "/404", forAny: true },
}
enum Modes {
  Local,
  Production,
}
export const GlobalMode: Modes = Modes.Local;

export function getPrefix() {
  switch (GlobalMode) {
    case Modes.Local:
      return "http://127.0.0.1:5000";
    case Modes.Production:
      return "https://rank-backend.vercel.app";
    default:
      return "something went wrong";
  }
}

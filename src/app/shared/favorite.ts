import { Feed } from "./feed";

export interface Favorite {
  id: number;
  userId: number;
  feedId: number;
  active: boolean;
  feed: Feed;
}

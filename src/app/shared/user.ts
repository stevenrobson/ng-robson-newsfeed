import { Favorite } from "./favorite";
import { Feed } from "./feed";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  avatar: string;
  about: string;
  friends: User[];
  favorites: Favorite[];
  feeds: Feed[];
}

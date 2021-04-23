export interface Feed {
  id: number;
  userId: number;
  date: Date;
  type: string;
  title: string;
  image: string;
  content: string;
  favorite: boolean;
}

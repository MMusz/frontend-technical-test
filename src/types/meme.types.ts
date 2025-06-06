import { Nullable, Opt, PaginatedResult } from "./global.types";
import { User } from "./user.types";

export type MemeText = {
  content: string;
  x: number;
  y: number;
};

export type Meme = {
  id: string;
  authorId: string;
  pictureUrl: string;
  description: string;
  commentsCount: string;
  texts: MemeText[];
  createdAt: string;
};

export type MemeWithAuthors = Meme & {
  author: Opt<Nullable<User>>;
};

export type PaginatedMemes = PaginatedResult<MemeWithAuthors>;

export type GetMemesApiResponse = PaginatedResult<Meme>;
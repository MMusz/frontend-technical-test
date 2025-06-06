import { Nullable, Opt, PaginatedResult } from "./global.types";
import { User } from "./user.types";

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  authorId: string;
  memeId: string;
};

export type CommentWithAuthor = Comment & {
  author: Opt<Nullable<User>>;
};

export type PaginatedComments = PaginatedResult<CommentWithAuthor>;

export type GetCommentsApiResponse = PaginatedResult<Comment>;
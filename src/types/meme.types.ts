import { Nullable, Opt, PaginatedResult } from "./global.types";
import { User } from "./user.types";

export type MemeText = {
  content: string;
  x: number;
  y: number;
  ref?: React.RefObject<HTMLParagraphElement>;
};

export type CaptionInput = {
  maxWidth?: number;
  maxHeight?: number;
}

export type Meme = {
  id: string;
  authorId: string;
  pictureUrl: string;
  description: string;
  commentsCount: number;
  texts: MemeText[];
  createdAt: string;
};

export type MemeWithAuthors = Meme & {
  author: Opt<Nullable<User>>;
};

export type PaginatedMemes = PaginatedResult<MemeWithAuthors>;

export type GetMemesApiResponse = PaginatedResult<Meme>;

export type PictureDimension = {
  height: Opt<number>;
  width: Opt<number>;
};

export type Picture = {
  url: string;
  file: File;
};

export type MemePicture = {
  description: string;
  pictureUrl: string;
  texts: MemeText[];
}

export type PostMemeApiRequestData = Pick<MemePicture, 'description' | 'texts'> & {
  picture: File;
};

export type CompleteMemePicture = MemePicture & PostMemeApiRequestData & { dataTestId?: string };

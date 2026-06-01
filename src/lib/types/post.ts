export type PostReaction = {
  likes: number;
  dislikes: number;
};

export type Post = {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: PostReaction;
  views: number;
  userId: number;
};

export type PostListResponse = {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
};

export type PostTag = {
  slug: string;
  name: string;
  url: string;
};

export type CommentUser = {
  id: number;
  username: string;
  fullName: string;
};

export type Comment = {
  id: number;
  body: string;
  postId: number;
  likes?: number;
  user: CommentUser;
};

export type CommentListResponse = {
  comments: Comment[];
  total: number;
  skip: number;
  limit: number;
};

export type AddCommentRequest = {
  body: string;
  postId: number;
  userId: number;
};

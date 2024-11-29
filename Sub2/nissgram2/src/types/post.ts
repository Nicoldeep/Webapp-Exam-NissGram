export interface Post {
    id: number;
    userName: string;
    text: string;
    imgUrl?: string;
    dateCreated: string;
    dateUpdated: string;
    userLikes: { userName: string }[];
    userComments: { userName: string; text: string; dateCommented: string }[];
  }
  
import { User } from "./user"; // Importer `User` hvis det finnes i en annen fil

export interface Post {
    postId: number;
    user: User;
    text: string;
    ImgUrl: string;
    dateCreated: Date;
    dateUpdated: Date;
  }
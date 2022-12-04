import axios, { AxiosResponse } from "axios";
import { PostType } from "../models/post.interface";

const instance = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com/",
  timeout: 15000
});

const resposeBody = (response: AxiosResponse) => response.data;

const requests = {
  get: (url: string) => instance.get(url).then(resposeBody),
  post: (url: string, body: {}) => instance.post(url, body).then(resposeBody),
  put: (url: string, body: {}) => instance.post(url, body).then(resposeBody),
  delete: (url: string) => instance.delete(url).then(resposeBody)
};

export const Post = {
  getPosts: (): Promise<PostType[]> => requests.get("/posts"),
  getAPost: (id: number): Promise<PostType> => requests.get(`/posts/${id}`),
  createPost: (post: PostType): Promise<PostType> =>
    requests.post("posts", post),
  updatePost: (post: PostType, id: number): Promise<PostType> =>
    requests.put(`posts/${id}`, post),
  deletePost: (id: number): Promise<void> => requests.delete(`/${id}`)
};

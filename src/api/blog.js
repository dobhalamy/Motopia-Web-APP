import { ADMIN_API } from './API_Base';
import unifyHandler from './unifyHandler';

export const getAllLinks = () => unifyHandler(ADMIN_API.get('/blog-posts/links'));
export const getAllActive = () => unifyHandler(ADMIN_API.get('/blog-posts/active')).then(res => res.data);
export const getPost = (category, post) => unifyHandler(ADMIN_API.get(`/blog-posts/${category}/${post}`)).then(res => res.data);

import http from "./httpService";
import { apiEndpoint  } from '../Config.json';
export function getPosts(){
    return http.get(apiEndpoint);
}
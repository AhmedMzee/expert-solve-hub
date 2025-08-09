import http from '../config/http.service'
import { api } from '../config/environment';
export const LoginService  ={

     async login(payload:any)
     {
        const response = await http.post(`${api.url}/auth/login`,payload)
        return response;
    }
}
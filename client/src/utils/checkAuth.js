import {jwtDecode} from 'jwt-decode'

export const checkAuth = () => {
  const token = localStorage.getItem('token');
  if(token) {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if(decodedToken.exp < currentTime){
        localStorage.removeItem('token');
        return null;
    }
       return decodedToken;
    } catch (error) {
      localStorage.removeItem('token');
      return null;
    }
  }
  return null;
}

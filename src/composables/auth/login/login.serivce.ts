import { postData } from 'src/helper/axios.instans';
import { LoginFormDto } from 'src/composables/auth/login/loginForm.dto';

export const loginUserService = async (data: LoginFormDto) => {
  return await postData('/login', data);
};

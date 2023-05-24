import { createMutationKeys } from '@lukemorales/query-key-factory';
import { loginApiResponseSchema, type LoginSchema } from '../../../auth/models/Auth.model';
import { http } from './http.api';

// #region query functions
export const login = async (creds: LoginSchema) => {
  const resp = await http.post(`auth/login`, creds);

  // `parse` will throw if `resp.data` is not correct
  const loginApiResponse = loginApiResponseSchema.parse(resp.data);
  // set 'Authorization' headers to
  http.defaults.headers.common['Authorization'] = `Bearer ${loginApiResponse.token}`;

  return loginApiResponse;
};

// export const refreshToken = async () => {
// const resp = await http.post(`auth/login`, creds);

// // `parse` will throw if `resp.data` is not correct
// const response = loginApiResponseSchema.safeParse(resp.data);

// if (response.success) {
//   // set 'Authorization' headers to
//   http.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`; //

//   return response.data;
// } else {
//   return resp.data as ErrorApiResponseSchema;
// }
// };
// #endregion

// #region keys factory
export const authMutationKeys = createMutationKeys('auth', {
  login: () => ({
    mutationKey: [''],
    mutationFn: (params: LoginSchema) => login(params),
  }),
});
// #endregion

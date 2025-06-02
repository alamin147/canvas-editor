import { baseApi } from '../../api/baseApi';

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getMe: builder.query({
      query: () => ({
        url: '/user/me',
        method: 'GET',
      }),
    }),

  }),
});

export const { useGetMeQuery} = authApi;

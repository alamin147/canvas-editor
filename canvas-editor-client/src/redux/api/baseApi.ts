import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { configENV } from "@/config";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    // Uncomment the line below to use the local server URL
    // baseUrl: `${configENV.server_local_url}/api/v1`,
    // Uncomment the line below to use the production server URL
    baseUrl: `${configENV.server_prod_url}/api/v1`,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;

      if (token) {
        headers.set("authorization", `${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [],

  endpoints: () => ({}),
});

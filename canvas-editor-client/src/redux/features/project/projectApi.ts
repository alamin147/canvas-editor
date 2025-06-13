import { baseApi } from '../../api/baseApi';

const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new project
    createProject: builder.mutation({
      query: (data) => ({
        url: '/projects',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Projects'],
    }),

    // Get all projects
    getAllProjects: builder.query({
      query: () => ({
        url: '/projects',
        method: 'GET',
      }),
      providesTags: ['Projects'],
    }),

    // Get a single project by ID
    getProject: builder.query({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'GET',
      }),
      providesTags: ['Project'],
    }),

    // Update a project
    updateProject: builder.mutation({
      query: ({ id, data }) => ({
        url: `/projects/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Project']
    }),

    // Delete a project
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Projects'],
    }),

    // Get project contributors
    getProjectContributors: builder.query({
      query: (id) => ({
        url: `/projects/${id}/contributors`,
        method: 'GET',
      }),
      providesTags: ['Project'],
    }),

    // Add a contributor to a project
    addContributor: builder.mutation({
      query: ({ projectId, email }) => ({
        url: `/projects/${projectId}/contributors`,
        method: 'POST',
        body: { email },
      }),
      invalidatesTags: ['Project'],
    }),

    // Remove a contributor from a project
    removeContributor: builder.mutation({
      query: ({ projectId, contributorId }) => ({
        url: `/projects/${projectId}/contributors/${contributorId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Project'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateProjectMutation,
  useGetAllProjectsQuery,
  useGetProjectQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetProjectContributorsQuery,
  useAddContributorMutation,
  useRemoveContributorMutation,
} = projectApi;

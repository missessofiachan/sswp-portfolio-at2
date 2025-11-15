/**
 * Factory for generating typed CRUD React Query hooks against REST resources.
 */

import { axiosInstance } from '@client/lib/axios';
import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

export type Identifier = string | number;

export interface ResourceQueryConfig<DTO, CreateDTO = Partial<DTO>, UpdateDTO = Partial<DTO>> {
  resource: string;
  baseUrl: string;
  staleTime?: number;
  listFn?: () => Promise<DTO[]>;
  getFn?: (id: Identifier) => Promise<DTO>;
  createFn?: (payload: CreateDTO) => Promise<DTO>;
  updateFn?: (id: Identifier, payload: UpdateDTO) => Promise<DTO>;
  deleteFn?: (id: Identifier) => Promise<void>;
}

const defaultList = async <DTO>(baseUrl: string): Promise<DTO[]> => {
  const { data } = await axiosInstance.get(baseUrl);
  if (Array.isArray(data)) return data as DTO[];
  if (Array.isArray((data as { data?: DTO[] }).data)) {
    return (data as { data: DTO[] }).data;
  }
  return [];
};

const defaultGet = async <DTO>(baseUrl: string, id: Identifier): Promise<DTO> => {
  const { data } = await axiosInstance.get(`${baseUrl}/${id}`);
  return data;
};

const defaultCreate = async <DTO, CreateDTO>(baseUrl: string, payload: CreateDTO): Promise<DTO> => {
  const { data } = await axiosInstance.post(baseUrl, payload);
  return data;
};

const defaultUpdate = async <DTO, UpdateDTO>(
  baseUrl: string,
  id: Identifier,
  payload: UpdateDTO
): Promise<DTO> => {
  const { data } = await axiosInstance.put(`${baseUrl}/${id}`, payload);
  return data;
};

const defaultDelete = async (baseUrl: string, id: Identifier): Promise<void> => {
  await axiosInstance.delete(`${baseUrl}/${id}`);
};

export function createResourceQuery<DTO, CreateDTO = Partial<DTO>, UpdateDTO = Partial<DTO>>(
  config: ResourceQueryConfig<DTO, CreateDTO, UpdateDTO>
) {
  const queryKeys = {
    all: [config.resource] as const,
    detail: (id: Identifier) => [config.resource, id] as const,
  };

  const listFn = config.listFn ?? (() => defaultList<DTO>(config.baseUrl));
  const getFn = config.getFn ?? ((id: Identifier) => defaultGet<DTO>(config.baseUrl, id));
  const createFn =
    config.createFn ??
    ((payload: CreateDTO) => defaultCreate<DTO, CreateDTO>(config.baseUrl, payload));
  const updateFn =
    config.updateFn ??
    ((id: Identifier, payload: UpdateDTO) =>
      defaultUpdate<DTO, UpdateDTO>(config.baseUrl, id, payload));
  const deleteFn = config.deleteFn ?? ((id: Identifier) => defaultDelete(config.baseUrl, id));

  function useList(options?: UseQueryOptions<DTO[]>) {
    return useQuery<DTO[]>({
      queryKey: queryKeys.all,
      queryFn: listFn,
      staleTime: config.staleTime ?? 60_000,
      ...options,
    });
  }

  function useDetail(id: Identifier | null | undefined, options?: UseQueryOptions<DTO>) {
    return useQuery<DTO>({
      queryKey: id != null ? queryKeys.detail(id) : ['noop', config.resource],
      queryFn: async () => {
        if (id == null) throw new Error('Missing identifier');
        return getFn(id);
      },
      enabled: id != null && (options?.enabled ?? true),
      staleTime: config.staleTime ?? 60_000,
      ...options,
    });
  }

  function useCreate(options?: UseMutationOptions<DTO, unknown, CreateDTO>) {
    const qc = useQueryClient();
    const { onSuccess, ...restOptions } = options ?? {};
    return useMutation<DTO, unknown, CreateDTO>({
      mutationFn: createFn,
      onSuccess: (data, variables, context) => {
        qc.invalidateQueries({ queryKey: queryKeys.all });
        onSuccess?.(data, variables, context);
      },
      ...restOptions,
    });
  }

  function useUpdate(
    options?: UseMutationOptions<DTO, unknown, { id: Identifier; payload: UpdateDTO }>
  ) {
    const qc = useQueryClient();
    const { onSuccess, ...restOptions } = options ?? {};
    return useMutation<DTO, unknown, { id: Identifier; payload: UpdateDTO }>({
      mutationFn: ({ id, payload }) => updateFn(id, payload),
      onSuccess: (data, variables, context) => {
        qc.invalidateQueries({ queryKey: queryKeys.all });
        qc.invalidateQueries({ queryKey: queryKeys.detail(variables.id) });
        onSuccess?.(data, variables, context);
      },
      ...restOptions,
    });
  }

  function useDelete(options?: UseMutationOptions<void, unknown, Identifier>) {
    const qc = useQueryClient();
    const { onSuccess, ...restOptions } = options ?? {};
    return useMutation<void, unknown, Identifier>({
      mutationFn: deleteFn,
      onSuccess: (data, variables, context) => {
        qc.invalidateQueries({ queryKey: queryKeys.all });
        qc.removeQueries({ queryKey: queryKeys.detail(variables) });
        onSuccess?.(data, variables, context);
      },
      ...restOptions,
    });
  }

  return {
    useList,
    useDetail,
    useCreate,
    useUpdate,
    useDelete,
    queryKeys,
  };
}

export type ResourceQueryReturnType<DTO, CreateDTO, UpdateDTO> = ReturnType<
  typeof createResourceQuery<DTO, CreateDTO, UpdateDTO>
>;

import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import {
  jobService,
  type CreateJobDto,
  type UpdateJobDto,
  type EnhanceDescriptionDto,
} from '@/services/job-service'

export const jobKeys = {
  all: ['jobs'] as const,
  companyList: (params: any) =>
    [...jobKeys.all, 'company', 'list', params] as const,
  detail: (id: number) => [...jobKeys.all, 'detail', id] as const,
  lookups: {
    all: ['jobs', 'lookups'] as const,
    categories: () => [...jobKeys.lookups.all, 'categories'] as const,
    jobTypes: () => [...jobKeys.lookups.all, 'jobTypes'] as const,
    locationTypes: () => [...jobKeys.lookups.all, 'locationTypes'] as const,
    currencies: () => [...jobKeys.lookups.all, 'currencies'] as const,
    countries: () => [...jobKeys.lookups.all, 'countries'] as const,
    governates: (countryId: number) =>
      [...jobKeys.lookups.all, 'governates', countryId] as const,
    skills: (query: string) =>
      [...jobKeys.lookups.all, 'skills', query] as const,
  },
}

export function useJobs() {
  const queryClient = useQueryClient()

  const createJobMutation = useMutation({
    mutationFn: (data: CreateJobDto) => jobService.createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.all })
    },
  })

  const updateJobMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateJobDto }) =>
      jobService.updateJob(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.all })
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(variables.id) })
    },
  })

  return {
    createJob: createJobMutation.mutate,
    createJobAsync: createJobMutation.mutateAsync,
    isCreatingJob: createJobMutation.isPending,
    createJobError: createJobMutation.error,

    updateJob: updateJobMutation.mutate,
    updateJobAsync: updateJobMutation.mutateAsync,
    isUpdatingJob: updateJobMutation.isPending,
    updateJobError: updateJobMutation.error,
  }
}

export function useEnhanceDescription() {
  return useMutation({
    mutationFn: (data: EnhanceDescriptionDto) =>
      jobService.enhanceDescription(data),
  })
}

export function useJob(id: number) {
  return useQuery({
    queryKey: jobKeys.detail(id),
    queryFn: () => jobService.getJobById(id),
    enabled: !!id,
  })
}

export function useCompanyJobs(params: {
  page?: number
  pageSize?: number
  search?: string
  status?: string
  jobTypeId?: number
}) {
  return useQuery({
    queryKey: jobKeys.companyList(params),
    queryFn: () => jobService.getCompanyJobs(params),
    placeholderData: keepPreviousData,
  })
}

export function useUpdateJobStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number
      status: 'Published' | 'Closed'
    }) => jobService.updateJobStatus(id, status),
    onSuccess: () => {
      // Invalidate the company jobs list query so it refreshes the statuses
      queryClient.invalidateQueries({
        queryKey: [...jobKeys.all, 'company', 'list'],
      })
    },
  })
}

export function useJobLookups(params?: {
  categorySearch?: string
  currencySearch?: string
  countrySearch?: string
}) {
  const { data: categories, isPending: isCategoriesLoading } = useQuery({
    queryKey: jobKeys.lookups.categories(),
    queryFn: () => jobService.getCategories(),
    select: (data) => {
      if (!params?.categorySearch) return data
      const search = params.categorySearch.toLowerCase()
      return data.filter((item) => item.name.toLowerCase().includes(search))
    },
    staleTime: 60 * 60 * 1000,
  })

  const { data: jobTypes, isLoading: isJobTypesLoading } = useQuery({
    queryKey: jobKeys.lookups.jobTypes(),
    queryFn: jobService.getJobTypes,
    staleTime: 60 * 60 * 1000,
  })

  const { data: locationTypes, isLoading: isLocationTypesLoading } = useQuery({
    queryKey: jobKeys.lookups.locationTypes(),
    queryFn: jobService.getLocationTypes,
    staleTime: 60 * 60 * 1000,
  })

  const { data: currencies, isLoading: isCurrenciesLoading } = useQuery({
    queryKey: jobKeys.lookups.currencies(),
    queryFn: () => jobService.getCurrencies(),
    select: (data) => {
      if (!params?.currencySearch) return data
      const search = params.currencySearch.toLowerCase()
      return data.filter((item) => {
        const name = item.name.toLowerCase()
        const code = item.code.toLowerCase()
        const label = `${name} (${code})`.toLowerCase()
        return (
          name.includes(search) ||
          code.includes(search) ||
          label.includes(search)
        )
      })
    },
    staleTime: 60 * 60 * 1000,
  })

  const { data: countries, isLoading: isCountriesLoading } = useQuery({
    queryKey: jobKeys.lookups.countries(),
    queryFn: () => jobService.getCountries(),
    select: (data) => {
      if (!params?.countrySearch) return data
      const search = params.countrySearch.toLowerCase()
      return data.filter(
        (item) =>
          item.name.toLowerCase().includes(search) ||
          item.code.toLowerCase().includes(search),
      )
    },
    staleTime: 60 * 60 * 1000,
  })

  return {
    categories,
    isCategoriesLoading,
    jobTypes,
    isJobTypesLoading,
    locationTypes,
    isLocationTypesLoading,
    currencies,
    isCurrenciesLoading,
    countries,
    isCountriesLoading,
  }
}

export function useGovernates(countryId: number | undefined, search?: string) {
  return useQuery({
    queryKey: jobKeys.lookups.governates(countryId!),
    queryFn: () => jobService.getGovernates(countryId!),
    select: (data) => {
      if (!search) return data
      const lowerSearch = search.toLowerCase()
      return data.filter((item) =>
        item.name.toLowerCase().includes(lowerSearch),
      )
    },
    enabled: !!countryId,
    staleTime: 60 * 60 * 1000,
  })
}

export function useSkillsSearch(query: string) {
  return useQuery({
    queryKey: jobKeys.lookups.skills(query),
    queryFn: () => jobService.searchSkills(query),
    enabled: !!query && query.length > 0,
    staleTime: 5 * 60 * 1000,
  })
}

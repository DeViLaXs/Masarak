import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { jobService, type CreateJobDto } from '@/services/job-service'

export const jobKeys = {
  all: ['jobs'] as const,
  lookups: {
    all: ['jobs', 'lookups'] as const,
    categories: (search?: string) =>
      [...jobKeys.lookups.all, 'categories', search ?? ''] as const,
    jobTypes: () => [...jobKeys.lookups.all, 'jobTypes'] as const,
    locationTypes: () => [...jobKeys.lookups.all, 'locationTypes'] as const,
    currencies: (search?: string) =>
      [...jobKeys.lookups.all, 'currencies', search ?? ''] as const,
    countries: (search?: string) =>
      [...jobKeys.lookups.all, 'countries', search ?? ''] as const,
    governates: (countryId: number, search?: string) =>
      [...jobKeys.lookups.all, 'governates', countryId, search ?? ''] as const,
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

  return {
    createJob: createJobMutation.mutate,
    createJobAsync: createJobMutation.mutateAsync,
    isCreatingJob: createJobMutation.isPending,
    createJobError: createJobMutation.error,
  }
}

export function useJobLookups(params?: {
  categorySearch?: string
  currencySearch?: string
  countrySearch?: string
}) {
  const { data: categories, isPending: isCategoriesLoading } = useQuery({
    queryKey: jobKeys.lookups.categories(params?.categorySearch),
    queryFn: () => jobService.getCategories(params?.categorySearch),
    staleTime: 60 * 60 * 1000,
    placeholderData: keepPreviousData,
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
    queryKey: jobKeys.lookups.currencies(params?.currencySearch),
    queryFn: () => jobService.getCurrencies(params?.currencySearch),
    staleTime: 60 * 60 * 1000,
    placeholderData: keepPreviousData,
  })

  const { data: countries, isLoading: isCountriesLoading } = useQuery({
    queryKey: jobKeys.lookups.countries(params?.countrySearch),
    queryFn: () => jobService.getCountries(params?.countrySearch),
    staleTime: 60 * 60 * 1000,
    placeholderData: keepPreviousData,
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
    queryKey: jobKeys.lookups.governates(countryId!, search),
    queryFn: () => jobService.getGovernates(countryId!, search),
    enabled: !!countryId,
    staleTime: 60 * 60 * 1000,
    placeholderData: keepPreviousData,
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

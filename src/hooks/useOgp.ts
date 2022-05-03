import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type ApiOgpResponse = {
  title: string
  image: string
  description: string
  url: string
  domain: string
}

export const useOgp = (url: string) => {
  const { data, error } = useSWR<any, ApiOgpResponse>(
    `/api/ogp?url=${encodeURI(url)}`,
    fetcher
  )
  return {
    ogp: data,
    isLoading: !error && !data,
    isError: error
  }
}

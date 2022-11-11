import Head from 'next/head'
import { useRouter } from 'next/router'

const TestPage = () => {
  const { query } = useRouter()
  console.log(query)
  const title = query?.title ?? 'Untitled'
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div>
        <h1>Test Page</h1>
      </div>
    </>
  )
}

export default TestPage

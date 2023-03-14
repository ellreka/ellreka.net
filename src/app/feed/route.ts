import { generateFeed } from '@/lib/feed'

export async function GET(request: Request) {
  const feed = await generateFeed()
  return new Response(feed, {
    headers: {
      'Content-Type': 'text/xml'
    }
  })
}

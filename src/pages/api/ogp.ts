import { NextApiRequest, NextApiResponse } from 'next'
import Mercury from '@postlight/mercury-parser'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const ogp = await Mercury.parse(request.query.url as string).then(
    (result: any) => {
      return {
        title: result.title,
        description: result.excerpt,
        url: result.url,
        domain: result.domain,
        image: result.lead_image_url
      }
    }
  )
  response.status(200).json(ogp)
}

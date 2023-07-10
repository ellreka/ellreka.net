import { Title } from '@/components/Title'
import { Meta } from '@/components/Meta'
import releases from '@/data/releases.json'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Suspense } from 'react'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'

type ItemProps = typeof releases[0]

const Item = (async (props: ItemProps) => {
  const getArticleInfo = async (url: string) => {
    const res = await fetch(url)
    const html = await res.text()
    const title = html.match(/<title>(.*?)<\/title>/)?.[1]
    return { title }
  }

  return (
    <div className="flex flex-col gap-3 rounded-md bg-gray-700 py-4 px-4">
      <a
        href={props.url}
        target="_blank"
        rel="noreferrer"
        className="h-[250px] w-full overflow-hidden">
        <img
          className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
          src={`/assets/releases/${props.id}.png`}
          alt=""
        />
      </a>
      <div className="flex grow flex-col gap-3">
        <h3 className="text-lg font-bold text-blue-400 hover:text-blue-500">
          <a href={props.url} target="_blank" rel="noreferrer">
            {props.title}
          </a>
        </h3>
        <p className="text-base text-white">{props.description}</p>
        <div className="mt-auto flex flex-col gap-2">
          {props?.article && (
            <a
              className="gap-1 text-sm text-blue-400"
              href={props.article}
              target="_blank"
              rel="noreferrer">
              <span>{(await getArticleInfo(props.article))?.title}</span>
              <ArrowTopRightOnSquareIcon className="ml-1 inline-block h-[1em] w-auto" />
            </a>
          )}
          {props?.github && (
            <a href={props.github} className="inline-flex items-center gap-1">
              <span className="text-xl text-gray-300">
                <FontAwesomeIcon icon={faGithub} />
              </span>
              <span className="text-sm text-gray-400">
                {props.github.replace('https://github.com/', '')}
              </span>
            </a>
          )}
        </div>
        <div>
          <ul className="flex flex-wrap gap-1">
            {props.tags.map((tag) => (
              <li
                key={tag}
                className="inline-block rounded-full bg-slate-600 px-2 text-xs text-white md:text-sm">
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}) as unknown as React.FC<ItemProps>

const Releases = () => {
  return (
    <>
      <Meta
        meta={{
          title: 'Releases',
          description: "ellreka's releases."
        }}
      />
      <div className="mx-auto max-w-3xl animate-fade-in">
        <Title>Releases</Title>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {releases.map((item, index) => {
            return (
              <Suspense key={index} fallback={null}>
                <Item {...item} />
              </Suspense>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Releases

import { Title } from '@/components/Title'
import { Meta } from '@/components/Meta'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons'
import {
  DocumentTextIcon,
  ClockIcon,
  RocketLaunchIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import { Card } from '@/components/Card/Card'

const Home = async () => {
  return (
    <>
      <Meta
        meta={{
          title: 'Home',
          description: 'Personal website of ellreka.'
        }}
      />
      <div className="mx-auto max-w-2xl">
        <Title>Home</Title>
        <div className="mt-20 flex items-center justify-center">
          <div className="mx-auto grid w-full max-w-[400px] grid-cols-2 gap-2">
            <div className="grid aspect-square h-full w-full grid-cols-1 gap-2">
              <Card
                className="aspect-auto"
                href="/about"
                label="About"
                background={
                  <UserIcon className="absolute right-2 bottom-2 h-[40px] w-auto text-white/20" />
                }
              />
              <Card
                className="aspect-auto"
                href="/timeline"
                label="Timeline"
                background={
                  <ClockIcon className="absolute right-2 bottom-2 h-[40px] w-auto text-white/20" />
                }
              />
            </div>
            <Card
              href="/entries"
              label="Entries"
              background={
                <DocumentTextIcon className="absolute right-0 bottom-0 h-[60px] w-auto text-white/20" />
              }
            />
            <Card
              href="/releases"
              label="Releases"
              background={
                <RocketLaunchIcon className="absolute right-2 bottom-2 h-[60px] w-auto text-white/20" />
              }
            />
            <div className="grid aspect-square w-full grid-cols-2 gap-2">
              <div></div>
              <Card
                href="https://twitter.com/ellreka"
                label="Twitter"
                className="from-sky-900 to-sky-400"
                icon={
                  <span className="text-3xl text-gray-300">
                    <FontAwesomeIcon icon={faTwitter} />
                  </span>
                }
              />
              <Card
                href="https://zenn.dev/ellreka"
                label="Zenn"
                className="from-sky-100 to-sky-300"
                icon={
                  <span className="">
                    <img
                      className="h-auto w-[40px]"
                      src="/assets/logo/zenn.svg"
                      alt=""
                    />
                  </span>
                }
              />
              <Card
                href="https://github.com/ellreka"
                label="GitHub"
                className="from-black to-gray-500"
                icon={
                  <span className="text-3xl text-gray-300">
                    <FontAwesomeIcon icon={faGithub} />
                  </span>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home

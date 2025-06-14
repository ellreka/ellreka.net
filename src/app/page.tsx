import { Title } from '@/components/Title'
import { Meta } from '@/components/Meta'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faXTwitter } from '@fortawesome/free-brands-svg-icons'
import {
  DocumentTextIcon,
  ClockIcon,
  RocketLaunchIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import { Card } from '@/components/Card/Card'
import { createWebsiteStructuredData } from '@/lib/structured-data'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home | ellreka.net',
  description: 'Personal website of ellreka.',
  openGraph: {
    title: 'Home | ellreka.net',
    description: 'Personal website of ellreka.',
    type: 'website',
    url: 'https://ellreka.net',
    siteName: 'ellreka.net',
    images: [
      {
        url: 'https://ellreka.net/favicon.ico',
        width: 1200,
        height: 630,
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home | ellreka.net',
    description: 'Personal website of ellreka.',
    images: ['https://ellreka.net/favicon.ico'],
  },
}

const Home = async () => {
  const websiteStructuredData = createWebsiteStructuredData();
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
      />
      <div className="mx-auto max-w-2xl animate-fade-in">
        <Title>Home</Title>
        <div className="mt-20 flex items-center justify-center">
          <div className="mx-auto grid w-full max-w-[400px] grid-cols-2 gap-2">
            <div className="grid aspect-square h-full w-full grid-cols-1 gap-2">
              <Card
                className="aspect-auto"
                href="/about"
                label="About"
                index={0}
                // background={
                //   <UserIcon className="absolute right-2 bottom-2 h-[40px] w-auto text-white/20" />
                // }
              />
              <Card
                className="aspect-auto"
                href="/timeline"
                label="Timeline"
                index={1}
                // background={
                //   <ClockIcon className="absolute right-2 bottom-2 h-[40px] w-auto text-white/20" />
                // }
              />
            </div>
            <Card
              href="/entries"
              label="Entries"
              index={2}
              // background={
              //   <DocumentTextIcon className="absolute right-0 bottom-0 h-[60px] w-auto text-white/20" />
              // }
            />
            <Card
              href="/releases"
              label="Releases"
              index={3}
              // background={
              //   <RocketLaunchIcon className="absolute right-2 bottom-2 h-[60px] w-auto text-white/20" />
              // }
            />
            <div className="grid aspect-square w-full grid-cols-2 gap-2">
              <div></div>
              <Card
                href="https://twitter.com/ellreka"
                label="Twitter"
                className="from-zinc-600 to-zinc-300"
                index={4}
                icon={
                  <span className="text-3xl text-black">
                    <FontAwesomeIcon icon={faXTwitter} />
                  </span>
                }
              />
              <Card
                href="https://zenn.dev/ellreka"
                label="Zenn"
                className="from-sky-100 to-sky-300"
                index={5}
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
                index={6}
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

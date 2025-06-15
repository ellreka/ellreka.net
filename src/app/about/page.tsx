import { Title } from '@/components/Title'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'About this blog'
}

const About = () => {
  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
        <Title>About</Title>
        <div className="mt-20 space-y-10">
          <p className="dark:text-white">
            技術的なことから日常的なことまで色々書くブログ
          </p>
          <p className="dark:text-white">
            <a
              href="https://github.com/ellreka/ellreka.net"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600">
              ソースコード
            </a>
          </p>
          <p>
            <Link
              href="/privacy"
              className="text-blue-600">
              プライバシーポリシー
            </Link>
          </p>
          {/* <h2 className="mt-10 dark:text-white text-lg font-bold">Accounts</h2>
          <ul className="dark:text-white">
            <li>
              <span>Github / </span>
              <a
                href="https://github.com/ellreka"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600">
                https://github.com/ellreka
              </a>
            </li>
            <li>
              <span>Twitter / </span>
              <a
                href="https://github.com/ellreka"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600">
                https://twitter.com/ellreka
              </a>
            </li>
            <li>
              <span>Mail / </span>
              <a
                href="mailto:ellreka5364@gmail.com"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600">
                ellreka5364@gmail.com
              </a>
            </li>
          </ul> */}
        </div>
      </div>
  )
}

export default About

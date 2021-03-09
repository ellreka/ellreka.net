import React from 'react'

import Layout from '../../components/Layout'
import { Meta } from '../../components/Meta'
import { Title } from '../../components/Title'

const About: React.FC = () => {
  const meta = {
    title: 'About',
    description: '自己紹介'
  }
  return (
    <Layout>
      <Meta meta={meta} />
      <div className="mx-auto max-w-2xl">
        <Title>About</Title>
        <div className="mt-10">
          <h2 className="dark:text-white text-lg font-bold mt-10">About</h2>
          <p className="dark:text-white">
            主にプログラミングに関する日頃学んだことを雑に書いています。
          </p>
          <p className="dark:text-white">
            このサイトは Next.js + MDX を SSG しています。
          </p>
          <p className="dark:text-white">
            ソースコードは
            <a
              href="https://github.com/ellreka/ellreka.net"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600">
              こちら
            </a>
            です。
          </p>
          <h2 className="dark:text-white text-lg font-bold mt-10">Profile</h2>
          <div className="dark:text-white border dark:border-white border-black p-1 space-y-1">
            <dl className="flex">
              <dt className="w-20">Name</dt>
              <dd>Shun Tanigome</dd>
            </dl>
            <dl className="flex">
              <dt className="w-20">Gender</dt>
              <dd>Man</dd>
            </dl>
            <dl className="flex">
              <dt className="w-20">Birthday</dt>
              <dd>2000/10/17</dd>
            </dl>
            <dl className="flex">
              <dt className="w-20">Age</dt>
              <dd>20</dd>
            </dl>
          </div>
          <div className="dark:text-white mt-10">
            <p>フロントエンドが好きです。</p>
          </div>
          <h2 className="dark:text-white text-lg font-bold mt-10">Hobby</h2>
          <p className="dark:text-white">
            プログラミング、ゲーム、生配信を見ること、深夜に目的なく散歩すること
          </p>
          <h2 className="dark:text-white text-lg font-bold mt-10">Skills</h2>
          <div className="dark:text-white space-y-2">
            <p>⭐ JavaScript, TypeScript, React, HTML5, CSS3</p>
            <p>💜 Next.js, TailwindCSS, StoryBook...</p>
          </div>
          <h2 className="dark:text-white text-lg font-bold mt-10">Accounts</h2>
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
          </ul>
        </div>
      </div>
    </Layout>
  )
}

export default About

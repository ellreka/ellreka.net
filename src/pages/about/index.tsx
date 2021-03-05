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
          <p className="dark:text-white">something</p>
          <h2 className="dark:text-white text-lg font-bold mt-10">Hobby</h2>
          <p className="dark:text-white">
            Programming, Watching a live streaming, Playing games
          </p>
          <h2 className="dark:text-white text-lg font-bold mt-10">Favorite</h2>
          <p className="dark:text-white">Dvorak, </p>
          {/* <h2 className="dark:text-white text-lg font-bold mt-10">Skill</h2>
          <p className="dark:text-white">JavaScript, TypeScript, React,</p> */}
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
            {/* <li>
              <span>Twitter / </span>
              <a
                href="https://github.com/ellreka"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600">
                https://twitter.com/ellreka
              </a>
            </li> */}
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

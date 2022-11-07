import { Title } from '@/components/Title'
import { Meta } from '@/components/Meta'

const About = () => {
  return (
    <>
      <Meta
        meta={{
          title: 'About',
          description: 'このブログについて'
        }}
      />
      <div className="mx-auto max-w-2xl">
        <Title>About</Title>
        <div className="mt-20 space-y-10">
          <p className="dark:text-white">日頃学んだことを雑に書きます。</p>
          <p className="dark:text-white">
            もし間違っている情報などあればプルリクいただけると大変嬉しいです。
          </p>
          <p className="dark:text-white">
            <a
              href="https://github.com/ellreka/ellreka.net"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600">
              このブログのソースコード
            </a>
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
    </>
  )
}

export default About

import { Title } from '@/components/Title'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: 'Privacy Policy'
}

const list = [
  {
    title: 'はじめに',
    content:
      '当ブログは、訪問者のプライバシーを尊重し、当ブログを安全にご利用いただけるよう、個人情報の保護に努めています。このプライバシーポリシーは、当ブログに訪れるすべての方々（以下、「ユーザー」といいます。）が提供する情報の取り扱いについて説明しています。'
  },
  {
    title: '個人情報の第三者への開示について',
    content: `
      当ブログは、ユーザーから提供された個人情報を、ユーザー本人の許可なく第三者に開示することはありません。ただし、次の場合は除きます。
      ・本人のご了解がある場合\n
      ・法令等への協力のため、開示が必要となる場合\n
      `
  },
  {
    title: 'アクセス解析ツールについて',
    content: `
      当ブログでは、Googleによるアクセス解析ツールを使用しています。このアクセス解析ツールは、トラフィックデータの収集のためにCookieを使用しています。このトラフィックデータは匿名で収集されており、個人を特定するものではありません。\n
      また、この機能はCookieを無効にすることで収集を拒否することができます。
      `
  },
  {
    title: 'Cookieについて',
    content: `
      当ブログでは、一部のコンテンツでCookieを使用しています。Cookieは、ユーザーが当ブログを再訪問した際に、より使いやすくするために利用されます。ユーザーはブラウザの設定により、Cookieの利用を拒否することができます。
      `
  },
  {
    title: '広告の配信について',
    content: `
    当サイトは第三者配信の広告サービスGoogle Adsenseを利用しています。\n
    広告配信事業者は、ユーザーの興味に応じた広告を表示するためにCookie（クッキー）を使用することがあります。 Cookie（クッキー）を無効にする設定およびGoogleアドセンスに関する詳細は広告 – ポリシーと規約 – Googleをご覧ください。\n
    また、当サイトは、Amazon.co.jpを宣伝しリンクすることによってサイトが紹介料を獲得できるアフィリエイトプログラムである、Amazonアソシエイト・プログラムの参加者です。\n
    第三者がコンテンツおよび宣伝を提供し、訪問者から直接情報を収集し、訪問者のブラウザにCookie（クッキー）を設定したりこれを認識したりする場合があります。
      `
  },
  {
    title: '著作権について',
    content: `
      当ブログに掲載されている文章や画像などの著作権は、当ブログ運営者に帰属します。これらの無断転載を禁じます。
      `
  },
  {
    title: '免責事項',
    content: `
      当ブログに掲載されている情報は、記事公開時点の正確さを期しておりますが、その内容の正確性や安全性を保証するものではありません。\n
      当ブログの情報を用いて行う一切の行為について、その結果について、一切の責任を負いかねますのでご了承ください。
      `
  },
  {
    title: 'プライバシーポリシーの変更について',
    content: `
      当ブログは、本ポリシーの内容を変更した場合には、変更後のポリシーについて、本サイト上でお知らせします。\n
      変更後のプライバシーポリシーは、本ページに掲載したときから効力を生じるものとします。
      `
  }
]

const PrivacyPolicy = () => {
  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
        <Title>プライバシーポリシー</Title>
        <div className="mt-20 space-y-10 text-white">
          {list.map((item, index) => (
            <div key={index} className="flex flex-col gap-3">
              <h2 className="text-xl font-bold">{item.title}</h2>
              {item.content.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
  )
}

export default PrivacyPolicy

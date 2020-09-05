import React from 'react'
import Layout from '../../components/Layout'
import { Title } from '../../components/Title'
import { Meta } from '../../components/Meta'

type Props = {}

const Profile: React.FC<Props> = () => {
  const meta = {
    title: 'プロフィール'
  }
  return (
    <Layout>
      <Meta meta={meta} />
      <div className="mx-auto max-w-2xl">
        <Title>Profile</Title>
      </div>
    </Layout>
  )
}

export default Profile

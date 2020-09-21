import React from 'react'

import Layout from '../../components/Layout'
import { Meta } from '../../components/Meta'
import { Title } from '../../components/Title'

const Profile: React.FC = () => {
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

import { Title } from '@/components/Title'
import { Meta } from '@/components/Meta'

const Releases = () => {
  return (
    <>
      <Meta
        meta={{
          title: 'Releases',
          description: "ellreka's releases."
        }}
      />
      <div className="mx-auto max-w-2xl animate-fade-in">
        <Title>Releases</Title>
      </div>
    </>
  )
}

export default Releases

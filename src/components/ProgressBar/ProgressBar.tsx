import { ReactElement, useEffect, useState } from 'react'

interface Props {
  loading: boolean
}

export function ProgressBar({ loading }: Props): ReactElement {
  const [percentage, setPercentage] = useState(20)
  useEffect(() => {
    if (!loading) return
    const timer = setTimeout(() => {
      setPercentage(percentage + 1)
    }, 1)
    if (percentage >= 100) {
      clearTimeout(timer)
    }
  }, [loading, percentage])
  return (
    <>
      {loading && (
        <div className="w-screen h-1 fixed top-0 left-0">
          <span
            className="bg-blue-400 h-full absolute top-0 left-0 transition-all"
            style={{
              width: `${percentage}%`
            }}
          />
        </div>
      )}
    </>
  )
}

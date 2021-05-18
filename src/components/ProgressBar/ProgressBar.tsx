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
        <div className="fixed left-0 top-0 w-screen h-1">
          <span
            className="absolute left-0 top-0 h-full bg-blue-400 transition-all"
            style={{
              width: `${percentage}%`
            }}
          />
        </div>
      )}
    </>
  )
}

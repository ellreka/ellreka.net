import React from 'react'
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

export function Footer(): React.ReactElement {
  return (
    <footer className="mx-auto mt-10 mb-5 w-full max-w-2xl">
      <div className="flex w-full justify-between text-gray-400">
        <div className="flex gap-3">
          <small className="">© ellreka</small>
          <a
            href="https://github.com/ellreka"
            target="_blank"
            rel="noreferrer"
            className="">
            <FontAwesomeIcon icon={faGithub} />
          </a>
          <a
            href="https://twitter.com/ellreka"
            target="_blank"
            rel="noreferrer"
            className="">
            <FontAwesomeIcon icon={faTwitter} />
          </a>
        </div>
        <div className="flex gap-3 text-sm">
          <Link href="/privacy" className="">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}

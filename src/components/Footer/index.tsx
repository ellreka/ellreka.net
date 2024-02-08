import React from 'react'
import { faGithub, faXTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

export function Footer(): React.ReactElement {
  return (
    <footer className="mx-auto mt-10 mb-5 w-full">
      <div className="flex w-full items-center justify-center text-gray-400">
        <div className="flex items-center gap-3">
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
            <FontAwesomeIcon icon={faXTwitter} />
          </a>
          <div className="flex gap-3 text-xs">
            <Link href="/privacy" className="">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

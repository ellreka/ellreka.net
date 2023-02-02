import React from 'react'
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export function Footer(): React.ReactElement {
  return (
    <footer className="mt-5 h-12 text-center">
      <div className="mx-auto flex w-12 justify-between">
        <a
          href="https://github.com/ellreka"
          target="_blank"
          rel="noreferrer"
          className="text-black dark:text-white">
          <FontAwesomeIcon icon={faGithub} />
        </a>
        <a
          href="https://twitter.com/ellreka"
          target="_blank"
          rel="noreferrer"
          className="text-black dark:text-white">
          <FontAwesomeIcon icon={faTwitter} />
        </a>
      </div>
      <small className="text-black dark:text-white">© ellreka</small>
    </footer>
  )
}

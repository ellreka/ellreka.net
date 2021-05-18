import React from 'react'
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export function Footer(): React.ReactElement {
  return (
    <footer className="mt-32 h-12 text-center">
      <div className="flex justify-between mx-auto w-12">
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
      <small className="text-black dark:text-white">© 2020 ellreka</small>
    </footer>
  )
}

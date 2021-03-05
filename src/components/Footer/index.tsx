import React from 'react'
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export function Footer(): React.ReactElement {
  return (
    <footer className="text-center h-12 mt-32">
      <div className="flex justify-between w-12 mx-auto">
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

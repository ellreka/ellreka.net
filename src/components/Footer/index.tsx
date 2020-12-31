import React from 'react'

export function Footer(): React.ReactElement {
  return (
    <footer className="text-center h-12 mt-32">
      <div className="flex justify-between w-12 mx-auto">
        <a
          href="https://github.com/ellreka"
          target="_blank"
          rel="noreferrer"
          className="text-black dark:text-white">
          <i className="fab fa-github" />
        </a>
        <a
          href="https://twitter.com/ellreka"
          target="_blank"
          rel="noreferrer"
          className="text-black dark:text-white">
          <i className="fab fa-twitter" />
        </a>
      </div>
      <small className="text-black dark:text-white">© 2020 ellreka</small>
    </footer>
  )
}

import React from 'react'

export const Footer = (): React.ReactElement => (
  <footer className="text-center mt-32">
    <div className="flex justify-between w-12 mx-auto">
      <a href="https://github.com/ellreka" target="_blank">
        <i className="fab fa-github"></i>
      </a>
      <a href="https://twitter.com/ellreka" target="_blank">
        <i className="fab fa-twitter"></i>
      </a>
    </div>
    <small>© 2020 ellreka</small>
  </footer>
)

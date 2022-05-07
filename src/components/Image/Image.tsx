import { ReactElement, CSSProperties, useState, Fragment } from 'react'
import clsx from 'clsx'
import NextImage from 'next/image'
import { Dialog, Transition } from '@headlessui/react'

interface ImageProps {
  width?: string | number
  height?: string | number
  alt?: string
  src: string
  className?: string
  style?: CSSProperties
}
export function Image({
  width,
  height,
  alt,
  src,
  className,
  style
}: ImageProps): ReactElement {
  const [isOpen, setIsOpen] = useState(false)

  const closeModal = () => {
    setIsOpen(false)
  }

  const openModal = () => {
    setIsOpen(true)
  }

  return (
    <>
      <img
        onClick={openModal}
        src={src}
        alt={alt}
        className={clsx('h-auto w-full cursor-pointer md:w-2/3', className)}
        style={style}
      />
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full w-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all">
                  <img
                    onClick={openModal}
                    src={src}
                    alt={alt}
                    className={clsx('h-auto w-full cursor-pointer', className)}
                    style={style}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

import { Fragment, useState } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import {
  ChartBarIcon,
  CogIcon,
  HomeIcon,
  MenuIcon,
  ViewGridAddIcon,
  ViewGridIcon,
  XIcon,
} from '@heroicons/react/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';

import { Head } from '@/components/Head';
import { LogoText } from '@/components/LogoText';
import { SignoutButton } from '@/components/SignoutButton';
import { classNames } from '@/utils/styling';

type Props = {
  title?: string;
  children: React.ReactNode;
};

export const Wrapper: React.FC<Props> = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { pathname } = useRouter();

  const t = useTranslations('navigation');

  const navigation = [
    { name: t('dashboard'), href: '/dashboard', icon: HomeIcon },
    { name: t('journeys'), href: '/journeys', icon: ViewGridIcon },
    { name: t('addJourney'), href: '/add', icon: ViewGridAddIcon },
    { name: t('stats'), href: '/stats', icon: ChartBarIcon },
    { name: t('settings'), href: '/settings', icon: CogIcon },
  ];

  const currentItem = navigation.find((item) => pathname.startsWith(item.href));

  return (
    <>
      <Head title={title} />
      <Transition show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-40 flex md:hidden" onClose={setSidebarOpen}>
          <TransitionChild
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <DialogPanel className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </TransitionChild>
          <TransitionChild
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
              <TransitionChild
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute right-0 top-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>
              <div className="h-0 flex-1 overflow-y-auto pb-4 pt-5">
                <div className="flex flex-shrink-0 items-center px-4">
                  <LogoText className="h-8 w-auto" />
                </div>
                <nav className="mt-5 space-y-1 px-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      passHref
                      className={classNames(
                        item.href === pathname
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                        'group flex items-center rounded-md px-2 py-2 text-base font-medium'
                      )}
                    >
                      <item.icon
                        className={classNames(
                          item.href === pathname ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                          'mr-4 h-6 w-6 flex-shrink-0'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
                <SignoutButton />
              </div>
            </div>
          </TransitionChild>
          <div className="w-14 flex-shrink-0">{/* Force sidebar to shrink to fit close icon */}</div>
        </Dialog>
      </Transition>

      {/* Static sidebar for desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto pb-4 pt-5">
            <div className="flex flex-shrink-0 items-center px-4">
              <LogoText className="h-8 w-auto" />
            </div>
            <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  passHref
                  className={classNames(
                    pathname.startsWith(item.href)
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    'group flex items-center rounded-md px-2 py-2 text-sm font-medium'
                  )}
                >
                  <item.icon
                    className={classNames(
                      item.href === pathname ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                      'mr-3 h-6 w-6 flex-shrink-0'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex w-full flex-shrink-0 border-t border-gray-200 p-4">
            <SignoutButton />
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col md:pl-64">
        <div className="sticky top-0 z-10 bg-white pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <main className="min-h-screen flex-1 bg-gray-50">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">{currentItem?.name}</h1>
            </div>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">{children}</div>
          </div>
        </main>
      </div>
    </>
  );
};

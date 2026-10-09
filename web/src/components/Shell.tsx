import type { ReactNode } from 'react'
import { Rail, TabBar } from './Nav'

/** Page frame. Adds room for the tab bar on phones and the rail on tablets. */
export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh md:pl-[140px] lg:pl-0 flex flex-col">
      <Rail />
      <div className="flex-1 flex flex-col">{children}</div>
      <TabBar />
    </div>
  )
}
export function Main({ children, className = '', inner = '' }: { children: ReactNode; className?: string; inner?: string }) {
  return (
    <div className={`sheet page-enter flex-1 pb-[118px] md:pb-10 ${className}`}>
      <main className={`px-6 pt-4 md:px-10 md:pt-6 max-w-[1200px] mx-auto flex flex-col gap-5 ${inner}`}>{children}</main>
    </div>
  )
}

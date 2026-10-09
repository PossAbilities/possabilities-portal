import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DEMO } from './lib/supabase'
import { AppProvider, useApp } from './lib/AppContext'
import { SignIn } from './pages/SignIn'
import { Home } from './pages/Home'
import { News, Story } from './pages/News'
import { Learn, Reader } from './pages/Learn'
import { Videos } from './pages/Videos'
import { Groups } from './pages/Groups'
import { Settings } from './pages/Settings'

function Gate() {
  const { session, loading } = useApp()
  if (loading) return <div className="min-h-dvh flex items-center justify-center" style={{ background: 'var(--purple)' }} aria-busy="true"><span className="h-display text-white text-[2rem]">Poss<span style={{ color: 'var(--teal)' }}>Abilities</span></span></div>
  if (!session) return <Routes><Route path="*" element={<SignIn />} /></Routes>
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/news" element={<News />} /><Route path="/news/:id" element={<Story />} />
      <Route path="/learn" element={<Learn />} /><Route path="/learn/read/:id" element={<Reader />} />
      <Route path="/videos" element={<Videos />} />
      <Route path="/groups" element={<Groups />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
export default function App() { const Router = DEMO ? HashRouter : BrowserRouter; return <AppProvider><Router><Gate /></Router></AppProvider> }

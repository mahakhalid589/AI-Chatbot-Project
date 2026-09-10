import { Outlet, useLocation } from 'react-router-dom'
import Header from './header'
import Footer from './footer'

export default function Layout() {
  const location = useLocation()
  const isChatPage = location.pathname === '/chat'

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      {!isChatPage && <Footer />}
    </div>
  )
}
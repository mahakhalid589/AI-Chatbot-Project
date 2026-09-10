import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout'
import LandingPage from './pages/landing'
import ChatPage from './pages/chat'
import DocumentsPage from './pages/documents'
import ResearchPage from './pages/research'
import PrivacyPage from './pages/privacy'
import TermsPage from './pages/terms'
import DisclaimerPage from './pages/disclaimer'
// Import the new resource pages
import LegalGuidesPage from './pages/legal-guides'
import CourtDirectoryPage from './pages/court-directory'
import BarCouncilPage from './pages/bar-council'
import LegalGlossaryPage from './pages/legal-glossary'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="research" element={<ResearchPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="disclaimer" element={<DisclaimerPage />} />
        {/* Add the new resource routes */}
        <Route path="legal-guides" element={<LegalGuidesPage />} />
        <Route path="court-directory" element={<CourtDirectoryPage />} />
        <Route path="bar-council" element={<BarCouncilPage />} />
        <Route path="legal-glossary" element={<LegalGlossaryPage />} />
      </Route>
    </Routes>
  )
}

export default App
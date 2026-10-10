import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Nav, Footer } from '@/shared/layout'
import { HomePage } from '@/features/home/HomePage'
import { PricingPage } from '@/features/pricing/PricingPage'
import { ComparePage } from '@/features/compare/ComparePage'
import { CompareHubPage } from '@/features/compare/CompareHubPage'
import { BlogPage } from '@/features/blog/BlogPage'
import { FeaturesPage } from '@/features/features/FeaturesPage'
import { FeatureDetailPage } from '@/features/features/FeatureDetailPage'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) document.querySelector(hash)?.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Nav />
      <main>
        <Routes>
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/features/:slug" element={<FeatureDetailPage />} />
          <Route path="/compare" element={<CompareHubPage />} />
          <Route path="/compare/:slug" element={<ComparePage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

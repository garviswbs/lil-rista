import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HamburgerMenu from './components/HamburgerMenu'
import ParentPageLayout from './components/ParentPageLayout'
import CheckInView1 from './pages/CheckInView/CheckInView1'
import CheckInView2 from './pages/CheckInView/CheckInView2'
import CheckInView3 from './pages/CheckInView/CheckInView3'
import BadgeView1 from './pages/BadgeView/BadgeView1'
import BadgeView2 from './pages/BadgeView/BadgeView2'
import BadgeView3 from './pages/BadgeView/BadgeView3'
import BaristaView1 from './pages/BaristaView/BaristaView1'
import BaristaView2 from './pages/BaristaView/BaristaView2'
import BaristaView3 from './pages/BaristaView/BaristaView3'
import ChildD1 from './pages/ParentD/ChildD1'
import ChildD2 from './pages/ParentD/ChildD2'
import ChildD3 from './pages/ParentD/ChildD3'
import ChildD4 from './pages/ParentD/ChildD4'
import ChildD5 from './pages/ParentD/ChildD5'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <HamburgerMenu />
        <Routes>
          <Route path="/" element={<Navigate to="/check-in-view/check-in-view-1" replace />} />
          <Route path="/check-in-view" element={<ParentPageLayout parent="check-in" />}>
            <Route index element={<Navigate to="check-in-view-1" replace />} />
            <Route path="check-in-view-1" element={<CheckInView1 />} />
            <Route path="check-in-view-2" element={<CheckInView2 />} />
            <Route path="check-in-view-3" element={<CheckInView3 />} />
          </Route>
          <Route path="/badge-view" element={<ParentPageLayout parent="badge" />}>
            <Route index element={<Navigate to="badge-view-1" replace />} />
            <Route path="badge-view-1" element={<BadgeView1 />} />
            <Route path="badge-view-2" element={<BadgeView2 />} />
            <Route path="badge-view-3" element={<BadgeView3 />} />
          </Route>
          <Route path="/barista-view" element={<ParentPageLayout parent="barista" />}>
            <Route index element={<Navigate to="barista-view-1" replace />} />
            <Route path="barista-view-1" element={<BaristaView1 />} />
            <Route path="barista-view-2" element={<BaristaView2 />} />
            <Route path="barista-view-3" element={<BaristaView3 />} />
          </Route>
          <Route path="/parent-d" element={<ParentPageLayout parent="d" />}>
            <Route index element={<Navigate to="child-d1" replace />} />
            <Route path="child-d1" element={<ChildD1 />} />
            <Route path="child-d2" element={<ChildD2 />} />
            <Route path="child-d3" element={<ChildD3 />} />
            <Route path="child-d4" element={<ChildD4 />} />
            <Route path="child-d5" element={<ChildD5 />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App


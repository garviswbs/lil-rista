import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HamburgerMenu from './components/HamburgerMenu'
import ParentPageLayout from './components/ParentPageLayout'
import ChildA1 from './pages/ParentA/ChildA1'
import ChildA2 from './pages/ParentA/ChildA2'
import ChildA3 from './pages/ParentA/ChildA3'
import ChildB1 from './pages/ParentB/ChildB1'
import ChildB2 from './pages/ParentB/ChildB2'
import ChildB3 from './pages/ParentB/ChildB3'
import ChildC1 from './pages/ParentC/ChildC1'
import ChildC2 from './pages/ParentC/ChildC2'
import ChildC3 from './pages/ParentC/ChildC3'
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
          <Route path="/" element={<Navigate to="/parent-a/child-a1" replace />} />
          <Route path="/parent-a" element={<ParentPageLayout parent="a" />}>
            <Route index element={<Navigate to="child-a1" replace />} />
            <Route path="child-a1" element={<ChildA1 />} />
            <Route path="child-a2" element={<ChildA2 />} />
            <Route path="child-a3" element={<ChildA3 />} />
          </Route>
          <Route path="/parent-b" element={<ParentPageLayout parent="b" />}>
            <Route index element={<Navigate to="child-b1" replace />} />
            <Route path="child-b1" element={<ChildB1 />} />
            <Route path="child-b2" element={<ChildB2 />} />
            <Route path="child-b3" element={<ChildB3 />} />
          </Route>
          <Route path="/parent-c" element={<ParentPageLayout parent="c" />}>
            <Route index element={<Navigate to="child-c1" replace />} />
            <Route path="child-c1" element={<ChildC1 />} />
            <Route path="child-c2" element={<ChildC2 />} />
            <Route path="child-c3" element={<ChildC3 />} />
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


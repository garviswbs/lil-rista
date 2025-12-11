import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HamburgerMenu from './components/HamburgerMenu'
import ParentPageLayout from './components/ParentPageLayout'
import NotCheckedIn from './pages/CheckInView/NotCheckedIn'
import CheckedIn from './pages/CheckInView/CheckedIn'
import AllAttendees from './pages/CheckInView/AllAttendees'
import WalkInReg from './pages/CheckInView/WalkInReg'
import AwaitingBadge from './pages/BadgeView/AwaitingBadge'
import BadgeReceived from './pages/BadgeView/BadgeReceived'
import BadgeView3 from './pages/BadgeView/BadgeView3'
import AwaitingBeverage from './pages/BaristaView/AwaitingBeverage'
import BeverageReceived from './pages/BaristaView/BeverageReceived'
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
          <Route path="/" element={<Navigate to="/check-in-view/not-checked-in" replace />} />
          <Route path="/check-in-view" element={<ParentPageLayout parent="check-in" />}>
            <Route index element={<Navigate to="not-checked-in" replace />} />
            <Route path="not-checked-in" element={<NotCheckedIn />} />
            <Route path="checked-in" element={<CheckedIn />} />
            <Route path="all-attendees" element={<AllAttendees />} />
            <Route path="walk-in-reg" element={<WalkInReg />} />
          </Route>
          <Route path="/badge-view" element={<ParentPageLayout parent="badge" />}>
            <Route index element={<Navigate to="awaiting-badge" replace />} />
            <Route path="awaiting-badge" element={<AwaitingBadge />} />
            <Route path="badge-received" element={<BadgeReceived />} />
            <Route path="badge-view-3" element={<BadgeView3 />} />
          </Route>
          <Route path="/barista-view" element={<ParentPageLayout parent="barista" />}>
            <Route index element={<Navigate to="awaiting-beverage" replace />} />
            <Route path="awaiting-beverage" element={<AwaitingBeverage />} />
            <Route path="beverage-received" element={<BeverageReceived />} />
            <Route path="barista-view-3" element={<BaristaView3 />} />
          </Route>
          <Route path="/dashboard" element={<ParentPageLayout parent="dashboard" />}>
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


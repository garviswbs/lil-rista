import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import './ParentPageLayout.css'

const parentConfig = {
  'check-in': {
    name: 'Check-in View',
    children: [
      { name: 'Not Checked-In', path: 'not-checked-in' },
      { name: 'Checked-In', path: 'checked-in' },
      { name: 'All attendees', path: 'all-attendees' },
      { name: 'Walk-In Reg', path: 'walk-in-reg' }
    ]
  },
  badge: {
    name: 'Badge View',
    children: [
      { name: 'Awaiting Badge', path: 'awaiting-badge' },
      { name: 'Badge Received', path: 'badge-received' },
      { name: 'Badge View 3', path: 'badge-view-3' }
    ]
  },
  barista: {
    name: 'Barista View',
    children: [
      { name: 'Barista View 1', path: 'barista-view-1' },
      { name: 'Barista View 2', path: 'barista-view-2' },
      { name: 'Barista View 3', path: 'barista-view-3' }
    ]
  },
  d: {
    name: 'Parent D',
    children: [
      { name: 'Child D1', path: 'child-d1' },
      { name: 'Child D2', path: 'child-d2' },
      { name: 'Child D3', path: 'child-d3' },
      { name: 'Child D4', path: 'child-d4' },
      { name: 'Child D5', path: 'child-d5' }
    ]
  }
}

function ParentPageLayout({ parent }) {
  const navigate = useNavigate()
  const location = useLocation()

  const config = parentConfig[parent]

  if (!config) {
    return <div>Parent page not found</div>
  }

  const handleTabClick = (childPath) => {
    const parentPath = parent === 'check-in' ? 'check-in-view' : parent === 'badge' ? 'badge-view' : parent === 'barista' ? 'barista-view' : `parent-${parent}`
    navigate(`/${parentPath}/${childPath}`)
  }

  const getActiveTab = () => {
    const pathParts = location.pathname.split('/')
    return pathParts[pathParts.length - 1]
  }

  const activeTab = getActiveTab()

  return (
    <div className="parent-page-layout">
      <div className="tabs-container">
        <div className="tabs">
          {config.children.map((child) => (
            <button
              key={child.path}
              className={`tab ${activeTab === child.path ? 'active' : ''}`}
              onClick={() => handleTabClick(child.path)}
            >
              {child.name}
            </button>
          ))}
        </div>
      </div>
      <div className="page-content">
        <Outlet />
      </div>
    </div>
  )
}

export default ParentPageLayout


import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import './ParentPageLayout.css'

const parentConfig = {
  a: {
    name: 'Parent A',
    children: [
      { name: 'Child A1', path: 'child-a1' },
      { name: 'Child A2', path: 'child-a2' },
      { name: 'Child A3', path: 'child-a3' }
    ]
  },
  b: {
    name: 'Parent B',
    children: [
      { name: 'Child B1', path: 'child-b1' },
      { name: 'Child B2', path: 'child-b2' },
      { name: 'Child B3', path: 'child-b3' }
    ]
  },
  c: {
    name: 'Parent C',
    children: [
      { name: 'Child C1', path: 'child-c1' },
      { name: 'Child C2', path: 'child-c2' },
      { name: 'Child C3', path: 'child-c3' }
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
    navigate(`/parent-${parent}/${childPath}`)
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


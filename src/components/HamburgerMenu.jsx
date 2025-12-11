import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './HamburgerMenu.css'

const menuStructure = [
  {
    parent: 'Parent A',
    parentPath: 'parent-a',
    children: [
      { name: 'Child A1', path: 'child-a1' },
      { name: 'Child A2', path: 'child-a2' },
      { name: 'Child A3', path: 'child-a3' }
    ]
  },
  {
    parent: 'Parent B',
    parentPath: 'parent-b',
    children: [
      { name: 'Child B1', path: 'child-b1' },
      { name: 'Child B2', path: 'child-b2' },
      { name: 'Child B3', path: 'child-b3' }
    ]
  },
  {
    parent: 'Parent C',
    parentPath: 'parent-c',
    children: [
      { name: 'Child C1', path: 'child-c1' },
      { name: 'Child C2', path: 'child-c2' },
      { name: 'Child C3', path: 'child-c3' }
    ]
  },
  {
    parent: 'Parent D',
    parentPath: 'parent-d',
    children: [
      { name: 'Child D1', path: 'child-d1' },
      { name: 'Child D2', path: 'child-d2' },
      { name: 'Child D3', path: 'child-d3' },
      { name: 'Child D4', path: 'child-d4' },
      { name: 'Child D5', path: 'child-d5' }
    ]
  }
]

function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const isActiveRoute = (parentPath, childPath) => {
    return location.pathname === `/${parentPath}/${childPath}`
  }

  return (
    <>
      <button 
        className={`hamburger-button ${isOpen ? 'open' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div className={`flyout-menu ${isOpen ? 'open' : ''}`} ref={menuRef}>
        <nav className="menu-nav">
          {menuStructure.map((section) => (
            <div key={section.parentPath} className="menu-section">
              <div className="menu-parent">
                <Link 
                  to={`/${section.parentPath}/${section.children[0].path}`}
                  className="parent-link"
                  onClick={() => setIsOpen(false)}
                >
                  {section.parent}
                </Link>
              </div>
              <ul className="menu-children">
                {section.children.map((child) => (
                  <li key={child.path}>
                    <Link
                      to={`/${section.parentPath}/${child.path}`}
                      className={isActiveRoute(section.parentPath, child.path) ? 'active' : ''}
                      onClick={() => setIsOpen(false)}
                    >
                      {child.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      {isOpen && <div className="flyout-overlay" onClick={() => setIsOpen(false)}></div>}
    </>
  )
}

export default HamburgerMenu


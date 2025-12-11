import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './HamburgerMenu.css'

const menuStructure = [
  {
    parent: 'Check-in View',
    parentPath: 'check-in-view',
    children: [
      { name: 'Not Checked-In', path: 'not-checked-in' },
      { name: 'Checked-In', path: 'checked-in' },
      { name: 'All attendees', path: 'all-attendees' },
      { name: 'Walk-In Reg', path: 'walk-in-reg' }
    ]
  },
  {
    parent: 'Badge View',
    parentPath: 'badge-view',
    children: [
      { name: 'Awaiting Badge', path: 'awaiting-badge' },
      { name: 'Badge Received', path: 'badge-received' },
      { name: 'Badge View 3', path: 'badge-view-3' }
    ]
  },
  {
    parent: 'Barista View',
    parentPath: 'barista-view',
    children: [
      { name: 'Awaiting Beverage', path: 'awaiting-beverage' },
      { name: 'Beverage Received', path: 'beverage-received' },
      { name: 'Barista View 3', path: 'barista-view-3' }
    ]
  },
  {
    parent: 'Dashboard',
    parentPath: 'dashboard',
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
      // Don't close if clicking the hamburger button itself
      if (event.target.closest('.hamburger-button')) {
        return
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      // Use 'click' instead of 'mousedown' for better mobile support
      document.addEventListener('click', handleClickOutside, true)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [isOpen])

  const toggleMenu = (e) => {
    // Prevent event from bubbling to handleClickOutside
    e.stopPropagation()
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


import { useState, useMemo } from 'react'
import '../../components/ChildPage.css'
import './AllAttendees.css'
import { useAttendees } from '../../contexts/AttendeesContext'
import AttendeeCard from '../../components/AttendeeCard'
import LoadingSpinner from '../../components/LoadingSpinner'

function CheckedIn() {
  const { attendees, loading } = useAttendees()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredAttendees = useMemo(() => {
    return attendees
      .filter((attendee) => !attendee.isDeleted && attendee.checkedIn)
      .filter((attendee) => {
        const fullName = `${attendee.firstName} ${attendee.lastName}`.toLowerCase()
        const email = attendee.email.toLowerCase()
        const registrationType = attendee.registrationType.toLowerCase()
        const search = searchTerm.toLowerCase()
        return fullName.includes(search) || email.includes(search) || registrationType.includes(search)
      })
      .sort((a, b) => {
        // Sort by checkedInAt DESC (most recently checked in first)
        const aTime = a.checkedInAt ? new Date(a.checkedInAt) : new Date(0)
        const bTime = b.checkedInAt ? new Date(b.checkedInAt) : new Date(0)
        return bTime - aTime
      })
  }, [attendees, searchTerm])

  if (loading) {
    return (
      <div className="child-page">
        <div className="page-header">
          <h1>Checked-In</h1>
        </div>
        <div className="loading-container">
          <LoadingSpinner size="large" />
        </div>
      </div>
    )
  }

  return (
    <div className="child-page">
      <div className="page-header">
        <h1>Checked-In</h1>
        <input
          type="text"
          className="search-bar"
          placeholder="Search attendees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="attendees-grid">
        {filteredAttendees.length === 0 ? (
          <p>No checked-in attendees found</p>
        ) : (
          filteredAttendees.map((attendee) => (
            <AttendeeCard key={attendee.id} attendee={attendee} mode="checkin" />
          ))
        )}
      </div>
    </div>
  )
}

export default CheckedIn


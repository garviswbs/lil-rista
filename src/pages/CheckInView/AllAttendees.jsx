import { useState, useMemo } from 'react'
import '../../components/ChildPage.css'
import './AllAttendees.css'
import { useAttendees } from '../../contexts/AttendeesContext'
import AttendeeCard from '../../components/AttendeeCard'
import LoadingSpinner from '../../components/LoadingSpinner'

function AllAttendees() {
  const { attendees, loading } = useAttendees()
  const [searchTerm, setSearchTerm] = useState('')

  // Filter out soft-deleted attendees and apply search
  const filteredAttendees = useMemo(() => {
    return attendees
      .filter((attendee) => !attendee.isDeleted)
      .filter((attendee) => {
        const fullName = `${attendee.firstName} ${attendee.lastName}`.toLowerCase()
        const email = attendee.email.toLowerCase()
        const registrationType = attendee.registrationType.toLowerCase()
        const search = searchTerm.toLowerCase()
        return fullName.includes(search) || email.includes(search) || registrationType.includes(search)
      })
      .sort((a, b) => {
        // Sort by createdAt DESC for FIFO (newest first, but we want oldest first for check-in order)
        return new Date(a.createdAt) - new Date(b.createdAt)
      })
  }, [attendees, searchTerm])

  if (loading) {
    return (
      <div className="child-page">
        <div className="page-header">
          <h1>All attendees</h1>
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
        <h1>All attendees</h1>
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
          <p>No attendees found</p>
        ) : (
          filteredAttendees.map((attendee) => (
            <AttendeeCard key={attendee.id} attendee={attendee} mode="checkin" />
          ))
        )}
      </div>
    </div>
  )
}

export default AllAttendees


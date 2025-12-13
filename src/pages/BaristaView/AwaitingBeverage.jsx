import { useState, useMemo } from 'react'
import '../../components/ChildPage.css'
import '../CheckInView/AllAttendees.css'
import { useAttendees } from '../../contexts/AttendeesContext'
import BaristaCard from '../../components/BaristaCard'
import LoadingSpinner from '../../components/LoadingSpinner'

function AwaitingBeverage() {
  const { attendees, loading } = useAttendees()
  const [searchTerm, setSearchTerm] = useState('')

  // Filter out soft-deleted attendees, awaiting beverage attendees, and apply search
  const filteredAttendees = useMemo(() => {
    return attendees
      .filter((attendee) => !attendee.isDeleted)
      .filter((attendee) => attendee.checkedIn && !attendee.receivedDrink)
      .filter((attendee) => {
        const fullName = `${attendee.firstName} ${attendee.lastName}`.toLowerCase()
        const email = attendee.email.toLowerCase()
        const drinkType = attendee.drinkType.toLowerCase()
        const search = searchTerm.toLowerCase()
        return fullName.includes(search) || email.includes(search) || drinkType.includes(search)
      })
      .sort((a, b) => {
        // Sort by createdAt ASC for FIFO (oldest first)
        return new Date(a.createdAt) - new Date(b.createdAt)
      })
  }, [attendees, searchTerm])

  if (loading) {
    return (
      <div className="child-page">
        <div className="page-header">
          <h1>Awaiting Beverage</h1>
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
        <h1>Awaiting Beverage</h1>
        <input
          type="text"
          className="search-bar"
          placeholder="Search attendees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="barista-grid">
        {filteredAttendees.length === 0 ? (
          <p>No attendees found</p>
        ) : (
          filteredAttendees.map((attendee) => (
            <BaristaCard key={attendee.id} attendee={attendee} />
          ))
        )}
      </div>
    </div>
  )
}

export default AwaitingBeverage


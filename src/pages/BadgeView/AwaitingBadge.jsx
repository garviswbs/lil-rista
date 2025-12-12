import { useState } from 'react'
import './ChildPage.css'
import '../CheckInView/AllAttendees.css'
import attendeesData from '../../data/attendees.json'
import AttendeeCard from '../../components/AttendeeCard'

function AwaitingBadge() {
  const [searchTerm, setSearchTerm] = useState('')
  const awaitingBadgeAttendees = attendeesData.filter(attendee => attendee.checkedIn && !attendee.receivedBadge)

  const filteredAttendees = awaitingBadgeAttendees.filter((attendee) => {
    const fullName = `${attendee.firstName} ${attendee.lastName}`.toLowerCase()
    const email = attendee.email.toLowerCase()
    const registrationType = attendee.registrationType.toLowerCase()
    const search = searchTerm.toLowerCase()
    return fullName.includes(search) || email.includes(search) || registrationType.includes(search)
  })

  return (
    <div className="child-page">
      <div className="page-header">
        <h1>Awaiting Badge</h1>
        <input
          type="text"
          className="search-bar"
          placeholder="Search attendees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="attendees-grid">
        {filteredAttendees.map((attendee) => (
          <AttendeeCard key={attendee.id} attendee={attendee} mode="badge" />
        ))}
      </div>
    </div>
  )
}

export default AwaitingBadge


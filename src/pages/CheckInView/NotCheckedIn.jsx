import { useState } from 'react'
import '../../components/ChildPage.css'
import './AllAttendees.css'
import attendeesData from '../../data/attendees.json'
import AttendeeCard from '../../components/AttendeeCard'

function NotCheckedIn() {
  const [searchTerm, setSearchTerm] = useState('')
  const notCheckedInAttendees = attendeesData.filter(attendee => !attendee.checkedIn)

  const filteredAttendees = notCheckedInAttendees.filter((attendee) => {
    const fullName = `${attendee.firstName} ${attendee.lastName}`.toLowerCase()
    const email = attendee.email.toLowerCase()
    const registrationType = attendee.registrationType.toLowerCase()
    const search = searchTerm.toLowerCase()
    return fullName.includes(search) || email.includes(search) || registrationType.includes(search)
  })

  return (
    <div className="child-page">
      <div className="page-header">
        <h1>Not Checked-In</h1>
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
          <AttendeeCard key={attendee.id} attendee={attendee} />
        ))}
      </div>
    </div>
  )
}

export default NotCheckedIn


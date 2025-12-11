import './ChildPage.css'
import './AllAttendees.css'
import attendeesData from '../../data/attendees.json'
import AttendeeCard from '../../components/AttendeeCard'

function AllAttendees() {
  return (
    <div className="child-page">
      <h1>All attendees</h1>
      <div className="attendees-grid">
        {attendeesData.map((attendee) => (
          <AttendeeCard key={attendee.id} attendee={attendee} />
        ))}
      </div>
    </div>
  )
}

export default AllAttendees


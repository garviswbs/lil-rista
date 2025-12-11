import './ChildPage.css'
import './AllAttendees.css'
import attendeesData from '../../data/attendees.json'
import AttendeeCard from '../../components/AttendeeCard'

function CheckedIn() {
  const checkedInAttendees = attendeesData.filter(attendee => attendee.checkedIn)

  return (
    <div className="child-page">
      <h1>Checked-In</h1>
      <div className="attendees-grid">
        {checkedInAttendees.map((attendee) => (
          <AttendeeCard key={attendee.id} attendee={attendee} />
        ))}
      </div>
    </div>
  )
}

export default CheckedIn


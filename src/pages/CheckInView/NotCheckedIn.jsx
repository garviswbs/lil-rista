import './ChildPage.css'
import './AllAttendees.css'
import attendeesData from '../../data/attendees.json'
import AttendeeCard from '../../components/AttendeeCard'

function NotCheckedIn() {
  const notCheckedInAttendees = attendeesData.filter(attendee => !attendee.checkedIn)

  return (
    <div className="child-page">
      <h1>Not Checked-In</h1>
      <div className="attendees-grid">
        {notCheckedInAttendees.map((attendee) => (
          <AttendeeCard key={attendee.id} attendee={attendee} />
        ))}
      </div>
    </div>
  )
}

export default NotCheckedIn


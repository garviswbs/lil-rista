import { useState } from 'react'
import './ChildPage.css'
import '../CheckInView/AllAttendees.css'
import attendeesData from '../../data/attendees.json'
import BaristaCard from '../../components/BaristaCard'

function BeverageReceived() {
    const [searchTerm, setSearchTerm] = useState('')
    const beverageReceivedAttendees = attendeesData.filter(attendee => attendee.checkedIn && attendee.receivedDrink)

    const filteredAttendees = beverageReceivedAttendees.filter((attendee) => {
        const fullName = `${attendee.firstName} ${attendee.lastName}`.toLowerCase()
        const email = attendee.email.toLowerCase()
        const drinkType = attendee.drinkType.toLowerCase()
        const search = searchTerm.toLowerCase()
        return fullName.includes(search) || email.includes(search) || drinkType.includes(search)
    })

    return (
        <div className="child-page">
            <div className="page-header">
                <h1>Beverage Received</h1>
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Search attendees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="barista-grid">
                {filteredAttendees.map((attendee) => (
                    <BaristaCard key={attendee.id} attendee={attendee} />
                ))}
            </div>
        </div>
    )
}

export default BeverageReceived


import './AttendeeCard.css'

function AttendeeCard({ attendee, mode = 'checkin' }) {
  const renderButtons = () => {
    if (mode === 'badge') {
      // Badge view: Give Badge (green) if receivedBadge is false, Revoke Badge if true
      if (!attendee.receivedBadge) {
        return <button className="btn-give-badge">Give Badge</button>
      } else {
        return <button className="btn-revoke-badge">Revoke Badge</button>
      }
    } else {
      // Check-in view: Checkout if checkedIn is true, Check In if false
      if (attendee.checkedIn) {
        return <button className="btn-checkout">Checkout</button>
      } else {
        return <button className="btn-checkin">Check In</button>
      }
    }
  }

  return (
    <div className="attendee-card">
      <div className="attendee-header">
        <h2 className="attendee-name">
          {attendee.firstName} {attendee.lastName}
        </h2>
      </div>
      <div className="attendee-details">
        <div className="detail-row">
          <span className="detail-label">Registration Type:</span>
          <span className="detail-value">{attendee.registrationType}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Drink Type:</span>
          <span className="detail-value">{attendee.drinkType}</span>
        </div>
        <div className="status-section">
          <div className={`status-item ${mode === 'checkin' ? 'status-item-highlight' : ''}`}>
            <span className="status-label">
              <span className="status-icon">✓</span>
              Checked In:
            </span>
            <span className={`status-badge ${attendee.checkedIn ? 'status-yes' : 'status-no'}`}>
              {attendee.checkedIn ? 'Yes' : 'No'}
            </span>
          </div>
          <div className={`status-item ${mode === 'badge' ? 'status-item-highlight' : ''}`}>
            <span className="status-label">
              <span className="status-icon">🎫</span>
              Received Badge:
            </span>
            <span className={`status-badge ${attendee.receivedBadge ? 'status-yes' : 'status-no'}`}>
              {attendee.receivedBadge ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="status-item">
            <span className="status-label">
              <span className="status-icon">☕</span>
              Received Drink:
            </span>
            <span className={`status-badge ${attendee.receivedDrink ? 'status-yes' : 'status-no'}`}>
              {attendee.receivedDrink ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>
      <div className="card-actions">
        {renderButtons()}
      </div>
    </div>
  )
}

export default AttendeeCard


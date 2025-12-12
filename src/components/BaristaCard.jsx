import './BaristaCard.css'

function BaristaCard({ attendee }) {
    return (
        <div className="barista-card">
            <div className="barista-header">
                <h2 className="barista-name">
                    {attendee.firstName} {attendee.lastName}
                </h2>
            </div>
            <div className="barista-details">
                <div className="detail-row">
                    <span className="detail-label">Drink Type:</span>
                    <span className="detail-value">{attendee.drinkType}</span>
                </div>
            </div>
            <div className="card-actions">
                {attendee.receivedDrink ? (
                    <button className="btn-resubmit-order">Resubmit Order</button>
                ) : (
                    <button className="btn-complete-order">Complete Order</button>
                )}
            </div>
        </div>
    )
}

export default BaristaCard


import { useAttendees } from '../contexts/AttendeesContext'
import { useLoading } from '../contexts/LoadingContext'
import { useToast } from '../contexts/ToastContext'
import LoadingSpinner from './LoadingSpinner'
import './BaristaCard.css'

function BaristaCard({ attendee }) {
    const { toggleDrink } = useAttendees()
    const { isLoading } = useLoading()
    const { success, error } = useToast()

    const handleDrink = async () => {
        const loadingKey = `drink-${attendee.id}`
        try {
            await toggleDrink(attendee.id)
            const action = attendee.receivedDrink ? 'revoked' : 'given'
            success(`Drink ${action} successfully`)
        } catch (err) {
            error(err.message || 'Failed to update drink status')
        }
    }

    const loadingKey = `drink-${attendee.id}`
    const isButtonLoading = isLoading(loadingKey)

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
                    <button 
                        className="btn-resubmit-order" 
                        onClick={handleDrink}
                        disabled={isButtonLoading || !attendee.checkedIn}
                    >
                        {isButtonLoading ? <LoadingSpinner size="small" /> : 'Resubmit Order'}
                    </button>
                ) : (
                    <button 
                        className="btn-complete-order" 
                        onClick={handleDrink}
                        disabled={isButtonLoading || !attendee.checkedIn}
                    >
                        {isButtonLoading ? <LoadingSpinner size="small" /> : 'Complete Order'}
                    </button>
                )}
            </div>
        </div>
    )
}

export default BaristaCard


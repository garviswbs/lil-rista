import { useState } from 'react'
import { useAttendees } from '../contexts/AttendeesContext'
import { useLoading } from '../contexts/LoadingContext'
import { useToast } from '../contexts/ToastContext'
import { getFormattedTimestamp } from '../utils/timestampUtils'
import CheckInModal from './CheckInModal'
import LoadingSpinner from './LoadingSpinner'
import './AttendeeCard.css'

const REGISTRATION_OPTIONS = [
  'Media',
  'Investor',
  'Sell-Side Analyst',
  'Starbucks Leadership',
  'Starbucks Staff',
]

const DRINK_OPTIONS = [
  'Drip Coffee',
  'Seasonal Specialty',
  'Latte',
  'Americano',
  'No Drink',
]

function AttendeeCard({ attendee, mode = 'checkin' }) {
  const { toggleCheckIn, toggleBadge, toggleDrink } = useAttendees()
  const { isLoading } = useLoading()
  const { success, error } = useToast()
  const [showCheckInModal, setShowCheckInModal] = useState(false)
  const [showCheckoutConfirm, setShowCheckoutConfirm] = useState(false)

  // Check if registration type is "Other" (not in standard options)
  const isOtherRegistration = !REGISTRATION_OPTIONS.includes(attendee.registrationType)

  // Check if drink type is "Custom" or "No Drink"
  const isCustomDrink = !DRINK_OPTIONS.includes(attendee.drinkType)
  const isNoDrink = attendee.drinkType === 'No Drink'

  const handleCheckIn = () => {
    setShowCheckInModal(true)
  }

  const handleCheckout = async () => {
    if (!showCheckoutConfirm) {
      setShowCheckoutConfirm(true)
      return
    }

    const loadingKey = `checkin-${attendee.id}`
    try {
      await toggleCheckIn(attendee.id)
      success('Attendee checked out successfully')
      setShowCheckoutConfirm(false)
    } catch (err) {
      error(err.message || 'Failed to checkout attendee')
      setShowCheckoutConfirm(false)
    }
  }

  const handleBadge = async () => {
    const loadingKey = `badge-${attendee.id}`
    try {
      await toggleBadge(attendee.id)
      const action = attendee.receivedBadge ? 'revoked' : 'given'
      success(`Badge ${action} successfully`)
    } catch (err) {
      error(err.message || 'Failed to update badge status')
    }
  }

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

  const renderButtons = () => {
    if (mode === 'badge') {
      const loadingKey = `badge-${attendee.id}`
      const isButtonLoading = isLoading(loadingKey)

      if (!attendee.receivedBadge) {
        return (
          <button
            className="btn-give-badge"
            onClick={handleBadge}
            disabled={isButtonLoading || !attendee.checkedIn}
          >
            {isButtonLoading ? <LoadingSpinner size="small" /> : 'Give Badge'}
          </button>
        )
      } else {
        return (
          <button
            className="btn-revoke-badge"
            onClick={handleBadge}
            disabled={isButtonLoading}
          >
            {isButtonLoading ? <LoadingSpinner size="small" /> : 'Revoke Badge'}
          </button>
        )
      }
    } else {
      const loadingKey = `checkin-${attendee.id}`
      const isButtonLoading = isLoading(loadingKey)

      if (attendee.checkedIn) {
        return (
          <button
            className="btn-checkout"
            onClick={handleCheckout}
            disabled={isButtonLoading}
          >
            {isButtonLoading ? <LoadingSpinner size="small" /> : showCheckoutConfirm ? 'Confirm Checkout' : 'Checkout'}
          </button>
        )
      } else {
        return (
          <button
            className="btn-checkin"
            onClick={handleCheckIn}
            disabled={isButtonLoading}
          >
            {isButtonLoading ? <LoadingSpinner size="small" /> : 'Check In'}
          </button>
        )
      }
    }
  }

  const getRegistrationDisplay = () => {
    if (isOtherRegistration) {
      return <span className="detail-value detail-value-other">Other</span>
    }
    return <span className="detail-value">{attendee.registrationType}</span>
  }

  const getDrinkStatusDisplay = () => {
    if (isNoDrink) {
      return <span className="status-badge status-na">NA</span>
    }
    if (isCustomDrink && attendee.receivedDrink) {
      return <span className="status-badge status-custom">Custom</span>
    }
    return (
      <span className={`status-badge ${attendee.receivedDrink ? 'status-yes' : 'status-no'}`}>
        {attendee.receivedDrink ? 'Yes' : 'No'}
      </span>
    )
  }

  return (
    <>
      <div className="attendee-card">
        <div className="attendee-header">
          <h2 className="attendee-name">
            {attendee.firstName} {attendee.lastName}
          </h2>
          <div className="attendee-timestamp">
            {getFormattedTimestamp(attendee)}
          </div>
        </div>
        <div className="attendee-details">
          <div className="detail-row">
            <span className="detail-label">Registration Type:</span>
            {getRegistrationDisplay()}
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
              {getDrinkStatusDisplay()}
            </div>
          </div>
        </div>
        <div className="card-actions">
          {renderButtons()}
        </div>
      </div>

      <CheckInModal
        attendee={attendee}
        isOpen={showCheckInModal}
        onClose={() => {
          setShowCheckInModal(false)
          setShowCheckoutConfirm(false)
        }}
      />
    </>
  )
}

export default AttendeeCard


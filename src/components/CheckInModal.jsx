import { useState, useEffect } from 'react'
import { useAttendees } from '../contexts/AttendeesContext'
import { useLoading } from '../contexts/LoadingContext'
import { useToast } from '../contexts/ToastContext'
import { RegistrationTypeDropdown } from './RegistrationTypeDropdown'
import { DrinkTypeDropdown } from './DrinkTypeDropdown'
import LoadingSpinner from './LoadingSpinner'
import './CheckInModal.css'

export default function CheckInModal({ attendee, isOpen, onClose }) {
  const { updateAttendee, toggleCheckIn } = useAttendees()
  const { isLoading } = useLoading()
  const { success, error } = useToast()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    registrationType: '',
    drinkType: '',
  })

  useEffect(() => {
    if (attendee) {
      setFormData({
        firstName: attendee.firstName || '',
        lastName: attendee.lastName || '',
        email: attendee.email || '',
        registrationType: attendee.registrationType || '',
        drinkType: attendee.drinkType || '',
      })
    }
  }, [attendee])

  if (!isOpen) return null

  const loadingKey = `checkin-${attendee?.id}`
  const isSubmitting = isLoading(loadingKey)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegistrationTypeChange = (value) => {
    setFormData((prev) => ({ ...prev, registrationType: value }))
  }

  const handleDrinkTypeChange = (value) => {
    setFormData((prev) => ({ ...prev, drinkType: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      error('Please fill in all required fields')
      return
    }

    if (!formData.registrationType || !formData.registrationType.trim()) {
      error('Please select a registration type')
      return
    }

    if (!formData.drinkType || !formData.drinkType.trim()) {
      error('Please select a drink type')
      return
    }

    try {
      // First update the attendee data
      await updateAttendee(attendee.id, formData)

      // Then toggle check-in status
      await toggleCheckIn(attendee.id)

      success('Attendee checked in successfully')
      onClose()
    } catch (err) {
      error(err.message || 'Failed to check in attendee')
    }
  }

  const handleCancel = () => {
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Check In Attendee</h2>
          <button className="modal-close" onClick={handleCancel} disabled={isSubmitting}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="checkin-form">
          <div className="form-group">
            <label>
              First Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-group">
            <label>
              Last Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-group">
            <label>
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-group">
            <RegistrationTypeDropdown
              value={formData.registrationType}
              onChange={handleRegistrationTypeChange}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-group">
            <DrinkTypeDropdown
              value={formData.drinkType}
              onChange={handleDrinkTypeChange}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={handleCancel} disabled={isSubmitting} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-submit">
              {isSubmitting ? <LoadingSpinner size="small" /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


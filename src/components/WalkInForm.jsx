import { useState } from 'react'
import { useAttendees } from '../contexts/AttendeesContext'
import { useLoading } from '../contexts/LoadingContext'
import { useToast } from '../contexts/ToastContext'
import { RegistrationTypeDropdown } from './RegistrationTypeDropdown'
import { DrinkTypeDropdown } from './DrinkTypeDropdown'
import LoadingSpinner from './LoadingSpinner'
import './WalkInForm.css'

export default function WalkInForm() {
  const { createAttendee, toggleCheckIn } = useAttendees()
  const { isLoading } = useLoading()
  const { success, error } = useToast()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    registrationType: '',
    drinkType: '',
  })

  const loadingKey = 'create-walkin'
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

  const validateForm = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      error('Please fill in all required fields')
      return false
    }

    if (!formData.registrationType || !formData.registrationType.trim()) {
      error('Please select a registration type')
      return false
    }

    if (!formData.drinkType || !formData.drinkType.trim()) {
      error('Please select a drink type')
      return false
    }

    return true
  }

  const handleSave = async () => {
    if (!validateForm()) return

    try {
      const newAttendee = await createAttendee({
        ...formData,
        checkedIn: false,
        receivedBadge: false,
        receivedDrink: false,
      })

      success('Attendee created successfully')
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        registrationType: '',
        drinkType: '',
      })
    } catch (err) {
      error(err.message || 'Failed to create attendee')
    }
  }

  const handleSaveAndCheckIn = async () => {
    if (!validateForm()) return

    try {
      const newAttendee = await createAttendee({
        ...formData,
        checkedIn: true,
        receivedBadge: false,
        receivedDrink: false,
      })

      // The check-in timestamp will be set by the API
      success('Attendee created and checked in successfully')
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        registrationType: '',
        drinkType: '',
      })
    } catch (err) {
      error(err.message || 'Failed to create and check in attendee')
    }
  }

  return (
    <div className="walk-in-form-container">
      <div className="walk-in-form-header">
        <h1>Walk-In Registration</h1>
      </div>

      <form className="walk-in-form" onSubmit={(e) => e.preventDefault()}>
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

        <div className="form-actions">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
            className="btn-save"
          >
            {isSubmitting ? <LoadingSpinner size="small" /> : 'Save User'}
          </button>
          <button
            type="button"
            onClick={handleSaveAndCheckIn}
            disabled={isSubmitting}
            className="btn-save-checkin"
          >
            {isSubmitting ? <LoadingSpinner size="small" /> : 'Save and Check-In'}
          </button>
        </div>
      </form>
    </div>
  )
}


import { useState, useEffect } from 'react'
import './RegistrationTypeDropdown.css'

const REGISTRATION_OPTIONS = [
  'Media',
  'Investor',
  'Sell-Side Analyst',
  'Starbucks Leadership',
  'Starbucks Staff',
  'Other',
]

export function RegistrationTypeDropdown({ value, onChange, disabled = false, required = false }) {
  const [selectedOption, setSelectedOption] = useState('')
  const [customValue, setCustomValue] = useState('')

  // Initialize: check if value matches an option, otherwise it's "Other"
  useEffect(() => {
    if (value) {
      if (REGISTRATION_OPTIONS.slice(0, -1).includes(value)) {
        setSelectedOption(value)
        setCustomValue('')
      } else {
        setSelectedOption('Other')
        setCustomValue(value)
      }
    }
  }, [value])

  const handleOptionChange = (e) => {
    const option = e.target.value
    setSelectedOption(option)
    if (option === 'Other') {
      // Keep custom value if it exists
      if (customValue) {
        onChange(customValue)
      } else {
        onChange('')
      }
    } else {
      setCustomValue('')
      onChange(option)
    }
  }

  const handleCustomChange = (e) => {
    const custom = e.target.value
    setCustomValue(custom)
    onChange(custom)
  }

  return (
    <div className="registration-type-dropdown">
      <label className="dropdown-label">
        Registration Type {required && <span className="required">*</span>}
      </label>
      <select
        value={selectedOption}
        onChange={handleOptionChange}
        disabled={disabled}
        className="dropdown-select"
        required={required}
      >
        <option value="">Select registration type</option>
        {REGISTRATION_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {selectedOption === 'Other' && (
        <input
          type="text"
          value={customValue}
          onChange={handleCustomChange}
          placeholder="Enter registration type"
          disabled={disabled}
          className="custom-input"
          required={required && selectedOption === 'Other'}
        />
      )}
    </div>
  )
}


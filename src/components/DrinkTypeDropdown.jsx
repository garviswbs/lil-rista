import { useState, useEffect } from 'react'
import './DrinkTypeDropdown.css'

const DRINK_OPTIONS = [
  'Drip Coffee',
  'Seasonal Specialty',
  'Latte',
  'Americano',
  'No Drink',
  'Custom',
]

// Mapping from old drink types to new options
const DRINK_MAPPING = {
  'Latte': 'Latte',
  'Cappuccino': 'Latte', // Map to closest match
  'Americano': 'Americano',
  'Mocha': 'Seasonal Specialty',
  'Espresso': 'Drip Coffee',
  'Frappuccino': 'Seasonal Specialty',
  'Cold Brew': 'Drip Coffee',
  'Tea': 'Seasonal Specialty',
  'Hot Chocolate': 'Seasonal Specialty',
  'None': 'No Drink',
}

export function DrinkTypeDropdown({ value, onChange, disabled = false, required = false }) {
  const [selectedOption, setSelectedOption] = useState('')
  const [customValue, setCustomValue] = useState('')

  // Initialize: check if value matches an option, otherwise it's "Custom"
  useEffect(() => {
    if (value) {
      // First check if it's a direct match
      if (DRINK_OPTIONS.slice(0, -1).includes(value)) {
        setSelectedOption(value)
        setCustomValue('')
      } else {
        // Check if it maps to an option
        const mapped = DRINK_MAPPING[value]
        if (mapped) {
          setSelectedOption(mapped)
          setCustomValue('')
        } else {
          // It's a custom value
          setSelectedOption('Custom')
          setCustomValue(value)
        }
      }
    }
  }, [value])

  const handleOptionChange = (e) => {
    const option = e.target.value
    setSelectedOption(option)
    if (option === 'Custom') {
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
    <div className="drink-type-dropdown">
      <label className="dropdown-label">
        Drink Type {required && <span className="required">*</span>}
      </label>
      <select
        value={selectedOption}
        onChange={handleOptionChange}
        disabled={disabled}
        className="dropdown-select"
        required={required}
      >
        <option value="">Select drink type</option>
        {DRINK_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {selectedOption === 'Custom' && (
        <textarea
          value={customValue}
          onChange={handleCustomChange}
          placeholder="Enter drink order details"
          disabled={disabled}
          className="custom-textarea"
          rows={3}
          required={required && selectedOption === 'Custom'}
        />
      )}
    </div>
  )
}


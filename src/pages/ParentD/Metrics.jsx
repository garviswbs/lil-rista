import { useMemo } from 'react'
import { useAttendees } from '../../contexts/AttendeesContext'
import LoadingSpinner from '../../components/LoadingSpinner'
import './Metrics.css'

function Metrics() {
    const { attendees, loading } = useAttendees()

    // Calculate metrics from attendees data
    const metrics = useMemo(() => {
        const nonDeleted = attendees.filter(a => !a.isDeleted)
        const totalRegistered = nonDeleted.length
        const totalCheckedIn = nonDeleted.filter(a => a.checkedIn).length
        const totalOutstanding = totalRegistered - totalCheckedIn
        const totalWalkIn = nonDeleted.filter(a =>
            a.registrationType === 'Walk-In' || a.registrationType === 'Walk-in'
        ).length

        // Group check-ins by registration type
        const checkInsByGroup = {}
        nonDeleted
            .filter(a => a.checkedIn)
            .forEach(attendee => {
                const group = attendee.registrationType || 'Unknown'
                checkInsByGroup[group] = (checkInsByGroup[group] || 0) + 1
            })

        return {
            totalRegistered,
            totalCheckedIn,
            totalOutstanding,
            totalWalkIn,
            checkInsByGroup
        }
    }, [attendees])

    const checkInRate = metrics.totalRegistered > 0
        ? ((metrics.totalCheckedIn / metrics.totalRegistered) * 100).toFixed(1)
        : 0

    if (loading) {
        return (
            <div className="metrics-dashboard">
                <div className="metrics-header">
                    <h1>Dashboard Metrics</h1>
                    <p className="metrics-subtitle">Real-time event attendance statistics</p>
                </div>
                <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                    <LoadingSpinner size="large" />
                </div>
            </div>
        )
    }

    return (
        <div className="metrics-dashboard">
            <div className="metrics-header">
                <h1>Dashboard Metrics</h1>
                <p className="metrics-subtitle">Real-time event attendance statistics</p>
            </div>

            <div className="metrics-grid">
                <div className="metric-card">
                    <div className="metric-icon">👥</div>
                    <div className="metric-content">
                        <h3 className="metric-label">Total Registered Attendees</h3>
                        <p className="metric-value">{metrics.totalRegistered.toLocaleString()}</p>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon">✅</div>
                    <div className="metric-content">
                        <h3 className="metric-label">Total Checked-In Attendees</h3>
                        <p className="metric-value">{metrics.totalCheckedIn.toLocaleString()}</p>
                        <p className="metric-percentage">{checkInRate}% check-in rate</p>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon">⏳</div>
                    <div className="metric-content">
                        <h3 className="metric-label">Total Outstanding Attendees</h3>
                        <p className="metric-value">{metrics.totalOutstanding.toLocaleString()}</p>
                        <p className="metric-percentage">
                            {((metrics.totalOutstanding / metrics.totalRegistered) * 100).toFixed(1)}% remaining
                        </p>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-icon">🚶</div>
                    <div className="metric-content">
                        <h3 className="metric-label">Total Walk-In Attendees</h3>
                        <p className="metric-value">{metrics.totalWalkIn.toLocaleString()}</p>
                        <p className="metric-percentage">
                            {metrics.totalCheckedIn > 0
                                ? ((metrics.totalWalkIn / metrics.totalCheckedIn) * 100).toFixed(1)
                                : 0}% of checked-in
                        </p>
                    </div>
                </div>
            </div>

            <div className="group-checkins-section">
                <h2 className="section-title">Check-ins by Registration Type</h2>
                <div className="group-checkins-grid">
                    {Object.keys(metrics.checkInsByGroup).length === 0 ? (
                        <p>No check-ins yet</p>
                    ) : (
                        Object.entries(metrics.checkInsByGroup).map(([group, count]) => (
                            <div key={group} className="group-card">
                                <h3 className="group-name">{group}</h3>
                                <p className="group-count">{count.toLocaleString()}</p>
                                <div className="group-bar">
                                    <div
                                        className="group-bar-fill"
                                        style={{
                                            width: `${metrics.totalCheckedIn > 0 ? (count / metrics.totalCheckedIn) * 100 : 0}%`
                                        }}
                                    ></div>
                                </div>
                                <p className="group-percentage">
                                    {metrics.totalCheckedIn > 0
                                        ? ((count / metrics.totalCheckedIn) * 100).toFixed(1)
                                        : 0}% of checked-in
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default Metrics

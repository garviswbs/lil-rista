import './Metrics.css'

function Metrics() {
    // Placeholder data - replace with actual data from your API/state management
    const metrics = {
        totalRegistered: 1250,
        totalCheckedIn: 892,
        totalOutstanding: 358,
        totalWalkIn: 45,
        checkInsByGroup: {
            'Group A': 320,
            'Group B': 285,
            'Group C': 287
        }
    }

    const checkInRate = metrics.totalRegistered > 0
        ? ((metrics.totalCheckedIn / metrics.totalRegistered) * 100).toFixed(1)
        : 0

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
                            {((metrics.totalWalkIn / (metrics.totalCheckedIn + metrics.totalWalkIn)) * 100).toFixed(1)}% of checked-in
                        </p>
                    </div>
                </div>
            </div>

            <div className="group-checkins-section">
                <h2 className="section-title">Check-ins by Group Type</h2>
                <div className="group-checkins-grid">
                    {Object.entries(metrics.checkInsByGroup).map(([group, count]) => (
                        <div key={group} className="group-card">
                            <h3 className="group-name">{group}</h3>
                            <p className="group-count">{count.toLocaleString()}</p>
                            <div className="group-bar">
                                <div
                                    className="group-bar-fill"
                                    style={{
                                        width: `${(count / metrics.totalCheckedIn) * 100}%`
                                    }}
                                ></div>
                            </div>
                            <p className="group-percentage">
                                {((count / metrics.totalCheckedIn) * 100).toFixed(1)}% of checked-in
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Metrics

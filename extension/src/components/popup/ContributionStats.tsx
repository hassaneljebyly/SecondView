export default function ContributionStats() {
  return (
    <section className='contribution-stats sv-divider sv-divider--bottom'>
      <h2 className='contribution-stats__title'>Your Contributions:</h2>
      <div className='contribution-stats__stats'>
        <div className='contribution-stats__stat'>
          {/* <span className='stat__icon' aria-hidden='true'></span> */}
          <span className='contribution-stats__stat-label'>Notes:</span>
          <span className='contribution-stats__stat-value'>12</span>
        </div>
        <div className='contribution-stats__stat'>
          {/* <span className='stat__icon'>⭐</span> */}
          <span className='contribution-stats__stat-label'>Ratings:</span>
          <span className='contribution-stats__stat-value'>34</span>
        </div>
        <div className='contribution-stats__stat'>
          {/* <span className='stat__icon'>⭐</span> */}
          <span className='contribution-stats__stat-label'>Accuracy:</span>
          <span className='contribution-stats__stat-value'>89%</span>
        </div>
        <div className='contribution-stats__stat'>
          {/* <span className='stat__icon'>⭐</span> */}
          <span className='contribution-stats__stat-label'>Helpful</span>
          <span className='contribution-stats__stat-value'>156</span>
        </div>
      </div>
    </section>
  );
}

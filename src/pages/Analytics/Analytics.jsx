import styles from './Analytics.module.css'
import Card from '@components/shared/Card/Card'
import Stat from '@components/shared/Stat/Stat'

export default function AnalyticsPage() {
  return (
    <div className={styles.analyticsPage}>
      <Card>
        <h2>Productivity Analytics</h2>
        <div className={styles.statsContainer}>
          <Stat value="5.2" label="Hours Today" />
          <Stat value="12" label="Sessions" />
          <Stat value="87%" label="Consistency" />
        </div>
      </Card>
    </div>
  )
}
import styles from './Sessions.module.css'
import Card from '@components/shared/Card/Card'

export default function SessionsPage() {
  return (
    <div className={styles.sessionsPage}>
      <Card>
        <h2>Session Planner</h2>
        <div className={styles.sessionGrid}>
          <div className={styles.sessionCard}>
            <h3>Deep Work</h3>
            <p>90 minutes</p>
            <button>Start</button>
          </div>
          <div className={styles.sessionCard}>
            <h3>Pomodoro</h3>
            <p>25 minutes</p>
            <button>Start</button>
          </div>
        </div>
      </Card>
    </div>
  )
}
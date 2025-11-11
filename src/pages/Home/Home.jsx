import styles from './Home.module.css';
import Timer from '../../components/Timer/Timer';
import Card from '../../components/shared/Card/Card';

export default function Home() {
  return (
    <div className={styles.homePage}>
      <Card>
        <h2>Today's Focus</h2>
        <div className={styles.timerContainer}>
          <Timer />
        </div>
      </Card>

      <Card>
        <h3>Quick Actions</h3>
        <div className={styles.quickActions}>
          <button>Start Focus Session</button>
          <button>Take Break</button>
        </div>
      </Card>
    </div>
  );
}
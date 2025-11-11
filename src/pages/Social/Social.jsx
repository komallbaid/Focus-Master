import styles from './Social.module.css'
import Card from '@components/shared/Card/Card'

export default function SocialPage() {
  return (
    <div className={styles.socialPage}>
      <Card>
        <h2>Community</h2>
        <div className={styles.friendsList}>
          <div className={styles.friendItem}>
            <span>👩💻 Sarah</span>
            <span>3h 42m</span>
          </div>
          <div className={styles.friendItem}>
            <span>👨💻 Alex</span>
            <span>2h 15m</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
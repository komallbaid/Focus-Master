import styles from './NavBar.module.css'

const navItems = [
  { icon: '🏠', label: 'Home', page: 'home' },
  { icon: '⏱️', label: 'Sessions', page: 'sessions' },
  { icon: '📊', label: 'Analytics', page: 'analytics' },
  { icon: '👥', label: 'Social', page: 'social' },
  { icon: '⚙️', label: 'Settings', page: 'settings' },
]

export default function NavBar({ current, onChange }) {
  return (
    <nav className={styles.navBar}>
      {navItems.map((item) => (
        <button
          key={item.page}
          className={`${styles.navItem} ${current === item.page ? styles.active : ''}`}
          onClick={() => onChange(item.page)}
        >
          <span className={styles.navIcon}>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
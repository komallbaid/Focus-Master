import styles from './Settings.module.css'
import Card from '@components/shared/Card/Card'
import { useState } from 'react'

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className={styles.settingsPage}>
      <Card>
        <h2>App Settings</h2>
        <div className={styles.settingItem}>
          <label>Dark Mode</label>
          <input 
            type="checkbox" 
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
        </div>
      </Card>
    </div>
  )
}
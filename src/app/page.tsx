'use client';

import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <h1 className={styles.senu}>SENU</h1>
          <div className={styles.loadingDots}>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
          </div>
        </div>
        <p className={styles.subtitle}>Coming Soon</p>
      </div>
    </main>
  );
}

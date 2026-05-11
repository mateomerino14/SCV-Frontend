import AppLogo from '../components/ui/AppLogo'
import { COLORS } from '../constants'

const styles = {
  footer: "p-1 border-t",
  inner: "max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 px-4",
  title: "text-xs font-bold font-inter",
  sub: "text-xs font-inter",
  year: "text-xs font-inter",
  background: "bg-white",
}

function Footer() {
  return (
    <footer className={styles.footer} style={{ backgroundColor: COLORS.footer, borderColor: COLORS.dataFields }}>
      <div className={styles.inner}>
        <div className='md:text-left text-center'>
          <p className={styles.title} style={{ color: COLORS.secondary }}>MAXAM – Sistema de Rendición de Gastos</p>
          <p className={styles.sub} style={{ color: COLORS.labels }}>Uso interno exclusivo del personal autorizado.</p>
          <p className={styles.year} style={{ color: COLORS.labels }}>© 2026</p>
        </div>
          <AppLogo/>
      </div>
    </footer>
  )
}

export default Footer;
import {COLORS} from '../../constants';

const styles = {
  button: 'w-full py-3 rounded-xl font-bold font-nunito text-sm cursor-pointer text-center border mt-3',
};

// Boton "Cargar más" de las listas paginadas (mismo estilo que el historial de viajes)
function LoadMoreButton({onClick, loading = false, label = 'Cargar más'}) {
  return (
    <button className={styles.button} style={{borderColor: COLORS.primary, color: COLORS.primary, opacity: loading ? 0.6 : 1}}
      onClick={onClick} disabled={loading}>
      {loading ? 'Cargando...' : label}
    </button>
  );
}

export default LoadMoreButton;

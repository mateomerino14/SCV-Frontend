import {BookmarkCheck} from "lucide-react";
import Button  from "../../components/ui/Button"
import { COLORS } from '../../constants'

const styles={
    overlay:'fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm',
    card:'items-center flex flex-col p-6 rounded-lg w-80',
    icon:'rounded-full p-2', 
    title:'text-3xl font-bold font-inter leading-tight text-white text-center mt-3',
    label:'font-inter text-center text-white m-5',
    buttons:'flex flex-row gap-4 '
}

function ConfirmacionModal({isOpen,onClose}){
    if (isOpen===false) return null;
    return(
        <div className={styles.overlay}>
            <div className={styles.card} style={{ backgroundColor: COLORS.primary}}>
            <BookmarkCheck size={100} style={{color: COLORS.background ,backgroundColor:COLORS.backgroundSecondary }} className={styles.icon}/>
            <h2 className={styles.title}>Registro <br/> Exitoso</h2>
            <span className={styles.label}>Se registro el viaje <br/> correctamente</span>
            <div className={styles.buttons}>
            <Button text="Aceptar" variant="secondary" onClick={onClose}/>
            </div>
            </div>
        </div>
    );  
}
export default ConfirmacionModal;
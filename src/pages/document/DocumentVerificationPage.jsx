import {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Search} from 'lucide-react';
import InputField from '../../components/ui/InputField';
import SkeletonCard from '../../components/ui/SkeletonCard';
import DocumentVerificationCard from '../../features/document/organisms/DocumentVerificationCard';
import useDocumentVerification from '../../hooks/shared/useDocumentVerification';
import logo from '../../assets/logo-maxam.png';
import {COLORS} from '../../constants';

const styles = {
  page: 'min-h-dvh flex flex-col items-center px-4 py-8',
  content: 'w-full max-w-xl flex flex-col gap-5',
  logo: 'h-16 object-contain mx-auto',
  title: 'text-2xl font-bold font-inter text-center',
  subtitle: 'text-sm font-inter text-center',
  form: 'flex flex-col gap-3',
  input: 'bg-transparent w-full outline-none font-inter text-sm uppercase',
  button: 'w-full py-3 rounded-xl font-bold font-nunito text-base cursor-pointer',
};

function DocumentVerificationPage() {
  const {codigo} = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState(codigo || '');
  const {loading, document, error} = useDocumentVerification(codigo);
  const handleSubmit = (event) => {
    event.preventDefault();
    const cleanCode = code.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (cleanCode) {
      navigate(`/verificar/${cleanCode}`);
    }
  };
  return (
    <div className={styles.page} style={{backgroundColor: COLORS.backgroundHeader}}>
      <div className={styles.content}>
        <img src={logo} alt="MAXAM FANEXA" className={styles.logo} />
        <h1 className={styles.title} style={{color: COLORS.title}}>Verificar documento</h1>
        <p className={styles.subtitle} style={{color: COLORS.labels}}>Escanea el QR del documento o escribe el código que figura junto a él.</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <InputField label="Código del documento" icon={<Search size={16} style={{color: COLORS.primary}} />}>
            <input type="text" placeholder="XXXX-XXXX-XXXX" maxLength={14} className={styles.input} style={{color: COLORS.text}}
              value={code} onChange={(event) => setCode(event.target.value)} aria-label="Código del documento" />
          </InputField>
          <button type="submit" className={styles.button} style={{backgroundColor: COLORS.primary, color: COLORS.background}}>Verificar</button>
        </form>
        {loading && <SkeletonCard />}
        {!loading && codigo && <DocumentVerificationCard document={document} error={error} />}
      </div>
    </div>
  );
}

export default DocumentVerificationPage;

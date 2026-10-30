import {useState, useEffect} from 'react';
import {verifyDocument} from '../../services/shared/documentService';

function useDocumentVerification(code) {
  const [result, setResult] = useState({loading: !!code, document: null, error: ''});

  useEffect(() => {
    if (!code) {
      return undefined;
    }
    let cancelled = false;
    verifyDocument(code).then((data) => {
      if (cancelled) {
        return;
      }
      if (data.error) {
        setResult({loading: false, document: null, error: data.error});
      }
      else {
        setResult({loading: false, document: data, error: ''});
      }
    });
    return () => {
      cancelled = true;
    };
  }, [code]);

  return result;
}

export default useDocumentVerification;

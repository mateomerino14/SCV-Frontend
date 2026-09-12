import {useState} from 'react';
import {saveAs} from 'file-saver';
import {downloadStatementPdf} from '../../services/trip/tripService';

function useStatementPdfDownload(tripId) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async () => {
    setDownloading(true);
    setError('');
    const data = await downloadStatementPdf(tripId);
    setDownloading(false);
    if (data.error) {
      setError(data.error);
      return;
    }
    saveAs(data.blob, data.fileName);
  };

  return {downloading, error, handleDownload};
}

export default useStatementPdfDownload;

import {useState} from 'react';

const maxFileSize = 5 * 1024 * 1024;
const unchangedAction = 'Sin cambios';

const initialState = {fileName: '', rows: [], preview: [], result: null, error: ''};

function useExcelImport({downloadTemplate, parseFile, previewRows, importRows, onImported}) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState(initialState);
  const [checking, setChecking] = useState(false);
  const [importing, setImporting] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const validRows = state.preview.filter((row) => row.valido);
  const invalidRows = state.preview.filter((row) => !row.valido);
  const actionableRows = validRows.filter((row) => row.accion !== unchangedAction);

  const open = () => {
    setState(initialState);
    setIsOpen(true);
  };

  const close = () => {
    if (importing) {
      return;
    }
    setIsOpen(false);
  };

  const handleDownloadTemplate = async () => {
    setDownloading(true);
    await downloadTemplate();
    setDownloading(false);
  };

  const selectFile = async (file) => {
    if (!file) {
      return;
    }
    if (file.size > maxFileSize) {
      setState({...initialState, fileName: file.name, error: 'El archivo supera los 5 MB'});
      return;
    }
    setChecking(true);
    setState({...initialState, fileName: file.name});
    const parsed = await parseFile(file);
    if (parsed.error) {
      setChecking(false);
      setState({...initialState, fileName: file.name, error: parsed.error});
      return;
    }
    const data = await previewRows(parsed.rows);
    setChecking(false);
    if (data.error) {
      setState({...initialState, fileName: file.name, error: data.error});
      return;
    }
    setState({...initialState, fileName: file.name, rows: parsed.rows, preview: data.filas});
  };

  const confirmImport = async () => {
    setImporting(true);
    const data = await importRows(state.rows);
    setImporting(false);
    if (data.error) {
      setState({...state, error: data.error});
      return;
    }
    setState({...state, result: data, error: ''});
    await onImported();
  };

  return {
    isOpen, open, close, fileName: state.fileName, preview: state.preview, result: state.result, error: state.error,
    validRows, invalidRows, actionableRows, checking, importing, downloading, downloadTemplate: handleDownloadTemplate, selectFile, confirmImport,
  };
}

export default useExcelImport;

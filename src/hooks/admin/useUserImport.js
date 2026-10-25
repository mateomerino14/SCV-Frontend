import {useState} from 'react';
import {previewUserImport, importUsers} from '../../services/admin/adminService';
import {downloadUserImportTemplate, parseUserImportFile} from '../../utils/userImportFile';

const maxFileSize = 5 * 1024 * 1024;

const initialState = {fileName: '', rows: [], preview: [], result: null, error: ''};

function useUserImport({positions, sections, onImported}) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState(initialState);
  const [checking, setChecking] = useState(false);
  const [importing, setImporting] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const validRows = state.preview.filter((row) => row.valido);
  const invalidRows = state.preview.filter((row) => !row.valido);

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

  const downloadTemplate = async () => {
    setDownloading(true);
    await downloadUserImportTemplate({positions, sections});
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
    const parsed = await parseUserImportFile(file);
    if (parsed.error) {
      setChecking(false);
      setState({...initialState, fileName: file.name, error: parsed.error});
      return;
    }
    const data = await previewUserImport(parsed.rows);
    setChecking(false);
    if (data.error) {
      setState({...initialState, fileName: file.name, error: data.error});
      return;
    }
    setState({...initialState, fileName: file.name, rows: parsed.rows, preview: data.filas});
  };

  const confirmImport = async () => {
    setImporting(true);
    const data = await importUsers(state.rows);
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
    validRows, invalidRows, checking, importing, downloading, downloadTemplate, selectFile, confirmImport,
  };
}

export default useUserImport;

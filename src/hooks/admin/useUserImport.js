import {previewUserImport, importUsers} from '../../services/admin/adminService';
import {downloadUserImportTemplate, parseUserImportFile} from '../../utils/userImportFile';
import useExcelImport from './useExcelImport';

function useUserImport({positions, sections, onImported}) {
  return useExcelImport({
    downloadTemplate: () => downloadUserImportTemplate({positions, sections}),
    parseFile: parseUserImportFile,
    previewRows: previewUserImport,
    importRows: importUsers,
    onImported,
  });
}

export default useUserImport;

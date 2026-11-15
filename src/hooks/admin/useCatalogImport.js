import {previewSectionImport, importSections, previewPositionImport, importPositions} from '../../services/admin/adminService';
import {downloadSectionImportTemplate, parseSectionImportFile, downloadPositionImportTemplate, parsePositionImportFile} from '../../utils/catalogImportFiles';
import useExcelImport from './useExcelImport';

const catalogImports = {
  section: {downloadTemplate: downloadSectionImportTemplate, parseFile: parseSectionImportFile, previewRows: previewSectionImport, importRows: importSections},
  position: {downloadTemplate: downloadPositionImportTemplate, parseFile: parsePositionImportFile, previewRows: previewPositionImport, importRows: importPositions},
};

function useCatalogImport(catalog, onImported) {
  return useExcelImport({...catalogImports[catalog], onImported});
}

export default useCatalogImport;

import {previewSectionImport, importSections, previewPositionImport, importPositions} from '../../services/admin/adminService';
import {downloadSectionImportTemplate, parseSectionImportFile, downloadPositionImportTemplate, parsePositionImportFile} from '../../utils/catalogImportFiles';
import useExcelImport from './useExcelImport';

const catalogImports = {
  section: {downloadTemplate: downloadSectionImportTemplate, parseFile: parseSectionImportFile, previewRows: previewSectionImport, importRows: importSections},
  position: {downloadTemplate: downloadPositionImportTemplate, parseFile: parsePositionImportFile, previewRows: previewPositionImport, importRows: importPositions},
};

function useCatalogImport(catalog, onImported, scaleTypes) {
  const config = catalogImports[catalog];
  return useExcelImport({...config, downloadTemplate: () => config.downloadTemplate(scaleTypes), onImported});
}

export default useCatalogImport;

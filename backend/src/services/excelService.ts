import * as XLSX from 'xlsx';
import fs from 'fs';

export interface ExcelSheetData {
  name: string;
  headers: string[];
  rows: Record<string, any>[];
  rowCount: number;
  columnCount: number;
}

export interface ExcelParseResult {
  fileName: string;
  sheets: ExcelSheetData[];
  totalSheets: number;
  totalRows: number;
  totalCells: number;
  fullTextContent: string;
}

export interface ExcelFilterOptions {
  search?: string;
  sheetName?: string;
  columns?: string[];
  page?: number;
  limit?: number;
}

export interface FilteredExcelData {
  sheets: ExcelSheetData[];
  totalRows: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function parseExcelFile(filePath: string, fileName: string): ExcelParseResult {
  const buffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(buffer, { type: 'buffer' });

  const sheets: ExcelSheetData[] = [];
  let totalRows = 0;
  let totalCells = 0;
  const textParts: string[] = [];

  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: '' });
    const headers = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];

    const rowCount = jsonData.length;
    const columnCount = headers.length;
    totalRows += rowCount;
    totalCells += rowCount * columnCount;

    // Build full text content from all cells
    textParts.push(`[工作表: ${sheetName}]`);
    textParts.push(headers.join(' | '));
    for (const row of jsonData) {
      const cellValues = headers.map((h) => String(row[h] ?? ''));
      textParts.push(cellValues.join(' | '));
    }

    sheets.push({
      name: sheetName,
      headers,
      rows: jsonData,
      rowCount,
      columnCount,
    });
  }

  return {
    fileName,
    sheets,
    totalSheets: sheets.length,
    totalRows,
    totalCells,
    fullTextContent: textParts.join('\n'),
  };
}

export function filterExcelData(
  parseResult: ExcelParseResult,
  options: ExcelFilterOptions
): FilteredExcelData {
  const { search, sheetName, columns, page = 1, limit = 50 } = options;

  let filteredSheets = parseResult.sheets;

  // Filter by sheet name
  if (sheetName) {
    filteredSheets = filteredSheets.filter((s) => s.name === sheetName);
  }

  // Filter columns
  if (columns && columns.length > 0) {
    filteredSheets = filteredSheets.map((sheet) => ({
      ...sheet,
      headers: sheet.headers.filter((h) => columns.includes(h)),
      rows: sheet.rows.map((row) => {
        const filtered: Record<string, any> = {};
        for (const col of columns) {
          if (col in row) filtered[col] = row[col];
        }
        return filtered;
      }),
    }));
  }

  // Full text search
  if (search) {
    const term = search.toLowerCase();
    filteredSheets = filteredSheets.map((sheet) => {
      const matchedRows = sheet.rows.filter((row) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(term)
        )
      );
      return { ...sheet, rows: matchedRows, rowCount: matchedRows.length };
    });
  }

  // Calculate total rows across all sheets
  const totalFilteredRows = filteredSheets.reduce((sum, s) => sum + s.rows.length, 0);

  // Paginate: flatten rows across sheets, then slice
  const startIdx = (page - 1) * limit;
  let remaining = limit;
  let skipped = 0;
  const paginatedSheets: ExcelSheetData[] = [];

  for (const sheet of filteredSheets) {
    if (skipped + sheet.rows.length <= startIdx) {
      skipped += sheet.rows.length;
      continue;
    }

    const sheetStart = Math.max(0, startIdx - skipped);
    const sheetRows = sheet.rows.slice(sheetStart, sheetStart + remaining);
    remaining -= sheetRows.length;
    skipped += sheet.rows.length;

    paginatedSheets.push({
      ...sheet,
      rows: sheetRows,
      rowCount: sheet.rows.length,
    });

    if (remaining <= 0) break;
  }

  return {
    sheets: paginatedSheets,
    totalRows: totalFilteredRows,
    page,
    limit,
    totalPages: Math.ceil(totalFilteredRows / limit),
  };
}

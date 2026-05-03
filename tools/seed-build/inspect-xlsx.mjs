import XLSX from 'xlsx';
import path from 'path';

const workbook = XLSX.readFile('tools/seed-build/input/CIS_Controls_v8.1.xlsx');
console.log('Sheets:', workbook.SheetNames);

// Inspect first few rows of a likely sheet
const sheetName = 'Controls v8.1.2';
console.log('Inspecting sheet:', sheetName);
const sheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
console.log('First 10 rows:');
data.slice(0, 10).forEach((row, i) => console.log(`${i}:`, row));

import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

const INPUT_FILE = 'tools/seed-build/input/CIS_Controls_v8.1.xlsx';
const OUTPUT_CONTROLS = 'public/seed/controls.json';
const OUTPUT_SAFEGUARDS = 'public/seed/safeguards.json';

function buildSeed() {
  console.log('Reading workbook...');
  const workbook = XLSX.readFile(INPUT_FILE);
  const sheet = workbook.Sheets['Controls v8.1.2'];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  const controls = [];
  const safeguards = [];

  // Skip header row
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row[0]) continue; // Skip empty rows

    const controlNumber = parseInt(row[0]);
    const safeguardId = row[1]; // e.g. 1.1

    if (!safeguardId) {
      // This is a Control row
      controls.push({
        number: controlNumber,
        name: row[4].trim(),
        description: row[5].trim(),
        sortOrder: controlNumber
      });
    } else {
      // This is a Safeguard row
      
      // Determine IG level (minimum IG where it applies)
      let igLevel = 'IG3';
      if (row[6] === 'x') igLevel = 'IG1';
      else if (row[7] === 'x') igLevel = 'IG2';

      safeguards.push({
        id: safeguardId.toString(),
        controlNumber: controlNumber,
        title: row[4].trim(),
        description: row[5].trim(),
        igLevel: igLevel,
        assetType: row[2] ? row[2].trim() : 'N/A',
        securityFunction: row[3] ? row[3].trim() : 'N/A'
      });
    }
  }

  console.log(`Extracted ${controls.length} Controls and ${safeguards.length} Safeguards.`);

  const seedMetadata = {
    seedVersion: "2025-03-01", // Based on file name
    frameworkVersion: "8.1",
    sourcePub: "CIS Critical Security Controls v8.1",
    fetchedAt: new Date().toISOString(),
    license: "CC BY-NC-ND 4.0",
    attribution: "Center for Internet Security, Inc. — https://www.cisecurity.org/controls/"
  };

  fs.writeFileSync(OUTPUT_CONTROLS, JSON.stringify({ ...seedMetadata, controls }, null, 2));
  fs.writeFileSync(OUTPUT_SAFEGUARDS, JSON.stringify({ ...seedMetadata, safeguards }, null, 2));

  console.log('Seed files generated successfully.');
  
  // Basic validation
  if (controls.length !== 18) console.warn(`Warning: Expected 18 controls, found ${controls.length}`);
  if (safeguards.length !== 153) console.warn(`Warning: Expected 153 safeguards, found ${safeguards.length}`);
  
  const ig1Count = safeguards.filter(s => s.igLevel === 'IG1').length;
  console.log(`Safeguards in IG1: ${ig1Count}`);
}

buildSeed();

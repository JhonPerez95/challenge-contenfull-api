const fs = require('fs');
const path = require('path');

const coveragePath = path.join(__dirname, 'coverage', 'coverage-final.json');

if (!fs.existsSync(coveragePath)) {
  console.error('No se encontró coverage-final.json');
  process.exit(1);
}

const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
let totalStatements = 0;
let coveredStatements = 0;

for (const file of Object.values(coverage)) {
  if (!file.s) continue;
  for (const [key, count] of Object.entries(file.s)) {
    totalStatements++;
    if (count > 0) coveredStatements++;
  }
}

const percentage = totalStatements === 0 ? 0 : ((coveredStatements / totalStatements) * 100).toFixed(2);
console.log(`Cobertura de statements: ${percentage}% (${coveredStatements}/${totalStatements})`);

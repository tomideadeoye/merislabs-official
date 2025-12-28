import { standardizeLawFirmName, handleMultipleLawFirms } from './utils';
import { lawFirmMappings as lawFirmMappingsData } from '@merislabs/data';

// Type for law firm mappings
interface LawFirmMappings {
  mappings: Record<string, string[]>;
  defaultMappings: Record<string, string>;
}

const lawFirmMappings = lawFirmMappingsData as LawFirmMappings;

// Test cases for all the mappings we have
const testCases = [
  // Punuka variations
  { input: "Punuka Attorneys", expected: "Punuka Attorneys" },
  { input: "Punuka Attorneys & Solicitors", expected: "Punuka Attorneys" },
  { input: "Punuka", expected: "Punuka Attorneys" },
  { input: "Punuka Attorneys.", expected: "Punuka Attorneys" },
  { input: "Punuka Attorneys & Solicitors.", expected: "Punuka Attorneys" },

  // Wale Taiwo variations
  { input: "Wale Taiwo & Co.", expected: "Wale Taiwo & Co" },
  { input: "Wale Taiwo & Co", expected: "Wale Taiwo & Co" },

  // G. Elias variations
  { input: "G. Elias", expected: "G. Elias" },
  { input: "G. Elias & Co", expected: "G. Elias" },
  { input: "G. Elias & Co.", expected: "G. Elias" },
  { input: "G. Elias & Co./ Wole Taiwo", expected: "G. Elias" },

  // Paul Usoro variations
  { input: "Paul Usoro & Co.", expected: "Paul Usoro & Co" },
  { input: "Paul Usoro & Co", expected: "Paul Usoro & Co" },

  // F.O Akinrele variations
  { input: "F.O Akinrele & Co.", expected: "F.O Akinrele & Co" },
  { input: "F.O Akinrele & Co", expected: "F.O Akinrele & Co" },

  // Convergence LP variations
  { input: "Convergence LP", expected: "Convergence LP" },
  { input: "Convergence Law Practice", expected: "Convergence LP" },

  // New mappings
  { input: "BA Law LLP", expected: "BA Law LLP" },
  { input: "Kunle Ogunba & Associates", expected: "Kunle Ogunba & Associates" },
  { input: "Kunle Ogunba & Co./Punuka Attorneys & Solicitors", expected: "Kunle Ogunba & Associates" },
  { input: "Fayemiwo & Co.", expected: "Fayemiwo & Co" },
  { input: "Fayemiwo & Co", expected: "Fayemiwo & Co" },
  { input: "Ikenna Onwusika & Co", expected: "Ikenna Onwusika & Co" },
  { input: "Ikenna Onwusika & Co.", expected: "Ikenna Onwusika & Co" },
  { input: "B. Ayorinde & Co.", expected: "B. Ayorinde & Co" },
  { input: "B. Ayorinde & Co", expected: "B. Ayorinde & Co" },

  // Edge cases
  { input: "", expected: "Not Specified" },
  { input: "Not Specified", expected: "Not Specified" },
  { input: "Unknown Law Firm", expected: "Unknown Law Firm" },

  // Unidentified mappings
  { input: "Unascertained", expected: "Unidentified" },
  { input: "NIL", expected: "Unidentified" },
  { input: "To be confirmed", expected: "Unidentified" },
  { input: "Not indicated", expected: "Unidentified" },

  // Additional F.O Akinrele variations
  { input: "F.O Akinrele", expected: "F.O Akinrele & Co" },
  { input: "F.O. Akinrele", expected: "F.O Akinrele & Co" },
  { input: "F.O. Akinrele & Co.", expected: "F.O Akinrele & Co" },
  { input: "F.O. Akinrele & Co", expected: "F.O Akinrele & Co" },
  { input: "F. O Akinrele & Co", expected: "F.O Akinrele & Co" },
  { input: "F.O AKINRELE", expected: "F.O Akinrele & Co" },
  { input: "F. O. Akinrele", expected: "F.O Akinrele & Co" },

  // Additional Punuka variations
  { input: "Punuka Attorneys and Solicitors", expected: "Punuka Attorneys" },
  { input: "Punuka Attorneys and Solicitors.", expected: "Punuka Attorneys" },

  // Additional Convergence variations
  { input: "Convergence Law Firm", expected: "Convergence LP" },
  { input: "Convergence Legal Practice", expected: "Convergence LP" },
  { input: "Convergence LP.", expected: "Convergence LP" },

  // Additional Kunle Ogunba variations
  { input: "Kunle Ogunba & Co.", expected: "Kunle Ogunba & Associates" },
  { input: "Kunle Ogunba & Co", expected: "Kunle Ogunba & Associates" },

  // Additional B. Ayorinde variations
  { input: "B.Ayorinde & Co", expected: "B. Ayorinde & Co" },

  // Additional BA Law variations
  { input: "B.A Law LP", expected: "BA Law LLP" },
  { input: "B.A Law LLP", expected: "BA Law LLP" },

  // Additional Agbaje variations
  { input: "Agbaje & Agbaje", expected: "Agbaje Agbaje & Co." },
  { input: "Agbaje & Agbaje & Co", expected: "Agbaje Agbaje & Co." }
];

// Run standardization tests
console.log("Running comprehensive law firm name standardization tests...\n");

let passed = 0;
let failed = 0;

testCases.forEach(({ input, expected }) => {
  const result = standardizeLawFirmName(input, lawFirmMappings);
  const status = result === expected ? "PASS" : "FAIL";

  if (status === "PASS") {
    passed++;
  } else {
    failed++;
  }

  console.log(`[${status}] standardizeLawFirmName("${input}") => "${result}" (expected: "${expected}")`);
});

console.log(`\nStandardization Test Results: ${passed} passed, ${failed} failed`);

// Test multiple law firm handling
console.log("\nRunning multiple law firm handling tests...\n");

const multipleFirmTestCases = [
  {
    input: "Wale Taiwo & Co; F.O Akinrele & Co.",
    expected: ["Wale Taiwo & Co", "F.O Akinrele & Co"]
  },
  {
    input: "Punuka Attorneys",
    expected: ["Punuka Attorneys"]
  },
  {
    input: "",
    expected: ["Not Specified"]
  }
];

let multiplePassed = 0;
let multipleFailed = 0;

multipleFirmTestCases.forEach(({ input, expected }) => {
  const result = handleMultipleLawFirms(input, lawFirmMappings);
  const status = JSON.stringify(result) === JSON.stringify(expected) ? "PASS" : "FAIL";

  if (status === "PASS") {
    multiplePassed++;
  } else {
    multipleFailed++;
  }

  console.log(`[${status}] handleMultipleLawFirms("${input}") => ${JSON.stringify(result)} (expected: ${JSON.stringify(expected)})`);
});

console.log(`\nMultiple Law Firm Test Results: ${multiplePassed} passed, ${multipleFailed} failed`);

// Overall results
const totalPassed = passed + multiplePassed;
const totalFailed = failed + multipleFailed;

console.log(`\nOverall Test Results: ${totalPassed} passed, ${totalFailed} failed`);

if (totalFailed === 0) {
  console.log("All tests passed! 🎉");
} else {
  console.log(`Some tests failed. Please review the implementation.`);
}

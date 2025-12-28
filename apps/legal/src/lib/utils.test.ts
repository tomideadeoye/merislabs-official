import { standardizeLawFirmName } from './utils';

// Mock law firm mappings for testing
const testMappings = {
  mappings: {
    "Punuka Attorneys": [
      "Punuka Attorneys",
      "Punuka Attorneys & Solicitors",
      "Punuka",
      "Punuka Attorneys."
    ],
    "Wale Taiwo & Co": [
      "Wale Taiwo & Co.",
      "Wale Taiwo & Co"
    ],
    "G. Elias": [
      "G. Elias",
      "G. Elias & Co",
      "G. Elias & Co."
    ]
  },
  defaultMappings: {
    "Not Specified": "Not Specified"
  }
};

// Test cases
const testCases = [
  { input: "Punuka Attorneys", expected: "Punuka Attorneys" },
  { input: "Punuka Attorneys & Solicitors", expected: "Punuka Attorneys" },
  { input: "Punuka", expected: "Punuka Attorneys" },
  { input: "Punuka Attorneys.", expected: "Punuka Attorneys" },
  { input: "Wale Taiwo & Co.", expected: "Wale Taiwo & Co" },
  { input: "Wale Taiwo & Co", expected: "Wale Taiwo & Co" },
  { input: "G. Elias", expected: "G. Elias" },
  { input: "G. Elias & Co", expected: "G. Elias" },
  { input: "G. Elias & Co.", expected: "G. Elias" },
  { input: "Unknown Law Firm", expected: "Unknown Law Firm" },
  { input: "", expected: "Not Specified" },
  { input: "Not Specified", expected: "Not Specified" }
];

// Run tests
testCases.forEach(({ input, expected }) => {
  const result = standardizeLawFirmName(input, testMappings);
  const status = result === expected ? "PASS" : "FAIL";
  console.log(`[${status}] standardizeLawFirmName("${input}") => "${result}" (expected: "${expected}")`);
});
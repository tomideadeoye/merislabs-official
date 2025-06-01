import { fetchCVComponents, suggestCVComponents, rephraseComponent, assembleCV } from '../lib/cv';

async function testCVTailoringSystem() {
  console.log("Starting CV Tailoring System Test");

  try {
    // Step 1: Fetch CV components
    console.log("\n1. Fetching CV components...");
    const components = await fetchCVComponents();
    console.log(`   Found ${components.length} components`);

    if (components.length === 0) {
      throw new Error("No CV components found. Make sure the Python API server is running and Notion is configured.");
    }

    const testJdAnalysis = `
      Senior Software Engineer position requiring expertise in React, TypeScript, and cloud services.
      The ideal candidate will have 5+ years of experience building scalable web applications,
      strong communication skills, and experience working in agile teams.
      Experience with AWS, CI/CD pipelines, and microservices architecture is a plus.
    `;

    console.log("\n2. Testing component suggestion...");
    const suggestion = await suggestCVComponents(
      testJdAnalysis,
      "Senior Software Engineer",
      "TechCorp"
    );

    if (!suggestion.success || !suggestion.suggested_component_ids || suggestion.suggested_component_ids.length === 0) {
      throw new Error(`Component suggestion failed: ${suggestion.error || "No components suggested"}`);
    }

    console.log(`   Successfully suggested ${suggestion.suggested_component_ids.length} components`);

    // Step 3: Test component rephrasing
    // Add null check for suggested component IDs
    if (!suggestion.suggested_component_ids?.length) {
      console.error("No suggested components for improvement");
      return;
    }

    const componentToRephrase = components.find(c => c.unique_id === suggestion.suggested_component_ids![0]);

    // Add null check for component lookup
    if (!componentToRephrase) {
      console.error(`Could not find component with ID: ${suggestion.suggested_component_ids[0]}`);
      return;
    }
    if (!componentToRephrase) {
      throw new Error("Could not find suggested component for rephrasing");
    }

    console.log(`\n3. Testing component rephrasing for "${componentToRephrase.component_name}"...`);
    const rephraseResult = await rephraseComponent(
      componentToRephrase.unique_id,
      testJdAnalysis,
      "TechCorp is a leading technology company focused on cloud solutions."
    );

    if (!rephraseResult.success || !rephraseResult.rephrased_content) {
      throw new Error(`Component rephrasing failed: ${rephraseResult.error || "No rephrased content returned"}`);
    }

    console.log("   Component rephrased successfully");
    console.log(`   Original: "${componentToRephrase.content_primary.substring(0, 100)}..."`);
    console.log(`   Rephrased: "${rephraseResult.rephrased_content.substring(0, 100)}..."`);

    // Step 4: Test CV assembly
    console.log("\n4. Testing CV assembly...");
    const tailoredContentMap: Record<string, string> = {
      [componentToRephrase.unique_id]: rephraseResult.rephrased_content
    };

    const assembleResult = await assembleCV(
      suggestion.suggested_component_ids.slice(0, 5),
      "Standard",
      "**TOMIDE ADEOYE**\ntomideadeoye@gmail.com | +234 818 192 7251",
      tailoredContentMap
    );

    if (!assembleResult.success || !assembleResult.assembled_cv) {
      throw new Error(`CV assembly failed: ${assembleResult.error || "No assembled CV returned"}`);
    }

    console.log("   CV assembled successfully");
    console.log(`   Assembled CV (preview): "${assembleResult.assembled_cv.substring(0, 200)}..."`);

    console.log("\nCV Tailoring System Test completed successfully!");

  } catch (error: any) {
    console.error(`\nTest failed: ${error.message}`);
    console.error(error);
  }
}

testCVTailoringSystem();

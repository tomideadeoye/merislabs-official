# Opportunity Evaluator

The Opportunity Evaluator is a powerful feature within Orion designed to help you make confident, data-driven decisions about career and educational opportunities. This feature directly addresses PRD 5.5.1 and is specifically designed to enhance career & external opportunity growth by providing a structured framework for evaluating opportunities against your profile, goals, and values.

## Features

1. **Comprehensive Opportunity Analysis**: Evaluate job descriptions, academic programs, or project briefs against your profile and goals.
   - Get a quantitative fit score to understand alignment
   - Identify key points of strong alignment
   - Uncover potential gaps or areas of concern
   - Analyze risks and rewards

2. **Strategic Recommendations**: Receive clear guidance on how to proceed with opportunities.
   - Get a clear recommendation (Pursue, Delay & Prepare, Reject, Consider Further)
   - Understand the reasoning behind the recommendation
   - Receive suggested next steps for action

3. **Memory Integration**: The system leverages your past experiences and reflections from memory.
   - Incorporates relevant past experiences in the evaluation
   - Considers your documented goals and values
   - Creates a personalized analysis based on your unique profile

## How It Works

### Data Flow

1. User inputs opportunity details (title, description, type, optional URL)
2. System retrieves user profile data and relevant past experiences from memory
3. LLM analyzes the opportunity against the user's profile and experiences
4. System presents a structured evaluation with fit score, alignment highlights, gap analysis, and recommendations

### Technical Implementation

- **Backend Processing**:
  - `/api/orion/opportunity/evaluate`: API route for opportunity evaluation
  - Uses memory search to retrieve relevant past experiences
  - Leverages LLM for sophisticated opportunity analysis

- **Frontend Components**:
  - `OpportunityEvaluator.tsx`: UI for inputting opportunity details and displaying evaluation results
  - Structured display of fit score, alignment highlights, gap analysis, and recommendations

## Usage

1. Navigate to the "Opportunity Evaluator" page
2. Enter the opportunity details:
   - Title of the opportunity
   - Type (job, education, project, other)
   - Optional URL for reference
   - Full description or details of the opportunity
3. Click "Evaluate Opportunity" to start the analysis
4. Review the comprehensive evaluation results:
   - Overall fit score (percentage)
   - Recommendation and reasoning
   - Alignment highlights and gap analysis
   - Risk/reward analysis
   - Suggested next steps

## Contribution to Career & External Opportunity Growth

The Opportunity Evaluator directly enhances career & external opportunity growth by:

1. Providing a structured, analytical framework for evaluating opportunities
2. Ensuring decisions are aligned with your goals, values, and profile
3. Identifying potential gaps that could be addressed through preparation
4. Offering clear, actionable next steps for pursuing opportunities
5. Building confidence in career and educational decisions through data-driven analysis

This feature transforms the often overwhelming process of evaluating opportunities into a systematic, objective analysis that helps you make confident decisions aligned with your long-term goals and values.
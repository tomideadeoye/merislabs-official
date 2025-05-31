# Enhanced RAG for Ask Question

The Enhanced RAG (Retrieval-Augmented Generation) feature improves Orion's question-answering capabilities by allowing you to filter which types of memories are used as context. This refinement directly addresses the goal of making Orion's existing intelligence more interconnected and insightful.

## Features

1. **Memory Type Filtering**: Specify which types of memories to prioritize in searches.
   - Journal entries
   - Journal reflections
   - WhatsApp analysis
   - Local documents (text, markdown, JSON)
   - Other memory types as they become available

2. **Memory Tag Filtering**: Target memories with specific tags.
   - Filter by project names
   - Filter by topics
   - Filter by relationship names
   - Any other tags used in your memory system

3. **Improved Context Relevance**: Get more precise answers by focusing on the most relevant data.
   - Reduce noise from unrelated memory types
   - Increase signal from highly relevant sources
   - Improve answer quality for domain-specific questions

4. **Transparent Filtering**: Clear indication when filters are applied.
   - Visual indicators for active filters
   - Mention of filtered context in answers
   - Easy filter management

## How It Works

### Data Flow

1. User enters a question and optionally selects memory filters
2. System constructs a query filter based on selected memory types and tags
3. Memory search API applies these filters when retrieving relevant context
4. LLM receives the filtered context along with the question
5. Answer is generated with a focus on the specified memory domains

### Technical Implementation

- **Backend Enhancements**:
  - Updated LLM API route to accept and process memory filters
  - Modified memory search query construction to include type and tag filters
  - Enhanced prompt construction to reference filtered context

- **Frontend Components**:
  - Added collapsible filter section to the Ask Question form
  - Implemented memory type checkboxes for common memory sources
  - Added tag input for fine-grained filtering
  - Included filter status indicators

## Usage

1. Navigate to the "Ask Question" page
2. Enter your question as usual
3. Click on "Memory Filters" to expand the filter options
4. Select specific memory types to prioritize (e.g., Journal Entries, WhatsApp Analysis)
5. Optionally enter tags to further refine the search (e.g., "career,project-x")
6. Submit your question
7. Receive an answer that focuses on the specified memory domains

## Benefits

1. **More Precise Answers**: Get responses that draw from the most relevant parts of your memory.
2. **Domain-Specific Queries**: Ask questions about particular areas of your life or specific projects.
3. **Reduced Noise**: Filter out irrelevant information that might dilute the quality of answers.
4. **Cross-Domain Insights**: Deliberately combine different memory types to discover connections.
5. **Improved Control**: Take greater control over how Orion leverages your personal knowledge base.

This enhancement transforms the Ask Question feature from a general-purpose query tool into a precision instrument that can target specific domains of your knowledge and experience, making Orion's insights even more valuable and relevant to your needs.
# Local File System Interaction

The Local File System Interaction feature enables Orion to securely access, read, and index files from designated directories on your local system. This feature directly addresses PRD 5.11 and is specifically designed to expand Orion's knowledge domain by incorporating your existing documents and files.

## Features

1. **Secure File Access**: Browse and read files from configured directories.
   - View directory contents
   - Read text-based file content
   - Ensure security through strict path validation

2. **File Indexing**: Add file content to Orion's memory for search and analysis.
   - Index individual files
   - Index entire directories
   - Track indexing status and results

3. **Memory Integration**: Indexed files become part of Orion's knowledge base.
   - Files are chunked and embedded for semantic search
   - File metadata is preserved for context
   - Content is accessible through Orion's memory system

## How It Works

### Data Flow

1. User configures accessible directories in environment variables
2. User browses directories and files through the UI
3. When indexing is requested, file content is:
   - Read and validated
   - Chunked into manageable segments
   - Embedded using the vector embedding system
   - Stored in Orion's memory with metadata
4. Indexed content becomes available for search and RAG operations

### Technical Implementation

- **Backend Services**:
  - `local_file_service.ts`: Core service for secure file operations
  - API routes for listing directories, reading files, and indexing content

- **API Routes**:
  - `/api/orion/local-fs/list-configured-dirs`: List accessible directories
  - `/api/orion/local-fs/list-files`: List contents of a directory
  - `/api/orion/local-fs/read-file`: Read content of a file
  - `/api/orion/local-fs/index-path`: Index a file or directory into memory

- **Frontend Components**:
  - `FileExplorer.tsx`: Browse directories and files
  - `FileViewer.tsx`: View file content
  - Local Files page for integrated browsing, viewing, and indexing

## Security Measures

1. **Path Validation**: All file operations verify that the requested path is within configured directories
2. **Read-Only Access**: The system only reads files, never modifies them
3. **File Type Restrictions**: Only supported text-based file types can be read
4. **Size Limits**: Large files are rejected to prevent system overload

## Usage

1. Configure accessible directories in your environment:
   - Set the `LOCAL_DOC_PATHS` environment variable with comma-separated paths
   - Example: `LOCAL_DOC_PATHS=/Users/username/Documents,/Users/username/Projects`

2. Navigate to the "Local Files" page:
   - Browse directories in the file explorer
   - Click on files to view their content
   - Use the "Index File" or "Index Directory" buttons to add content to Orion's memory

3. Access indexed content:
   - Use the "Ask Question" feature with RAG to query indexed files
   - Files will appear in memory searches
   - Content will inform other Orion features like the Opportunity Evaluator

## Contribution to Orion's Knowledge Domain

The Local File System Interaction feature significantly enhances Orion's capabilities by:

1. Expanding its knowledge base beyond manually entered information
2. Providing access to your existing documents, notes, and research
3. Creating a more comprehensive context for RAG operations
4. Enabling deeper analysis by incorporating more of your personal knowledge

This feature transforms Orion from a system limited to what you explicitly tell it into one that can leverage your existing knowledge base, making it a more powerful and contextually aware partner in your growth journey.
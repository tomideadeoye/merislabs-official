#!/usr/bin/env python3
import sys
import json
from sentence_transformers import SentenceTransformer

def main():
    try:
        # Read input from stdin
        input_data = sys.stdin.read()
        if not input_data:
            sys.stderr.write("Error: Input data is empty.\n")
            sys.exit(1)

        texts = json.loads(input_data)

        # Load the model
        model_name = "all-MiniLM-L6-v2"
        model = SentenceTransformer(model_name)

        # Generate embeddings
        embeddings = model.encode(texts)

        # Convert numpy arrays to lists for JSON serialization
        embeddings_list = embeddings.tolist()

        # Output the embeddings as JSON
        print(json.dumps(embeddings_list))

    except json.JSONDecodeError:
        sys.stderr.write("Error: Invalid JSON received.\n")
        sys.exit(1)
    except Exception as e:
        sys.stderr.write(f"An unexpected error occurred: {e}\n")
        sys.exit(1)

if __name__ == "__main__":
    main()

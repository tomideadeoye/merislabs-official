#!/usr/bin/env python3
import sys
import json
import os
import subprocess

def main():
    # Read input from stdin
    input_data = sys.stdin.read()
    texts = json.loads(input_data)
    
    # Create a temporary file with the texts
    temp_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "temp_texts.json")
    with open(temp_file, "w") as f:
        json.dump(texts, f)
    
    # Path to the Python executable in the virtual environment
    venv_python = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "orion_python_backend",
        "venv",
        "bin",
        "python"
    )
    
    # Path to the helper script that will use the virtual environment
    helper_script = os.path.join(os.path.dirname(os.path.abspath(__file__)), "embedding_helper.py")
    
    # Create the helper script
    with open(helper_script, "w") as f:
        f.write("""
import sys
import json
import os
from sentence_transformers import SentenceTransformer

def generate_embeddings():
    # Read the texts from the temporary file
    temp_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "temp_texts.json")
    with open(temp_file, "r") as f:
        texts = json.load(f)
    
    # Load the model
    model_name = "all-MiniLM-L6-v2"
    model = SentenceTransformer(model_name)
    
    # Generate embeddings
    embeddings = model.encode(texts)
    
    # Convert numpy arrays to lists for JSON serialization
    embeddings_list = embeddings.tolist()
    
    # Output the embeddings as JSON
    print(json.dumps(embeddings_list))
    
    # Clean up
    os.remove(temp_file)

if __name__ == "__main__":
    generate_embeddings()
""")
    
    # Make the helper script executable
    os.chmod(helper_script, 0o755)
    
    # Run the helper script with the virtual environment Python
    result = subprocess.run([venv_python, helper_script], capture_output=True, text=True)
    
    if result.returncode != 0:
        sys.stderr.write(f"Error: {result.stderr}")
        sys.exit(1)
    
    # Output the embeddings
    print(result.stdout)
    
    # Clean up
    try:
        os.remove(helper_script)
    except:
        pass

if __name__ == "__main__":
    main()
#!/usr/bin/env python3
import os
import sys
import logging
import nest_asyncio  # Ensure this is installed: pip install nest_asyncio

# Apply nest_asyncio to patch the event loop
# This MUST be done before Streamlit's own event loop management kicks in.
nest_asyncio.apply()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
logger.info("Starting Streamlit application via run_streamlit.py...")

# Add the current directory to the Python path if it's not already there
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.append(current_dir)
    logger.info(f"Added {current_dir} to Python path.")

# The main application logic is in orion_streamlit_app.py.
# When `streamlit run run_streamlit.py` is executed, this script becomes the main module.
# Importing orion_streamlit_app will execute its top-level Streamlit commands.
if __name__ == "__main__":
    # Any environment variables or initial setup specific to Streamlit that
    # cannot be in config.toml can be set here before importing the main app.
    # For example: os.environ['STREAMLIT_SERVER_PORT'] = '8501'
    logger.info("Importing orion_streamlit_app module...")
    import orion_streamlit_app  # noqa: F401
    logger.info("orion_streamlit_app imported. Streamlit server should now be running.")

import json
import logging
from typing import List
from cv_component_model import CVComponent

JSON_FILE_PATH = "cv_data.json"
logging.basicConfig(level=logging.INFO)

def validate_cv_data() -> bool:
    valid_components = 0
    invalid_components_details = []
    try:
        with open(JSON_FILE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
            if not isinstance(data, list):
                logging.error(f"'{JSON_FILE_PATH}' should contain a list of components.")
                return False

            for i, item_data in enumerate(data):
                try:
                    # Pydantic v2+ model validation
                    CVComponent.model_validate(item_data)
                    valid_components += 1
                except Exception as e:
                    logging.error(
                        f"Validation Error in component #{i+1} "
                        f"('{item_data.get('Component Name', 'N/A')}'): {e}"
                    )
                    invalid_components_details.append({
                        "index": i+1,
                        "name": item_data.get('Component Name', 'N/A'),
                        "error": str(e)
                    })

            logging.info(
                f"Validation complete. Valid components: {valid_components}/{len(data)}"
            )
            if invalid_components_details:
                logging.error("Details of invalid components:")
                for detail in invalid_components_details:
                    logging.error(
                        f"  - Index {detail['index']} (Name: {detail['name']}): {detail['error']}"
                    )
                return False
            return True

    except FileNotFoundError:
        logging.error(f"'{JSON_FILE_PATH}' not found.")
        return False
    except json.JSONDecodeError:
        logging.error(f"Error decoding JSON from '{JSON_FILE_PATH}'.")
        return False

if __name__ == "__main__":
    if validate_cv_data():
        print("cv_data.json is valid against the CVComponent model.")
    else:
        print("cv_data.json has validation errors. Please check the logs.")

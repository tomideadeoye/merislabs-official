# Orion UI Components

A unified UI component system for building consistent and maintainable Streamlit applications.

## Features

- Type-safe component interfaces
- Built-in error handling and logging
- Form validation and sanitization
- Responsive layouts
- Component usage analytics
- Performance optimization with caching

## Component Categories

### Display Components

Visual elements with consistent styling:

- Status badges
- Section containers
- Action bars
- Memory status indicators

```python
from ui_components import render_status_badge, AlertType

render_status_badge("Success", AlertType.SUCCESS, "Operation completed")
```

### Form Components

Input fields with validation:

- Text inputs
- Select boxes
- Multi-select
- Date pickers
- File uploads

```python
from ui_components import render_form_field, FormFieldType

name = render_form_field(
    FormFieldType.TEXT,
    "Name",
    "name_field",
    required=True,
    validation=validate_not_empty
)
```

### Layout Components

Page structure and organization:

- Page containers
- Section containers
- Sidebar containers
- Column layouts

```python
from ui_components import page_container, column_layout

with page_container("My Page", icon="📝"):
    with column_layout(num_columns=2):
        st.write("Column 1")
        st.write("Column 2")
```

### Utilities

Common helper functions:

- Input validation
- Text formatting
- Component caching
- Error handling

```python
from ui_components.utils import (
    validate_email,
    truncate_text,
    handle_ui_error
)
```

## Best Practices

1. **Error Handling**

   - Use `handle_ui_error` decorator for component error handling
   - Provide user-friendly error messages
   - Log errors appropriately

2. **Validation**

   - Validate all user inputs
   - Use built-in validators or create custom ones
   - Sanitize inputs to prevent XSS

3. **Performance**

   - Use ComponentCache for expensive operations
   - Implement proper logging for monitoring
   - Follow Streamlit's caching guidelines

4. **Accessibility**
   - Provide clear labels and help text
   - Include tooltips for complex features
   - Use semantic HTML elements

## Examples

Check `examples/ui_components_example.py` for a complete example application showcasing all components.

## Contributing

1. Follow the existing code style
2. Add tests for new components
3. Update documentation
4. Run tests before submitting changes

## Testing

Run tests with pytest:

```bash
pytest tests/ui_components/
```

## License

MIT License - See LICENSE file for details

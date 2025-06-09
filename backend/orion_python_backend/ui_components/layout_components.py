import streamlit as st
from enum import Enum
from typing import Callable, List, Tuple, Dict, Any


class DisplayMode(Enum):
    NORMAL = "normal"
    COMPACT = "compact"


def render_section(
    title: str, content: str, mode: DisplayMode = DisplayMode.NORMAL
) -> None:
    """Render a content section with consistent styling."""
    if mode == DisplayMode.COMPACT:
        st.markdown(f"**{title}:** {content}")
    else:
        with st.container():
            st.subheader(title)
            st.markdown(content)


def render_action_bar(actions: List[Tuple[str, Callable[[], None]]]) -> None:
    """Render a horizontal bar of action buttons."""
    cols = st.columns(len(actions))
    for col, (label, handler) in zip(cols, actions):
        with col:
            if st.button(label):
                handler()


# Container components
def page_container():
    """Create a main page container with consistent padding."""
    return st.container()


def section_container(title: str):
    """Create a section container with titled header."""
    with st.container():
        st.subheader(title)
        return st.container()


def sidebar_container():
    """Create a sidebar container with consistent styling."""
    return st.sidebar.container()


def column_layout(num_columns: int):
    """Create a column-based layout."""
    return st.columns(num_columns)


def render_sidebar_section(title: str, content_func, expanded: bool = True) -> None:
    """Render a collapsible sidebar section."""
    if expanded:
        st.sidebar.markdown(f"### {title}")
        content_func()
    else:
        with st.sidebar.expander(title, expanded=False):
            content_func()


def render_two_column_layout(left_content_func, right_content_func, ratio: List[float] = [1, 1]) -> None:
    """Render a two-column layout."""
    col1, col2 = st.columns(ratio)

    with col1:
        left_content_func()

    with col2:
        right_content_func()


def render_three_column_layout(
    left_content_func,
    center_content_func,
    right_content_func,
    ratio: List[float] = [1, 1, 1]
) -> None:
    """Render a three-column layout."""
    col1, col2, col3 = st.columns(ratio)

    with col1:
        left_content_func()

    with col2:
        center_content_func()

    with col3:
        right_content_func()


def render_tabs(tab_config: Dict[str, Any]) -> None:
    """Render tabs with content."""
    tab_names = list(tab_config.keys())
    tabs = st.tabs(tab_names)

    for i, (tab_name, content_func) in enumerate(tab_config.items()):
        with tabs[i]:
            content_func()


def render_container_with_border(content_func, border_color: str = "#e0e0e0") -> None:
    """Render content within a bordered container."""
    with st.container():
        st.markdown(f"""
        <div style="border: 1px solid {border_color}; border-radius: 0.5rem; padding: 1rem;">
        """, unsafe_allow_html=True)

        content_func()

        st.markdown("</div>", unsafe_allow_html=True)


def render_grid_layout(items: List[Any], columns: int = 3, item_renderer=None) -> None:
    """Render items in a grid layout."""
    if not item_renderer:
        item_renderer = lambda item: st.write(item)

    for i in range(0, len(items), columns):
        cols = st.columns(columns)
        for j, col in enumerate(cols):
            if i + j < len(items):
                with col:
                    item_renderer(items[i + j])


def render_pipeline_sidebar() -> None:
    """Render pipeline-specific sidebar."""
    st.sidebar.markdown("### Pipeline Controls")
    st.sidebar.info("Configure your pipeline settings here.")

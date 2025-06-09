import os
import sys
import asyncio
import datetime
import logging
import pandas as pd
import re
from typing import List, Optional
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import streamlit as st

# --- Standard Setup: Add project root to sys.path for consistent imports ---
script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(script_dir, ".."))
if project_root not in sys.path:
    sys.path.append(project_root)
# --- End Path Setup ---

from orion_utils import scrape_multiple
from app_state import SessionStateKeys

logger = logging.getLogger(__name__)

# Constants for routine pages and scraping
NOTION_GOALS_PAGE = "https://www.notion.so/merislabs/55fcffddc0fc4eff94dc809bec58d7f0?v=0ef7df8a7eae4f2a8b746b0587f24b4f&pvs=4"
NOTION_GRATITUDE_REFLECTION_PAGE = "https://www.notion.so/merislabs/b4004e34821a4665b4defc721f59325d?v=bf4e7825be6e46f693f016e760c233c4&pvs=4"
SUBSTACK_PAGE = "https://tomideadeoye.substack.com/publish/home?utm_source=menu"
WEBSITES_CSV_PATH = "websites_to_scrape.csv"

EXCLUSION_PATTERNS = [
    r"(facebook\.com/(sharer|plugins)|twitter\.com/(intent/tweet|widgets)|linkedin\.com/shareArticle|api\.whatsapp\.com/send|pinterest\.com/pin)",
    r"^mailto:", r"^tel:", r"^sms:", r"javascript:void\(0\)",
    r"(?:^|/)(contact(?:-us)?|terms(?:-of-(?:service|use))?|disclaimer|privacy(?:-policy)?|policy|categories?|tags?|page/\d+|about(?:-us)?|support|help|faq|login|log-in|signin|sign-in|signup|sign-up|register|cart|checkout|my-account|profile|account|sitemap\.xml|robots\.txt|feed|rss|author(?:/\w+)?|wp-json|xmlrpc\.php|amp(?:/.*)?)(?:[/\?#]|$)",
    r"\.(jpg|jpeg|png|gif|bmp|tiff|pdf|zip|tar\.gz|rar|exe|dmg|doc|docx|xls|xlsx|ppt|pptx|mp3|mp4|avi|mov|css|js|json|xml|txt|webp|svg|ico|woff|woff2|ttf|otf|eot)$",
    r"^#.*", r"^\s*$",
]

def is_excluded_routine(url: str) -> bool:
    """Return True if URL matches an exclusion pattern."""
    if not isinstance(url, str) or not url.strip():
        return True
    url_no_frag = url.split("#", 1)[0]
    return any(re.search(pat, url_no_frag, re.IGNORECASE) for pat in EXCLUSION_PATTERNS)

def open_urls_in_browser_routine(urls: List[str]) -> None:
    """Create Streamlit link buttons for URLs (recommended for deployed apps)."""
    for url in urls:
        if isinstance(url, str) and url.startswith(("http://", "https://")):
            try:
                st.link_button(f"Open {url}", url)
            except Exception as e:
                logger.error(f"Failed to create link for {url}: {e}")

async def process_routine_scraping_tasks(current_date_str: str) -> List[str]:
    """Scrape URLs from CSV, filter, and save unique links."""
    result_links: List[str] = []
    if not os.path.exists(WEBSITES_CSV_PATH):
        st.error(f"CSV not found: {WEBSITES_CSV_PATH}")
        return result_links
    try:
        df = pd.read_csv(WEBSITES_CSV_PATH)
        if "scrape" not in df.columns:
            st.error("Column 'scrape' missing in CSV.")
            return result_links
        urls = df["scrape"].dropna().astype(str).tolist()
        if not urls:
            st.warning("No URLs to scrape.")
            return result_links
        with st.spinner(f"Scraping {len(urls)} websites..."):
            contents = await scrape_multiple(tuple(urls), use_selenium=True, body_only=False, headless=True)
        for base, html in zip(urls, contents):
            if not isinstance(html, str):
                continue
            soup = BeautifulSoup(html, "html.parser")
            for a in soup.find_all("a", href=True):
                href = a["href"].strip()
                full = urljoin(base, href)
                if full.startswith(("http://","https://")) and not is_excluded_routine(full):
                    result_links.append(full)
        unique = sorted(set(result_links))
        out_file = f"scraped_links_{current_date_str}.csv"
        pd.DataFrame(unique, columns=["url"]).to_csv(out_file, index=False)
        st.success(f"Saved {len(unique)} links to {out_file}")
        return unique
    except Exception as e:
        logger.error("Error scraping routines", exc_info=True)
        st.error(f"Scraping error: {e}")
        return result_links

async def perform_routine_daily_tasks() -> None:
    """Run tasks based on weekday (Monday/Thursday/etc.)."""
    now = datetime.datetime.now()
    current_date_str = now.strftime("%Y-%m-%d")
    weekday = now.weekday()  # Monday=0
    st.info(f"Running routines for {current_date_str} (Weekday {weekday})")
    if weekday == 0:  # Monday
        links = await process_routine_scraping_tasks(current_date_str)
        st.session_state[SessionStateKeys.ROUTINES_SCRAPED_LINKS.value] = links
    elif weekday == 3:  # Thursday
        st.write("Thursday: preparing Substack post...")
        open_urls_in_browser_routine([SUBSTACK_PAGE])
    else:
        st.write("No scheduled tasks today.")
    st.success("Routine tasks complete.")

def render_page_content() -> None:
    """Render the Routines Manager page."""
    st.title("🔄 Routines Manager")
    state = st.session_state
    # Initialize global state
    state.setdefault(SessionStateKeys.MEMORY_INITIALIZED.value, False)
    state.setdefault(SessionStateKeys.ROUTINES_EXECUTION_STATUS.value, "idle")
    state.setdefault(SessionStateKeys.ROUTINES_LAST_RUN.value, None)
    state.setdefault(SessionStateKeys.ROUTINES_SCRAPED_LINKS.value, [])
    if not state.get(SessionStateKeys.MEMORY_INITIALIZED.value):
        st.error("Memory not initialized.")
        return

    st.subheader("Manual Task Execution")
    col1, col2 = st.columns(2)
    with col1:
        if st.button("▶️ Run Daily Tasks", key="routines_run_daily"):
            state[SessionStateKeys.ROUTINES_EXECUTION_STATUS.value] = "running"
            st.rerun()
    with col2:
        if st.button("🕸️ Run Scraping Only", key="routines_run_scraping"):
            state[SessionStateKeys.ROUTINES_EXECUTION_STATUS.value] = "scraping"
            st.rerun()

    status = state.get(SessionStateKeys.ROUTINES_EXECUTION_STATUS.value)
    if status == "running":
        with st.spinner("Executing all tasks..."):
            asyncio.run(perform_routine_daily_tasks())
            state[SessionStateKeys.ROUTINES_LAST_RUN.value] = datetime.datetime.now()
            state[SessionStateKeys.ROUTINES_EXECUTION_STATUS.value] = "completed"
            st.rerun()
    elif status == "scraping":
        with st.spinner("Executing scraping tasks..."):
            today = datetime.datetime.now().strftime("%Y-%m-%d")
            links = asyncio.run(process_routine_scraping_tasks(today))
            state[SessionStateKeys.ROUTINES_SCRAPED_LINKS.value] = links
            state[SessionStateKeys.ROUTINES_LAST_RUN.value] = datetime.datetime.now()
            state[SessionStateKeys.ROUTINES_EXECUTION_STATUS.value] = "completed_scraping"
            st.rerun()

    last = state.get(SessionStateKeys.ROUTINES_LAST_RUN.value)
    if last:
        st.write(f"Last run at: {last.strftime('%Y-%m-%d %H:%M:%S')}")

    if state.get(SessionStateKeys.ROUTINES_SCRAPED_LINKS.value):
        st.subheader("Scraped Links")
        st.dataframe(pd.DataFrame(state[SessionStateKeys.ROUTINES_SCRAPED_LINKS.value], columns=["url"]))

    with st.expander("Scheduled Tasks Overview", expanded=False):
        st.markdown(
            "- Mondays: Web scraping for opportunities\n"
            "- Thursdays: Substack preparation\n"
            "- Others: No scheduled tasks\n"
        )

# Entry point for Streamlit
render_page_content()

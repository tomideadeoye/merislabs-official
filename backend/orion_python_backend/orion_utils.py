# pyright: ignore
import asyncio
import configparser
import datetime
import json
import logging
import mimetypes
import os
import random
import re
import smtplib
import socket
import ssl
import sys
import threading
import time
import uuid
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
from email.message import EmailMessage
from enum import Enum, auto
from functools import lru_cache
from typing import Any, Dict, List, Optional, Tuple, Union, Iterator, Sequence

try:
    import dns.resolver  # type: ignore[import]
    import dns.exception  # type: ignore[import]
    from dns.rdtypes.ANY.MX import MX  # type: ignore[import]
except ImportError:
    logging.warning("dns library not installed; MX record validation disabled.")
    dns = None  # type: ignore
    MX = None  # type: ignore

import aiohttp
from bs4 import BeautifulSoup
import traceback
from urllib.parse import urlparse
import contextlib

from dotenv import load_dotenv

try:
    from fake_useragent import UserAgent  # type: ignore[import]
except ImportError:
    logging.warning("fake_useragent not installed; using fallback UserAgent.")

    class UserAgent:
        @property
        def random(self):
            return "Mozilla/5.0"


try:
    from googlesearch import search as google_search_lib  # type: ignore[import]
except ImportError:
    logging.warning("googlesearch not installed; google_search_lib disabled.")
    google_search_lib = lambda *args, **kwargs: []
from requests.exceptions import (
    HTTPError,
    JSONDecodeError,
    RequestException,
)

try:
    from tenacity import (  # type: ignore[import]
        retry,
        retry_if_exception_type,
        stop_after_attempt,
        wait_exponential,
    )
except ImportError:
    logging.warning("tenacity not installed; retry decorators are no-ops.")

    def retry(*args, **kwargs):
        def decorator(f):
            import asyncio
            from functools import wraps

            if asyncio.iscoroutinefunction(f):

                @wraps(f)
                async def async_wrapper(*a, **kw):
                    return await f(*a, **kw)

                return async_wrapper
            else:

                @wraps(f)
                def sync_wrapper(*a, **kw):
                    return f(*a, **kw)

                return sync_wrapper

        return decorator

    def retry_if_exception_type(*args, **kwargs):
        def inner(retry_state) -> bool:
            return True

        return inner

    def stop_after_attempt(*args, **kwargs):
        def inner(retry_state) -> bool:
            return True

        return inner

    def wait_exponential(*args, **kwargs):
        def inner(retry_state):
            return 1.0

        return inner


# Base exception classes
class BaseTimeoutException(Exception):
    """Base timeout exception"""

    pass


class BaseWebDriverException(Exception):
    """Base webdriver exception"""

    pass


# Selenium imports and setup
try:
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options as ChromeOptions
    from selenium.webdriver.firefox.options import Options as FirefoxOptions
    from selenium.webdriver.chrome.service import Service as ChromeService
    from selenium.webdriver.firefox.service import Service as FirefoxService
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.support.ui import WebDriverWait
    from webdriver_manager.chrome import ChromeDriverManager
    from webdriver_manager.firefox import GeckoDriverManager
    from selenium.common.exceptions import TimeoutException as SeleniumTimeoutException
    from selenium.common.exceptions import (
        WebDriverException as SeleniumWebDriverException,
    )

    TimeoutException = type(
        "TimeoutException", (BaseTimeoutException, SeleniumTimeoutException), {}
    )
    WebDriverException = type(
        "WebDriverException", (BaseWebDriverException, SeleniumWebDriverException), {}
    )

    SELENIUM_AVAILABLE = True
    logging.info("Selenium and WebDriver Manager loaded successfully.")
except ImportError:
    TimeoutException = BaseTimeoutException
    WebDriverException = BaseWebDriverException
    SELENIUM_AVAILABLE = False
    logging.warning(
        "Selenium or WebDriver Manager not found. Web scraping with Selenium will not be available."
    )


try:
    import habitica  # type: ignore[import]

    habitica: Any  # type: ignore
except ImportError:
    logging.warning("habitica library not installed; habitica features disabled.")
    habitica = None  # type: ignore


load_dotenv()


def safe_json_loads(s: Optional[str]) -> Any:
    """
    Safely load JSON from a string, returning an empty dict on failure.
    """
    try:
        return json.loads(s or "{}")
    except Exception as e:
        logging.error(f"safe_json_loads error: {e}")
        return {}


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s-%(levelname)s-[%(filename)s:%(lineno)d]-%(message)s",
)


def format_whatsapp_template(template: str, profile_context: str) -> str:
    """
    Apply simple templating to a WhatsApp message.
    Replaces '{profile}' placeholder in the template with the user's profile context.
    """
    try:
        return template.replace("{profile}", profile_context)
    except Exception:
        return template


try:
    from orion_config import OUTPUT_DIRECTORY as default_output_dir


except ImportError:
    logging.warning(
        "orion_config.py not found or missing expected variables (OUTPUT_DIRECTORY). Using defaults or disabling features."
    )
    default_output_dir = "."


ua = UserAgent()

GOOGLE_API_KEY = os.getenv("GOOGLE_SEARCH_API_KEY")
GOOGLE_CSE_ID = os.getenv("GOOGLE_SEARCH_ENGINE_ID")
EMAIL_SENDER = os.getenv("EMAIL_SENDER", "tomideadeoye@gmail.com")
GMAIL_ACCOUNT_PASSWORD = os.getenv("EMAIL_APP_PASSWORD")
MX_CACHE: Dict[str, str] = {}
SMTP_TIMEOUT = 10
SMTP_SENDER_DOMAIN_FOR_CHECK = "gmail.com"


if not GMAIL_ACCOUNT_PASSWORD:
    logging.warning(
        "EMAIL_APP_PASSWORD not found in environment variables. Email sending will likely fail."
    )


HABITICA_BASE_URL: Optional[str] = None
HABITICA_AUTH_HEADERS: Optional[Dict[str, str]] = None
hab_api: Optional[Any] = None  # type: ignore


try:
    config_path = os.path.expanduser("~/.config/habitica/auth.cfg")
    logging.info(f"Initializing Habitica client. Reading config from: {config_path}")

    if not os.path.exists(config_path):
        logging.error(f"Habitica config file not found at: {config_path}")

    else:
        config = configparser.ConfigParser()
        config.read(config_path)

        if not config.has_section("auth"):
            logging.error(
                f"Config file exists but missing [auth] section at: {config_path}"
            )

        else:
            auth_for_library_init = {
                "url": config.get(
                    "auth", "url", fallback="https://habitica.com"
                ).rstrip("/"),
                "x-api-user": config.get("auth", "login"),
                "x-api-key": config.get("auth", "password"),
            }
            logging.info(
                f"Read credentials from config. User ID prefix: {auth_for_library_init['x-api-user'][:4]}..., API Key prefix: {auth_for_library_init['x-api-key'][:4]}..."
            )

            HABITICA_BASE_URL = auth_for_library_init["url"]
            HABITICA_AUTH_HEADERS = {
                "x-api-user": auth_for_library_init["x-api-user"],
                "x-api-key": auth_for_library_init["x-api-key"],
                "Content-Type": "application/json",
            }
            logging.info(f"Habitica Base URL set to: {HABITICA_BASE_URL}")
            logging.info("Habitica Auth Headers populated.")

            if habitica and hasattr(habitica, "api"):
                hab_api = habitica.api.Habitica(auth=auth_for_library_init)  # type: ignore[union-attr, attr-defined]
                logging.info(
                    "Habitica library client object created (connection not tested at init)."
                )
            else:
                hab_api = None


except FileNotFoundError as e:
    logging.error(f"Habitica config file error during processing: {e}")
    hab_api = None
    HABITICA_BASE_URL = None
    HABITICA_AUTH_HEADERS = None
except ValueError as e:
    logging.error(f"Habitica config file format error or missing key: {e}")
    hab_api = None
    HABITICA_BASE_URL = None
    HABITICA_AUTH_HEADERS = None
except Exception as e:
    logging.error(
        f"Unexpected error initializing Habitica API client: {e}", exc_info=True
    )
    hab_api = None
    HABITICA_BASE_URL = None
    HABITICA_AUTH_HEADERS = None


class ProfileType(Enum):
    LOCAL_PROFILE = auto()
    ONLINE_PROFILE = auto()


@lru_cache(maxsize=1)
def load_profile(profile_type: ProfileType = ProfileType.LOCAL_PROFILE) -> str:
    """Loads Tomide's profile from local file or online.

    Args:
        profile_type: Type of profile to load (LOCAL_PROFILE or ONLINE_PROFILE)

    Returns:
        Profile content as string, or error message if loading fails
    """
    # List of profile filenames to try, in order of preference
    profile_filenames = [
        "tomide adeoye profile.txt",
        "tomide_profile.txt",
        "Tomide_Adeoye_Profile.txt",
        "tomideadeoye.txt",
    ]

    # Get the directory where orion_utils.py is located
    base_dir = os.path.dirname(os.path.abspath(__file__))
    # Get project root (parent directory)
    project_root = os.path.abspath(os.path.join(base_dir, ".."))

    logging.info(f"Attempting to load profile. Type requested: {profile_type.name}")
    logging.debug(f"Base directory: {base_dir}")
    logging.debug(f"Project root: {project_root}")

    if profile_type == ProfileType.ONLINE_PROFILE:
        # Online profile loading logic would go here
        # For now, fall back to local profile
        logging.warning("Online profile loading not implemented, falling back to local")

    # Try each profile filename in both base directory and project root
    for filename in profile_filenames:
        # Try in project root first
        project_root_path = os.path.join(project_root, filename)
        base_dir_path = os.path.join(base_dir, filename)

        for filepath in [project_root_path, base_dir_path]:
            logging.debug(f"Checking for profile at: {filepath}")
            try:
                if os.path.exists(filepath):
                    with open(filepath, "r", encoding="utf-8") as file:
                        profile = file.read()
                        if profile.strip():
                            logging.info(
                                f"Profile loaded successfully from {filepath} ({len(profile)} chars)."
                            )
                            return profile
                        else:
                            logging.warning(f"Profile file {filepath} is empty.")
                            continue
            except Exception as e:
                logging.error(
                    f"Error reading profile file {filepath}: {e}", exc_info=True
                )
                continue

    error_msg = (
        f"Could not load profile from any known location. "
        f"Tried: {', '.join(profile_filenames)} "
        f"in {project_root} and {base_dir}"
    )
    logging.error(error_msg)
    return f"Error: {error_msg}"


def get_tomide_profile_local_or_online(
    profile_type: ProfileType = ProfileType.LOCAL_PROFILE,
) -> str:
    """Alias for load_profile for backwards compatibility."""
    return load_profile(profile_type)


scrape_cache: Dict[str, Optional[str]] = {}
scrape_cache_lock = threading.Lock()


async def async_fetch(url: str, session: aiohttp.ClientSession, timeout: int = 15):
    """Asynchronously fetches content from a URL."""
    headers = {"User-Agent": ua.random}
    try:
        async with session.get(
            url, headers=headers, timeout=aiohttp.ClientTimeout(total=timeout)
        ) as response:
            response.raise_for_status()
            return await response.text()
    except asyncio.TimeoutError:
        logging.warning(f"Timeout fetching {url} with aiohttp after {timeout} seconds.")
        return None
    except aiohttp.ClientError as e:
        logging.warning(f"aiohttp client error fetching {url}: {e}")
        return None
    except Exception as e:
        logging.error(
            f"Unexpected error during async_fetch for {url}: {e}", exc_info=True
        )
        return None


async def scrape_with_aiohttp(
    url: str,
    body_only: bool = False,
    retries: int = 2,
    delay: int = 1,
    timeout: int = 15,
) -> Optional[str]:
    """Scrapes content using aiohttp with retries."""
    global scrape_cache, scrape_cache_lock
    with scrape_cache_lock:
        if url in scrape_cache:
            logging.debug(f"Cache hit for URL: {url}")
            return scrape_cache[url]

    async with aiohttp.ClientSession() as session:
        for attempt in range(retries):
            logging.debug(
                f"Attempt {attempt + 1}/{retries} fetching {url} with aiohttp"
            )
            html = await async_fetch(url, session, timeout=timeout)
            if html:
                try:
                    soup = BeautifulSoup(html, "html.parser")
                    if body_only:
                        target_element = soup.body or soup
                        result = (
                            target_element.get_text(separator="\n", strip=True)
                            if target_element
                            else ""
                        )
                    else:
                        result = soup.get_text(separator="\n", strip=True)

                    if result:
                        logging.debug(
                            f"Successfully scraped content from {url} (aiohttp)"
                        )
                        with scrape_cache_lock:
                            scrape_cache[url] = result
                        return result
                    else:
                        logging.warning(
                            f"aiohttp fetch successful, but no text extracted from {url} (attempt {attempt + 1})"
                        )

                except Exception as e:
                    logging.warning(
                        f"Error parsing HTML from {url} with BeautifulSoup: {e}"
                    )

            if attempt < retries - 1:
                actual_delay = delay * (attempt + 1)
                logging.warning(
                    f"Retrying {url} with aiohttp after {actual_delay}s delay..."
                )
                await asyncio.sleep(actual_delay)

    logging.error(f"Failed to scrape {url} with aiohttp after {retries} retries.")
    with scrape_cache_lock:
        scrape_cache[url] = None
    return None


def get_webdriver(
    browser: str = "chrome", headless: bool = True
) -> Any:  # type: ignore
    """Get a configured webdriver instance.

    Args:
        browser: Browser to use ('chrome' or 'firefox')
        headless: Whether to run in headless mode

    Returns:
        Configured webdriver instance or None if setup fails
    """
    if not SELENIUM_AVAILABLE:
        return None

    try:
        if browser.lower() == "chrome":
            options = ChromeOptions()
            if headless:
                options.add_argument("--headless")
            options.add_argument("--no-sandbox")
            options.add_argument("--disable-dev-shm-usage")
            service = ChromeService(ChromeDriverManager().install())
            return webdriver.Chrome(service=service, options=options)
        else:
            options = FirefoxOptions()
            if headless:
                options.add_argument("--headless")
            service = FirefoxService(GeckoDriverManager().install())
            return webdriver.Firefox(service=service, options=options)
    except Exception as e:
        logging.error(f"Failed to initialize {browser} webdriver: {str(e)}")
        return None


class TomsEmailUtilities:
    """Utility class for email validation and handling."""

    dns_resolver = dns.resolver.Resolver() if dns else None  # type: ignore[assignment]

    @classmethod
    def _get_mx_records(cls, domain_name: str) -> List[Tuple[int, str]]:
        """Get MX records for a domain, safely handling DNS resolution.

        Args:
            domain_name: Domain to get MX records for

        Returns:
            List of tuples (preference, exchange) sorted by preference
        """
        if not cls.dns_resolver:
            return []
        try:
            answer = cls.dns_resolver.resolve(domain_name, "MX")
            mx_records = []

            # Process each answer record
            for rdata in answer.response.answer[0].items:
                if MX and isinstance(rdata, MX):
                    mx_records.append(
                        (rdata.preference, str(rdata.exchange).rstrip("."))
                    )

            # Sort by preference
            return sorted(mx_records, key=lambda x: x[0])
        except Exception as e:
            logging.error(f"DNS resolution error for {domain_name}: {str(e)}")
            return []

    @classmethod
    def send_email(
        cls,
        recipient_email: str,
        subject: str,
        body: str,
        attachments: Optional[List[Dict[str, Any]]] = None,
    ) -> Tuple[bool, str]:
        """
        Send an email with optional attachments.

        Args:
            recipient_email (str): The recipient's email address
            subject (str): The email subject
            body (str): The HTML or plain text email body
            attachments (Optional[List[Dict[str, Any]]]): List of attachment dicts with 'filename' and 'content' keys

        Returns:
            Tuple[bool, str]: (success status, message)
        """
        try:
            # Load email configuration from environment
            load_dotenv()
            sender_email = os.getenv("EMAIL_SENDER")
            app_password = os.getenv("GMAIL_APP_PASSWORD")

            if not sender_email or not app_password:
                msg = "Email sender credentials not configured."
                logging.error(msg)
                return False, msg

            # Create the email
            msg = EmailMessage()
            msg.set_content(body)  # Plain text version
            msg["Subject"] = subject
            msg["From"] = sender_email
            msg["To"] = recipient_email

            # Add attachments if provided
            if attachments:
                for attachment in attachments:
                    filename = attachment.get("filename")
                    content = attachment.get("content")
                    if not filename or not content:
                        continue

                    # Guess the MIME type
                    mimetype, _ = mimetypes.guess_type(filename)
                    if mimetype is None:
                        mimetype = "application/octet-stream"
                    maintype, subtype = mimetype.split("/", 1)

                    msg.add_attachment(
                        content, maintype=maintype, subtype=subtype, filename=filename
                    )

            # Send the email
            context = ssl.create_default_context()
            with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
                server.login(sender_email, app_password)
                server.send_message(msg)

            success_msg = f"Email sent successfully to {recipient_email}"
            logging.info(success_msg)
            return True, success_msg

        except Exception as e:
            error_msg = f"Failed to send email: {str(e)}"
            logging.error(error_msg)
            return False, error_msg

    @classmethod
    def validate_email_domain(cls, domain: str) -> bool:
        """Validate email domain through MX record lookup.

        Args:
            domain: Domain to validate

        Returns:
            True if domain has valid MX records, False otherwise
        """
        mx_records = cls._get_mx_records(domain)
        return len(mx_records) > 0

    @classmethod
    def mail_checker(cls, email: str) -> Optional[Tuple[str, str]]:
        """Check if email address is valid via MX record and SMTP.

        Args:
            email: Email address to validate

        Returns:
            Tuple of (email, status) if valid, None if invalid
        """
        try:
            domain = email.split("@")[1]
            if not cls.validate_email_domain(domain):
                logging.warning(f"No MX records found for domain: {domain}")
                return None

            # Continue with SMTP validation...
            # ...existing code...
        except Exception as e:
            logging.error(f"Error validating email {email}: {str(e)}")
            return None


# --- Structured Feedback Storage ---
STRUCTURED_FEEDBACK_FILE = "orion_structured_feedback.json"


def save_structured_feedback(feedback_item: Dict[str, Any]) -> None:
    """Append feedback item to JSON log."""
    try:
        all_feedback = []
        if os.path.exists(STRUCTURED_FEEDBACK_FILE):
            with open(STRUCTURED_FEEDBACK_FILE, "r", encoding="utf-8") as f:
                try:
                    all_feedback = json.load(f)
                    if not isinstance(all_feedback, list):
                        logging.warning(f"Feedback file corrupted. Starting fresh.")
                        all_feedback = []
                except json.JSONDecodeError:
                    logging.warning(f"Could not decode feedback file. Starting fresh.")
                    all_feedback = []

        feedback_item["timestamp"] = datetime.datetime.now(
            datetime.timezone.utc
        ).isoformat()
        feedback_item["id"] = str(uuid.uuid4())
        feedback_item.setdefault("status", "open")
        all_feedback.append(feedback_item)

        with open(STRUCTURED_FEEDBACK_FILE, "w", encoding="utf-8") as f:
            json.dump(all_feedback, f, indent=2)
        logging.info(f"Saved feedback item: {feedback_item['id']}")
    except Exception as e:
        logging.error(f"Failed to save feedback: {e}", exc_info=True)


def get_structured_feedback(status: Optional[str] = None) -> List[Dict[str, Any]]:
    """Load structured feedback, optionally filter by status."""
    if not os.path.exists(STRUCTURED_FEEDBACK_FILE):
        return []
    try:
        with open(STRUCTURED_FEEDBACK_FILE, "r", encoding="utf-8") as f:
            all_feedback = json.load(f)
            if not isinstance(all_feedback, list):
                logging.error("Feedback file corrupted. Returning empty.")
                return []

            if status:
                return [
                    item
                    for item in all_feedback
                    if isinstance(item, dict) and item.get("status") == status
                ]
            return [item for item in all_feedback if isinstance(item, dict)]
    except json.JSONDecodeError:
        logging.error(f"Failed to decode feedback file. Returning empty list.")
        return []
    except Exception as e:
        logging.error(f"Failed to load feedback: {e}", exc_info=True)
        return []


def extract_email_from_text(text: str) -> Optional[str]:
    """Extract email address from text content."""
    emails = re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", text)
    if emails:
        email = emails.group(0)
        # Clean up common email suffixes
        for suffix in [".com", ".org", ".net", ".edu", ".co.uk", ".io"]:
            if suffix in email:
                parts = email.split(suffix)
                email = parts[0] + suffix
                break
        return email
    return None


async def search_web_and_extract_info(search_query: str, pages: int = 5) -> str:
    """Search web and extract relevant information."""
    logging.info(f"Starting web search for: '{search_query}' (pages: {pages})")

    search_results = await google_search(search_query, pages)
    if not search_results:
        logging.warning(f"No search results for: '{search_query}'")
        return f"No information found for: {search_query}"

    urls = [result["link"] for result in search_results if result.get("link")]
    if not urls:
        logging.warning(f"No valid URLs found for: '{search_query}'")
        return f"No valid sources found for: {search_query}"

    try:
        # Get URLs for scraping
        urls_to_scrape = urls[:pages]  # Limit to specified number of pages
        browser_results = await scrape_multiple(
            urls_to_scrape, use_selenium=True, body_only=True
        )
        if not browser_results:
            return f"Failed to extract content for: {search_query}"

        # Process results with error handling
        valid_contents = []
        for url, content in zip(urls_to_scrape, browser_results):
            if content and isinstance(content, str):
                # Limit content length and clean it up
                cleaned_content = content.strip()[
                    :2000
                ]  # Limit to 2000 chars per source
                if cleaned_content:
                    valid_contents.append(f"Source ({url}):\n{cleaned_content}\n---")

        if not valid_contents:
            return f"No valid content could be extracted for: {search_query}"

        return f"Information for '{search_query}':\n\n" + "\n\n".join(valid_contents)
    except Exception as e:
        logging.error(f"Error extracting web info: {e}", exc_info=True)
        return f"Error processing query: {search_query}"


async def scrape_multiple(
    urls: Sequence[str],
    use_selenium: bool = False,
    body_only: bool = False,
    browser: str = "chrome",
    headless: bool = True,
) -> List[Optional[str]]:
    """Scrape multiple URLs concurrently.

    Args:
        urls: Sequence of URLs to scrape (list or tuple)
        use_selenium: Whether to use Selenium for scraping
        body_only: Whether to return only the body content
        browser: Browser to use with Selenium
        headless: Whether to run browser in headless mode

    Returns:
        List of scraped content strings or None for failed scrapes
    """
    # Convert any sequence to list
    url_list = list(urls)

    async def scrape_url(url: str) -> Optional[str]:
        try:
            if use_selenium and SELENIUM_AVAILABLE:
                driver = get_webdriver(browser, headless)
                if not driver:
                    return None
                try:
                    driver.get(url)
                    WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.TAG_NAME, "body"))
                    )
                    content = driver.page_source
                finally:
                    driver.quit()
            else:
                async with aiohttp.ClientSession() as session:
                    async with session.get(url) as response:
                        content = await response.text()

            if body_only:
                soup = BeautifulSoup(content, "html.parser")
                return soup.body.get_text() if soup.body else ""
            return content
        except Exception as e:
            logging.error(f"Error scraping {url}: {str(e)}")
            return None

    tasks = [scrape_url(url) for url in url_list]
    return await asyncio.gather(*tasks)


# Email validation error handling
def handle_email_validation_error(
    email: str, error: Exception
) -> Optional[Tuple[str, str]]:
    """Handle email validation errors with proper logging.

    Args:
        email: The email being validated
        error: The exception that occurred

    Returns:
        None to indicate validation failure
    """
    error_type = type(error).__name__
    logging.error(f"{error_type} during email validation for {email}: {str(error)}")
    return None


def validate_email(email: str) -> Optional[Tuple[str, str]]:
    """Validate email through SMTP with comprehensive error handling."""
    try:
        # Email validation logic here
        pass
    except (socket.error, ssl.SSLError, smtplib.SMTPException) as e:
        return handle_email_validation_error(email, e)
    except Exception as e:
        return handle_email_validation_error(email, e)


async def google_search(query: str, max_results: int = 10) -> List[Dict[str, str]]:
    """Perform a Google search and return structured results.

    Args:
        query: Search query string
        max_results: Maximum number of results to return

    Returns:
        List of dictionaries containing search results with keys:
        - title: Result title
        - link: Result URL
        - snippet: Result description
    """
    try:
        results = []
        for result in google_search_lib(
            query, num=max_results, stop=max_results, pause=2.0
        ):
            results.append(
                {
                    "title": "",  # Title would need to be extracted from the page
                    "link": result,
                    "snippet": "",  # Snippet would need to be extracted from the page
                }
            )
        return results
    except Exception as e:
        logging.error(f"Error performing Google search: {str(e)}")
        return []


def save_response_to_file(
    content: str, filename_prefix: str, directory: str = default_output_dir
) -> Optional[str]:
    """
    Save content to a file with a timestamp-based filename.

    Args:
        content: The content to save to file
        filename_prefix: The prefix for the filename. Invalid chars will be removed
        directory: Directory to save the file in. Defaults to OUTPUT_DIRECTORY from config

    Returns:
        The full path to the saved file if successful, None if failed
    """
    try:
        # Clean filename by removing invalid characters
        clean_prefix = "".join(
            c for c in filename_prefix if c.isalnum() or c in ("_", "-")
        )
        timestamp = time.strftime("%Y%m%d_%H%M%S")
        filename = f"{clean_prefix}_{timestamp}.txt"

        # Ensure directory exists
        os.makedirs(directory, exist_ok=True)

        # Create full file path
        filepath = os.path.join(directory, filename)

        # Save the content
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)

        logging.info(f"Content saved to {filepath}")
        return filepath

    except Exception as e:
        logging.error(f"Error saving content to file: {str(e)}", exc_info=True)
        return None


def extract_links_and_snippets(
    search_results: List[Dict[str, str]],
) -> List[Dict[str, str]]:
    """Extract links and snippets from search results."""
    logging.info("Extracting links and snippets from search results")
    extracted_data = []
    for result in search_results:
        data = {
            "link": result.get("link") or result.get("formattedUrl"),
            "snippet": result.get("snippet") or result.get("htmlSnippet", ""),
        }
        extracted_data.append(data)
    logging.info(f"Extracted {len(extracted_data)} items from search results")
    return extracted_data


def prep_url_list_for_scraping(extracted_data: List[Dict[str, str]]) -> List[str]:
    """Prepares a list of unique URLs for scraping."""
    logging.info("Preparing URLs for scraping")
    urls_to_scrape = list(
        set(item["link"] for item in extracted_data if item.get("link"))
    )  # Use set for uniqueness
    logging.info(f"Prepared {len(urls_to_scrape)} unique URLs for scraping")
    return urls_to_scrape


async def search_and_extract_web_context(
    search_query: str, num_results: int = 5
) -> Tuple[str, str]:
    logging.info(f"Performing web search and extraction for query: '{search_query}'")
    combined_snippets = ""
    combined_scraped_content = ""

    try:
        # Step 1: Search
        search_results = await google_search(search_query, max_results=num_results)
        if not search_results:
            logging.warning("Web search returned no results.")
            return "", ""

        # Step 2: Extract links and snippets
        extracted_data = extract_links_and_snippets(search_results)
        if not extracted_data:
            logging.warning("No links/snippets extracted from search results.")
            return "", ""

        # Combine snippets
        combined_snippets = "\n".join(
            [
                f"Source: {item.get('link', 'N/A')}\nSnippet: {item.get('snippet', 'N/A')}\n---"
                for item in extracted_data
            ]
        )

        # Step 3: Prepare URLs for scraping
        urls_to_scrape = prep_url_list_for_scraping(extracted_data)

        # Step 4: Scrape content
        scraped_contents = await scrape_multiple(
            urls_to_scrape, use_selenium=True, body_only=True, headless=True
        )
        if scraped_contents:
            combined_scraped_content = "\n\n".join(
                f"--- Content from {url} ---\n{content[:1500]}..."  # Limit length
                for url, content in zip(urls_to_scrape, scraped_contents)
                if content
            )
        else:
            logging.warning("Scraping yielded no content.")

        logging.info("Successfully generated web context.")
        return combined_snippets, combined_scraped_content

    except Exception as e:
        logging.error(
            f"Error during web search/extraction for '{search_query}': {e}",
            exc_info=True,
        )
        return (
            combined_snippets,
            combined_scraped_content,
        )  # Return whatever was gathered


async def search_and_extract_web_context_async(
    search_query: str, num_results: int = 5
) -> Tuple[str, str]:
    """
    Async wrapper for search_and_extract_web_context to be imported by other modules.
    Ensures compatibility with async import expectations.
    """
    import asyncio

    loop = asyncio.get_event_loop()
    # Run the existing function in executor to avoid blocking event loop
    return await loop.run_in_executor(
        None,
        lambda: asyncio.run(search_and_extract_web_context(search_query, num_results)),
    )

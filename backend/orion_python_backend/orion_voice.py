import logging
import os
import tempfile
import time
from dotenv import load_dotenv
from typing import Optional


import speech_recognition as sr


try:
    from playsound import playsound
except ImportError:
    logging.error(
        "playsound library not found or failed to import. Please install (e.g., pip install playsound==1.2.2)"
    )
    playsound = None


import pyttsx3
from gtts import gTTS

try:
    from elevenlabs.client import ElevenLabs
    from elevenlabs import Voice, VoiceSettings

    ELEVENLABS_AVAILABLE = True
except ImportError:
    ElevenLabs = None
    Voice = None
    VoiceSettings = None
    ELEVENLABS_AVAILABLE = False
    logging.warning("ElevenLabs SDK not found. High-quality TTS voices unavailable.")


WHISPER_POSSIBLE = hasattr(sr.Recognizer, "recognize_whisper")
if not WHISPER_POSSIBLE:
    logging.warning(
        "Whisper STT via speech_recognition not available. Ensure 'openai-whisper' is installed (`pip install -U openai-whisper`)."
    )


load_dotenv()
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s",
)


ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
ELEVENLABS_VOICE_ID_DEFAULT = os.getenv(
    "ELEVENLABS_VOICE_ID_DEFAULT", "jBpfuIE2acCO8z3wKNLl"
)
ELEVENLABS_VOICE_ID_THERAPY = os.getenv(
    "ELEVENLABS_VOICE_ID_THERAPY", "EXAVITQu4vr4xnSDxMaL"
)
WHISPER_MODEL_NAME = os.getenv("WHISPER_MODEL_NAME", "base.en")

WHISPER_FORCE_CPU = os.getenv("WHISPER_FORCE_CPU", "False").lower() == "true"


eleven_client = None
if ELEVENLABS_AVAILABLE and ELEVENLABS_API_KEY:
    try:
        eleven_client = ElevenLabs(api_key=ELEVENLABS_API_KEY)
        logging.info("ElevenLabs client initialized.")
    except Exception as e:
        logging.error(f"Failed to initialize ElevenLabs client: {e}")
elif not ELEVENLABS_API_KEY and ELEVENLABS_AVAILABLE:
    logging.warning(
        "ElevenLabs SDK is installed, but ELEVENLABS_API_KEY is not set in .env."
    )


def listen_for_command(
    timeout_seconds=10, phrase_time_limit_seconds=5
) -> Optional[str]:
    """
    Listens for a voice command using the microphone and returns the recognized text.
    Prioritizes Whisper (via speech_recognition) if available, otherwise falls back to Google Web Speech.
    """
    r = sr.Recognizer()
    with sr.Microphone() as source:
        logging.info("Adjusting for ambient noise...")
        r.adjust_for_ambient_noise(source, duration=1)
        logging.info(f"Listening for command ({phrase_time_limit_seconds}s limit)...")
        try:
            audio = r.listen(
                source,
                timeout=timeout_seconds,
                phrase_time_limit=phrase_time_limit_seconds,
            )
            logging.info("Audio captured, recognizing...")
            text = None

            if WHISPER_POSSIBLE:
                logging.info(f"Attempting Whisper STT (Model: {WHISPER_MODEL_NAME})...")
                try:
                    whisper_kwargs = {"model": WHISPER_MODEL_NAME}

                    if WHISPER_FORCE_CPU:
                        whisper_kwargs["device"] = "cpu"
                        logging.debug("Forcing Whisper to use CPU.")

                    text = r.recognize_whisper(audio, **whisper_kwargs)
                    logging.info(f"Whisper recognized: {text}")

                except sr.UnknownValueError:
                    logging.warning("Whisper could not understand audio.")

                except sr.RequestError as e:
                    logging.error(f"Could not request results from Whisper; {e}")

                except Exception as whisper_err:

                    logging.error(
                        f"Whisper transcription failed unexpectedly: {whisper_err}",
                        exc_info=True,
                    )

            if text is None:
                if not WHISPER_POSSIBLE:
                    logging.info(
                        "Whisper not available, using Google Web Speech for STT..."
                    )
                else:
                    logging.info(
                        "Whisper failed or returned empty, falling back to Google Web Speech..."
                    )
                try:
                    text = r.recognize_google(audio)
                    logging.info(f"Google Web Speech recognized: {text}")
                except sr.UnknownValueError:
                    logging.warning("Google Web Speech could not understand audio.")
                    return None
                except sr.RequestError as e:
                    logging.error(
                        f"Could not request results from Google Web Speech service; {e}"
                    )
                    return None

            if text:

                return text.strip()
            else:

                logging.warning(
                    "Recognition resulted in empty text after all attempts."
                )
                return None

        except sr.WaitTimeoutError:
            logging.warning("No speech detected within timeout.")
            return None
        except Exception as e:
            logging.error(
                f"An unexpected error occurred during listening: {e}", exc_info=True
            )
            return None


def speak_response(text: str, voice_preference: str = "default"):
    """Speaks the given text using the preferred TTS engine."""
    if not text:
        logging.warning("speak_response called with empty text.")
        return
    if not playsound:
        logging.error("Cannot speak response: playsound function is not available.")
        return

    logging.info(
        f"Speaking response (Voice Pref: {voice_preference}): '{text[:50]}...'"
    )
    temp_filename = None

    try:

        if voice_preference in ["therapy", "default_eleven"] and eleven_client:
            voice_id_to_use = None
            if voice_preference == "therapy" and ELEVENLABS_VOICE_ID_THERAPY:
                voice_id_to_use = ELEVENLABS_VOICE_ID_THERAPY
                logging.debug(f"Using ElevenLabs Therapy Voice ID: {voice_id_to_use}")
            elif (
                voice_preference == "default_eleven" or voice_preference == "default"
            ) and ELEVENLABS_VOICE_ID_DEFAULT:

                voice_id_to_use = ELEVENLABS_VOICE_ID_DEFAULT
                logging.debug(f"Using ElevenLabs Default Voice ID: {voice_id_to_use}")

            if voice_id_to_use:
                try:
                    voice_obj = Voice(voice_id=voice_id_to_use)

                    if voice_preference == "therapy":
                        voice_obj.settings = VoiceSettings(
                            stability=0.6,
                            similarity_boost=0.75,
                            style=0.3,
                            use_speaker_boost=True,
                        )
                    else:
                        voice_obj.settings = VoiceSettings(
                            stability=0.7, similarity_boost=0.7, use_speaker_boost=True
                        )

                    audio_stream = eleven_client.generate(
                        text=text,
                        voice=voice_obj,
                        model="eleven_multilingual_v2",
                    )

                    if audio_stream:

                        with tempfile.NamedTemporaryFile(
                            delete=False, suffix=".mp3"
                        ) as fp:
                            temp_filename = fp.name
                            for chunk in audio_stream:
                                if chunk:
                                    fp.write(chunk)

                        if os.path.getsize(temp_filename) > 0:
                            logging.debug(
                                f"ElevenLabs audio saved to temp file: {temp_filename}"
                            )
                            playsound(temp_filename)
                            return
                        else:
                            logging.warning(
                                "ElevenLabs generate stream yielded no audio data (empty file)."
                            )

                            if temp_filename and os.path.exists(temp_filename):
                                try:
                                    os.remove(temp_filename)
                                except OSError:
                                    pass
                            temp_filename = None

                    else:
                        logging.warning(
                            "ElevenLabs generate returned None or empty generator."
                        )
                except Exception as eleven_err:
                    logging.error(
                        f"ElevenLabs generation/playback failed: {eleven_err}",
                        exc_info=True,
                    )

        logging.debug("Attempting fallback to gTTS.")
        try:
            tts = gTTS(text=text, lang="en", slow=False)

            with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as fp:
                tts.write_to_fp(fp)
                temp_filename = fp.name
            logging.debug(f"gTTS audio saved to temp file: {temp_filename}")
            playsound(temp_filename)
            return
        except Exception as gtts_err:
            logging.warning(f"gTTS failed: {gtts_err}. Trying pyttsx3.")

            if temp_filename and os.path.exists(temp_filename):
                try:
                    os.remove(temp_filename)
                except OSError:
                    pass
            temp_filename = None

        logging.debug("Attempting fallback to pyttsx3.")
        try:
            engine = pyttsx3.init()
            if engine:

                engine.setProperty("rate", 180)

                engine.say(text)
                engine.runAndWait()

                return
            else:
                logging.error("pyttsx3 engine initialization failed.")
        except Exception as pyttsx3_err:
            logging.error(f"pyttsx3 failed: {pyttsx3_err}", exc_info=True)

    except Exception as e:
        logging.error(f"General error in speak_response: {e}", exc_info=True)
    finally:

        if temp_filename and os.path.exists(temp_filename):
            try:
                os.remove(temp_filename)
                logging.debug(f"Cleaned up temp audio file: {temp_filename}")
            except OSError as e:
                logging.error(f"Error removing temp file {temp_filename}: {e}")


if __name__ == "__main__":
    speak_response("Hello! How can I help you today?", voice_preference="default")
    command = listen_for_command()

    if command:
        speak_response(f"You said: {command}", voice_preference="default_eleven")
        if "therapy" in command.lower():
            speak_response(
                "Okay, switching to a calmer voice for our session.",
                voice_preference="therapy",
            )
        elif "hello" in command.lower():
            speak_response("Hello to you too!", voice_preference="default")
    else:
        speak_response(
            "I didn't catch that. Could you please repeat?", voice_preference="default"
        )

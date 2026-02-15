---
name: audio-processing
description: Audio ingestion, analysis, transformation, and generation (Transcribe, TTS, VAD, Features).
metadata:
  {
    "openclaw":
      {
        "emoji": "🎙️",
        "requires": { 
          "bins": ["ffmpeg", "python3"], 
          "pip": ["openai-whisper", "gTTS", "librosa", "pydub", "soundfile", "numpy", "webrtcvad-wheels"] 
        },
        "install":
          [
            {
              "id": "ffmpeg",
              "kind": "brew",
              "package": "ffmpeg",
              "label": "Install ffmpeg",
            },
            {
              "id": "python-deps",
              "kind": "pip",
              "package": "openai-whisper gTTS librosa pydub soundfile numpy webrtcvad-wheels",
              "label": "Install Python dependencies",
            }
          ],
      },
  }
---

# Audio Processing Skill

A comprehensive toolset for audio manipulation and analysis.

## Tool API

### audio_tool
Perform audio operations like transcription, text-to-speech, and feature extraction.

- **Parameters:**
  - `action` (string, required): One of `transcribe`, `tts`, `extract_features`, `vad_segments`, `transform`.
  - `file_path` (string, optional): Path to input audio file.
  - `text` (string, optional): Text for TTS.
  - `output_path` (string, optional): Path for output file (default: auto-generated).
  - `model` (string, optional): Whisper model size (tiny, base, small, medium, large). Default: `base`.

**Usage:**

```bash
# Transcribe
uv run --with "openai-whisper" --with "pydub" --with "numpy" skills/audio-processing/tool.py transcribe --file_path input.wav

# TTS
uv run --with "gTTS" skills/audio-processing/tool.py tts --text "Hello world" --output_path hello.mp3

# Features
uv run --with "librosa" --with "numpy" --with "soundfile" skills/audio-processing/tool.py extract_features --file_path input.wav
```

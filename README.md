# 📘 **HybridEngineCo — Modular AI Content Engine**

HybridEngineCo is a **fully‑modular, agent‑driven AI content automation system** designed to generate complete, platform‑ready content from a single topic input.

It produces:

- Scripts  
- Metadata  
- Voiceovers  
- Multi‑format videos  
- Short‑form clips  
- Thumbnails  
- Uploads (YouTube + TikTok placeholder)  

All powered by a clean, resilient pipeline with retries, fallbacks, and cloud‑ready storage.

---

# 🚀 **Features**

### 🎤 **AI Voice Generation**
- ElevenLabs → OpenAI fallback  
- Retry‑aware  
- Writes audio to persistent storage  

### 🎬 **Video Assembly Engine**
- FFmpeg‑powered  
- Multi‑format export: **9:16, 16:9, 1:1, 4:5**  
- Subtitles, overlays, transitions  
- Brand‑colored accents (#8B5CF6)

### ✂️ **Clip Extraction**
- Auto‑detects high‑value moments  
- Slices clips from 16:9 master  
- Exported as standalone MP4s  

### 🖼️ **Thumbnail Generation**
- FFmpeg‑generated  
- Branded accent bar  
- 16:9 + 9:16 formats  

### ☁️ **Uploads**
- YouTube (real, resumable upload)  
- TikTok (placeholder or Playwright/API later)  

### 🔁 **Error‑Resilient Automation**
- Unified error class  
- Retry wrappers for:
  - FFmpeg  
  - TTS  
  - Uploads  
- Pipeline‑safe error propagation  

### 🧩 **Agent‑Driven Architecture**
Each stage is a standalone agent:

```
topic → script → metadata → brand → voice → video → clips → thumbnails → upload
```

---

# 📂 **Project Structure**

```
HybridEngineCo/
│
├── packages/
│   ├── agents/        # All agents (voice, video, clip, thumbnail, upload)
│   ├── tools/         # FFmpeg, TTS, storage, retry, upload clients
│   ├── config/        # Brand profiles, templates, thumbnail config, YouTube config
│   └── core/          # Pipeline graph + pipeline runner
│
├── apps/
│   ├── api/           # Express API for triggering pipeline
│   └── worker/        # Optional async job processor
│
└── infra/
    └── railway/       # Railway environment + .env.example
```

---

# 🧠 **Pipeline Overview**

The pipeline is defined in:

```
packages/core/src/pipelineGraph.ts
```

Execution order:

1. **TopicAgent**  
2. **ScriptAgent**  
3. **MetadataAgent**  
4. **BrandAgent**  
5. **VoiceAgent**  
6. **VideoAgent**  
7. **ClipAgent**  
8. **ThumbnailAgent**  
9. **UploadAgent**

The runner executes each agent in sequence and passes state forward.

---

# 🔧 **Environment Variables**

Copy `.env.example` into `.env` and fill in:

### **Core**
```
ASSET_PATH=/data/assets
```

### **OpenAI**
```
OPENAI_API_KEY=
```

### **ElevenLabs**
```
ELEVENLABS_API_KEY=
TTS_VOICE_ID=
```

### **YouTube**
```
YT_CLIENT_ID=
YT_CLIENT_SECRET=
YT_REFRESH_TOKEN=
YT_CHANNEL_ID=
```

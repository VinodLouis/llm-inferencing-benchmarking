# LLM Inference Benchmarking: Server vs Client Performance Analysis

> A comprehensive benchmarking framework comparing Large Language Model inference performance across **server-side** and **client-side (in-browser)** execution contexts with detailed metrics analysis.

---

## 🎯 Project Overview

This project provides a robust framework for benchmarking and comparing LLM inference performance between two execution paradigms:

- **Server-Side Inference**: Running LLM on remote server using [Ollama](https://ollama.ai/) backend
- **Client-Side Inference**: Running LLM directly in-browser using [Web LLM](https://webllm.mlc.ai/) (powered by MLC)

The application measures critical performance metrics including latency, throughput, memory usage, consistency, and supports network latency simulation to model real-world deployment scenarios (WiFi, 5G, 4G, LAN).

### Key Features

✅ **Dual Inference Modes**: Server and client-side LLM execution in a single application  
✅ **Comprehensive Metrics**: Latency, throughput, memory, jitter, cold/warm start analysis  
✅ **Network Simulation**: Simulate real-world network conditions (LAN, WiFi, 4G, 5G)  
✅ **Warm-up Iterations**: Accurate performance measurement after model warmup  
✅ **Interactive Dashboard**: Real-time progress tracking and results visualization  
✅ **Detailed Analysis**: Automatic insights comparing performance across both modes  
✅ **CSV Export**: Export all benchmark results for further analysis  
✅ **Chat Interface**: Interactive chat with client inference modes for demo

---

## 📦 Project Structure

```
llm-inferencing-benchmarking/
├── docker-compose.yml              # Docker configuration for Ollama server
├── package.json                    # Node.js dependencies
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite build configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS configuration
│
├── public/                         # Static public assets
│
└── src/
    ├── main.tsx                    # React app entry point
    ├── App.tsx                     # Main application component
    ├── App.css                     # Global styles
    ├── index.css                   # Base styles with Tailwind
    ├── vite-env.d.ts              # Vite environment types
    │
    ├── types/
    │   ├── index.ts               # Core TypeScript type definitions
    │   └── webllm.d.ts            # Web LLM library type definitions
    │
    ├── services/
    │   ├── inferenceService.ts    # Server & client inference logic
    │   └── analysisService.ts     # Performance analysis engine
    │
    ├── hooks/
    │   ├── useBenchmark.ts        # Benchmark execution hook
    │   └── useChat.ts             # Chat functionality hook
    │
    ├── components/
    │   ├── BenchmarkConfig.tsx    # Configuration panel component
    │   ├── PerformanceComparison.tsx  # Performance charts & comparison
    │   ├── AnalysisInsights.tsx   # AI-powered analysis insights
    │   ├── FutureOutlook.tsx      # Trend analysis component
    │   ├── MetricsTable.tsx       # Detailed metrics display
    │   ├── NetworkLatencyInfo.tsx # Network simulation info
    │   ├── UseCaseRecommendations.tsx # Use case suggestions
    │   ├── SetupInstructions.tsx  # Setup guide component
    │   └── ChatPanel.tsx          # Interactive chat interface
    │
    ├── utils/
    │   ├── metricsCalculator.ts   # Metrics computation utilities
    │   ├── networkLatency.ts      # Network latency simulation configs
    │   └── csvExporter.ts         # CSV export functionality
    │
    └── assets/                     # Images and static resources

```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **Docker & Docker Compose** (for server-side inference)
- **Modern web browser** with WebGL support (for client-side inference)
- **Python 3.8+** (optional, for advanced Ollama setup)

### Installation

1. **Clone the repository**

   ```bash
   git clone git@github.com:VinodLouis/llm-inferencing-benchmarking.git
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the Ollama server** (in a separate terminal)

   ```bash
   docker-compose up -d
   ```

   This will:
   - Pull the latest Ollama image
   - Start the Ollama service on `localhost:11434`
   - Create a persistent volume for model data at `ollama-data`
   - Auto-restart the container if it crashes

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173` (or another port shown in terminal)

### Initial Model Setup

Before running benchmarks, you need to pull an LLM model into Ollama:

```bash
# Pull a specific model in our case we need 2 models
docker exec ollama-llm ollama pull llama3.2:1b
docker exec ollama-llm ollama pull llama3.2:3b
# List available models
docker exec ollama-llm ollama list
```

---

## 🏗️ Docker Compose Setup

### Configuration Details

The `docker-compose.yml` file configures the Ollama service:

```yaml
version: '3.8'
services:
  ollama:
    image: ollama/ollama:latest
    container_name: ollama-llm
    ports:
      - '11434:11434' # API port (localhost only)
    volumes:
      - ollama-data:/root/.ollama # Persistent model storage
    environment:
      - OLLAMA_HOST=0.0.0.0 # Listen on all interfaces
    restart: unless-stopped # Auto-restart on failure
```

### Key Components

| Component          | Purpose                                                  |
| ------------------ | -------------------------------------------------------- |
| **Image**          | `ollama/ollama:latest` - Official Ollama Docker image    |
| **Port**           | `11434` - Ollama API (HTTP endpoint)                     |
| **Volume**         | `ollama-data` - Persistent storage for downloaded models |
| **Host**           | `0.0.0.0` - Accessible from host machine                 |
| **Restart Policy** | Auto-restart container if it crashes                     |

### Useful Docker Commands

```bash
# View logs
docker logs ollama-llm -f

# Check service status
docker ps | grep ollama

# Restart service
docker-compose restart

# Stop and remove containers
docker-compose down

# Clean up everything including volumes (⚠️ will delete models)
docker-compose down -v

# Access container shell
docker exec -it ollama-llm bash

# Test API endpoint
curl http://localhost:11434/api/tags

# Generate using API directly
curl http://localhost:11434/api/generate \
  -d '{
    "model": "llama3.2:1b",
    "prompt": "What is machine learning?"
  }'
```

---

## 🧠 Frontend Server & Application

### Frontend Technology Stack

- **Framework**: React 19.2 with TypeScript
- **Build Tool**: Vite 7.2 (fast HMR, optimized builds)
- **Styling**: Tailwind CSS 3.4 + PostCSS
- **UI Icons**: Lucide React 0.263
- **Client LLM**: Web LLM 0.2.46 (MLC AI)
- **Linting**: ESLint + Prettier

### Running the Development Server

```bash
npm run dev
```

This starts:

- Local dev server on `http://localhost:5173` (default)
- Hot Module Replacement (HMR) for instant code updates
- TypeScript compilation
- Tailwind CSS processing

### Production Build

```bash
npm run build      # Compile and optimize for production
npm run preview    # Preview production build locally
```

### Frontend Architecture

#### Core Application Flow

```
App.tsx (Main Component)
├── State Management
│   ├── Benchmark Config (model, endpoint, iterations)
│   ├── Benchmark Status (idle, running, complete)
│   └── Results & Analysis
│
├── Hooks
│   ├── useBenchmark() - Orchestrates benchmark execution
│   └── useChat() - Manages chat interactions
│
├── Components
│   ├── BenchmarkConfig - UI for configuration
│   ├── ChatPanel - Interactive chat interface
│   ├── PerformanceComparison - Charts & visualizations
│   ├── MetricsTable - Detailed metrics display
│   └── Analysis Components - Insights & recommendations
│
└── Services
    ├── inferenceService.ts
    │   ├── serverInference() - HTTP calls to Ollama
    │   └── clientInference() - Web LLM model inference
    │
    ├── analysisService.ts - Comparative analysis
    └── Utils
        ├── metricsCalculator.ts - Statistical analysis
        ├── networkLatency.ts - Latency simulation
        └── csvExporter.ts - Data export
```

---

## 🤖 LLM Inference Modes

### Server-Side Inference

**Technology**: Ollama HTTP API  
**Location**: Running in Docker container on `localhost:11434`  
**Execution**: Remote API calls from browser

#### How It Works

1. Browser sends prompt to `/api/generate` endpoint
2. Ollama processes on server (CPU/GPU optimized)
3. Server returns generated text
4. Metrics captured on client

#### API Endpoint Reference

```
POST /api/generate

Request Body:
{
  "model": "llama3.2:1b",
  "prompt": "What is machine learning?",
  "stream": false
}

Response:
{
  "response": "Machine learning is a subset of artificial intelligence...",
  "model": "llama3.2:1b",
  "created_at": "2024-02-02T10:30:00Z",
  "done": true,
  "total_duration": 5000000000,
  "load_duration": 1000000000,
  "prompt_eval_count": 10,
  "eval_count": 50,
  "eval_duration": 4000000000
}
```

#### Performance Characteristics

- **Latency Impact**: Server processing + network overhead
- **Memory Usage**: Amortized across all users
- **Consistency**: Depends on server load and network
- **Scalability**: Multiple users share server resources
- **Reliability**: Centralized control and monitoring

### Client-Side Inference (In-Browser)

**Technology**: Web LLM (MLC AI compiled models)  
**Location**: Running in user's browser  
**Execution**: Direct local inference

#### How It Works

1. Model loaded into browser WebAssembly environment
2. Inference runs locally using GPU/WebGL acceleration
3. No network calls required
4. Metrics captured natively in browser

#### Model Loading & Caching

Web LLM uses indexed database caching:

```javascript
// Models cached in browser IndexedDB:
// - Cache key based on model hash
// - Persists across sessions
// - Reduces download on reload
// - Typical cache sizes:
//   - llama3.2:1b: 750MB
//   - llama3.2-3b: 1.5GB
```

#### Browser Requirements

- **WebGL 2.0 support** (for GPU acceleration)
- **Web Workers** (for parallel processing)
- **IndexedDB** (for model caching)
- **Minimum RAM**: 8GB+ recommended
- **Tested Browsers**:
  - Chrome/Chromium 90+
  - Safari 16+ (M-series Macs)

#### Performance Characteristics

- **Latency**: Pure computation time (no network)
- **Memory Usage**: Full model loaded in browser
- **Consistency**: No external factors affecting performance
- **Scalability**: Limited by single device capabilities
- **Privacy**: Inference stays on user's device

---

## 📊 Metrics & Measurements

### Collected Metrics

The application measures the following for each inference request:

| Metric                    | Unit    | Definition                                     |
| ------------------------- | ------- | ---------------------------------------------- |
| **Latency (Avg)**         | ms      | Average inference time across all iterations   |
| **Latency (Min/Max)**     | ms      | Minimum and maximum latency observed           |
| **Latency (Median)**      | ms      | 50th percentile latency                        |
| **P95 Latency**           | ms      | 95th percentile (95% of requests faster)       |
| **P99 Latency**           | ms      | 99th percentile (99% of requests faster)       |
| **Standard Deviation**    | ms      | Variability in latencies (consistency measure) |
| **Jitter**                | ms      | Variation in response times                    |
| **Cold Start Latency**    | ms      | First inference latency (model loading)        |
| **Warm Start Latency**    | ms      | Average latency after warmup iterations        |
| **Throughput**            | req/sec | Requests per second (inverse of avg latency)   |
| **Success Rate**          | %       | Percentage of successful inferences            |
| **Avg Memory Delta**      | MB      | Average memory change per inference            |
| **Peak Memory**           | MB      | Maximum memory usage during inference          |
| **Time to First Token**   | ms      | Latency until first output token               |
| **Response Length**       | tokens  | Output length in tokens                        |
| **Round Trip Time (RTT)** | ms      | Full request/response cycle time               |

### Network Latency Simulation

The application simulates real-world network conditions for server inference:

```typescript
// From src/utils/networkLatency.ts
const NETWORK_LATENCY_CONFIGS = {
  none: {
    mode: 'none',
    label: 'Localhost (No Delay)',
    latency: 0,
    description: 'Direct connection - server on same machine',
  },
  lan: {
    mode: 'lan',
    label: 'Lab LAN',
    latency: 2.5,
    description: 'Local Area Network - server in same building',
  },
  wifi: {
    mode: 'wifi',
    label: 'Home WiFi',
    latency: 15,
    description: 'Home WiFi - typical residential connection',
  },
  '5g': {
    mode: '5g',
    label: '5G Mobile',
    latency: 30,
    description: '5G cellular network',
  },
  '4g': {
    mode: '4g',
    label: '4G Mobile',
    latency: 60,
    description: '4G/LTE cellular network',
  },
};
```

**How it works**: For each inference request, simulated latency is added twice:

1. Request transmission delay (one-way)
2. Response transmission delay (one-way)
3. **Total network overhead** = 2 × configured latency

**Example**: WiFi mode with 15ms latency = 30ms total simulated network overhead

---

## 🔧 Configuration

### Test Prompts

The default test prompts cover various reasoning domains:

**Generic Reasoning:**

- "What are the key differences between deductive and inductive reasoning?"
- "Explain the concept of cause and effect with a real-world example."
- "Why is critical thinking important in everyday decision-making?"
- "Describe how analogies help in problem-solving."

**Statistics & Data Science:**

- "Explain the difference between correlation and causation with statistical examples."
- "What is the Central Limit Theorem and why is it important?"
- "Describe how hypothesis testing works, including Type I and Type II errors."
- "List and explain 3 assumptions behind linear regression models."
- "How does Bayesian inference differ from frequentist statistics?"
- "Explain p-values and confidence intervals in the context of statistical significance."

---

## 📈 Running Benchmarks

### Step-by-Step Benchmark Execution

1. **Configure Benchmark**
   - Set server endpoint (default: localhost:11434)
   - Choose model (must be pulled in Ollama first)
   - Set number of iterations (typically 10-50 for accurate statistics)
   - Set warm-up iterations (2-5 recommended)
   - Select network latency mode for server simulation

2. **Start Benchmark**
   - Click "Start Benchmark" button
   - Application runs configured iterations:
     - Warm-up phase (runs but not measured)
     - Measurement phase (results collected)
   - Real-time progress shown in UI

3. **Review Results**
   - Performance Comparison charts appear
   - Detailed metrics table displays all statistics
   - Network latency impact analysis shown
   - CSV export available

### Performance Tips

- **Use warm-up iterations**: Allows JIT compilation and model initialization
- **Use multiple iterations**: At least 10 for statistical significance
- **Test with various prompts**: Different prompts may have different characteristics
- **Monitor system load**: Close other applications for accurate results
- **Consistent environment**: Run benchmarks in similar conditions

---

## 💾 Data Export

### CSV Export Feature

The application provides CSV export for detailed analysis:

```bash
# Exported files:
# 1. benchmark_results_[timestamp].csv
#    - Detailed metrics for both server and client
#    - Network latency configuration
#    - Timestamp and platform info
#
# 2. Contains columns:
#    - Metric Name
#    - Server Value
#    - Client Value
#    - Unit
#    - Interpretation
```

### Exported Data Includes

- All metrics (latency, throughput, memory, etc.)
- Percentile analysis (P95, P99)
- Cold/warm start comparison
- Success rates
- Platform and browser information
- Timestamp of benchmark run

---

## 🛠️ Development

### Project Setup for Development

```bash
# Install dependencies
npm install

# Start dev server with HMR
npm run dev

# In another terminal, start Ollama
docker-compose up -d

# Optional: Pull models
docker exec ollama-llm ollama pull llama3.2:1b
```

### Key Technologies

| Technology   | Purpose          | Version |
| ------------ | ---------------- | ------- |
| React        | UI Framework     | 19.2.0  |
| TypeScript   | Type Safety      | 5.9.3   |
| Vite         | Build Tool       | 7.2.4   |
| Tailwind CSS | Styling          | 3.4.0   |
| Web LLM      | Client Inference | 0.2.46  |
| Ollama       | Server Backend   | latest  |
| Docker       | Containerization | 24+     |

### Code Organization Best Practices

- **Services**: Business logic (inferencing, analysis)
- **Components**: React UI components (reusable)
- **Hooks**: Custom React hooks (state management, logic)
- **Utils**: Pure utility functions (calculations, helpers)
- **Types**: TypeScript interfaces and types (type safety)

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Cannot connect to server"

```bash
# Check if Ollama is running
docker ps | grep ollama

# If not running, start it
docker-compose up -d

# Check Ollama API
curl http://localhost:11434/api/tags
```

#### 2. "Model not found"

```bash
# List available models
docker exec ollama-llm ollama list

# Pull a model
docker exec ollama-llm ollama pull llama3.2:1b llama3.2:3b
```

#### 3. Browser shows "WebGL not supported"

- Update your graphics drivers
- Try a different browser (Chrome recommended for Web LLM)
- Check browser WebGL support at https://webglreport.com/

#### 4. OOM (Out of Memory) errors

- Reduce model size (use 1b or 7b instead of 13b)
- Close other browser tabs
- Restart browser to clear memory

#### 5. Slow inference performance

- Check browser developer tools for CPU/GPU load
- Ensure no other heavy processes running
- Try different network latency mode to isolate server vs client

---

## 📚 API Reference

### Ollama API Endpoints

#### Generate Text

```
POST /api/generate

Request:
{
  "model": "llama3.2:1b",
  "prompt": "Your prompt here",
  "stream": false
}

Response:
{
  "model": "llama3.2:1b",
  "created_at": "2024-02-02T10:30:00Z",
  "response": "Generated text...",
  "done": true,
  "total_duration": 5000000000,
  "load_duration": 1000000000,
  "prompt_eval_count": 10,
  "eval_count": 50,
  "eval_duration": 4000000000
}
```

#### List Models

```
GET /api/tags

Response:
{
  "models": [
    {
      "name": "llama3.2:1b",
      "modified_at": "2024-02-02T10:00:00Z",
      "size": 2100000000,
      "digest": "..."
    }
  ]
}
```

---

## 📊 Understanding the Results

### Interpreting Latency Metrics

- **Lower latency = Better** for real-time applications
- **Client often faster** due to no network overhead
- **Server latency includes** network round-trip time
- **Consistency matters**: Low standard deviation = predictable

### Interpreting Throughput

- **Throughput = 1000 / avg_latency** (requests per second)
- **Higher throughput = More requests handled**
- **Server scales better** with multiple concurrent users
- **Client limited** by single device hardware

### Memory Considerations

- **Client memory**: Full model loaded in browser (typically 2-4GB)
- **Server memory**: Per-request overhead minimal, shared across users
- **Memory delta**: Change in heap size during inference
- **Peak memory**: Maximum heap size reached

### Network Latency Impact

- **No latency (localhost)**: Server = Client in speed
- **15ms WiFi**: ~30ms overhead per server request (2x one-way)
- **60ms 4G**: ~120ms overhead per server request
- **Network overhead compounds** across multiple requests

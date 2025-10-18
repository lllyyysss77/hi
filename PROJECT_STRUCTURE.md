# Pinecone Agent Chat - Project Structure & Architecture

## Project Overview
A Next.js-based AI chat application with Pinecone vector memory, Notion integration, and MCP (Model Context Protocol) support. Features real-time streaming responses, plugin system, and multi-language support.

## Architecture Diagram

\`\`\`mermaid
graph TB
    subgraph "Frontend Layer"
        A[app/page.tsx] --> B[App.tsx]
        B --> C[ChatWindow]
        B --> D[Sidebar]
        
        C --> C1[Message Component]
        C --> C2[Chat Input]
        C --> C3[File Upload]
        C --> C4[Thinking Indicator]
        
        D --> D1[ApiSettings]
        D --> D2[PersonaSettings]
        D --> D3[Plugins]
        D --> D4[ManualMemoryInput]
        D --> D5[ConversationActions]
        D --> D6[MemoryLog]
        D --> D7[LanguageSelector]
        
        D3 --> D3A[PineconeSettings]
        D3 --> D3B[NotionSettings]
        D3 --> D3C[McpSettings]
    end
    
    subgraph "API Layer - Next.js Routes"
        E[/api/chat/route.ts]
        F[/api/analyze/route.ts]
    end
    
    subgraph "Service Layer"
        G[geminiService]
        H[pineconeService]
        I[notionService]
        J[pluginService]
        K[configService]
        L[localizationService]
        M[embeddingService]
    end
    
    subgraph "External APIs"
        N[Google Gemini AI]
        O[Pinecone Vector DB]
        P[Notion API]
    end
    
    C --> E
    C --> F
    E --> G
    F --> G
    
    G --> N
    C --> H
    H --> O
    D3B --> I
    I --> P
    
    C --> J
    D --> K
    D7 --> L
    H --> M
    
    style A fill:#FFE5E5
    style B fill:#FFE5E5
    style C fill:#FFF0E5
    style D fill:#FFF0E5
    style E fill:#E5F0FF
    style F fill:#E5F0FF
    style G fill:#F0E5FF
    style H fill:#F0E5FF
    style I fill:#F0E5FF
    style J fill:#F0E5FF
    style K fill:#F0E5FF
    style L fill:#F0E5FF
    style M fill:#F0E5FF
    style N fill:#E5FFE5
    style O fill:#E5FFE5
    style P fill:#E5FFE5
\`\`\`

## Data Flow

\`\`\`mermaid
sequenceDiagram
    participant U as User
    participant C as ChatWindow
    participant API as /api/chat
    participant G as geminiService
    participant P as pineconeService
    participant AI as Gemini AI
    participant V as Pinecone Vector DB
    
    U->>C: Types message
    C->>P: Query relevant memories
    P->>V: Vector search
    V-->>P: Return similar memories
    P-->>C: Memory context
    C->>API: POST {userInput, memoryContext}
    API->>G: Process with context
    G->>AI: Stream request
    AI-->>G: Stream response chunks
    G-->>API: Forward chunks
    API-->>C: Stream response
    C-->>U: Display streaming text
    
    alt Save to memory
        AI->>G: Function call: saveToVectorMemory
        G->>P: Save memory
        P->>V: Store vector
    end
\`\`\`

## Component Hierarchy

\`\`\`mermaid
graph TD
    A[app/layout.tsx] --> B[app/page.tsx]
    B --> C[App.tsx]
    C --> D[Sidebar]
    C --> E[ChatWindow]
    
    D --> D1[ApiSettings]
    D --> D2[PersonaSettings]
    D --> D3[Plugins]
    D --> D4[ManualMemoryInput]
    D --> D5[ConversationActions]
    D --> D6[MemoryLog]
    
    D3 --> D3A[PineconeSettings]
    D3 --> D3B[NotionSettings]
    D3 --> D3C[McpSettings]
    
    E --> E1[Message]
    E --> E2[ThinkingMessage]
    E --> E3[CodeBlock]
\`\`\`

## Service Dependencies

\`\`\`mermaid
graph LR
    A[configService] --> B[App Components]
    C[pineconeService] --> D[ChatWindow]
    C --> E[MemoryLog]
    C --> F[ManualMemoryInput]
    G[pluginService] --> H[Plugins]
    G --> D
    I[localizationService] --> J[All Components]
    K[notionService] --> L[NotionSettings]
    M[geminiService] --> N[API Routes]
    
    style A fill:#FFB3BA
    style C fill:#BAFFC9
    style G fill:#BAE1FF
    style I fill:#FFFFBA
    style K fill:#FFD9BA
    style M fill:#E0BBE4
\`\`\`

## State Management

\`\`\`mermaid
graph TD
    A[localStorage] --> B[configService]
    A --> C[pineconeService]
    A --> D[pluginService]
    A --> E[localizationService]
    A --> F[ChatWindow - Chat History]
    
    B --> G[Config State]
    C --> H[Memory State]
    D --> I[Plugin State]
    E --> J[Language State]
    
    G --> K[React Components]
    H --> K
    I --> K
    J --> K
\`\`\`

## Key Features

### 1. Chat System
- Real-time streaming responses from Gemini AI
- Message history persistence in localStorage
- File upload support (.txt files)
- Thinking indicators during processing
- Export chat history

### 2. Memory System (Pinecone)
- Vector-based long-term memory
- Automatic context retrieval
- Manual memory input
- Recent memory log display
- Connection status monitoring

### 3. Plugin System
- Pinecone vector memory
- Notion integration
- MCP (Model Context Protocol)
- Enable/disable plugins dynamically
- Plugin state persistence

### 4. Localization
- English and Chinese support
- Dynamic language switching
- Persistent language preference

### 5. Persona Customization
- Custom agent name
- Custom agent icon
- System instruction customization
- Model selection

## Environment Variables

\`\`\`
API_KEY - Google Gemini API key (server-side)
GEMINI_API_KEY - Alternative Gemini API key (server-side)
\`\`\`

## Technology Stack

- **Framework**: Next.js 15.2.4 (App Router)
- **UI**: React 19, Tailwind CSS 4
- **AI**: Google Gemini AI SDK
- **Vector DB**: Pinecone
- **Components**: Radix UI, shadcn/ui
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design tokens

## File Structure

\`\`\`
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # Streaming chat endpoint
│   │   └── analyze/route.ts       # Notion analysis endpoint
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Root page
│   └── globals.css                # Global styles & design tokens
├── components/
│   ├── ChatWindow.tsx             # Main chat interface
│   ├── Sidebar.tsx                # Settings sidebar
│   ├── Message.tsx                # Chat message display
│   ├── ApiSettings.tsx            # API configuration
│   ├── PersonaSettings.tsx        # Agent customization
│   ├── Plugins.tsx                # Plugin management
│   ├── PineconeSettings.tsx       # Pinecone status
│   ├── NotionSettings.tsx         # Notion integration
│   ├── McpSettings.tsx            # MCP configuration
│   ├── MemoryLog.tsx              # Memory display
│   ├── ManualMemoryInput.tsx      # Manual memory entry
│   ├── ConversationActions.tsx    # Chat actions
│   ├── CodeBlock.tsx              # Code syntax highlighting
│   └── ui/                        # shadcn/ui components
├── services/
│   ├── geminiService.ts           # AI chat service
│   ├── pineconeService.ts         # Vector memory service
│   ├── notionService.ts           # Notion integration
│   ├── pluginService.ts           # Plugin management
│   ├── configService.ts           # App configuration
│   ├── localizationService.ts     # i18n service
│   └── embeddingService.ts        # Text embeddings
├── hooks/
│   └── useTranslations.ts         # Translation hook
└── types.ts                       # TypeScript types
\`\`\`

## Routing

- `/` - Main chat interface (SSR + Client-side)
- `/api/chat` - POST - Streaming chat with memory context
- `/api/analyze` - POST - Notion content analysis

## Hooks & Custom Logic

### useTranslations
- Provides `t()` function for translations
- Returns current language and `setLanguage()` function
- Subscribes to localizationService updates

### Service Subscriptions
All services use a pub-sub pattern:
\`\`\`typescript
service.subscribe(callback)
service.unsubscribe(callback)
\`\`\`

## Browser APIs Used

- localStorage - State persistence
- FileReader - File upload
- Blob/URL - Export functionality
- crypto.randomUUID() - ID generation (with SSR fallback)
- window - Browser detection (with SSR guards)

## SSR Considerations

All services check for `typeof window !== 'undefined'` before accessing browser APIs to support Next.js server-side rendering and static generation.

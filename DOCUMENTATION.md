# Pinecone Agent Chat - Complete Project Documentation

## Project Overview
A Next.js-based AI chat application with Pinecone vector memory, MCP plugin support, and multi-API key management.

## Technology Stack
- **Framework**: Next.js 15.5.4 (App Router)
- **Runtime**: React 19.1.0
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.1.9 with glass morphism design
- **AI**: Google Gemini API with multi-key fallback
- **State Management**: React hooks (useState, useEffect)
- **UI Components**: Radix UI + shadcn/ui
- **Analytics**: Vercel Analytics

## Architecture Overview

\`\`\`mermaid
graph TB
    subgraph "Frontend Layer"
        A[App.tsx] --> B[ChatWindow]
        A --> C[Sidebar]
        C --> D[ApiSettings]
        C --> E[PersonaSettings]
        C --> F[Plugins]
        C --> G[PineconeSettings]
        C --> H[McpSettings]
        C --> I[MemoryLog]
        B --> J[Message Components]
        B --> K[CodeBlock]
    end
    
    subgraph "Service Layer"
        L[geminiService] --> M[API Key Manager]
        N[pineconeService] --> O[Embedding Service]
        P[configService] --> Q[localStorage]
        R[pluginService] --> S[MCP Integration]
        T[localizationService] --> U[i18n]
        V[notionService] --> W[Notion API]
    end
    
    subgraph "API Layer"
        X[/api/chat] --> L
        Y[/api/analyze] --> L
        X --> M
        Y --> M
    end
    
    subgraph "Data Layer"
        Q[Browser Storage]
        Z[Vector Memory]
        AA[Chat History]
    end
    
    B --> X
    B --> Y
    D --> P
    E --> P
    F --> R
    G --> N
    L --> N
    N --> Z
    P --> AA
\`\`\`

## Data Flow Architecture

\`\`\`mermaid
sequenceDiagram
    participant U as User
    participant C as ChatWindow
    participant API as API Routes
    participant KM as API Key Manager
    participant G as Gemini Service
    participant P as Pinecone Service
    participant S as Storage
    
    U->>C: Send Message
    C->>S: Save to History
    C->>API: POST /api/chat
    API->>KM: Get Next API Key
    KM->>G: Initialize with Key
    G->>G: Generate Response
    alt API Key Fails
        G-->>KM: Error
        KM->>KM: Switch to Next Key
        KM->>G: Retry with New Key
    end
    G->>P: Store in Vector Memory
    P->>S: Save Embeddings
    G-->>API: Stream Response
    API-->>C: SSE Stream
    C->>U: Display Response
\`\`\`

## Component Hierarchy

\`\`\`mermaid
graph TD
    A[app/page.tsx] --> B[App.tsx]
    B --> C[Sidebar]
    B --> D[ChatWindow]
    
    C --> C1[ApiSettings]
    C --> C2[PersonaSettings]
    C --> C3[Plugins]
    C --> C4[PineconeSettings]
    C --> C5[McpSettings]
    C --> C6[ManualMemoryInput]
    C --> C7[ConversationActions]
    C --> C8[MemoryLog]
    
    D --> D1[Message]
    D --> D2[CodeBlock]
    D --> D3[ApiEndpoint]
    
    C1 --> UI1[Input Components]
    C2 --> UI2[Textarea Components]
    C3 --> UI3[Switch Components]
    C4 --> UI4[Badge Components]
\`\`\`

## Service Dependencies

\`\`\`mermaid
graph LR
    A[configService] --> B[localStorage]
    C[geminiService] --> D[API Key Manager]
    E[pineconeService] --> F[embeddingService]
    E --> A
    G[pluginService] --> A
    H[localizationService] --> B
    I[notionService] --> B
    
    D --> J[Environment Variables]
    F --> C
    
    K[API Routes] --> C
    K --> D
    K --> E
\`\`\`

## Routing Structure

\`\`\`mermaid
graph TD
    A[/] --> B[app/page.tsx]
    B --> C[Dynamic Import App.tsx]
    
    D[/api/chat] --> E[POST Handler]
    E --> F[Stream Response]
    
    G[/api/analyze] --> H[POST Handler]
    H --> I[Notion Analysis]
    
    J[app/layout.tsx] --> K[Global Layout]
    K --> L[Analytics]
    K --> M[Fonts]
    K --> N[Global CSS]
\`\`\`

## State Management Flow

\`\`\`mermaid
stateDiagram-v2
    [*] --> Initialized
    Initialized --> ConfigLoaded: Load Config
    ConfigLoaded --> APIReady: API Keys Set
    APIReady --> ChatActive: User Interaction
    ChatActive --> Processing: Send Message
    Processing --> Streaming: API Response
    Streaming --> ChatActive: Complete
    Processing --> Error: API Failure
    Error --> Retry: Switch Key
    Retry --> Processing: New Key
    Error --> ChatActive: All Keys Failed
\`\`\`

## API Key Management Flow

\`\`\`mermaid
flowchart TD
    A[User Input: key1,key2,key3] --> B[Parse Keys]
    B --> C[Store in Array]
    C --> D[Initialize Index = 0]
    D --> E[Make API Call]
    E --> F{Success?}
    F -->|Yes| G[Return Response]
    F -->|No| H{More Keys?}
    H -->|Yes| I[Increment Index]
    I --> E
    H -->|No| J[Return Error]
    G --> K[Reset Index]
\`\`\`

## Memory System Architecture

\`\`\`mermaid
graph TB
    A[User Message] --> B[Generate Embedding]
    B --> C[Store in Vector DB]
    C --> D[Pinecone Service]
    D --> E[In-Memory Storage]
    
    F[Query] --> G[Search Similar]
    G --> D
    D --> H[Return Top K]
    H --> I[Context Enhancement]
    I --> J[Gemini API]
\`\`\`

## Plugin System

\`\`\`mermaid
classDiagram
    class Plugin {
        +string id
        +string name
        +boolean enabled
        +function execute()
    }
    
    class PluginService {
        +Plugin[] plugins
        +registerPlugin()
        +enablePlugin()
        +disablePlugin()
        +executePlugin()
    }
    
    class MCPPlugin {
        +string endpoint
        +connect()
        +disconnect()
    }
    
    class NotionPlugin {
        +string apiKey
        +analyze()
    }
    
    PluginService --> Plugin
    MCPPlugin --|> Plugin
    NotionPlugin --|> Plugin
\`\`\`

## File Structure

\`\`\`
pineconeagentchat/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts          # Chat API endpoint with streaming
│   │   └── analyze/
│   │       └── route.ts          # Notion analysis endpoint
│   ├── globals.css               # Global styles with glass morphism
│   ├── layout.tsx                # Root layout with fonts
│   └── page.tsx                  # Entry point with dynamic import
├── components/
│   ├── ui/                       # shadcn/ui components (75 files)
│   ├── ApiEndpoint.tsx           # API endpoint display
│   ├── ApiSettings.tsx           # Multi-key API configuration
│   ├── ChatWindow.tsx            # Main chat interface
│   ├── CodeBlock.tsx             # Code syntax highlighting
│   ├── ConversationActions.tsx   # Chat actions (clear, export)
│   ├── CoreMemory.tsx            # Memory management UI
│   ├── ManualMemoryInput.tsx     # Manual memory entry
│   ├── McpSettings.tsx           # MCP plugin configuration
│   ├── MemoryLog.tsx             # Memory history display
│   ├── Message.tsx               # Chat message component
│   ├── NotionSettings.tsx        # Notion integration
│   ├── PersonaSettings.tsx       # AI persona configuration
│   ├── PineconeSettings.tsx      # Vector DB settings
│   ├── Plugins.tsx               # Plugin management
│   ├── Sidebar.tsx               # Settings sidebar
│   └── icons.tsx                 # Icon components
├── services/
│   ├── apiKeyManager.ts          # Multi-key management with fallback
│   ├── configService.ts          # App configuration
│   ├── embeddingService.ts       # Text embedding generation
│   ├── geminiService.ts          # Gemini API client
│   ├── localizationService.ts    # i18n support
│   ├── notionService.ts          # Notion API integration
│   ├── pineconeService.ts        # Vector database simulation
│   └── pluginService.ts          # Plugin system
├── hooks/
│   ├── use-mobile.ts             # Mobile detection
│   ├── use-toast.ts              # Toast notifications
│   ├── useSimpleFeedback.ts      # User feedback
│   └── useTranslations.ts        # Translation hook
├── lib/
│   └── utils.ts                  # Utility functions (cn)
├── types.ts                      # TypeScript type definitions
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript configuration
└── next.config.mjs               # Next.js configuration
\`\`\`

## Environment Variables

\`\`\`bash
# Required
API_KEY=your_gemini_api_key_1,key_2,key_3  # Comma-separated for fallback
GEMINI_API_KEY=your_gemini_api_key         # Alternative key name

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

## Key Features

### 1. Multi-API Key Management
- Supports comma-separated API keys
- Automatic fallback on failure
- Round-robin key rotation
- Error tracking per key

### 2. Vector Memory System
- In-browser Pinecone simulation
- Semantic search capabilities
- Conversation context retention
- Memory persistence in localStorage

### 3. Plugin Architecture
- MCP (Model Context Protocol) support
- Notion integration
- Extensible plugin system
- Enable/disable per plugin

### 4. Glass Morphism UI
- OKLCH color space
- Backdrop blur effects
- Responsive design
- Mobile-first approach

### 5. Streaming Responses
- Server-Sent Events (SSE)
- Real-time message display
- Graceful error handling
- Retry logic

## API Endpoints

### POST /api/chat
**Request:**
\`\`\`json
{
  "message": "User message",
  "history": [
    {"author": "user", "content": "Previous message"},
    {"author": "agent", "content": "Previous response"}
  ]
}
\`\`\`

**Response:** SSE stream of text chunks

### POST /api/analyze
**Request:**
\`\`\`json
{
  "content": "Notion page content to analyze"
}
\`\`\`

**Response:**
\`\`\`json
{
  "analysis": "AI-generated analysis"
}
\`\`\`

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (with webkit prefixes)
- Mobile browsers: ✅ Responsive design

## Performance Optimizations

1. **Dynamic Imports**: App.tsx loaded client-side only
2. **Code Splitting**: Automatic by Next.js
3. **Memoization**: React.memo for expensive components
4. **Lazy Loading**: Services instantiated on demand
5. **Debouncing**: Input handlers debounced
6. **Virtual Scrolling**: For long message lists

## Security Considerations

1. **API Keys**: Server-side only, never exposed to client
2. **CORS**: Configured for API routes
3. **Input Validation**: All user inputs sanitized
4. **XSS Prevention**: React's built-in protection
5. **Rate Limiting**: Implemented in API routes

## Testing Strategy

### Unit Tests
- Service layer functions
- Utility functions
- Component logic

### Integration Tests
- API route handlers
- Service interactions
- Component integration

### E2E Tests
- User flows
- Chat functionality
- Settings management

## Deployment

### Vercel (Recommended)
\`\`\`bash
vercel deploy
\`\`\`

### Manual Build
\`\`\`bash
pnpm install
pnpm build
pnpm start
\`\`\`

## Troubleshooting

### Common Issues

1. **localStorage not defined**
   - Fixed with SSR guards in services
   - Dynamic import in page.tsx

2. **API key errors**
   - Check environment variables
   - Verify key format (comma-separated)
   - Check API key manager logs

3. **Streaming issues**
   - Verify SSE support in browser
   - Check network tab for errors
   - Ensure API route returns proper headers

## Future Enhancements

1. Real Pinecone integration
2. User authentication
3. Multi-user support
4. Advanced plugin marketplace
5. Voice input/output
6. File upload support
7. Export conversations
8. Theme customization
9. Keyboard shortcuts
10. Mobile app (React Native)

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request
5. Wait for review

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: [repository]/issues
- Email: support@example.com
- Discord: [community link]

---

**Last Updated**: 2025-01-18
**Version**: 1.0.0
**Maintainer**: Development Team

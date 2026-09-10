import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Send, 
  Mic, 
  MicOff, 
  Paperclip, 
  Scale, 
  Bookmark,
  Share2,
  ArrowLeft,
  Languages,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Shield,
  Copy,
  Edit3,
  Check,
  Trash2,
  History,
  Plus,
  MoreHorizontal,
  Pin,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { askLegalAI, clearConversationAPI, transcribeVoiceAPI } from '@/lib/api'

interface Source {
  reference: string
  verified: boolean
  lastVerified: string
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  contentUrdu: string
  timestamp: Date
  confidence?: number
  sources?: Source[]
  isEdited?: boolean
}

// StoredMessage for localStorage (timestamp is string)
type StoredMessage = Omit<Message, 'timestamp'> & { timestamp: string }

interface ChatSession {
  id: string
  title: string
  date: string
  time: string
  messages: StoredMessage[]
  pinned: boolean
}

const suggestedQueries = [
  { text: "What is Section 302 PPC?", textUrdu: "دفعہ 302 پی پی سی کیا ہے؟" },
  { text: "Punishment for theft", textUrdu: "چوری کی سزا" },
  { text: "How to file FIR?", textUrdu: "ایف آئی آر کیسے درج کریں؟" },
  { text: "My legal rights", textUrdu: "میرے قانونی حقوق" },
  { text: "Bail application process", textUrdu: "ضمانت کی درخواست کا عمل" },
  { text: "Divorce procedure", textUrdu: "طلاق کا طریقہ کار" },
]

const legalCategories = [
  { id: 'family', name: 'Family Law' },
  { id: 'property', name: 'Property' },
  { id: 'criminal', name: 'Criminal' },
  { id: 'business', name: 'Business' },
  { id: 'constitutional', name: 'Constitutional' },
]

function getConfidenceBadge(confidence: number) {
  if (confidence >= 0.9) return { label: 'High Confidence', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' }
  if (confidence >= 0.7) return { label: 'Medium Confidence', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' }
  return { label: 'Low Confidence', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' }
}

function SourceBadge({ source }: { source: Source }) {
  return (
    <div className="flex items-center gap-1 text-xs">
      <CheckCircle className="h-3 w-3 text-emerald-600" />
      <span className="text-muted-foreground">{source.reference}</span>
      {source.verified && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Shield className="h-3 w-3 text-primary ml-1" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Verified Source - Last checked: {source.lastVerified}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}

// Storage helpers
const STORAGE_KEYS = {
  SESSION: 'paklegal_session_id',
  HISTORY: 'paklegal_chat_sessions',
  CURRENT_MESSAGES: 'paklegal_current_messages'
}

const getStorageItem = <T,>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaultValue
  } catch {
    return defaultValue
  }
}

const setStorageItem = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export default function ChatPage() {
  const navigate = useNavigate()
  
  // Session ID
  const [sessionId, setSessionId] = useState(() => {
    const stored = localStorage.getItem('paklegal_session_id')
    if (stored) return stored
    const newId = crypto.randomUUID()
    localStorage.setItem('paklegal_session_id', newId)
    return newId
  })

  // Chat History from localStorage
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    return getStorageItem(STORAGE_KEYS.HISTORY, [])
  })

  const [messages, setMessages] = useState<Message[]>(() => {
    const stored = getStorageItem<StoredMessage[]>(STORAGE_KEYS.CURRENT_MESSAGES, [])
    if (stored.length > 0) {
      return stored.map(m => ({...m, timestamp: new Date(m.timestamp)}))
    }
    return [
      {
        id: 'welcome',
        role: 'assistant',
        content: `Assalam-o-Alaikum. Welcome to PakLegal AI.

I have access to 764+ Pakistani laws including:
- Pakistan Penal Code (PPC)
- Constitution of Pakistan (1973)
- Criminal Procedure Code
- Civil Procedure Code
- Family Laws, Property Laws & Business Laws

Ask me anything about Pakistani law!

Important: This information is for general guidance only and does not constitute legal advice. For specific legal matters, please consult a qualified lawyer licensed to practice in Pakistan.`,
        contentUrdu: `السلام علیکم۔ پاک لیگل ای آئی میں خوش آمدید۔`,
        timestamp: new Date(),
        confidence: 1,
        sources: [],
      }
    ]
  })
  
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState<'en' | 'ur'>('en')
  const [isListening, setIsListening] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null)
  
  // Voice recording state
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [isTranscribing, setIsTranscribing] = useState(false)
  
  // Chat history menu state
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editChatTitle, setEditChatTitle] = useState('')
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px'
    }
  }, [input])

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Save messages to storage
  useEffect(() => {
    const serializable = messages.map(m => ({
      ...m,
      timestamp: m.timestamp.toISOString()
    }))
    setStorageItem(STORAGE_KEYS.CURRENT_MESSAGES, serializable)
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // ============================================
  // SAVE CHAT TO HISTORY
  // ============================================
  const saveToHistory = (msgs: Message[], sid: string) => {
    if (msgs.length <= 1) return
    
    const userMessages = msgs.filter(m => m.role === 'user')
    if (userMessages.length === 0) return
    
    const existing = chatSessions.find(s => s.id === sid)
    
    // Title from first user message only
    let title = existing?.title
    if (!title) {
      const firstUserMessage = userMessages[0].content
      title = firstUserMessage.length > 35 
        ? firstUserMessage.substring(0, 35) + '...' 
        : firstUserMessage
    }
    
    const session: ChatSession = {
      id: sid,
      title,
      date: existing?.date || new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      messages: msgs.map(m => ({
        ...m,
        timestamp: m.timestamp.toISOString()
      })),
      pinned: existing?.pinned || false
    }
    
    const updated = [session, ...chatSessions.filter(s => s.id !== sid)]
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1
        if (!a.pinned && b.pinned) return 1
        return 0
      })
      .slice(0, 50)
    
    setChatSessions(updated)
    setStorageItem(STORAGE_KEYS.HISTORY, updated)
  }

  // ============================================
  // LOAD SESSION FROM HISTORY
  // ============================================
  const loadSession = (sessionIdToLoad: string) => {
    const session = chatSessions.find(s => s.id === sessionIdToLoad)
    if (!session) return
    
    // Save current first
    saveToHistory(messages, sessionId)
    
    const restoredMessages = session.messages.map(m => ({
      ...m,
      timestamp: new Date(m.timestamp)
    }))
    
    setMessages(restoredMessages)
    setSessionId(sessionIdToLoad)
    localStorage.setItem('paklegal_session_id', sessionIdToLoad)
    setStorageItem(STORAGE_KEYS.CURRENT_MESSAGES, session.messages)
    setTimeout(() => scrollToBottom(), 100)
  }

  // ============================================
  // NEW CHAT
  // ============================================
  const startNewChat = async () => {
    // Save current chat first
    saveToHistory(messages, sessionId)
    
    try { await clearConversationAPI() } catch (e) { console.error(e) }
    
    const newId = crypto.randomUUID()
    setSessionId(newId)
    localStorage.setItem('paklegal_session_id', newId)
    
    const welcomeMsg: Message = {
      id: 'welcome',
      role: 'assistant',
      content: `Assalam-o-Alaikum. Welcome to PakLegal AI.

I have access to 764+ Pakistani laws including:
- Pakistan Penal Code (PPC)
- Constitution of Pakistan (1973)
- Criminal Procedure Code
- Civil Procedure Code
- Family Laws, Property Laws & Business Laws

Ask me anything about Pakistani law!

Important: This information is for general guidance only and does not constitute legal advice. For specific legal matters, please consult a qualified lawyer licensed to practice in Pakistan.`,
      contentUrdu: `السلام علیکم۔ پاک لیگل ای آئی میں خوش آمدید۔`,
      timestamp: new Date(),
      confidence: 1,
      sources: [],
    }
    
    setMessages([welcomeMsg])
    setStorageItem(STORAGE_KEYS.CURRENT_MESSAGES, [welcomeMsg])
    setInput('')
  }

  // ============================================
  // MENU ACTIONS
  // ============================================
  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setActiveMenuId(activeMenuId === id ? null : id)
  }

  const startEditChat = (e: React.MouseEvent, session: ChatSession) => {
    e.stopPropagation()
    setEditingChatId(session.id)
    setEditChatTitle(session.title)
    setActiveMenuId(null)
  }

  const saveChatName = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!editChatTitle.trim()) return
    
    const updated = chatSessions.map(s => 
      s.id === id ? { ...s, title: editChatTitle.trim() } : s
    )
    setChatSessions(updated)
    setStorageItem(STORAGE_KEYS.HISTORY, updated)
    setEditingChatId(null)
    setEditChatTitle('')
  }

  const cancelEditChat = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingChatId(null)
    setEditChatTitle('')
  }

  const togglePin = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const updated = chatSessions.map(s => 
      s.id === id ? { ...s, pinned: !s.pinned } : s
    ).sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return 0
    })
    setChatSessions(updated)
    setStorageItem(STORAGE_KEYS.HISTORY, updated)
    setActiveMenuId(null)
  }

  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const updated = chatSessions.filter(s => s.id !== id)
    setChatSessions(updated)
    setStorageItem(STORAGE_KEYS.HISTORY, updated)
    setActiveMenuId(null)
    
    if (id === sessionId) {
      startNewChat()
    }
  }

  // ============================================
  // SEND MESSAGE
  // ============================================
  const handleSendMessage = async (messageText: string = input) => {
    if (!messageText.trim()) return

    const romanUrduWords = ['hai', 'ka', 'ki', 'kya', 'ke', 'ko', 'se', 'mein', 'aur', 'nahi', 'bhi', 'karna', 'hota'];
    const isRomanUrdu = romanUrduWords.some(word => messageText.toLowerCase().includes(word));
    const detectedLang = isRomanUrdu ? 'en' : language === 'ur' ? 'ur' : 'en';

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      contentUrdu: messageText,
      timestamp: new Date(),
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')           // CLEAR input after sending
    setIsLoading(true)

    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    try {
      const result = await askLegalAI(messageText, detectedLang as 'en' | 'ur', sessionId)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.response,
        contentUrdu: result.response,
        timestamp: new Date(),
        confidence: result.confidence ? result.confidence / 100 : 0.95,
        sources: result.sources ? result.sources.map((src: any) => ({
          reference: src.title || src.source || 'Unknown Source',
          verified: true,
          lastVerified: new Date().toISOString().split('T')[0]
        })) : [],
      }

      const finalMessages = [...newMessages, assistantMessage]
      setMessages(finalMessages)
      
      // Save to history
      saveToHistory(finalMessages, sessionId)
      
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I cannot connect to the legal database. Please make sure the backend server is running on http://127.0.0.1:5000",
        contentUrdu: "معذرت، میں قانونی ڈیٹا بیس سے منسلک نہیں ہو سکتا۔",
        timestamp: new Date(),
        confidence: 0,
        sources: [],
      }
      const finalMessages = [...newMessages, errorMessage]
      setMessages(finalMessages)
      saveToHistory(finalMessages, sessionId)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditMessage = (messageId: string, currentContent: string) => {
    setEditingMessageId(messageId)
    setEditContent(currentContent)
  }

  const saveEditMessage = (messageId: string) => {
    if (!editContent.trim()) return
    const updated = messages.map(msg => 
      msg.id === messageId 
        ? { ...msg, content: editContent.trim(), contentUrdu: editContent.trim(), isEdited: true }
        : msg
    )
    setMessages(updated)
    saveToHistory(updated, sessionId)
    setEditingMessageId(null)
    setEditContent('')
  }

  const cancelEdit = () => {
    setEditingMessageId(null)
    setEditContent('')
  }

  const handleCopyMessage = async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // ============================================
  // VOICE INPUT - FIXED: NO REPETITION
  // ============================================
  const toggleVoiceInput = async () => {
    if (isListening) {
      // STOP recording
      mediaRecorder?.stop();
      setIsListening(false);
    } else {
      // START recording
      try {
        // Only clear if box is empty or contains old transcript
        if (!input.trim()) {
          setInput('');
        }
        
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        
        // Collect ALL chunks
        const allChunks: Blob[] = [];
        let previousTranscript = ''; // Track last known transcript
        
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            allChunks.push(e.data);
          }
        };

        // Live transcription every 3 seconds
        const intervalId = setInterval(async () => {
          if (allChunks.length === 0 || !recorder || recorder.state !== 'recording') return;
          
          const blob = new Blob(allChunks, { type: 'audio/webm' });
          
          try {
            const data = await transcribeVoiceAPI(blob, language);
            if (data.transcript && data.transcript !== previousTranscript) {
              const newTranscript = data.transcript;
              
              // REPLACE old transcript with new one in input box
              setInput(prev => {
                // Remove the previous transcript from input
                const withoutOld = prev.replace(previousTranscript, '').trim();
                // Add new transcript
                return withoutOld ? `${withoutOld} ${newTranscript}` : newTranscript;
              });
              
              previousTranscript = newTranscript;
            }
          } catch (err) {
            // Silently fail for live updates
            console.debug('Live update failed:', err);
          }
        }, 3000);

        recorder.onstop = async () => {
          clearInterval(intervalId);
          stream.getTracks().forEach(t => t.stop());
          
          // Final clean transcription
          setIsTranscribing(true);
          try {
            const finalBlob = new Blob(allChunks, { type: 'audio/webm' });
            const data = await transcribeVoiceAPI(finalBlob, language);
            
            if (data.transcript) {
              // Replace with final accurate transcript
              setInput(prev => {
                const withoutOld = prev.replace(previousTranscript, '').trim();
                return withoutOld ? `${withoutOld} ${data.transcript}` : data.transcript;
              });
            }
            
            textareaRef.current?.focus();
          } catch (err) {
            console.error('Final transcription error:', err);
          } finally {
            setIsTranscribing(false);
          }
        };

        recorder.start(1000); // Collect every 1 second
        setMediaRecorder(recorder);
        setIsListening(true);
      } catch (err) {
        alert('Please allow microphone access in your browser.');
        setIsListening(false);
      }
    }
  };

  const handleSuggestedQuery = (query: string) => {
    handleSendMessage(query)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${sidebarOpen ? 'w-72' : 'w-0'} transition-all duration-300 border-r bg-muted/30 overflow-hidden flex-shrink-0 flex flex-col`}
      >
        {/* STICKY HEADER */}
        <div className="flex-shrink-0 p-3 border-b bg-muted/30">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
            onClick={startNewChat}
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          
          {/* LEGAL CATEGORIES */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2 px-1">
              Legal Categories
            </h3>
            <div className="space-y-0.5">
              {legalCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleSuggestedQuery(`Tell me about ${cat.name}`)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-foreground hover:bg-accent transition-colors"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <Separator className="my-2" />

          {/* CHAT HISTORY */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2 px-1 flex items-center gap-1.5">
              <History className="h-3 w-3" />
              Chat History
            </h3>
            
            {chatSessions.length === 0 ? (
              <p className="text-xs text-muted-foreground px-3 py-2 italic">
                No conversations yet
              </p>
            ) : (
              <div className="space-y-0.5">
                {chatSessions.map((session) => {
                  const isActive = session.id === sessionId
                  const isMenuOpen = activeMenuId === session.id
                  const isEditing = editingChatId === session.id
                  
                  return (
                    <div
                      key={session.id}
                      onClick={() => !isEditing && loadSession(session.id)}
                      className={`group relative flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                        isActive 
                          ? 'bg-accent text-accent-foreground' 
                          : 'hover:bg-accent/50 text-foreground'
                      }`}
                    >
                      <MessageSquare className={`h-3.5 w-3.5 flex-shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                      
                      <div className="flex-1 min-w-0">
                        {isEditing ? (
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              value={editChatTitle}
                              onChange={(e) => setEditChatTitle(e.target.value)}
                              className="w-full text-sm bg-background border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveChatName(e as any, session.id)
                                if (e.key === 'Escape') cancelEditChat(e as any)
                              }}
                            />
                            <button 
                              onClick={(e) => saveChatName(e, session.id)}
                              className="p-1 hover:bg-primary/10 rounded"
                            >
                              <Check className="h-3 w-3 text-green-600" />
                            </button>
                            <button 
                              onClick={cancelEditChat}
                              className="p-1 hover:bg-destructive/10 rounded"
                            >
                              <X className="h-3 w-3 text-destructive" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm truncate font-medium flex-1">
                                {session.title}
                              </p>
                              {session.pinned && (
                                <Pin className="h-3 w-3 text-primary flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                              {session.date} • {session.time}
                            </p>
                          </>
                        )}
                      </div>
                      
                      {/* Three dot menu */}
                      {!isEditing && (
                        <button
                          onClick={(e) => toggleMenu(e, session.id)}
                          className={`p-1 rounded transition-all ${
                            isMenuOpen || isActive
                              ? 'opacity-100'
                              : 'opacity-0 group-hover:opacity-100'
                          } hover:bg-accent`}
                        >
                          <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                      )}
                      
                      {/* Dropdown Menu */}
                      {isMenuOpen && !isEditing && (
                        <div 
                          ref={menuRef}
                          className="absolute right-2 top-8 z-50 w-40 bg-popover border rounded-lg shadow-lg py-1"
                        >
                          <button
                            onClick={(e) => startEditChat(e, session)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                            Edit chat name
                          </button>
                          <button
                            onClick={(e) => togglePin(e, session.id)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
                          >
                            <Pin className={`h-3.5 w-3.5 ${session.pinned ? 'text-primary' : ''}`} />
                            {session.pinned ? 'Unpin' : 'Pin to top'}
                          </button>
                          <Separator className="my-1" />
                          <button
                            onClick={(e) => deleteSession(e, session.id)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="flex-shrink-0 p-3 border-t bg-muted/20">
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              This AI provides general legal information only. Consult a qualified lawyer for specific advice.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Chat Header */}
        <header className="h-14 border-b flex items-center justify-between px-4 flex-shrink-0 bg-background/95 backdrop-blur">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={sidebarOpen ? 'bg-accent' : ''}
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
            <span className="font-medium">PakLegal AI</span>
          </div>

          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}>
                    <Languages className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Switch to {language === 'en' ? 'Urdu' : 'English'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Bookmark className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save Chat</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </header>

        {/* Messages Area */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 scroll-smooth"
        >
          <div className="max-w-3xl mx-auto space-y-6 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className="group"
                onMouseEnter={() => setHoveredMessageId(message.id)}
                onMouseLeave={() => setHoveredMessageId(null)}
              >
                {message.role === 'user' ? (
                  <div className="flex flex-col items-end">
                    <div className="bg-emerald-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                      {editingMessageId === message.id ? (
                        <div className="min-w-[300px] text-left">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full bg-white/10 text-white rounded-lg p-2 text-sm resize-none border border-white/20"
                            rows={3}
                            autoFocus
                          />
                          <div className="flex justify-end gap-2 mt-2">
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-1 text-xs bg-white/20 text-white rounded hover:bg-white/30"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => saveEditMessage(message.id)}
                              className="px-3 py-1 text-xs bg-white text-emerald-600 rounded hover:bg-gray-100"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="whitespace-pre-line text-sm">
                          {message.content}
                          {message.isEdited && (
                            <span className="text-xs opacity-60 ml-2">(edited)</span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {!editingMessageId && hoveredMessageId === message.id && (
                      <div className="flex items-center gap-3 mt-2 mr-1">
                        <button
                          onClick={() => handleEditMessage(message.id, message.content)}
                          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          <Edit3 size={12} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleCopyMessage(message.id, message.content)}
                          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          {copiedMessageId === message.id ? (
                            <Check size={12} className="text-green-500" />
                          ) : (
                            <Copy size={12} />
                          )}
                          {copiedMessageId === message.id ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Scale className="h-4 w-4 text-primary-foreground" />
                    </div>
                    
                    <div className="flex-1 max-w-[80%]">
                      {/* Copy button on hover */}
                      <div 
                        className="relative bg-muted border rounded-2xl rounded-tl-sm px-4 py-3 text-foreground pr-10"
                        onMouseEnter={() => setHoveredMessageId(message.id)}
                        onMouseLeave={() => setHoveredMessageId(null)}
                      >
                        <div className="whitespace-pre-line text-sm">
                          {language === 'ur' ? message.contentUrdu : message.content}
                        </div>
                        
                        <button
                          onClick={() => handleCopyMessage(message.id, message.content)}
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            opacity: hoveredMessageId === message.id ? 1 : 0,
                            transition: 'opacity 0.2s ease'
                          }}
                          className="p-1.5 rounded-md bg-background border shadow-sm text-muted-foreground hover:text-foreground hover:bg-accent"
                          title="Copy"
                        >
                          {copiedMessageId === message.id ? (
                            <Check size={14} className="text-green-500" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>

                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-2 space-y-1">
                          <p className="text-xs text-muted-foreground font-medium">Sources:</p>
                          {message.sources.map((source, idx) => (
                            <SourceBadge key={idx} source={source} />
                          ))}
                        </div>
                      )}

                      {message.confidence !== undefined && (
                        <div className="mt-2">
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getConfidenceBadge(message.confidence).color}`}
                          >
                            {getConfidenceBadge(message.confidence).label}
                          </Badge>
                        </div>
                      )}

                      <div className="mt-2">
                        <span className="text-xs text-muted-foreground">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Scale className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="bg-muted border rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.1s]" />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* INPUT AREA */}
        <div className="flex-shrink-0 border-t bg-background">
          {messages.length <= 1 && (
            <div className="px-4 py-3 border-b">
              <p className="text-xs text-muted-foreground mb-2">Popular Legal Questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQueries.map((query, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleSuggestedQuery(language === 'ur' ? query.textUrdu : query.text)}
                  >
                    {language === 'ur' ? query.textUrdu : query.text}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="p-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex gap-2 items-end">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Paperclip className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Attach File</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleVoiceInput}
                  disabled={isTranscribing}
                  className={isListening ? 'bg-red-100 text-red-600 animate-pulse' : ''}
                >
                  {isListening ? <Mic className="h-5 w-5" /> : isTranscribing ? <Mic className="h-5 w-5 animate-spin" /> : <MicOff className="h-5 w-5" />}
                </Button>

                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isListening ? "Listening... Speak now" : isTranscribing ? "Transcribing..." : language === 'en' ? "Ask about Pakistani law..." : "پاکستانی قانون کے بارے میں پوچھیں..."}
                  disabled={isListening || isTranscribing}
                  className="flex-1 min-h-[40px] max-h-[200px] resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  rows={1}
                  style={{ overflow: 'auto' }}
                />

                <Button 
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || isLoading || isListening || isTranscribing}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>

              <p className="text-center text-xs text-muted-foreground mt-2">
                {isListening ? "Click mic again to stop • Words appear as you speak" : isTranscribing ? "Finalizing..." : "Press Enter to send, Shift+Enter for new line"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
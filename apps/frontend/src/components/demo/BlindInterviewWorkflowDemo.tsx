'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const BlindInterviewWorkflowDemo = () => {
    const [isBlindInterviewOpen, setIsBlindInterviewOpen] = useState(true);
    const [blindInterviewPosition, setBlindInterviewPosition] = useState({ x: 50, y: 50 });
    const [isRecording, setIsRecording] = useState(false);
    const [recordingStage, setRecordingStage] = useState(0); // 0: idle, 1: recording, 2: processing, 3: response
    const [aiMessages, setAiMessages] = useState<string[]>([]);
    const [lastScreenshot, setLastScreenshot] = useState<string | null>(null);
    const [currentAction, setCurrentAction] = useState<string | null>(null);
    const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
    const [currentScenarioIndex, setCurrentScenarioIndex] = useState<number | null>(null);

    // Ref for auto-scrolling chat container
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Enhanced interview questions and AI responses with code examples and theory
    const interviewScenarios = React.useMemo(
        () => [
            {
                question:
                    'Can you implement a binary search algorithm and explain its time complexity?',
                audioResponses: [
                    '🎙️ Question: Binary Search Implementation',
                    '📚 Theory: Divide & conquer on sorted arrays. Each comparison eliminates half the search space.',
                    '⏱️ Time: O(log n), Space: O(1) iterative / O(log n) recursive',
                    '```python\ndef binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1```',
                    '🔑 Key points: Handle integer overflow with mid = left + (right - left) // 2',
                ],
                screenshotResponses: [
                    '📸 Detected: Binary search discussion',
                    '� Alternative: Use bisect module in Python',
                    '```python\nimport bisect\nindex = bisect.bisect_left(arr, target)\nreturn index if index < len(arr) and arr[index] == target else -1```',
                ],
            },
            {
                question: 'What is the difference between SQL JOIN types? Give examples.',
                audioResponses: [
                    '🎙️ Question: SQL JOIN Operations',
                    '📚 Theory: JOINs combine rows from two or more tables based on related columns.',
                    '🔗 INNER JOIN: Returns only matching rows from both tables',
                    '```sql\nSELECT u.name, o.total\nFROM users u\nINNER JOIN orders o ON u.id = o.user_id```',
                    '🔗 LEFT JOIN: All rows from left table + matching from right',
                    '```sql\nSELECT u.name, COALESCE(o.total, 0) as total\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id```',
                    '🔑 Use INNER for required relationships, LEFT for optional',
                ],
                screenshotResponses: [
                    '📸 SQL JOIN diagram detected',
                    '📊 Visual: Venn diagram representation helps explain overlaps',
                    '⚡ Performance: Use indexes on JOIN columns for better performance',
                ],
            },
            {
                question:
                    'Implement a function to reverse a linked list. Can you do it iteratively and recursively?',
                audioResponses: [
                    '🎙️ Question: Linked List Reversal',
                    '� Theory: Change pointer directions to reverse the chain',
                    '🔄 Iterative approach with 3 pointers:',
                    '```python\ndef reverse_iterative(head):\n    prev, curr = None, head\n    while curr:\n        next_temp = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_temp\n    return prev```',
                    '🔄 Recursive approach:',
                    '```python\ndef reverse_recursive(head):\n    if not head or not head.next:\n        return head\n    new_head = reverse_recursive(head.next)\n    head.next.next = head\n    head.next = None\n    return new_head```',
                    '⏱️ Both: O(n) time, Iterative: O(1) space, Recursive: O(n) space',
                ],
                screenshotResponses: [
                    '� Linked list visualization detected',
                    '🎯 Pattern: Three-pointer technique is common for list manipulation',
                    '💡 Edge cases: Empty list, single node, maintain head reference',
                ],
            },
            {
                question: 'Explain the concept of closures in JavaScript with an example.',
                audioResponses: [
                    '🎙️ Question: JavaScript Closures',
                    "📚 Theory: A closure gives access to outer function's scope from inner function",
                    "🔐 Inner function 'closes over' variables from outer scope",
                    '```javascript\nfunction createCounter() {\n    let count = 0;\n    return function() {\n        count++;\n        return count;\n    };\n}\nconst counter = createCounter();\nconsole.log(counter()); // 1\nconsole.log(counter()); // 2```',
                    '💡 Use cases: Data privacy, function factories, callbacks',
                    '```javascript\nfunction multiplier(factor) {\n    return function(number) {\n        return number * factor;\n    };\n}\nconst double = multiplier(2);\nconsole.log(double(5)); // 10```',
                    '🔑 Variables persist even after outer function returns',
                ],
                screenshotResponses: [
                    '📸 JavaScript closure code detected',
                    '⚡ Common pattern: Module pattern uses closures for encapsulation',
                    '🎯 Memory: Be aware of potential memory leaks with closures',
                ],
            },
            {
                question: 'What are the SOLID principles? Explain each with a brief example.',
                audioResponses: [
                    '🎙️ Question: SOLID Design Principles',
                    '📚 Theory: 5 principles for maintainable object-oriented design',
                    '🅂 Single Responsibility: One class, one reason to change',
                    '🅾 Open/Closed: Open for extension, closed for modification',
                    '🅻 Liskov Substitution: Subtypes must be substitutable for base types',
                    'ℹ Interface Segregation: Many specific interfaces > one general',
                    '� Dependency Inversion: Depend on abstractions, not concretions',
                    '```python\n# Single Responsibility\nclass EmailSender:\n    def send(self, message): pass\n\nclass EmailValidator:\n    def validate(self, email): pass```',
                    '🔑 Benefits: Easier testing, maintenance, and code reuse',
                ],
                screenshotResponses: [
                    '📸 SOLID principles diagram detected',
                    "🎯 Real-world: Apply gradually, don't over-engineer simple solutions",
                    '📖 Resources: Clean Code and Clean Architecture books elaborate these',
                ],
            },
            {
                question: 'How would you implement a rate limiter? What algorithms would you use?',
                audioResponses: [
                    '🎙️ Question: Rate Limiting Implementation',
                    '📚 Theory: Control request frequency to prevent abuse/overload',
                    '🪣 Token Bucket: Fixed capacity, tokens added at constant rate',
                    '```python\nimport time\nclass TokenBucket:\n    def __init__(self, capacity, refill_rate):\n        self.capacity = capacity\n        self.tokens = capacity\n        self.refill_rate = refill_rate\n        self.last_refill = time.time()\n    \n    def allow_request(self):\n        self._refill()\n        if self.tokens > 0:\n            self.tokens -= 1\n            return True\n        return False```',
                    '🚰 Sliding Window: Count requests in time window',
                    '⚡ Trade-offs: Memory vs accuracy, burst handling',
                    '🔑 Consider: Distributed systems need Redis/database coordination',
                ],
                screenshotResponses: [
                    '📸 Rate limiting architecture detected',
                    '🎯 Distributed: Use Redis with sliding window counters',
                    '📊 Monitoring: Track rate limit hits and adjust thresholds',
                ],
            },
            {
                question:
                    'Design a URL shortening service like bit.ly. What are the key components?',
                audioResponses: [
                    '🎙️ Question: System Design - URL Shortener',
                    '📚 Theory: Need to convert long URLs to short unique identifiers',
                    '🏗️ Components: Web server, database, cache, analytics',
                    "```python\n# Base62 encoding for short URLs\ndef encode_base62(num):\n    alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'\n    result = ''\n    while num > 0:\n        result = alphabet[num % 62] + result\n        num //= 62\n    return result or '0'```",
                    '📊 Scale: 100:1 read/write ratio, use Redis for caching',
                    '🔑 Database: Use auto-increment ID + base62 encoding for short URLs',
                    '⚡ Performance: CDN for global distribution, database sharding',
                ],
                screenshotResponses: [
                    '📸 System design whiteboard detected',
                    '🎯 Alternative: Use hash function + collision handling',
                    '📈 Analytics: Track clicks, geographic data, referrers',
                ],
            },
            {
                question:
                    "What happens when you type 'google.com' in your browser? Walk me through the entire process.",
                audioResponses: [
                    '🎙️ Question: Browser Navigation Process',
                    '📚 Theory: Complex multi-step process involving DNS, TCP, HTTP',
                    '1️⃣ DNS Resolution: Browser checks cache → OS cache → Router → DNS servers',
                    '2️⃣ TCP Connection: Three-way handshake (SYN, SYN-ACK, ACK)',
                    '3️⃣ TLS Handshake: Certificate validation, key exchange',
                    '4️⃣ HTTP Request: GET / HTTP/1.1 with headers',
                    '5️⃣ Server Processing: Load balancer → Web server → App server',
                    '6️⃣ HTTP Response: HTML + status code + headers',
                    '7️⃣ Rendering: Parse HTML → Build DOM → CSSOM → Render tree → Paint',
                    '🔑 Optimizations: Keep-alive connections, HTTP/2, caching',
                ],
                screenshotResponses: [
                    '📸 Network diagram detected',
                    '🎯 Tools: Use browser DevTools Network tab to observe',
                    '⚡ Performance: Critical rendering path optimization',
                ],
            },
            {
                question: 'Implement a LRU (Least Recently Used) cache with O(1) operations.',
                audioResponses: [
                    '🎙️ Question: LRU Cache Implementation',
                    '📚 Theory: Combine HashMap + Doubly Linked List for O(1) operations',
                    '🔗 HashMap: Key → Node mapping for O(1) access',
                    '```python\nclass LRUCache:\n    def __init__(self, capacity):\n        self.capacity = capacity\n        self.cache = {}  # key -> node\n        # Create dummy head and tail\n        self.head = Node(0, 0)\n        self.tail = Node(0, 0)\n        self.head.next = self.tail\n        self.tail.prev = self.head\n\n    def get(self, key):\n        if key in self.cache:\n            node = self.cache[key]\n            self._remove(node)\n            self._add(node)\n            return node.value\n        return -1```',
                    '🔄 Operations: Move to head on access, remove from tail when full',
                    '⏱️ Time: O(1) for get/put, Space: O(capacity)',
                    '🔑 Key insight: Doubly linked list enables O(1) removal',
                ],
                screenshotResponses: [
                    '📸 LRU cache visualization detected',
                    '🎯 Alternative: Use OrderedDict in Python for simpler implementation',
                    '💡 Variations: LFU cache, time-based expiration',
                ],
            },
        ],
        [],
    );

    // Auto-scroll chat to bottom when new messages are added
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [aiMessages]);

    const handleRecording = React.useCallback(() => {
        if (!isRecording) {
            // Start recording with random interview scenario
            const randomIndex = Math.floor(Math.random() * interviewScenarios.length);
            const selectedScenario = interviewScenarios[randomIndex];
            setCurrentScenarioIndex(randomIndex);
            setIsRecording(true);
            setRecordingStage(1);
            setRecordedAudio(`Interviewer: "${selectedScenario.question}"`);
        } else {
            // Stop recording and process - use the SAME scenario that was selected
            setRecordingStage(2);
            setTimeout(() => {
                setRecordingStage(3);
                // Use the stored scenario index to get the correct responses
                if (currentScenarioIndex !== null) {
                    const currentScenario = interviewScenarios[currentScenarioIndex];
                    setAiMessages((prev) => [...prev, ...currentScenario.audioResponses]);
                }
                setIsRecording(false);
                setRecordingStage(0);
                setTimeout(() => setCurrentAction(null), 2000);
            }, 2000);
        }
    }, [isRecording, interviewScenarios, currentScenarioIndex]);

    const handleScreenshot = React.useCallback(() => {
        setLastScreenshot(`FullScreen_Capture_${Date.now()}.png`);

        // Simulate capturing entire screen and processing by AI
        setTimeout(() => {
            // Use current scenario if available, otherwise pick random
            const scenarioIndex =
                currentScenarioIndex !== null
                    ? currentScenarioIndex
                    : Math.floor(Math.random() * interviewScenarios.length);
            const selectedScenario = interviewScenarios[scenarioIndex];

            const fullScreenAnalysis = [
                '🖥️ Full screen captured and sent to BlindInterview AI',
                '🔍 AI analyzing entire desktop: Detected coding interview environment',
                '📊 Screen analysis complete: Interview question about data structures',
                '💻 AI processed full screen: Found system design discussion with diagrams',
                '🧠 Complete desktop analyzed: AI identified algorithm whiteboarding session',
                '⚡ Full screen sent to AI: Detected JavaScript debugging scenario',
            ];
            const enhancedResponses = [
                fullScreenAnalysis[Math.floor(Math.random() * fullScreenAnalysis.length)],
                ...selectedScenario.screenshotResponses,
            ];
            setAiMessages((prev) => [...prev, ...enhancedResponses]);
            setTimeout(() => setCurrentAction(null), 2000);
        }, 1500);
    }, [interviewScenarios, currentScenarioIndex]);

    const moveBlindInterview = React.useCallback((direction: string) => {
        setBlindInterviewPosition((prev) => {
            const moveDistance = 15;
            switch (direction) {
                case 'ArrowUp':
                    return { ...prev, y: Math.max(5, prev.y - moveDistance) };
                case 'ArrowDown':
                    return { ...prev, y: Math.min(80, prev.y + moveDistance) };
                case 'ArrowLeft':
                    return { x: Math.max(5, prev.x - moveDistance), y: prev.y };
                case 'ArrowRight':
                    return { x: Math.min(70, prev.x + moveDistance), y: prev.y };
                default:
                    return prev;
            }
        });
        setTimeout(() => setCurrentAction(null), 1000);
    }, []);

    const handleExit = React.useCallback(() => {
        setTimeout(() => {
            setIsBlindInterviewOpen(false);
            setAiMessages([]);
            setIsRecording(false);
            setRecordingStage(0);
            setCurrentAction(null);
            setCurrentScenarioIndex(null); // Reset scenario mapping
            setTimeout(() => {
                setIsBlindInterviewOpen(true);
                setBlindInterviewPosition({ x: 50, y: 50 });
            }, 2000);
        }, 1000);
    }, []);

    // Keyboard event handlers
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Shift + R - Toggle recording
            if (event.shiftKey && event.key.toLowerCase() === 'r') {
                event.preventDefault();
                setCurrentAction('recording');
                handleRecording();
            }
            // Shift + I - Screenshot
            else if (event.shiftKey && event.key.toLowerCase() === 'i') {
                event.preventDefault();
                setCurrentAction('screenshot');
                handleScreenshot();
            }
            // Shift + T - Toggle BlindInterview window
            else if (event.shiftKey && event.key.toLowerCase() === 't') {
                event.preventDefault();
                setCurrentAction('toggle');
                setIsBlindInterviewOpen(!isBlindInterviewOpen);
            }
            // Shift + Arrow Keys - Move window
            else if (event.shiftKey && event.key.startsWith('Arrow')) {
                event.preventDefault();
                setCurrentAction('move');
                moveBlindInterview(event.key);
            }
            // Alt + Q - Close application
            else if (event.altKey && event.key.toLowerCase() === 'q') {
                event.preventDefault();
                setCurrentAction('exit');
                handleExit();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isBlindInterviewOpen, handleRecording, handleScreenshot, moveBlindInterview, handleExit]);

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Background Image using Next.js Image - Lowest z-index */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/assets/desktop.png"
                    alt="Desktop Background"
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="100vw"
                />
            </div>

            {/* Desktop overlay with theme-aware styling */}
            <div className="absolute inset-0 bg-background/30 z-10"></div>

            {/* Neon lime glow effects matching the main theme */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(180,255,100,0.08),transparent_60%)] pointer-events-none z-20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(150,255,120,0.06),transparent_60%)] pointer-events-none z-20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(200,255,80,0.03),transparent_80%)] pointer-events-none z-10" />

            {/* Subtle animated glow */}
            <div className="absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0deg,rgba(180,255,100,0.02)_60deg,transparent_120deg)] animate-pulse pointer-events-none z-10" />
            {/* Full Screen Screenshot Flash Effect */}
            <AnimatePresence>
                {lastScreenshot && currentAction === 'screenshot' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.9, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 bg-white z-50 pointer-events-none flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-black text-2xl font-bold bg-white/90 px-6 py-3 rounded-lg border-2 border-blue-500"
                        >
                            📸 Full Screen Captured → Sending to BlindInterview AI
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Interview Setup - Video Call */}
            <div className="absolute inset-0 z-30">
                {/* Modern Video Call Interview Window */}
                <div className="absolute top-2 left-2 w-72 h-48 md:top-4 md:left-4 md:w-96 md:h-72 bg-card/95 backdrop-blur-md rounded-xl border border-border overflow-hidden shadow-2xl">
                    {/* Modern Video Call Header */}
                    <div className="bg-card/90 backdrop-blur-sm px-2 py-2 md:px-4 md:py-3 flex items-center justify-between border-b border-border">
                        <div className="flex items-center space-x-2 md:space-x-3">
                            <div className="w-2 h-2 md:w-3 md:h-3 bg-destructive rounded-full"></div>
                            <div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-500 rounded-full"></div>
                            <div className="w-2 h-2 md:w-3 md:h-3 bg-primary rounded-full"></div>
                            <span className="text-card-foreground text-xs md:text-sm font-medium ml-1 md:ml-2 hidden sm:inline">
                                Technical Interview - Zoom
                            </span>
                            <span className="text-card-foreground text-xs font-medium ml-1 sm:hidden">
                                Interview
                            </span>
                        </div>
                        <div className="flex items-center space-x-1 md:space-x-2">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full animate-pulse"></div>
                            <span className="text-primary text-xs font-medium">Demo</span>
                            <span className="text-muted-foreground text-xs hidden md:inline">
                                45:32
                            </span>
                        </div>
                    </div>

                    {/* Video Content Area */}
                    <div className="relative h-full bg-gradient-to-br from-card via-card to-primary/5 flex items-center justify-center">
                        {/* Interviewer Avatar */}
                        <div className="text-center">
                            <div className="relative">
                                <div className="w-12 h-12 md:w-20 md:h-20 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-2 md:mb-3 flex items-center justify-center shadow-lg border border-border">
                                    <span className="text-lg md:text-3xl">👨‍💼</span>
                                </div>
                                {/* Status indicator */}
                                <div className="absolute -bottom-0.5 -right-0.5 md:-bottom-1 md:-right-1 w-4 h-4 md:w-6 md:h-6 bg-primary rounded-full border-2 border-card flex items-center justify-center">
                                    {isRecording ? (
                                        <motion.div
                                            animate={{ scale: [1, 1.3, 1] }}
                                            transition={{ repeat: Infinity, duration: 1 }}
                                            className="w-1 h-1 md:w-2 md:h-2 bg-card rounded-full"
                                        />
                                    ) : (
                                        <div className="w-1 h-1 md:w-2 md:h-2 bg-card rounded-full"></div>
                                    )}
                                </div>
                            </div>
                            <div className="text-card-foreground font-medium text-xs md:text-sm">
                                Alex Chen
                            </div>
                            <div className="text-muted-foreground text-xs hidden md:block">
                                Senior Software Engineer
                            </div>
                            <div className="text-muted-foreground text-xs mt-1 hidden md:block">
                                @TechCorp
                            </div>
                        </div>

                        {/* Modern Audio Visualization */}
                        <AnimatePresence>
                            {isRecording && (
                                <div className="absolute bottom-6 left-6 flex items-center space-x-1 bg-red-600/20 backdrop-blur-sm px-3 py-2 rounded-full border border-red-500/30">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                    <div className="flex items-end space-x-1">
                                        {[...Array(5)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                animate={{
                                                    height: [3, 12, 6, 15, 3],
                                                }}
                                                transition={{
                                                    repeat: Infinity,
                                                    duration: 0.8,
                                                    delay: i * 0.1,
                                                }}
                                                className="w-0.5 bg-red-400 rounded-full"
                                            />
                                        ))}
                                    </div>
                                    <span className="text-red-300 text-xs ml-2">Recording</span>
                                </div>
                            )}
                        </AnimatePresence>

                        {/* Video Call Controls */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
                            <div className="bg-slate-700/80 backdrop-blur-sm rounded-full p-2">
                                <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">🎤</span>
                                </div>
                            </div>
                            <div className="bg-slate-700/80 backdrop-blur-sm rounded-full p-2">
                                <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">📹</span>
                                </div>
                            </div>
                            <div className="bg-red-600/80 backdrop-blur-sm rounded-full p-2">
                                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">📞</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Question Display */}
                    <div className="absolute bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur-sm text-white p-3 border-t border-slate-700">
                        <div className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                                <div className="text-xs text-slate-400 mb-1">Current Question:</div>
                                <div className="text-sm text-slate-200">
                                    {recordedAudio ||
                                        'Tell me about a challenging technical problem you solved recently and your approach.'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modern VS Code Editor */}
                <div className="absolute top-2 right-2 w-72 h-48 md:top-4 md:right-4 md:w-[420px] md:h-80 bg-card/95 backdrop-blur-md rounded-xl border border-border overflow-hidden shadow-2xl">
                    {/* VS Code Title Bar */}
                    <div className="bg-card/90 backdrop-blur-sm px-2 py-1.5 md:px-4 md:py-2 border-b border-border flex items-center justify-between">
                        <div className="flex items-center space-x-2 md:space-x-3">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 md:w-3 md:h-3 bg-destructive rounded-full"></div>
                                <div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-500 rounded-full"></div>
                                <div className="w-2 h-2 md:w-3 md:h-3 bg-primary rounded-full"></div>
                            </div>
                            <div className="flex items-center space-x-1 md:space-x-2">
                                <span className="text-primary text-xs md:text-sm">📁</span>
                                <span className="text-card-foreground text-xs md:text-sm truncate max-w-[120px] md:max-w-none">
                                    interview_solution.py
                                </span>
                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-accent rounded-full"></div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-1 md:space-x-2">
                            <span className="text-muted-foreground text-xs hidden md:inline">
                                Python
                            </span>
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full"></div>
                        </div>
                    </div>

                    {/* Code Content */}
                    <div className="relative h-full bg-gradient-to-br from-card via-card to-primary/5">
                        <div className="p-2 md:p-4 text-xs md:text-sm font-mono leading-relaxed">
                            {/* Line numbers */}
                            <div className="absolute left-0 top-4 w-10 text-slate-600 text-xs space-y-1 pt-1">
                                <div className="text-right pr-3">1</div>
                                <div className="text-right pr-3">2</div>
                                <div className="text-right pr-3">3</div>
                                <div className="text-right pr-3">4</div>
                                <div className="text-right pr-3">5</div>
                                <div className="text-right pr-3">6</div>
                                <div className="text-right pr-3">7</div>
                                <div className="text-right pr-3">8</div>
                                <div className="text-right pr-3">9</div>
                            </div>

                            {/* Code content */}
                            <div className="ml-12 space-y-1">
                                <div className="text-slate-500"># Binary Search Implementation</div>
                                <div className="text-slate-400"># Time Complexity: O(log n)</div>
                                <div className="mt-2">
                                    <span className="text-purple-400">def</span>{' '}
                                    <span className="text-blue-400">binary_search</span>
                                    <span className="text-slate-300">(</span>
                                    <span className="text-orange-400">arr</span>
                                    <span className="text-slate-300">, </span>
                                    <span className="text-orange-400">target</span>
                                    <span className="text-slate-300">):</span>
                                </div>
                                <div className="ml-4 text-slate-300">
                                    <span className="text-orange-400">left</span>
                                    <span className="text-slate-300">, </span>
                                    <span className="text-orange-400">right</span>
                                    <span className="text-slate-300"> = </span>
                                    <span className="text-green-400">0</span>
                                    <span className="text-slate-300">, </span>
                                    <span className="text-blue-400">len</span>
                                    <span className="text-slate-300">(</span>
                                    <span className="text-orange-400">arr</span>
                                    <span className="text-slate-300">) - </span>
                                    <span className="text-green-400">1</span>
                                </div>
                                <div className="ml-4 mt-1">
                                    <span className="text-purple-400">while</span>
                                    <span className="text-slate-300"> </span>
                                    <span className="text-orange-400">left</span>
                                    <span className="text-slate-300"> &lt;= </span>
                                    <span className="text-orange-400">right</span>
                                    <span className="text-slate-300">:</span>
                                </div>
                                <div className="ml-8 text-slate-300">
                                    <span className="text-orange-400">mid</span>
                                    <span className="text-slate-300"> = (</span>
                                    <span className="text-orange-400">left</span>
                                    <span className="text-slate-300"> + </span>
                                    <span className="text-orange-400">right</span>
                                    <span className="text-slate-300">) // </span>
                                    <span className="text-green-400">2</span>
                                </div>
                                <div className="ml-8 text-purple-400">
                                    if <span className="text-orange-400">arr</span>
                                    <span className="text-slate-300">[</span>
                                    <span className="text-orange-400">mid</span>
                                    <span className="text-slate-300">] == </span>
                                    <span className="text-orange-400">target</span>
                                    <span className="text-slate-300">:</span>
                                </div>
                                <div className="ml-12 text-purple-400">
                                    return <span className="text-orange-400">mid</span>
                                </div>
                            </div>

                            {/* Cursor */}
                            <motion.div
                                animate={{ opacity: [1, 0, 1] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                                className="absolute bottom-6 md:bottom-8 left-10 md:left-16 w-0.5 h-3 md:h-4 bg-primary"
                            />
                        </div>

                        {/* Screenshot flash effect */}
                        <AnimatePresence>
                            {lastScreenshot && currentAction === 'screenshot' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 0.8, 0] }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute inset-0 bg-white pointer-events-none"
                                />
                            )}
                        </AnimatePresence>

                        {/* Status bar */}
                        <div className="absolute bottom-0 left-0 right-0 bg-card/90 backdrop-blur-sm px-2 py-1 md:px-4 md:py-1 text-xs text-muted-foreground flex items-center justify-between border-t border-border">
                            <div className="flex items-center space-x-2 md:space-x-4">
                                <span className="hidden md:inline">🐍 Python</span>
                                <span className="md:hidden">🐍</span>
                                <span className="hidden md:inline">UTF-8</span>
                                <span>Ln 9, Col 16</span>
                            </div>
                            <div className="flex items-center space-x-1 md:space-x-2">
                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full"></div>
                                <span className="hidden md:inline">Auto Save</span>
                                <span className="md:hidden">✓</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BlindInterview AI Window - AI Assistant Mode */}
                <AnimatePresence>
                    {isBlindInterviewOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 0.4, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            style={{
                                position: 'absolute',
                                left: `${blindInterviewPosition.x}%`,
                                top: `${blindInterviewPosition.y}%`,
                                zIndex: 20,
                            }}
                            className="w-72 h-96 md:w-[420px] md:h-[520px] bg-card/95 backdrop-blur-md rounded-xl shadow-2xl border border-border overflow-hidden"
                        >
                            {/* Modern AI Assistant Header */}
                            <div className="bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm text-card-foreground px-2 py-2 md:px-4 md:py-3 flex items-center justify-between border-b border-border">
                                <div className="flex items-center space-x-2 md:space-x-3">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-destructive/70 rounded-full"></div>
                                        <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-yellow-500/70 rounded-full"></div>
                                        <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-primary/70 rounded-full"></div>
                                    </div>
                                    <div className="w-5 h-5 md:w-7 md:h-7 bg-primary/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-primary/30">
                                        <span className="text-xs md:text-sm">🎯</span>
                                    </div>
                                    <div>
                                        <span className="text-xs md:text-sm font-semibold text-card-foreground">
                                            BlindInterview AI
                                        </span>
                                        <div className="text-xs text-muted-foreground hidden md:block">
                                            {isRecording ? 'Recording...' : 'AI Assistant Ready'}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-1 md:space-x-2">
                                    {isRecording && (
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                            className="w-2 h-2 md:w-2.5 md:h-2.5 bg-destructive rounded-full"
                                        />
                                    )}
                                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full animate-pulse"></div>
                                    <span className="text-xs text-muted-foreground">Active</span>
                                </div>
                            </div>

                            {/* AI Assistant Chat Messages */}
                            <div className="h-full flex flex-col bg-card/20 backdrop-blur-sm">
                                <div
                                    ref={chatContainerRef}
                                    className="flex-1 overflow-y-auto p-4 space-y-4"
                                >
                                    {/* Welcome Message */}
                                    <div className="flex items-start space-x-3">
                                        <div className="w-7 h-7 bg-primary/60 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                            <span className="text-xs">�</span>
                                        </div>
                                        <div className="bg-slate-800/70 backdrop-blur-sm text-white/90 p-3 rounded-2xl rounded-tl-md max-w-xs border border-primary/20">
                                            <div className="text-sm">
                                                🤖 AI Assistant activated - Ready to help you
                                                prepare
                                            </div>
                                            <div className="text-xs text-white/60 mt-1">
                                                Professional AI guidance for interview preparation
                                            </div>
                                        </div>
                                    </div>

                                    {/* Processing Animation */}
                                    <AnimatePresence>
                                        {recordingStage === 2 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="flex items-start space-x-3"
                                            >
                                                <div className="w-7 h-7 bg-blue-500/60 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{
                                                            repeat: Infinity,
                                                            duration: 1,
                                                        }}
                                                        className="w-3.5 h-3.5 border-2 border-white/80 border-t-transparent rounded-full"
                                                    />
                                                </div>
                                                <div className="bg-blue-600/70 backdrop-blur-sm text-white/90 p-3 rounded-2xl rounded-tl-md border border-blue-400/30">
                                                    <div className="text-sm flex items-center space-x-2">
                                                        <span>🎙️ Processing your question...</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                        {currentAction === 'screenshot' && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="flex items-start space-x-3"
                                            >
                                                <div className="w-7 h-7 bg-purple-500/60 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                                    <motion.div
                                                        animate={{ scale: [1, 1.2, 1] }}
                                                        transition={{
                                                            repeat: Infinity,
                                                            duration: 0.8,
                                                        }}
                                                        className="text-white/90 text-sm"
                                                    >
                                                        📸
                                                    </motion.div>
                                                </div>
                                                <div className="bg-purple-600/70 backdrop-blur-sm text-white/90 p-3 rounded-2xl rounded-tl-md border border-purple-400/30">
                                                    <div className="text-sm">
                                                        Screen analysis in progress...
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* AI Response Messages */}
                                    <AnimatePresence>
                                        {aiMessages.map((message, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.3 }}
                                                className="flex items-start space-x-3"
                                            >
                                                <div className="w-7 h-7 bg-primary/60 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                                    <span className="text-xs">🎯</span>
                                                </div>
                                                <div className="bg-primary/70 backdrop-blur-sm text-white/90 p-3 rounded-2xl rounded-tl-md max-w-xs border border-primary/30">
                                                    <div className="text-sm leading-relaxed">
                                                        {message}
                                                    </div>
                                                    <div className="text-xs text-white/60 mt-1 flex items-center space-x-2">
                                                        <span>
                                                            {new Date().toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        </span>
                                                        <span>•</span>
                                                        <span>Analyzing</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                {/* AI Assistant Status Bar */}
                                <div className="border-t border-slate-700/50 bg-slate-800/60 backdrop-blur-sm px-4 py-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div
                                                className={`w-2 h-2 rounded-full ${currentAction ? 'bg-primary/80 animate-pulse' : 'bg-slate-500/60'}`}
                                            ></div>
                                            <span className="text-xs text-white/70">
                                                {currentAction
                                                    ? `Processing ${currentAction}...`
                                                    : 'Ready to assist'}
                                            </span>
                                            <div className="text-xs text-white/50">•</div>
                                            <span className="text-xs text-white/50">
                                                Available when needed
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xs text-white/60">
                                                {aiMessages.length} insights
                                            </span>
                                            <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Action Feedback */}
                <AnimatePresence>
                    {currentAction && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="absolute bottom-32 md:bottom-4 left-1/2 transform -translate-x-1/2 bg-card/95 backdrop-blur-md border border-border text-card-foreground px-4 py-2 md:px-6 md:py-3 rounded-lg text-xs md:text-sm z-40 shadow-lg"
                        >
                            {currentAction === 'recording' && (
                                <div className="flex items-center space-x-2">
                                    <span>🎙️</span>
                                    <span>
                                        {isRecording
                                            ? 'Recording interviewer...'
                                            : 'Stopped recording, processing...'}
                                    </span>
                                </div>
                            )}
                            {currentAction === 'screenshot' && (
                                <div className="flex items-center space-x-2">
                                    <span>📸</span>
                                    <span>Full screen captured and sent to AI for analysis</span>
                                </div>
                            )}
                            {currentAction === 'toggle' && (
                                <div className="flex items-center space-x-2">
                                    <span>🎛️</span>
                                    <span>
                                        {isBlindInterviewOpen
                                            ? 'BlindInterview shown'
                                            : 'BlindInterview hidden'}
                                    </span>
                                </div>
                            )}
                            {currentAction === 'move' && (
                                <div className="flex items-center space-x-2">
                                    <span>🎯</span>
                                    <span>BlindInterview repositioned</span>
                                </div>
                            )}
                            {currentAction === 'exit' && (
                                <div className="flex items-center space-x-2">
                                    <span>❌</span>
                                    <span>Closing application...</span>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Modern Keyboard Shortcuts Guide - Desktop only */}
            <div className="absolute bottom-4 right-4 bg-card/95 backdrop-blur-md border border-border text-card-foreground p-5 rounded-xl text-xs max-w-sm hidden md:block shadow-lg">
                <h3 className="font-semibold mb-3 text-primary flex items-center space-x-2">
                    <span>⌨️</span>
                    <span>Interactive Demo Controls</span>
                </h3>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <kbd className="bg-secondary hover:bg-secondary/80 transition-colors px-3 py-1.5 rounded-lg text-primary font-mono text-xs border border-border">
                            Shift+R
                        </kbd>
                        <span className="ml-3 text-card-foreground">
                            🎙️ Record & Analyze Question
                        </span>
                    </div>
                    <div className="text-xs text-muted-foreground ml-2 -mt-1">
                        AI provides code examples & theory explanations
                    </div>
                    <div className="flex items-center justify-between">
                        <kbd className="bg-secondary hover:bg-secondary/80 transition-colors px-3 py-1.5 rounded-lg text-accent font-mono text-xs border border-border">
                            Shift+I
                        </kbd>
                        <span className="ml-3 text-card-foreground">📸 Screen Capture</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <kbd className="bg-secondary hover:bg-secondary/80 transition-colors px-3 py-1.5 rounded-lg text-chart-3 font-mono text-xs border border-border">
                            Shift+T
                        </kbd>
                        <span className="ml-3 text-card-foreground">🔄 Toggle Window</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <kbd className="bg-secondary hover:bg-secondary/80 transition-colors px-3 py-1.5 rounded-lg text-chart-2 font-mono text-xs border border-border">
                            Shift+↑↓←→
                        </kbd>
                        <span className="ml-3 text-card-foreground">🎯 Move</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <kbd className="bg-secondary hover:bg-secondary/80 transition-colors px-3 py-1.5 rounded-lg text-destructive font-mono text-xs border border-border">
                            Alt+Q
                        </kbd>
                        <span className="ml-3 text-card-foreground">❌ Exit</span>
                    </div>
                </div>
                <div className="mt-4 pt-3 border-t border-border text-muted-foreground text-xs">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span>Interactive simulation of AI-powered interview preparation</span>
                    </div>
                </div>
            </div>

            {/* Mobile Instructions & Controls */}
            <div className="md:hidden absolute inset-x-4 bottom-4 space-y-4">
                {/* Mobile Interactive Controls */}
                <div className="bg-card/95 backdrop-blur-md border border-border rounded-xl p-4 shadow-lg">
                    <h3 className="font-semibold mb-3 text-primary flex items-center space-x-2 text-sm">
                        <span>📱</span>
                        <span>Touch Controls</span>
                    </h3>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                        <button
                            onClick={() => {
                                setCurrentAction('recording');
                                handleRecording();
                            }}
                            className="bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary p-3 rounded-lg transition-all duration-200 active:scale-95 flex flex-col items-center space-y-1"
                        >
                            <span className="text-lg">🎙️</span>
                            <span className="text-xs font-medium">Record</span>
                        </button>

                        <button
                            onClick={() => {
                                setCurrentAction('screenshot');
                                handleScreenshot();
                            }}
                            className="bg-accent/10 hover:bg-accent/20 border border-accent/30 text-accent p-3 rounded-lg transition-all duration-200 active:scale-95 flex flex-col items-center space-y-1"
                        >
                            <span className="text-lg">📸</span>
                            <span className="text-xs font-medium">Capture</span>
                        </button>

                        <button
                            onClick={() => {
                                setCurrentAction('toggle');
                                setIsBlindInterviewOpen(!isBlindInterviewOpen);
                            }}
                            className="bg-secondary hover:bg-secondary/80 border border-border text-secondary-foreground p-3 rounded-lg transition-all duration-200 active:scale-95 flex flex-col items-center space-y-1"
                        >
                            <span className="text-lg">🔄</span>
                            <span className="text-xs font-medium">Toggle</span>
                        </button>
                    </div>

                    {/* Feature Descriptions */}
                    <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <span>Record: AI analyzes questions & provides coding solutions</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-accent rounded-full"></div>
                            <span>Capture: Full screen analysis for visual context</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                            <span>Toggle: Show/hide BlindInterview AI assistant</span>
                        </div>
                    </div>
                </div>

                {/* Mobile Demo Status */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        <span className="text-primary text-xs font-medium">Demo Active</span>
                    </div>
                    <div className="text-xs text-muted-foreground">BlindInterview AI Assistant</div>
                </div>
            </div>
        </div>
    );
};

export default BlindInterviewWorkflowDemo;

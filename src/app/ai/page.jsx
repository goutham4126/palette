'use client'
import { useState, useEffect, useRef } from 'react'
import { IoMdRefresh, IoMdCode } from 'react-icons/io'
import { FiCopy, FiDownload } from 'react-icons/fi'
import { GoogleGenerativeAI } from "@google/generative-ai"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {toast} from "react-hot-toast"
import { FaCamera,FaMicrophone  } from "react-icons/fa";
import { RiAiGenerate } from "react-icons/ri";

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  throw new Error("Missing NEXT_PUBLIC_GEMINI_API_KEY environment variable")
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY)

export default function WebsiteChat() {
  const [chatHistory, setChatHistory] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chatHistory')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  
  const [userInput, setUserInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [previewCode, setPreviewCode] = useState('')
  const [editingCode, setEditingCode] = useState(null)
  const [uploadedImages, setUploadedImages] = useState([])
  const chatEndRef = useRef(null)
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  // Persist chat history to localStorage
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory))
  }, [chatHistory])

  const clearHistory = () => {
    setChatHistory([])
    setUploadedImages([])
    localStorage.removeItem('chatHistory')
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join('');
          setUserInput(prev => prev + ' ' + transcript);
        };

        recognition.onerror = (event) => {
          setIsListening(false);
          toast.error('Speech recognition error: ' + event.error);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognition);
      }
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
    } else {
      recognition?.start();
    }
    setIsListening(!isListening);
  };

  const [customizations, setCustomizations] = useState({
    darkTheme: false,
    animations: false,
    contactForm: false,
    imageGallery: false,
  })
  const [primaryColor, setPrimaryColor] = useState('blue')
  const [layoutType, setLayoutType] = useState('responsive')
  const [sectionCount, setSectionCount] = useState(3)
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImages((prev) => [
          ...prev,
          {
            id: Date.now(),
            name: file.name,
            base64: reader.result,
          },
        ])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = async () => {
    if (!userInput.trim()) return

    const userMessage = { 
      role: 'user', 
      content: userInput,
      timestamp: new Date().toLocaleTimeString()
    }
    
    setChatHistory(prev => [...prev, userMessage])
    setUserInput('')
    setIsLoading(true)

    try {
      const customizationPrompts = []
      if (customizations.darkTheme) customizationPrompts.push('Dark theme with contrasting colors')
      if (customizations.animations) customizationPrompts.push('Subtle animations on scroll/hover')
      if (customizations.contactForm) customizationPrompts.push('Contact form section')
      if (customizations.imageGallery) customizationPrompts.push('Image gallery grid')
      
      const layoutPrompts = {
        responsive: 'Responsive layout adapting to screen sizes',
        grid: 'CSS grid-based layout',
        single: 'Single column layout'
      }

      const imageInstructions = uploadedImages.length > 0 ? 
        `- Include ${uploadedImages.length} uploaded images using src="uploaded-image-1", "uploaded-image-2", etc.` : 
        ''

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' })
      const prompt = `Generate HTML/Tailwind CSS code for: ${userInput}. Requirements:
        - Modern ${layoutPrompts[layoutType]}
        - ${customizations.darkTheme ? 'Dark' : 'Light'} theme using ${primaryColor} as primary color
        - Clean semantic HTML with ${sectionCount} sections
        - Tailwind CSS with interactive elements
        ${customizationPrompts.length ? '- Includes: ' + customizationPrompts.join(', ') : ''}
        ${imageInstructions}
        - Placeholder images from https://placehold.co/ only if no uploaded images are used
        - Return ONLY raw code wrapped in <!-- Generated Website Code --> comments`

      const result = await model.generateContent(prompt)
      const response = await result.response
      const rawCode = response.text()
      let cleanCode = rawCode.replace(/```html/g, '').replace(/```/g, '').trim()

      // Replace image placeholders with actual base64 URLs
      uploadedImages.forEach((image, index) => {
        const placeholder = `uploaded-image-${index + 1}`
        cleanCode = cleanCode.replace(new RegExp(placeholder, 'g'), image.base64)
      })

      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: 'Website code generated. Click below to preview or copy.',
        code: cleanCode,
        timestamp: new Date().toLocaleTimeString()
      }])

    } catch (error) {
      console.error(error)
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: 'Error generating website. Please try again.',
        isError: true
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = (code) => {
    const blob = new Blob([code], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'website.html'
    a.click()
  }

  const QuickActions = () => (
    <div className="grid grid-cols-5 gap-2 mb-4">
      <button onClick={() => setUserInput('Modern portfolio')} 
        className="p-2 bg-blue-100 text-blue-600 rounded">
        Portfolio
      </button>
      <button onClick={() => setUserInput('E-commerce product page')}
        className="p-2 bg-green-100 text-green-600 rounded">
        E-commerce
      </button>
      <button onClick={() => setUserInput('Restaurant homepage')}
        className="p-2 bg-red-100 text-red-600 rounded">
        Restaurant
      </button>
      <button onClick={() => setUserInput('Blog template')}
        className="p-2 bg-purple-100 text-purple-600 rounded">
        Blog
      </button>
      <button onClick={() => setUserInput('Medical Store')} 
        className="p-2 bg-yellow-100 text-yellow-600 rounded">
        Medical
      </button>
    </div>
  )
  const CustomizationToolbar = () => (
    <div className="flex flex-wrap gap-3 mb-2 p-2 bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Theme Toggles */}
      <button 
        onClick={() => setCustomizations(prev => ({ ...prev, darkTheme: !prev.darkTheme }))}
        className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all
          ${customizations.darkTheme ? 'bg-blue-600 text-white' : 'bg-gray-50 hover:bg-gray-100'}
          border border-gray-200 hover:border-gray-300 font-medium`}
      >
        🌙 Dark
      </button>
      
      <button 
        onClick={() => setCustomizations(prev => ({ ...prev, animations: !prev.animations }))}
        className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all
          ${customizations.animations ? 'bg-blue-600 text-white' : 'bg-gray-50 hover:bg-gray-100'}
          border border-gray-200 hover:border-gray-300 font-medium`}
      >
        🎥 Animations
      </button>
  
      <button 
        onClick={() => setCustomizations(prev => ({ ...prev, contactForm: !prev.contactForm }))}
        className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all
          ${customizations.contactForm ? 'bg-blue-600 text-white' : 'bg-gray-50 hover:bg-gray-100'}
          border border-gray-200 hover:border-gray-300 font-medium`}
      >
        📝 Contact Form
      </button>
  
      {/* Expanded Color Picker */}
      <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-md border border-gray-200">
        <span className="text-gray-600 font-medium">Color:</span>
        <div className="flex gap-2">
          {Object.entries({
            blue: '#3B82F6',
            green: '#10B981',
            purple: '#8B5CF6',
            red: '#EF4444',
            pink: '#EC4899',
            orange: '#F97316',
            white: '#ffffff',
            cyan: '#06B6D4',
            lime: '#84CC16',
            black: '#000000'
          }).map(([colorName, hexCode]) => (
            <button
              key={colorName}
              onClick={() => setPrimaryColor(hexCode)}
              style={{ backgroundColor: hexCode }}
              className={`h-7 w-7 rounded-full transition-transform hover:scale-110 border border-gray-200
                ${primaryColor === hexCode ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
            />
          ))}
        </div>
      </div>
  
      {/* Dropdowns */}
      <Select value={layoutType} onValueChange={setLayoutType}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Layout" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="responsive">Responsive</SelectItem>
          <SelectItem value="grid">Grid Layout</SelectItem>
          <SelectItem value="single">Single Column</SelectItem>
        </SelectContent>
      </Select>

      <Select value={String(sectionCount)} onValueChange={(value) => setSectionCount(parseInt(value))}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Sections" />
        </SelectTrigger>
        <SelectContent>
          {[2, 3, 4, 5].map(num => (
            <SelectItem key={num} value={String(num)}>{num} Sections</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory, isLoading])

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <a href="/" className="text-xl font-bold cursor-pointer">Pallette</a>
        <div className="flex gap-4">
          <IoMdRefresh 
            className="h-6 w-6 cursor-pointer hover:scale-110 transition"
            onClick={clearHistory}
          />
        </div>
      </div>

      <div id="chat-container" className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}>
            {msg.role === 'assistant' && (
              <div>
                <IoMdCode className="h-10 w-10 text-blue-600 bg-blue-100 p-2 rounded-full shadow-lg" />
              </div>
            )}
            
            <div className={`max-w-3xl p-4 rounded-xl shadow-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-200 shadow-md'}`}
            >
              {msg.role === 'assistant' ? (
                <div className="relative">
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">{msg.timestamp}</span>
                    {msg.code && <span className="ml-2 text-xs">● {msg.code.length} characters</span>}
                  </div>
                  <p className="text-gray-800">{msg.content}</p>
                  
                  {msg.code && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => setPreviewCode(msg.code)}
                        className="flex items-center gap-1 px-3 py-1 rounded hover:bg-gray-100"
                      >
                        👁️ Preview
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(msg.code)
                          toast.success('Code copied to clipboard!')
                        }}
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        <FiCopy className="text-gray-600" />
                      </button>
                      <button
                        onClick={() => setEditingCode(msg.code)}
                        className="p-2 hover:bg-gray-100 rounded"
                      >
                        ✏️ Edit
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="text-xs text-blue-100 mb-1">{msg.timestamp}</div>
                  <p>{msg.content}</p>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="mt-2.5">
                <span className="text-blue-600 font-medium bg-blue-100 p-3 rounded-full">👤</span>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start gap-3">
            <div className="bg-white p-4 rounded-xl shadow-md w-full max-w-2xl">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Generating website code...
              </div>
            </div>
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>

      <div className="p-2 bg-white border-t shadow-lg">
        <QuickActions />
        <CustomizationToolbar />
        
        <div className="flex gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Describe your website (e.g., 'Tech startup landing page with dark theme')"
            className="flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* Add microphone button */}
          <button
            onClick={toggleListening}
            disabled={!recognition}
            className={`p-2 rounded-full ${
              isListening 
                ? 'bg-red-500 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            } transition-colors disabled:opacity-50`}
            title={recognition ? "Voice input" : "Speech recognition not supported"}
          >
            <FaMicrophone className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3 px-2 py-2 bg-gray-50 rounded-md border border-gray-200 relative">
            <label className="cursor-pointer text-blue-600 hover:text-blue-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors">
              <FaCamera/>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            
            {uploadedImages.length > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {uploadedImages.length}
              </div>
            )}
          </div>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {isLoading ? 'Generating...' : <RiAiGenerate />}
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {previewCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl w-11/12 h-5/6 flex flex-col">
            <div className="flex justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Live Preview</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(previewCode)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <FiDownload />
                </button>
                <button 
                  onClick={() => setPreviewCode('')}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  ✕
                </button>
              </div>
            </div>
            <iframe
              srcDoc={previewCode}
              className="flex-1 border-none rounded-b-xl"
              title="Website Preview"
            />
          </div>
        </div>
      )}

      {/* Code Editor Modal */}
      {editingCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl w-11/12 h-5/6 flex flex-col">
            <div className="flex justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Edit Code</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setPreviewCode(editingCode)
                    setEditingCode(null)
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Preview
                </button>
                <button 
                  onClick={() => setEditingCode(null)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  ✕
                </button>
              </div>
            </div>
            <textarea
              value={editingCode}
              onChange={(e) => setEditingCode(e.target.value)}
              className="flex-1 p-4 font-mono text-sm border-none outline-none"
              spellCheck="false"
            />
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { Search, Clock, CheckCircle, XCircle, RotateCcw } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

interface QueryHistoryItem {
  id: string
  query: string
  timestamp: Date
  executionTime?: number
  status: 'success' | 'error'
  error?: string
  resultCount?: number
}

interface HistoryPanelProps {
  onRestoreQuery?: (query: string) => void
}

// Mock history data for now
const mockHistory: QueryHistoryItem[] = [
  {
    id: '1',
    query: 'SELECT * FROM users WHERE email LIKE "%@example.com"',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    executionTime: 120,
    status: 'success',
    resultCount: 15
  },
  {
    id: '2',
    query: 'SELECT COUNT(*) FROM orders WHERE status = "completed"',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    executionTime: 89,
    status: 'success',
    resultCount: 1
  },
  {
    id: '3',
    query: 'SELECT * FROM invalid_table',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    status: 'error',
    error: 'Table "invalid_table" does not exist'
  }
]

export function HistoryPanel({ onRestoreQuery }: HistoryPanelProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const history = mockHistory

  const filteredHistory = history.filter(item =>
    item.query.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const truncateQuery = (query: string, maxLength: number = 100) => {
    if (query.length <= maxLength) return query
    return query.substring(0, maxLength) + "..."
  }

  const handleRestore = (query: string) => {
    if (onRestoreQuery) {
      onRestoreQuery(query)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Query History</h3>
          <span className="text-sm text-muted-foreground">
            {filteredHistory.length} queries
          </span>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search queries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-auto">
        {filteredHistory.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            {searchTerm ? "No queries match your search" : "No query history yet"}
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-3 hover:bg-muted/25 transition-colors"
              >
                {/* Query Status and Time */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {item.status === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm font-medium">
                      {item.status === 'success' ? 'Success' : 'Error'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatTimestamp(item.timestamp)}</span>
                    {item.executionTime && (
                      <span>• {item.executionTime}ms</span>
                    )}
                  </div>
                </div>

                {/* Query Text */}
                <div className="mb-2">
                  <code className="text-sm bg-muted/50 p-2 rounded block">
                    {truncateQuery(item.query)}
                  </code>
                </div>

                {/* Result Info or Error */}
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    {item.status === 'success' && item.resultCount !== undefined ? (
                      <span>{item.resultCount} rows returned</span>
                    ) : item.error ? (
                      <span className="text-red-500">{item.error}</span>
                    ) : null}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRestore(item.query)}
                    className="h-6 px-2 text-xs"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Restore
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t p-3">
        <div className="text-xs text-muted-foreground text-center">
          History is stored locally in your browser
        </div>
      </div>
    </div>
  )
}
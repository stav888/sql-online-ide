"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { SqlEditor } from "@/components/SqlEditor"
import { VisualTable } from "@/components/VisualTable"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, ExternalLink } from "lucide-react"

interface SharedQueryData {
  query: string
  state?: unknown
  createdAt: string
  expiresAt?: string
}

export default function SharedQueryPage() {
  const params = useParams()
  const shareId = params.id as string
  
  const [queryData, setQueryData] = useState<SharedQueryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [queryResults, setQueryResults] = useState<Record<string, unknown>[]>([])
  const [isExecuting, setIsExecuting] = useState(false)

  useEffect(() => {
    const fetchSharedQuery = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/share?id=${shareId}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load shared query')
        }

        setQueryData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    if (shareId) {
      fetchSharedQuery()
    }
  }, [shareId])

  const handleExecuteQuery = async () => {
    if (!queryData?.query) return
    
    setIsExecuting(true)
    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: queryData.query,
          database: 'sqlite'
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Query execution failed')
      }

      if (result.data) {
        setQueryResults(result.data)
      }
    } catch (error) {
      console.error('Query execution error:', error)
    } finally {
      setIsExecuting(false)
    }
  }

  const copyToClipboard = () => {
    if (queryData?.query) {
      navigator.clipboard.writeText(queryData.query)
    }
  }

  const openInNewTab = () => {
    const url = `/?query=${encodeURIComponent(queryData?.query || '')}`
    window.open(url, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading shared query...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
          <Button 
            className="mt-4 w-full" 
            onClick={() => window.location.href = '/'}
          >
            Go to SQL IDE
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Shared SQL Query</h1>
            <p className="text-sm text-muted-foreground">
              Created: {queryData ? new Date(queryData.createdAt).toLocaleString() : ''}
              {queryData?.expiresAt && (
                <span> • Expires: {new Date(queryData.expiresAt).toLocaleString()}</span>
              )}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Query
            </Button>
            <Button variant="outline" size="sm" onClick={openInNewTab}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in IDE
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-rows-2 gap-4 h-[calc(100vh-120px)]">
          {/* Query Display */}
          <div className="border rounded-lg">
            <SqlEditor
              value={queryData?.query || ''}
              onChange={() => {}} // Read-only
              onExecute={handleExecuteQuery}
              isExecuting={isExecuting}
            />
          </div>

          {/* Results */}
          <div className="border rounded-lg">
            <VisualTable data={queryResults} />
          </div>
        </div>
      </div>
    </div>
  )
}
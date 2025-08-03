"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { LeftPanel } from "@/components/LeftPanel"
import { SqlEditor } from "@/components/SqlEditor"
import { VisualTable } from "@/components/VisualTable"
import { HistoryPanel } from "@/components/HistoryPanel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function SqlIdeContent() {
  const searchParams = useSearchParams()
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false)
  const [sqlQuery, setSqlQuery] = useState("")
  const [queryResults, setQueryResults] = useState<Record<string, unknown>[]>([])
  const [isExecuting, setIsExecuting] = useState(false)

  // Load query from URL parameters (for shared links)
  useEffect(() => {
    const queryParam = searchParams.get('query')
    if (queryParam) {
      setSqlQuery(decodeURIComponent(queryParam))
    }
  }, [searchParams])

  const handleExecuteQuery = async () => {
    if (!sqlQuery.trim()) return
    
    setIsExecuting(true)
    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: sqlQuery,
          database: 'sqlite' // Default to SQLite for now
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Query execution failed')
      }

      if (result.data) {
        setQueryResults(result.data)
      } else if (result.message) {
        // For DML operations, show a success message
        console.log(result.message)
        setQueryResults([])
      }
    } catch (error) {
      console.error("Query execution error:", error)
      setQueryResults([])
    } finally {
      setIsExecuting(false)
    }
  }

  const handleRestoreQuery = (query: string) => {
    setSqlQuery(query)
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Left Panel - Database Explorer */}
      <LeftPanel 
        collapsed={leftPanelCollapsed}
        onToggleCollapse={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Section - SQL Editor */}
        <div className="h-1/2 border-b">
          <SqlEditor
            value={sqlQuery}
            onChange={setSqlQuery}
            onExecute={handleExecuteQuery}
            isExecuting={isExecuting}
          />
        </div>
        
        {/* Bottom Section - Results and History */}
        <div className="h-1/2 flex">
          <div className="flex-1">
            <Tabs defaultValue="results" className="h-full">
              <TabsList className="w-full">
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              <TabsContent value="results" className="h-full">
                <VisualTable data={queryResults} />
              </TabsContent>
              <TabsContent value="history" className="h-full">
                <HistoryPanel onRestoreQuery={handleRestoreQuery} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading SQL IDE...</p>
        </div>
      </div>
    }>
      <SqlIdeContent />
    </Suspense>
  )
}

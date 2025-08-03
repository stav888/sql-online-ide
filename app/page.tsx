"use client"

import { useState } from "react"
import { LeftPanel } from "@/components/LeftPanel"
import { SqlEditor } from "@/components/SqlEditor"
import { VisualTable } from "@/components/VisualTable"
import { HistoryPanel } from "@/components/HistoryPanel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false)
  const [sqlQuery, setSqlQuery] = useState("")
  const [queryResults, setQueryResults] = useState<Record<string, unknown>[]>([])
  const [isExecuting, setIsExecuting] = useState(false)

  const handleExecuteQuery = async () => {
    if (!sqlQuery.trim()) return
    
    setIsExecuting(true)
    try {
      // TODO: Implement query execution
      console.log("Executing query:", sqlQuery)
      // Mock results for now
      setQueryResults([
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" }
      ])
    } catch (error) {
      console.error("Query execution error:", error)
    } finally {
      setIsExecuting(false)
    }
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
                <HistoryPanel />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

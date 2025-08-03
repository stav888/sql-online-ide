"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Database, Table, Columns3, Search } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { cn } from "@/lib/utils"

interface LeftPanelProps {
  collapsed: boolean
  onToggleCollapse: () => void
}

interface DatabaseConnection {
  id: string
  name: string
  type: 'sqlite' | 'postgresql' | 'mariadb' | 'mssql'
  connected: boolean
}

const mockDatabases: DatabaseConnection[] = [
  { id: '1', name: 'SQLite Local', type: 'sqlite', connected: true },
  { id: '2', name: 'PostgreSQL', type: 'postgresql', connected: false },
  { id: '3', name: 'MariaDB', type: 'mariadb', connected: false },
  { id: '4', name: 'SQL Server', type: 'mssql', connected: false },
]

const mockTables = [
  { name: 'users', columns: ['id', 'name', 'email', 'created_at'] },
  { name: 'orders', columns: ['id', 'user_id', 'total', 'status'] },
  { name: 'products', columns: ['id', 'name', 'price', 'category'] },
]

export function LeftPanel({ collapsed, onToggleCollapse }: LeftPanelProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedTables, setExpandedTables] = useState<string[]>([])

  const toggleTableExpansion = (tableName: string) => {
    setExpandedTables(prev => 
      prev.includes(tableName) 
        ? prev.filter(t => t !== tableName)
        : [...prev, tableName]
    )
  }

  const filteredTables = mockTables.filter(table =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.columns.some(col => col.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className={cn(
      "bg-muted/50 border-r transition-all duration-300",
      collapsed ? "w-12" : "w-80"
    )}>
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        {!collapsed && <h2 className="font-semibold">Database Explorer</h2>}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-8 w-8"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {!collapsed && (
        <>
          {/* Search */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tables, columns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Database Connections */}
          <div className="p-4 border-b">
            <h3 className="font-medium mb-3">Connections</h3>
            <div className="space-y-2">
              {mockDatabases.map((db) => (
                <div key={db.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Database className="h-4 w-4" />
                    <span className="text-sm">{db.name}</span>
                  </div>
                  <Button
                    variant={db.connected ? "default" : "outline"}
                    size="sm"
                    className="h-6 text-xs"
                  >
                    {db.connected ? "Connected" : "Connect"}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Tables */}
          <div className="p-4">
            <h3 className="font-medium mb-3">Tables</h3>
            <div className="space-y-1">
              {filteredTables.map((table) => (
                <div key={table.name}>
                  <div
                    className="flex items-center space-x-2 p-2 rounded hover:bg-muted cursor-pointer"
                    onClick={() => toggleTableExpansion(table.name)}
                  >
                    <Table className="h-4 w-4" />
                    <span className="text-sm">{table.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {table.columns.length}
                    </span>
                  </div>
                  {expandedTables.includes(table.name) && (
                    <div className="ml-6 space-y-1">
                      {table.columns.map((column) => (
                        <div key={column} className="flex items-center space-x-2 p-1 text-sm text-muted-foreground">
                          <Columns3 className="h-3 w-3" />
                          <span>{column}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
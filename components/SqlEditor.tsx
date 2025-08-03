"use client"

import { useRef } from "react"
import dynamic from "next/dynamic"
import { Button } from "./ui/button"
import { Play, Share, Download, Upload } from "lucide-react"
import { useHotkeys } from "react-hotkeys-hook"

// Dynamically import Monaco Editor to prevent SSR issues
const Editor = dynamic(() => import("@monaco-editor/react").then(mod => ({ default: mod.Editor })), {
  ssr: false,
  loading: () => <div className="flex-1 flex items-center justify-center">Loading editor...</div>
})

interface SqlEditorProps {
  value: string
  onChange: (value: string) => void
  onExecute: () => void
  isExecuting: boolean
}

// SQL short codes mapping - will be used for future autocomplete functionality
// const SHORT_CODES = {
//   's*': (tableName: string) => `SELECT * FROM ${tableName}`,
//   'sf': (tableName: string) => `SELECT column1, column2 FROM ${tableName}`,
//   'sl': (tableName: string) => `SELECT * FROM ${tableName} ORDER BY id DESC LIMIT 100`,
// }

export function SqlEditor({ value, onChange, onExecute, isExecuting }: SqlEditorProps) {
  const editorRef = useRef<unknown>(null)

  // Keyboard shortcuts
  useHotkeys('ctrl+enter', onExecute, { preventDefault: true })
  useHotkeys('shift+enter', onExecute, { preventDefault: true })

  const handleEditorDidMount = (editor: unknown) => {
    editorRef.current = editor

    // Monaco will be available here since we're in the browser
    if (typeof window !== 'undefined') {
      import('monaco-editor').then((monaco) => {
        // Setup SQL completion provider
        monaco.languages.registerCompletionItemProvider('sql', {
          provideCompletionItems: (model, position) => {
            const suggestions = [
              {
                label: 's* tableName',
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: 'SELECT * FROM ${1:tableName}',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: 'Select all from table',
                range: {
                  startLineNumber: position.lineNumber,
                  endLineNumber: position.lineNumber,
                  startColumn: position.column,
                  endColumn: position.column,
                },
              },
              {
                label: 'sf tableName',
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: 'SELECT ${1:column1}, ${2:column2} FROM ${3:tableName}',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: 'Select fields from table',
                range: {
                  startLineNumber: position.lineNumber,
                  endLineNumber: position.lineNumber,
                  startColumn: position.column,
                  endColumn: position.column,
                },
              },
              {
                label: 'sl tableName',
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: 'SELECT * FROM ${1:tableName} ORDER BY ${2:id} DESC LIMIT 100',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: 'Select limited records from table',
                range: {
                  startLineNumber: position.lineNumber,
                  endLineNumber: position.lineNumber,
                  startColumn: position.column,
                  endColumn: position.column,
                },
              }
            ]

            return { suggestions }
          }
        })
      })
    }

    // Focus on editor
    if (editor && typeof (editor as { focus?: () => void }).focus === 'function') {
      (editor as { focus: () => void }).focus()
    }
  }

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log("Share query:", value)
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export query:", value)
  }

  const handleImport = () => {
    // TODO: Implement import functionality
    console.log("Import query")
  }

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="border-b p-2 flex items-center space-x-2">
        <Button
          onClick={onExecute}
          disabled={isExecuting || !value.trim()}
          size="sm"
          className="flex items-center space-x-2"
        >
          <Play className="h-4 w-4" />
          <span>{isExecuting ? "Executing..." : "Execute"}</span>
        </Button>
        
        <div className="flex items-center space-x-1 ml-auto">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleImport}>
            <Upload className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language="sql"
          value={value}
          onChange={(val) => onChange(val || "")}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            wordWrap: "on",
            automaticLayout: true,
            scrollBeyondLastLine: false,
            tabSize: 2,
            insertSpaces: true,
            rulers: [80],
            renderLineHighlight: "gutter",
            selectionHighlight: false,
            occurrencesHighlight: "off",
            overviewRulerBorder: false,
            bracketPairColorization: {
              enabled: true
            }
          }}
          theme="vs-dark"
        />
      </div>

      {/* Status Bar */}
      <div className="border-t p-2 text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>SQL Editor - Use Ctrl+Enter or Shift+Enter to execute</span>
          <span>Lines: {value.split('\n').length} | Characters: {value.length}</span>
        </div>
      </div>
    </div>
  )
}
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { query, database } = await request.json()

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      )
    }

    // For now, return mock data based on query type
    const startTime = Date.now()
    
    // Simple query parsing for demo purposes
    const upperQuery = query.toUpperCase().trim()
    
    let mockResults: unknown[] = []
    let columns: string[] = []
    
    if (upperQuery.includes('SELECT') && upperQuery.includes('USERS')) {
      columns = ['id', 'name', 'email', 'created_at']
      mockResults = [
        { id: 1, name: 'John Doe', email: 'john@example.com', created_at: '2024-01-15T10:30:00Z' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', created_at: '2024-01-16T14:20:00Z' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', created_at: '2024-01-17T09:15:00Z' },
      ]
    } else if (upperQuery.includes('SELECT') && upperQuery.includes('ORDERS')) {
      columns = ['id', 'user_id', 'total', 'status', 'created_at']
      mockResults = [
        { id: 101, user_id: 1, total: 299.99, status: 'completed', created_at: '2024-01-18T11:00:00Z' },
        { id: 102, user_id: 2, total: 149.50, status: 'pending', created_at: '2024-01-18T15:30:00Z' },
      ]
    } else if (upperQuery.includes('SELECT') && upperQuery.includes('PRODUCTS')) {
      columns = ['id', 'name', 'price', 'category', 'in_stock']
      mockResults = [
        { id: 1, name: 'Laptop Pro', price: 1299.99, category: 'Electronics', in_stock: true },
        { id: 2, name: 'Wireless Mouse', price: 29.99, category: 'Electronics', in_stock: true },
        { id: 3, name: 'Office Chair', price: 199.99, category: 'Furniture', in_stock: false },
      ]
    } else if (upperQuery.includes('COUNT')) {
      columns = ['count']
      mockResults = [{ count: 42 }]
    } else if (upperQuery.includes('INSERT') || upperQuery.includes('UPDATE') || upperQuery.includes('DELETE')) {
      // For DML operations, return affected rows
      const affectedRows = Math.floor(Math.random() * 5) + 1
      return NextResponse.json({
        success: true,
        message: `Query executed successfully. ${affectedRows} row(s) affected.`,
        affectedRows,
        executionTime: Date.now() - startTime,
        query: query.trim()
      })
    } else {
      // Unknown query type
      return NextResponse.json(
        { error: 'Query type not supported in demo mode' },
        { status: 400 }
      )
    }

    const executionTime = Date.now() - startTime

    return NextResponse.json({
      success: true,
      data: mockResults,
      columns,
      rowCount: mockResults.length,
      executionTime,
      query: query.trim(),
      database: database || 'sqlite'
    })

  } catch (error) {
    console.error('Query execution error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
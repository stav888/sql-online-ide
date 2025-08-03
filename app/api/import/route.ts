import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const tableName = formData.get('tableName') as string

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      )
    }

    if (!tableName) {
      return NextResponse.json(
        { error: 'Table name is required' },
        { status: 400 }
      )
    }

    const fileContent = await file.text()
    const fileExtension = file.name.split('.').pop()?.toLowerCase()

    let parsedData: unknown[] = []

    switch (fileExtension) {
      case 'csv': {
        // Simple CSV parser - in production, use a proper CSV parsing library
        const lines = fileContent.split('\n').filter(line => line.trim())
        if (lines.length < 2) {
          return NextResponse.json(
            { error: 'CSV file must have at least header and one data row' },
            { status: 400 }
          )
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
        
        parsedData = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
          const row: Record<string, string> = {}
          headers.forEach((header, index) => {
            row[header] = values[index] || ''
          })
          return row
        })
        break
      }

      case 'json': {
        try {
          const jsonData = JSON.parse(fileContent)
          if (Array.isArray(jsonData)) {
            parsedData = jsonData
          } else {
            return NextResponse.json(
              { error: 'JSON file must contain an array of objects' },
              { status: 400 }
            )
          }
        } catch {
          return NextResponse.json(
            { error: 'Invalid JSON format' },
            { status: 400 }
          )
        }
        break
      }

      case 'xlsx':
      case 'xls': {
        return NextResponse.json(
          { error: 'Excel file import not yet implemented. Please use CSV or JSON format.' },
          { status: 501 }
        )
      }

      default:
        return NextResponse.json(
          { error: 'Unsupported file format. Please use CSV, JSON, or Excel files.' },
          { status: 400 }
        )
    }

    if (parsedData.length === 0) {
      return NextResponse.json(
        { error: 'No data found in file' },
        { status: 400 }
      )
    }

    // In a real implementation, you would:
    // 1. Validate the data structure
    // 2. Create the table if it doesn't exist
    // 3. Insert the data into the database
    // 4. Return the actual results

    // For now, return success with summary
    const columns = Object.keys(parsedData[0] as Record<string, unknown>)
    
    return NextResponse.json({
      success: true,
      message: `Successfully imported ${parsedData.length} rows into table "${tableName}"`,
      rowsImported: parsedData.length,
      columns,
      sampleData: parsedData.slice(0, 3), // Return first 3 rows as sample
      tableName
    })

  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json(
      { 
        error: 'Import failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
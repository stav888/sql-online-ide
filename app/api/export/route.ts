import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { data, format, filename } = await request.json()

    if (!data || !Array.isArray(data)) {
      return NextResponse.json(
        { error: 'Data is required and must be an array' },
        { status: 400 }
      )
    }

    if (!format || !['csv', 'json', 'xlsx'].includes(format)) {
      return NextResponse.json(
        { error: 'Format must be one of: csv, json, xlsx' },
        { status: 400 }
      )
    }

    const baseFilename = filename || `export_${new Date().toISOString().split('T')[0]}`

    switch (format) {
      case 'csv': {
        if (data.length === 0) {
          return new NextResponse('', {
            headers: {
              'Content-Type': 'text/csv',
              'Content-Disposition': `attachment; filename="${baseFilename}.csv"`
            }
          })
        }

        const headers = Object.keys(data[0])
        const csvContent = [
          headers.join(','),
          ...data.map(row => 
            headers.map(header => {
              const value = row[header]
              if (value === null || value === undefined) return ''
              if (typeof value === 'string' && value.includes(',')) {
                return `"${value.replace(/"/g, '""')}"`
              }
              return String(value)
            }).join(',')
          )
        ].join('\n')

        return new NextResponse(csvContent, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="${baseFilename}.csv"`
          }
        })
      }

      case 'json': {
        const jsonContent = JSON.stringify(data, null, 2)
        
        return new NextResponse(jsonContent, {
          headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="${baseFilename}.json"`
          }
        })
      }

      case 'xlsx': {
        // For now, return CSV format as XLSX generation requires additional setup
        // In production, you would use a library like xlsx or exceljs
        return NextResponse.json(
          { error: 'XLSX export not yet implemented. Please use CSV or JSON format.' },
          { status: 501 }
        )
      }

      default:
        return NextResponse.json(
          { error: 'Unsupported format' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { 
        error: 'Export failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
# SQL Online IDE

A comprehensive SQL Online IDE built with Next.js 14, featuring multi-database support, advanced query editing, and collaborative features.

![SQL IDE Interface](https://github.com/user-attachments/assets/b63c83fe-0ee5-4be7-9fb3-3e04f88e8147)

![SQL IDE History Panel](https://github.com/user-attachments/assets/a389ed57-817a-4548-9cc6-c07525c9b84c)

## Features

### 🗄️ Multi-Database Engine Support
- **SQLite** (in-browser via sql.js)
- **PostgreSQL**
- **MariaDB** 
- **Microsoft SQL Server**
- Connection management and switching between databases

### ✍️ Advanced SQL Editor
- Monaco Editor integration with SQL syntax highlighting
- Intelligent autocomplete with SQL snippets
- Keyboard shortcuts (Ctrl+Enter, Shift+Enter for execution)
- Short-code snippets:
  - `s* tableName` → `SELECT * FROM tableName`
  - `sf tableName` → `SELECT columns FROM tableName`
  - `sl tableName` → `SELECT * FROM tableName ORDER BY key DESC LIMIT 100`

### 🗂️ Database Explorer
- Collapsible left sidebar with database tree view
- Searchable tables, columns, indexes, and triggers
- Visual database schema representation
- Quick connection management for all database types

### 📊 Results Visualization
- Advanced DataGrid with sorting and filtering
- Inline cell editing (double-click to edit)
- Export functionality (CSV, JSON, XLSX)
- Pagination for large result sets
- Real-time row and column statistics

### 📋 Query History
- Persistent query history with IndexedDB storage
- Save executed queries with metadata:
  - Query text and execution time
  - Result row counts
  - Success/error status
  - Timestamps
- Search and filter functionality
- One-click query restoration

### 🔗 Share & Collaborate
- Generate shareable URLs for SQL scripts
- JWT-based state persistence
- Short URL generation (`/s/:id`)
- Read-only access for shared links
- Configurable expiration times

### 📁 Import/Export Data
- CSV, JSON, and Excel file import
- Streaming data processing for large files
- Batch data insertion with validation
- Export query results in multiple formats

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui + Radix UI
- **Editor**: Monaco Editor
- **Database ORM**: Prisma
- **State Management**: React Hooks
- **Storage**: IndexedDB (Dexie) for client-side data
- **Authentication**: JWT for sharing features

## Quick Start

### Prerequisites
- Node.js 18+ 
- Docker (for database services)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/stav888/sql-online-ide.git
   cd sql-online-ide
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start database services**
   ```bash
   docker-compose up -d
   ```

5. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Configuration

The application supports multiple database engines:

### SQLite (Default)
- No additional setup required
- Runs entirely in the browser
- Perfect for testing and demos

### PostgreSQL
```bash
# Default connection (via Docker Compose)
postgresql://postgres:password123@localhost:5432/sqlide
```

### MariaDB
```bash
# Default connection (via Docker Compose)
mysql://mariadb:password123@localhost:3306/sqlide
```

### Microsoft SQL Server
```bash
# Default connection (via Docker Compose)
Server=localhost,1433;Database=sqlide;User Id=sa;Password=Password123!;TrustServerCertificate=true
```

## API Endpoints

### Query Execution
```
POST /api/execute
Content-Type: application/json

{
  "query": "SELECT * FROM users",
  "database": "sqlite"
}
```

### Share Query
```
POST /api/share
Content-Type: application/json

{
  "query": "SELECT * FROM users WHERE active = true",
  "expirationHours": 24
}
```

### Import Data
```
POST /api/import
Content-Type: multipart/form-data

file: [CSV/JSON/Excel file]
tableName: "users"
```

### Export Data
```
POST /api/export
Content-Type: application/json

{
  "data": [...],
  "format": "csv",
  "filename": "export"
}
```

## Keyboard Shortcuts

- **Ctrl+Enter** or **Shift+Enter**: Execute query
- **Ctrl+S**: Save query (coming soon)
- **Ctrl+/**: Toggle comment
- **Ctrl+F**: Find in editor
- **Ctrl+H**: Find and replace

## Development

### Project Structure
```
sql-online-ide/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx            # Main SQL IDE interface
│   ├── api/                # API routes
│   │   ├── execute/        # Query execution
│   │   ├── import/         # Data import
│   │   ├── export/         # Data export
│   │   └── share/          # Query sharing
│   └── s/[id]/            # Shared query viewer
├── components/
│   ├── LeftPanel.tsx       # Database explorer
│   ├── SqlEditor.tsx       # Monaco editor wrapper
│   ├── VisualTable.tsx     # Results data grid
│   ├── HistoryPanel.tsx    # Query history
│   └── ui/                 # Reusable UI components
├── lib/
│   ├── utils.ts           # Utility functions
│   └── dbClients.ts       # Database connection clients
├── prisma/
│   └── schema.prisma      # Database schema
└── docker-compose.yml     # Development databases
```

### Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Docker Deployment

```bash
# Build Docker image
docker build -t sql-online-ide .

# Run container
docker run -p 3000:3000 sql-online-ide
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@example.com or create an issue on GitHub.

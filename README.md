# Daily Updates & To Do List

A Next.js application for managing daily task updates and to-do lists with a clean, professional interface.

## Features

### Daily Updates
- **Generate formatted task lists** for Slack or other platforms
- **Live preview** of the generated HTML output
- **Copy to clipboard** with one click
- **Save and load** daily updates by date
- **History view** with delete functionality
- **localStorage persistence** - no backend required

### To Do List
- **Task management** with active/completed separation
- **Detailed timestamps** - tracks both registration and completion times (down to the second)
- **Date-based organization** - view tasks grouped by date
- **History view** - browse completed tasks by date
- **Confirmation dialogs** - prevents accidental deletions
- **localStorage persistence** - data saved in browser

## Tech Stack

- **Next.js 14.2.0** - React framework with App Router
- **React 18.3.0** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 3.4.0** - Utility-first styling
- **localStorage** - Client-side data persistence

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
dailyUpdates/
├── app/
│   ├── page.tsx           # Daily Updates page
│   ├── todo/
│   │   └── page.tsx       # To Do List page
│   └── layout.tsx         # Root layout with navigation
├── components/
│   ├── Navigation.tsx     # Tab navigation component
│   ├── Toast.tsx          # Success notification component
│   └── ConfirmDialog.tsx  # Delete confirmation modal
├── public/                # Static assets
├── tailwind.config.ts     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## Key Components

### Navigation
Provides tab-based navigation between Daily Updates and To Do List pages with active state indication.

### Toast
Displays success notifications (bottom-right corner) with auto-dismiss after 3 seconds.

### ConfirmDialog
Modal dialog for delete confirmations, preventing accidental data loss.

## Data Storage

All data is stored in the browser's localStorage:

- **Daily Updates**: Stored with key format `dailyUpdate_YYYY-MM-DD`
- **To Do List**: Stored with key `todos` as an array of all tasks

## Features in Detail

### Timestamps
All tasks include detailed timestamps:
- **Registration**: Date and time when task was created (MM/DD/YYYY, HH:MM:SS)
- **Completion**: Date and time when task was marked as done (MM/DD/YYYY, HH:MM:SS)

### Copy to Clipboard
Daily Updates can be copied in HTML format, ready to paste into Slack or other platforms that support rich text.

### History Management
Both pages include history views where you can:
- Browse past daily updates or completed tasks
- View tasks grouped by date
- Delete individual entries with confirmation

## Design Philosophy

This application follows a simple, clean design approach using Tailwind CSS utilities without additional UI frameworks. The focus is on functionality and ease of use while maintaining a professional appearance.

## License

Private project - All rights reserved

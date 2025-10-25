# Lighter Accounts Watching

A React component for monitoring Lighter trading accounts and their positions in real-time.

## Features

- **Real-time monitoring**: Uses React Query with 30-second intervals to keep data fresh
- **Bulk address import**: Paste multiple addresses at once with support for various formats
- **Local storage persistence**: Addresses are saved locally and persist between sessions
- **Address parsing**: Supports multiple formats:
  - `SM1 0x042ffe02F6565dAD4c359D335765356B705aB50A`
  - `0x042ffe02F6565dAD4c359D335765356B705aB50A`
  - `SM4 0x0b5Aa2aa22e3F0a0930a04Fb0a84B589139DD06d # This is a comment`
- **Account statistics**: Shows total collateral, active positions across all accounts
- **Position details**: Displays individual positions with PnL, entry prices, liquidation prices
- **Error handling**: Graceful error handling with retry functionality

## Usage

### Adding Addresses

1. Copy addresses from your source (Excel, text file, etc.)
2. Paste them into the textarea
3. The system will automatically parse and validate addresses
4. Click "Add X Addresses" to add them to your watch list

### Supported Address Formats

- `LABEL 0x...` - With label prefix
- `0x...` - Direct address
- `LABEL 0x... # comment` - With comments
- Each address on a new line

### Data Display

For each account, the system shows:

- Account status (active/inactive)
- Total collateral and available balance
- Active positions with:
  - Position size and type (Long/Short)
  - Average entry price
  - Unrealized PnL
  - Liquidation price
  - Margin requirements

## Technical Details

- Built with React Query for efficient data fetching
- Uses Next.js App Router
- Tailwind CSS for styling
- TypeScript for type safety
- LocalStorage for persistence

## API Integration

Connects to Lighter API:

- Endpoint: `https://mainnet.zklighter.elliot.ai/api/v1/account`
- Query parameter: `by=l1_address&value={address}`
- Auto-refreshes every 30 seconds

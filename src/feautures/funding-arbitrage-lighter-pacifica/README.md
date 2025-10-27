# Funding Arbitrage Lighter Pacifica

A React component for monitoring and analyzing funding rate arbitrage opportunities between Pacifica and Lighter exchanges.

## Features

- **Real-time monitoring**: Uses React Query to keep funding rates current
- **Multi-exchange comparison**: Compares funding rates across Pacifica and Lighter exchanges
- **Flexible timeframes**: View rates across different time intervals (1h, 8h, 1d, 1w, 1y)
- **Advanced filtering**: Search and sort markets by symbol, rates, or spread
- **Visual indicators**: Clear spread visualization with arbitrage suggestions
- **Error handling**: Graceful error handling with retry functionality
- **Performance optimized**: Efficient data fetching and state management

## Usage

### Viewing Opportunities

1. The table displays funding rates from both exchanges
2. Use the search bar to filter specific markets
3. Select timeframes to view rates over different periods
4. Sort columns to find the best arbitrage opportunities
5. View spread indicators for trading recommendations

### Understanding the Data

For each market, the system shows:
- **Market symbol**: Trading pair (e.g., BTC, ETH)
- **Pacifica rates**: Current and next funding rates
- **Lighter rates**: Current funding rates
- **Spread analysis**: Rate difference with percentage and trading suggestions

### Spread Indicators

- **Green**: Pacifica rate > Lighter rate (Short Pacifica, Long Lighter)
- **Red**: Lighter rate > Pacifica rate (Short Lighter, Long Pacifica)
- **Gray**: Rates are equal (No arbitrage opportunity)

## Technical Details

- Built with React Query for efficient data fetching
- Uses Next.js App Router
- Tailwind CSS for styling
- TypeScript for type safety
- Component-based architecture for reusability

## API Integration

Connects to multiple exchanges:

### Pacifica API
- Endpoint: `https://api.pacifica.fi/api/v1/info`
- Update frequency: Every hour
- Provides current and next funding rates

### Lighter API
- Endpoint: `https://mainnet.zklighter.elliot.ai/api/v1/funding-rates`
- Update frequency: Every 8 hours
- Provides current funding rates

## Component Configuration

```tsx
<FundingArbitrageTable
  maxSymbols={50}           // Limit number of markets displayed
  refreshIntervalMs={30000} // Auto-refresh interval in milliseconds
  targetSymbols={['BTC', 'ETH']} // Specific symbols to monitor
/>
```

## Architecture

The component follows a feature-based architecture:
- **Components**: Reusable UI components with clear responsibilities
- **Hooks**: Custom React hooks for state management
- **Services**: API integration and data fetching
- **Utils**: Helper functions and utilities
- **Types**: TypeScript type definitions
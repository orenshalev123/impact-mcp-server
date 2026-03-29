# Impact.com MCP Server

An MCP (Model Context Protocol) server that connects AI assistants to your [Impact.com](https://impact.com) affiliate marketing platform. Manage actions, partners, campaigns, ads, deals, promo codes, reports, and invoices through natural language.

## Tools

| Tool | Description |
|------|-------------|
| `list_actions` | List conversions with filtering by state, date, campaign, partner |
| `get_action` | Get details for a specific conversion |
| `update_action` | Approve, reject, or adjust a conversion |
| `get_action_items` | Get line items within a conversion |
| `list_action_updates` | View action modification history |
| `list_partners` | List affiliates with filtering by status, campaign, country |
| `get_partner` | Get partner details |
| `list_partner_groups` | List partner groups in a campaign |
| `list_contacts` | List partner contacts for a campaign |
| `list_campaigns` | List all campaigns/programs |
| `get_campaign` | Get campaign details |
| `list_ads` | List creative assets (banners, coupons, text links) |
| `get_ad` | Get ad details |
| `get_tracking_link` | Get tracking link for an ad |
| `create_tracking_link` | Create a new tracking link for a partner |
| `list_deals` | List all deals |
| `get_deal` | Get deal details |
| `create_deal` | Create a new deal |
| `list_promo_codes` | List all promo codes |
| `create_promo_code` | Create and assign a promo code |
| `list_reports` | List available report templates |
| `get_report_metadata` | Get report columns and metadata |
| `export_report` | Schedule an async report export (CSV) |
| `export_clicks` | Schedule an async click export (CSV) |
| `list_jobs` | List async export jobs |
| `get_job_status` | Check export job status |
| `download_job` | Download completed export |
| `list_invoices` | List invoices |
| `get_invoice` | Get invoice details |
| `list_contracts` | List partner contracts |
| `get_contract` | Get contract details |
| `submit_conversion` | Submit a server-side conversion event |

## Setup

### 1. Get your API credentials

In your Impact.com account, go to **Settings > Technical > API Access Tokens** and note your **Account SID** and **Auth Token**.

### 2. Install

#### Claude Desktop / Claude Code

Add to your MCP config (`claude_desktop_config.json` or `.claude.json`):

```json
{
  "mcpServers": {
    "impact": {
      "command": "npx",
      "args": ["@power-consulting/impact-mcp-server"],
      "env": {
        "IMPACT_ACCOUNT_SID": "your-account-sid",
        "IMPACT_AUTH_TOKEN": "your-auth-token"
      }
    }
  }
}
```

#### Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "impact": {
      "command": "npx",
      "args": ["@power-consulting/impact-mcp-server"],
      "env": {
        "IMPACT_ACCOUNT_SID": "your-account-sid",
        "IMPACT_AUTH_TOKEN": "your-auth-token"
      }
    }
  }
}
```

### 3. Restart your AI tool

The Impact tools will appear in your tool list.

## Usage Examples

Once connected, you can ask your AI assistant things like:

- "Show me all pending conversions from this week"
- "List my top 10 active affiliates"
- "Create a promo code SAVE20 and assign it to partner 12345"
- "Export a performance report for March 2026"
- "What deals are currently active?"
- "Approve action #67890"

## API Limits

- **1,000 requests/hour** for most endpoints
- **3,600 requests/hour** for catalog endpoints
- **100 report exports/day**
- **10 click exports/day**
- **45-day max date range** on action queries

## Security

Your credentials never leave your machine. The server runs locally and communicates directly with the Impact.com API using your credentials stored in environment variables.

## License

MIT

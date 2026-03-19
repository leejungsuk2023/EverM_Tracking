// Run: npx tsx --env-file=.env.local scripts/sync-now.ts
import { syncFromSheets } from '../src/lib/sync-sheets';

async function main() {
  console.log('Starting sync...');
  const result = await syncFromSheets();
  console.log('Sync complete:', JSON.stringify(result, null, 2));
}

main().catch(console.error);

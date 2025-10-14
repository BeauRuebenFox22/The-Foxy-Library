import { apiSetup, fetchShopifyCurrencyCode } from '../utils/config/factory';
import { state } from '../utils/store/store';

// Idempotent global init (prevents double execution if script loaded twice)
// Also resolves Stencil v update expecting a default export from globalScript.
// Flags kept minimal to avoid polluting window.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const w: any = (typeof window !== 'undefined') ? window : {};

export default async function intravenousGlobalInit() {
  try {
    if(!w.__IV_API_SETUP_DONE) {
      apiSetup();
      w.__IV_API_SETUP_DONE = true;
    }
    if(!w.__IV_CURRENCY_FETCH_DONE) {
      try {
        const code = await fetchShopifyCurrencyCode();
        if(code) state.setCurrencyCode(code);
      } catch (err) {
        console.debug('[IV] currency fetch skipped', err);
      }
      w.__IV_CURRENCY_FETCH_DONE = true;
    }
  } catch(err) {
    console.error('[IV] Global init failed', err);
  }
}
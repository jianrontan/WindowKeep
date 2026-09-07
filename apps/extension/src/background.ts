import { PROTOCOL_VERSION } from '@windowkeep/protocol';

chrome.runtime.onInstalled.addListener(() => {
  console.info(
    `WindowKeep extension installed. Protocol ${String(PROTOCOL_VERSION)}; native connection is not implemented yet.`,
  );
});

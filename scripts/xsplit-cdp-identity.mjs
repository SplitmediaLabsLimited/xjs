const CEF_103_BROWSER = /^Chrome\/103(?:\.|$)/;
const XSPLIT_USER_AGENT = /(?:^|\s)XSplitBroadcaster\/\d+(?:\.\d+)*(?:\s|$)/;

/** Reject generic Chrome or the wrong embedded CEF before recording XSplit evidence. */
export function assertXSplitCdpVersion(version) {
  const browser = typeof version?.Browser === 'string' ? version.Browser : '';
  if (!CEF_103_BROWSER.test(browser)) {
    throw new Error('Expected XSplit Chrome/CEF 103 at the configured CDP endpoint.');
  }

  const userAgent = typeof version?.['User-Agent'] === 'string' ? version['User-Agent'] : '';
  if (!XSPLIT_USER_AGENT.test(userAgent)) {
    throw new Error('Expected XSplit Broadcaster at the configured CDP endpoint.');
  }
}

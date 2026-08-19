/// <reference path="../../defs/es6-promise.d.ts" />

import { exec } from '../internal/internal';
import { StreamInfo } from './streaminfo';

export const OUTPUT_SUFFIX = '&output:';
export const ALL_INDEX = 'all';
export const LOCAL_RECORDING = 'Local Recording';

const PENDING_OUTPUT_TTL_MS = 15000;
const pendingOutputEvents: Array<{ channelName: string; index: string; ts: number }> = [];

export type OutputTarget = string | number | 'all';

export interface BroadcastOptions {
  suppressPrestreamDialog?: boolean;
  outputTarget?: OutputTarget;
}

export interface OutputTargetOptions {
  outputTarget?: OutputTarget;
}

const bareChannelKey = (channelName: string) => {
  const raw = decodeStreamChannelName(String(channelName == null ? '' : channelName));
  const idx = raw.indexOf(OUTPUT_SUFFIX);
  return (idx === -1 ? raw : raw.slice(0, idx)).toLowerCase();
};

/** recstat / host channel names may contain HTML entities (`&amp;output:`). */
export function decodeStreamChannelName(name: string): string {
  return String(name == null ? '' : name)
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&');
}

export function rememberOutputEvent(channelName: string, index: string) {
  const now = Date.now();
  while (pendingOutputEvents.length && now - pendingOutputEvents[0].ts > PENDING_OUTPUT_TTL_MS) {
    pendingOutputEvents.shift();
  }
  pendingOutputEvents.push({
    channelName: bareChannelKey(channelName),
    index: String(index),
    ts: now,
  });
}

export function takePendingOutputIndex(channelName: string): string | null {
  const key = bareChannelKey(channelName);
  const idx = pendingOutputEvents.findIndex((item) => item.channelName === key);
  if (idx === -1) {
    return null;
  }
  const [item] = pendingOutputEvents.splice(idx, 1);
  return item.index;
}

export function getViewOutputsCount(): Promise<number> {
  return new Promise((resolve) => {
    exec('CallHostFunc', 'getProperty', 'viewoutputscount', (countStr) => {
      resolve(Math.max(1, parseInt(String(countStr), 10) || 1));
    });
  });
}

export function normalizeOutputTarget(outputTarget?: OutputTarget): string | null {
  if (outputTarget === undefined || outputTarget === null || outputTarget === '') {
    return null;
  }
  const raw = String(outputTarget).trim();
  if (raw.toLowerCase() === ALL_INDEX) {
    return ALL_INDEX;
  }
  if (/^\d+$/.test(raw)) {
    return raw;
  }
  return null;
}

export function getOutputParam(index: string): string {
  return `output=${index}`;
}

export async function resolveOutputIndices(outputTarget?: OutputTarget): Promise<string[] | null> {
  const normalized = normalizeOutputTarget(outputTarget);
  if (normalized === null) {
    return null;
  }

  const count = await getViewOutputsCount();
  if (normalized === ALL_INDEX) {
    return Array.from({ length: count }, (_, i) => String(i));
  }

  const indexNum = parseInt(normalized, 10);
  if (indexNum < 0 || indexNum >= count) {
    return [];
  }
  return [normalized];
}

function channelNameMatchesTarget(name: string, channelName: string, index: string): boolean {
  const decodedName = decodeStreamChannelName(name);
  const expected = `${channelName}${OUTPUT_SUFFIX}${index}`;
  return decodedName === expected || (index === '0' && decodedName === channelName);
}

export async function isOutputTargetActive(channelName: string, index: string): Promise<boolean> {
  const channels = await StreamInfo.getActiveStreamChannels();
  return channels.some((channel) =>
    channelNameMatchesTarget(getStreamInfoName(channel), channelName, index)
  );
}

function getStreamInfoName(channel: StreamInfo): string {
  return decodeStreamChannelName(String((channel as unknown as { _name: string })._name || ''));
}

const asIndexToken = (value: unknown): string | null => {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  const token = String(value);
  if (token !== ALL_INDEX && /^\d+$/.test(token)) {
    return token;
  }
  return null;
};

export function resolveStreamEventIndex(
  channelName: string,
  eventInfo: Record<string, unknown> = {}
): string | null {
  const raw = decodeStreamChannelName(String(channelName == null ? '' : channelName));
  const suffixIdx = raw.indexOf(OUTPUT_SUFFIX);
  if (suffixIdx !== -1) {
    return raw.slice(suffixIdx + OUTPUT_SUFFIX.length) || '0';
  }

  const fieldCandidates = [
    eventInfo.OutputIdx,
    eventInfo.outputIdx,
    eventInfo.OutputIndex,
    eventInfo.outputIndex,
    eventInfo.Idx,
    eventInfo.idx,
    eventInfo.ViewOutput,
  ];
  for (let i = 0; i < fieldCandidates.length; i++) {
    const token = asIndexToken(fieldCandidates[i]);
    if (token != null) {
      return token;
    }
  }

  const settings = eventInfo.Settings;
  if (typeof settings === 'string') {
    const match = settings.match(/\boutput="(\d+)"/);
    if (match) {
      return match[1];
    }
  }

  return takePendingOutputIndex(raw);
}

export function withOutputSuffix(channelName: string, index: string): string {
  const raw = String(channelName == null ? '' : channelName);
  if (raw.includes(OUTPUT_SUFFIX)) {
    return raw;
  }
  return `${raw}${OUTPUT_SUFFIX}${index}`;
}

export function resolveStreamEventChannelName(
  channelName: string,
  eventInfo: Record<string, unknown> = {}
): string {
  const index = resolveStreamEventIndex(channelName, eventInfo);
  if (index == null) {
    return channelName;
  }
  return withOutputSuffix(channelName, index);
}

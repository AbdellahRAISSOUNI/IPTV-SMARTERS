/**
 * Utility to load page metadata from JSON files
 * Falls back to defaults if file doesn't exist
 */

import type { Locale } from '@/lib/i18n';
import { getDefaultMetadata } from '@/lib/admin/metadata';
import type { MetadataContent } from '@/lib/admin/metadata';
import fs from 'fs';
import path from 'path';

/**
 * Load metadata for a locale
 */
export async function loadPageMetadata(locale: Locale): Promise<MetadataContent> {
  // Try to load from file system
  try {
    const filePath = path.join(process.cwd(), 'data', 'metadata', `${locale}.json`);
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContents);
    return data as MetadataContent;
  } catch (error) {
    // File doesn't exist or can't be read, use default
    console.error(`Failed to load metadata for ${locale}, using defaults:`, error);
  }

  // Fallback to default
  return getDefaultMetadata(locale);
}

/**
 * Get homepage metadata
 */
export async function getHomepageMetadata(locale: Locale): Promise<{ title: string; description: string }> {
  const metadata = await loadPageMetadata(locale);
  return metadata.homepage;
}

/**
 * Get blog listing metadata
 */
export async function getBlogListingMetadata(locale: Locale): Promise<{ title: string; description: string }> {
  const metadata = await loadPageMetadata(locale);
  return metadata.blogListing;
}

/**
 * Get installation page metadata
 */
export async function getInstallationMetadata(
  locale: Locale,
  page: 'windows' | 'ios' | 'firestick' | 'smartTv' | 'guide'
): Promise<{ title: string; description: string }> {
  const metadata = await loadPageMetadata(locale);
  return metadata.installation[page];
}

/**
 * Get reseller page metadata
 */
export async function getResellerMetadata(locale: Locale): Promise<{ title: string; description: string }> {
  const metadata = await loadPageMetadata(locale);
  return metadata.reseller;
}

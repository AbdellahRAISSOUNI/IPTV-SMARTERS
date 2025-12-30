import React from 'react';

/**
 * Converts URLs in text to clickable links
 * @param text - The text that may contain URLs
 * @returns React element with clickable links
 */
export function parseUrlsToLinks(text: string): React.ReactNode {
  // Match URLs (http://, https://, or www.)
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
  const parts: (string | React.ReactElement)[] = [];
  let lastIndex = 0;
  let match;

  while ((match = urlRegex.exec(text)) !== null) {
    // Add text before the URL
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Normalize URL (add https:// if it starts with www.)
    let url = match[0];
    if (url.startsWith('www.')) {
      url = `https://${url}`;
    }

    // Add the clickable link
    parts.push(
      <a
        key={match.index}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#2563eb] hover:text-[#1d4ed8] hover:underline font-medium"
      >
        {match[0]}
      </a>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  // If no URLs were found, return the original text
  if (parts.length === 0) {
    return text;
  }

  return <>{parts}</>;
}



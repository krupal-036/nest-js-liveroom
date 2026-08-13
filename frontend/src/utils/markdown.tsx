import React from 'react';

const INLINE_REGEX = /(`[^`\n]+`)|(\*\*[^*\n]+\*\*)|(_[^_\n]+_)/g;

export const renderMarkdown = (text: string): React.ReactNode => {
    if (!text) return text;

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let key = 0;
    let match: RegExpExecArray | null;

    INLINE_REGEX.lastIndex = 0;
    while ((match = INLINE_REGEX.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index));
        }

        const token = match[0];
        if (match[1]) {
            parts.push(
                <code key={key++} className="rounded-md bg-black/10 px-1.5 py-0.5 font-mono text-[0.85em] dark:bg-white/10">
                    {token.slice(1, -1)}
                </code>
            );
        } else if (match[2]) {
            parts.push(<strong key={key++} className="font-bold">{token.slice(2, -2)}</strong>);
        } else {
            const prevChar = text[match.index - 1] || '';
            if (/[A-Za-z0-9]/.test(prevChar)) {
                parts.push(token);
            } else {
                parts.push(<em key={key++}>{token.slice(1, -1)}</em>);
            }
        }

        lastIndex = match.index + token.length;
    }

    if (lastIndex < text.length) parts.push(text.slice(lastIndex));
    return parts.length === 1 ? parts[0] : <>{parts}</>;
};
export interface ArXivPaper {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  url: string;
}

function extractBetween(text: string, open: string, close: string): string {
  const start = text.indexOf(open);
  if (start === -1) return '';
  const inner = text.slice(start + open.length);
  const end = inner.indexOf(close);
  return end === -1 ? inner.trim() : inner.slice(0, end).trim();
}

function extractAll(text: string, open: string, close: string): string[] {
  const results: string[] = [];
  let cursor = 0;
  while (cursor < text.length) {
    const start = text.indexOf(open, cursor);
    if (start === -1) break;
    const inner = text.slice(start + open.length);
    const end = inner.indexOf(close);
    results.push(end === -1 ? inner.trim() : inner.slice(0, end).trim());
    cursor = start + open.length + (end === -1 ? inner.length : end + close.length);
  }
  return results;
}

export async function fetchArXivPapers(query: string, maxResults = 5): Promise<ArXivPaper[]> {
  const url = `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&max_results=${maxResults}&sortBy=relevance`;

  let xml: string;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    xml = await res.text();
  } catch (err) {
    console.error('[ArXiv] Fetch failed:', err);
    return [];
  }

  // Split on <entry> tags
  const entriesRaw = extractAll(xml, '<entry>', '</entry>');

  return entriesRaw.map((entry): ArXivPaper => {
    const rawId = extractBetween(entry, '<id>', '</id>');
    const paperId = rawId.split('/abs/').pop() || rawId;
    const title = extractBetween(entry, '<title>', '</title>').replace(/\s+/g, ' ');
    const abstract = extractBetween(entry, '<summary>', '</summary>').replace(/\s+/g, ' ');
    const authorBlocks = extractAll(entry, '<author>', '</author>');
    const authors = authorBlocks.map((a) => extractBetween(a, '<name>', '</name>'));

    return {
      id: paperId,
      title,
      abstract,
      authors,
      url: `https://arxiv.org/abs/${paperId}`,
    };
  });
}

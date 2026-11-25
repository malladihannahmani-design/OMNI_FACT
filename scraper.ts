import * as cheerio from 'cheerio';

export interface ScrapedArticle {
  url: string;
  domain: string;
  title: string;
  author?: string;
  publishDate?: string;
  description?: string;
  content: string;
  wordCount: number;
}

export interface UrlStatusResult {
  isOk: boolean;
  statusCode?: number;
  statusText?: string;
  errorMessage?: string;
}

export async function checkUrlAccessibility(targetUrl: string): Promise<UrlStatusResult> {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(targetUrl);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return { isOk: false, errorMessage: 'Invalid URL protocol' };
    }
  } catch {
    return { isOk: false, errorMessage: 'Invalid URL format' };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout for status pre-check

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 MisinfoFactCheckBot/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        isOk: false,
        statusCode: response.status,
        statusText: response.statusText,
        errorMessage: `Target URL returned HTTP status ${response.status} ${response.statusText || ''}`.trim(),
      };
    }

    return {
      isOk: true,
      statusCode: response.status,
      statusText: response.statusText,
    };
  } catch (err) {
    const msg = (err as Error).message || 'Unreachable or DNS failure';
    return {
      isOk: false,
      errorMessage: `Target URL is unreachable or domain failed DNS resolution (${msg}).`,
    };
  }
}

export async function scrapeUrl(targetUrl: string): Promise<ScrapedArticle> {
  // Validate URL structure
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(targetUrl);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Invalid URL protocol. Please provide an http or https link.');
    }
  } catch (err) {
    throw new Error(`Invalid URL format: ${(err as Error).message}`);
  }

  const domain = parsedUrl.hostname.replace(/^www\./, '');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 MisinfoFactCheckBot/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status} when fetching URL: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove noise and irrelevant non-content elements
    $('script, style, nav, footer, header, noscript, iframe, svg, form, aside, .advertisement, .ad, .ads, .social-share, .comments, .cookie-banner').remove();

    // Extract title
    const title =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('h1').first().text().trim() ||
      $('title').text().trim() ||
      'Untitled Article';

    // Extract description
    const description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      '';

    // Extract author
    const author =
      $('meta[name="author"]').attr('content') ||
      $('meta[property="article:author"]').attr('content') ||
      $('[rel="author"]').text().trim() ||
      $('.byline, .author, .writer').first().text().trim() ||
      undefined;

    // Extract publication date
    const publishDate =
      $('meta[property="article:published_time"]').attr('content') ||
      $('meta[name="pubdate"]').attr('content') ||
      $('time').first().attr('datetime') ||
      $('time').first().text().trim() ||
      undefined;

    // Extract body content paragraphs
    let paragraphs: string[] = [];

    // Prioritize main article selectors
    const mainArticle = $('article, main, .article-body, .story-body, .entry-content, #content, .content');
    if (mainArticle.length > 0) {
      mainArticle.find('p').each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 25 && !text.toLowerCase().includes('subscribe') && !text.toLowerCase().includes('all rights reserved')) {
          paragraphs.push(text);
        }
      });
    }

    // Fallback if main article container was not identified
    if (paragraphs.length < 2) {
      paragraphs = [];
      $('p').each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 30) {
          paragraphs.push(text);
        }
      });
    }

    const combinedContent = paragraphs.join('\n\n');
    const finalContent = combinedContent.length > 50 ? combinedContent : description || title;
    const wordCount = finalContent.split(/\s+/).filter(Boolean).length;

    return {
      url: targetUrl,
      domain,
      title: title.trim(),
      author: author ? author.trim() : undefined,
      publishDate,
      description,
      content: finalContent,
      wordCount,
    };
  } catch (error) {
    const message = (error as Error).message || 'Failed to fetch article';
    throw new Error(`Web Scraper Error: ${message}`);
  }
}

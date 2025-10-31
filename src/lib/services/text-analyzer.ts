/**
 * Text analysis service providing comprehensive text metrics and readability analysis
 * All algorithms implemented in pure JavaScript without external AI dependencies
 */

export interface TextAnalysisResult {
  basicStats: {
    wordCount: {
      total: number;
      unique: number;
    };
    characterCount: {
      withSpaces: number;
      withoutSpaces: number;
    };
    sentenceCount: number;
    paragraphCount: number;
    averageWordsPerSentence: number;
    readingTimeMinutes: number;
    speakingTimeMinutes: number;
  };
  readability: {
    fleschReadingEase: {
      score: number;
      level: string;
    };
    fleschKincaidGradeLevel: number;
    gunningFogIndex: number;
    automatedReadabilityIndex: number;
    smogIndex: number;
  };
  seoContent: {
    keywordDensity: Array<{
      phrase: string;
      count: number;
      density: number;
    }>;
    topKeywords: Array<{
      word: string;
      count: number;
      percentage: number;
    }>;
    longTailKeywords: Array<{
      phrase: string;
      count: number;
      density: number;
    }>;
  };
}

/**
 * Analyze text using comprehensive JavaScript algorithms
 */
export function analyzeText(text: string): TextAnalysisResult {
  // Clean and normalize text
  const cleanText = text.trim();

  if (!cleanText) {
    return getEmptyResult();
  }

  const basicStats = calculateBasicStats(cleanText);
  const readability = calculateReadabilityMetrics(cleanText);
  const seoContent = calculateSEOContentAnalysis(cleanText);

  return {
    basicStats,
    readability,
    seoContent,
  };
}

/**
 * Calculate basic text statistics
 */
function calculateBasicStats(text: string) {
  // Word count analysis
  const words = text.split(/\s+/).filter(word => word.length > 0);
  const totalWords = words.length;
  const uniqueWords = new Set(words.map(word => word.toLowerCase())).size;

  // Character count
  const withSpaces = text.length;
  const withoutSpaces = text.replace(/\s/g, '').length;

  // Sentence count (split on ., !, ? followed by space or end)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length;

  // Paragraph count (split on double line breaks)
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const paragraphCount = paragraphs.length;

  // Average words per sentence
  const averageWordsPerSentence = sentenceCount > 0 ? totalWords / sentenceCount : 0;

  // Reading time (200-250 words per minute average)
  const readingTimeMinutes = totalWords / 225; // Using 225 as average

  // Speaking time (150 words per minute)
  const speakingTimeMinutes = totalWords / 150;

  return {
    wordCount: {
      total: totalWords,
      unique: uniqueWords,
    },
    characterCount: {
      withSpaces,
      withoutSpaces,
    },
    sentenceCount,
    paragraphCount,
    averageWordsPerSentence: Math.round(averageWordsPerSentence * 100) / 100,
    readingTimeMinutes: Math.round(readingTimeMinutes * 100) / 100,
    speakingTimeMinutes: Math.round(speakingTimeMinutes * 100) / 100,
  };
}

/**
 * Calculate readability metrics using various formulas
 */
function calculateReadabilityMetrics(text: string) {
  const words = text.split(/\s+/).filter(word => word.length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

  const totalWords = words.length;
  const totalSentences = sentences.length;

  if (totalWords === 0 || totalSentences === 0) {
    return {
      fleschReadingEase: { score: 0, level: 'Not analyzable' },
      fleschKincaidGradeLevel: 0,
      gunningFogIndex: 0,
      automatedReadabilityIndex: 0,
      smogIndex: 0,
    };
  }

  // Calculate syllables for each word
  const syllablesPerWord = words.map(word => countSyllables(word.toLowerCase()));
  const totalSyllables = syllablesPerWord.reduce((sum, count) => sum + count, 0);

  // Calculate average sentence length and syllables per word
  const avgSentenceLength = totalWords / totalSentences;
  const avgSyllablesPerWord = totalSyllables / totalWords;

  // Flesch Reading Ease Score (0-100, higher = easier to read)
  const fleschScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
  const clampedFleschScore = Math.max(0, Math.min(100, fleschScore));

  // Flesch Reading Ease level interpretation
  let fleschLevel = '';
  if (clampedFleschScore >= 90) fleschLevel = 'Very Easy (5th grade)';
  else if (clampedFleschScore >= 80) fleschLevel = 'Easy (6th grade)';
  else if (clampedFleschScore >= 70) fleschLevel = 'Fairly Easy (7th grade)';
  else if (clampedFleschScore >= 60) fleschLevel = 'Standard (8th-9th grade)';
  else if (clampedFleschScore >= 50) fleschLevel = 'Fairly Difficult (10th-12th grade)';
  else if (clampedFleschScore >= 30) fleschLevel = 'Difficult (College)';
  else fleschLevel = 'Very Difficult (College Graduate)';

  // Flesch-Kincaid Grade Level
  const fleschKincaid = (0.39 * avgSentenceLength) + (11.8 * avgSyllablesPerWord) - 15.59;

  // Gunning Fog Index
  const complexWords = words.filter(word => countSyllables(word.toLowerCase()) >= 3).length;
  const complexWordPercentage = (complexWords / totalWords) * 100;
  const gunningFog = 0.4 * (avgSentenceLength + complexWordPercentage);

  // Automated Readability Index
  const characters = text.replace(/\s/g, '').length;
  const avgCharsPerWord = characters / totalWords;
  const automatedReadability = (4.71 * avgCharsPerWord) + (0.5 * avgSentenceLength) - 21.43;

  // SMOG Index (for health content, uses 30 sentences sample)
  // Simplified calculation using available sentences
  const smogMultiplier = totalSentences >= 3 ? Math.sqrt(complexWords * (30 / totalSentences)) : 0;
  const smogIndex = 1.043 * smogMultiplier + 3.1291;

  return {
    fleschReadingEase: {
      score: Math.round(clampedFleschScore * 100) / 100,
      level: fleschLevel,
    },
    fleschKincaidGradeLevel: Math.round(fleschKincaid * 100) / 100,
    gunningFogIndex: Math.round(gunningFog * 100) / 100,
    automatedReadabilityIndex: Math.round(automatedReadability * 100) / 100,
    smogIndex: Math.round(smogIndex * 100) / 100,
  };
}

/**
 * Count syllables in a word using vowel patterns
 */
function countSyllables(word: string): number {
  if (word.length <= 0) return 0;

  // Remove common endings and count vowel groups
  word = word.toLowerCase();
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');

  const syllables = word.match(/[aeiouy]{1,2}/g);

  return syllables ? syllables.length : 1;
}

/**
 * Calculate SEO and content analysis metrics
 */
function calculateSEOContentAnalysis(text: string) {
  const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 0);
  const totalWords = words.length;

  if (totalWords === 0) {
    return {
      keywordDensity: [],
      topKeywords: [],
      longTailKeywords: [],
    };
  }

  // Top keywords (single words, excluding common stop words)
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were',
    'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
    'must', 'can', 'this', 'that', 'these', 'those', 'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you',
    'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it',
    'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'whose', 'this',
    'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having',
    'do', 'does', 'did', 'doing', 'will', 'would', 'shall', 'should', 'can', 'could', 'may', 'might', 'must'
  ]);

  const wordFreq = new Map<string, number>();
  words.forEach(word => {
    // Remove punctuation and normalize
    const cleanWord = word.replace(/[^\w]/g, '');
    if (cleanWord.length > 2 && !stopWords.has(cleanWord)) {
      wordFreq.set(cleanWord, (wordFreq.get(cleanWord) || 0) + 1);
    }
  });

  const topKeywords = Array.from(wordFreq.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .map(([word, count]) => ({
      word,
      count,
      percentage: Math.round((count / totalWords) * 10000) / 100, // 2 decimal places
    }));

  // Keyword density for 1-3 word phrases
  const phrases = generateNGrams(words, 3);
  const phraseFreq = new Map<string, number>();

  phrases.forEach(phrase => {
    const key = phrase.join(' ');
    phraseFreq.set(key, (phraseFreq.get(key) || 0) + 1);
  });

  const keywordDensity = Array.from(phraseFreq.entries())
    .filter(([, count]) => count >= 2) // Only phrases that appear at least twice
    .sort(([, a], [, b]) => b - a)
    .slice(0, 15)
    .map(([phrase, count]) => ({
      phrase,
      count,
      density: Math.round((count / (totalWords - 2)) * 10000) / 100, // Normalize for phrase length
    }));

  // Long-tail keywords (2-3 word phrases)
  const longTailKeywords = Array.from(phraseFreq.entries())
    .filter(([phrase]) => {
      const words = phrase.split(' ');
      return words.length >= 2 && words.length <= 3;
    })
    .filter(([, count]) => count >= 2)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 15)
    .map(([phrase, count]) => ({
      phrase,
      count,
      density: Math.round((count / (totalWords - phrase.split(' ').length + 1)) * 10000) / 100,
    }));

  return {
    keywordDensity,
    topKeywords,
    longTailKeywords,
  };
}

/**
 * Generate n-grams from word array
 */
function generateNGrams(words: string[], maxLength: number): string[][] {
  const ngrams: string[][] = [];

  for (let n = 1; n <= maxLength; n++) {
    for (let i = 0; i <= words.length - n; i++) {
      ngrams.push(words.slice(i, i + n));
    }
  }

  return ngrams;
}

/**
 * Return empty result for invalid input
 */
function getEmptyResult(): TextAnalysisResult {
  return {
    basicStats: {
      wordCount: { total: 0, unique: 0 },
      characterCount: { withSpaces: 0, withoutSpaces: 0 },
      sentenceCount: 0,
      paragraphCount: 0,
      averageWordsPerSentence: 0,
      readingTimeMinutes: 0,
      speakingTimeMinutes: 0,
    },
    readability: {
      fleschReadingEase: { score: 0, level: 'Not analyzable' },
      fleschKincaidGradeLevel: 0,
      gunningFogIndex: 0,
      automatedReadabilityIndex: 0,
      smogIndex: 0,
    },
    seoContent: {
      keywordDensity: [],
      topKeywords: [],
      longTailKeywords: [],
    },
  };
}

/**
 * Analysis Service
 * Handles saving and retrieving website analyses from D1 database
 */

import { createD1Client } from "@/lib/db";
import type { WebsiteData, AnalysisResult } from "@/lib/validators/schema";

export interface SavedAnalysis {
  id: string;
  user_id: string | null;
  url: string;
  website_data: string; // JSON string
  analysis_result: string; // JSON string
  action_plan_summary: string | null;
  action_plan_timeline: string | null;
  quick_wins: string | null; // JSON array string
  analyzed_at: number;
  created_at: number;
}

export interface AnalysisHistoryItem {
  url: string;
  latest_analysis_date: number;
  total_count: number;
  latest_analysis_id: string;
  preview_data: string; // JSON string with preview info
}

/**
 * Saves an analysis to the database
 * Returns the generated analysis ID
 */
export async function saveAnalysis(
  userId: string | null,
  url: string,
  websiteData: WebsiteData,
  analysisResult: AnalysisResult
): Promise<string> {
  const db = createD1Client();
  const now = Date.now(); // Use milliseconds for consistency
  const id = crypto.randomUUID();

  await db
    .prepare(
      `INSERT INTO analyses (id, user_id, url, website_data, analysis_result, analyzed_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      userId,
      url,
      JSON.stringify(websiteData),
      JSON.stringify(analysisResult),
      now,
      now
    )
    .run();

  return id;
}

/**
 * Fetches all analyses for a user
 * Ordered by analyzed_at descending (newest first)
 */
export async function getUserAnalyses(
  userId: string
): Promise<SavedAnalysis[]> {
  const db = createD1Client();

  const result = await db
    .prepare(`SELECT * FROM analyses WHERE user_id = ? ORDER BY analyzed_at DESC`)
    .bind(userId)
    .all<SavedAnalysis>();

  return result.results || [];
}

/**
 * Fetches analyses for a specific URL and user
 */
export async function getAnalysesByUrl(
  userId: string,
  url: string
): Promise<SavedAnalysis[]> {
  const db = createD1Client();

  const result = await db
    .prepare(
      `SELECT * FROM analyses WHERE user_id = ? AND url = ? ORDER BY analyzed_at DESC`
    )
    .bind(userId, url)
    .all<SavedAnalysis>();

  return result.results || [];
}

/**
 * Fetches analysis history grouped by URL
 * Returns metadata for each URL with counts and latest analysis info
 */
export async function getAnalysisHistory(
  userId: string
): Promise<AnalysisHistoryItem[]> {
  const db = createD1Client();

  // Get grouped data with counts and latest analysis info
  const result = await db
    .prepare(
      `SELECT
         url,
         MAX(analyzed_at) as latest_analysis_date,
         COUNT(*) as total_count,
         (SELECT id FROM analyses a2
          WHERE a2.user_id = ? AND a2.url = analyses.url
          ORDER BY analyzed_at DESC LIMIT 1) as latest_analysis_id,
         (SELECT website_data FROM analyses a3
          WHERE a3.user_id = ? AND a3.url = analyses.url
          ORDER BY analyzed_at DESC LIMIT 1) as preview_data
       FROM analyses
       WHERE user_id = ?
       GROUP BY url
       ORDER BY latest_analysis_date DESC`
    )
    .bind(userId, userId, userId)
    .all<AnalysisHistoryItem>();

  // Ensure timestamps are properly converted to numbers
  const results = result.results || [];
  return results.map((item) => ({
    ...item,
    latest_analysis_date: Number(item.latest_analysis_date),
    total_count: Number(item.total_count),
  }));
}

/**
 * Fetches a single analysis by ID
 * Only returns if it belongs to the specified user
 */
export async function getAnalysisById(
  analysisId: string,
  userId: string
): Promise<SavedAnalysis | null> {
  const db = createD1Client();

  const result = await db
    .prepare(`SELECT * FROM analyses WHERE id = ? AND user_id = ?`)
    .bind(analysisId, userId)
    .first<SavedAnalysis>();

  return result;
}


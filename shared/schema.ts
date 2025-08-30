import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const issues = pgTable("issues", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body"),
  url: text("url").notNull(),
  repository: text("repository").notNull(),
  repositoryUrl: text("repository_url").notNull(),
  language: text("language"),
  labels: json("labels").$type<string[]>().default([]),
  state: text("state").notNull().default("open"),
  comments: integer("comments").default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  difficulty: text("difficulty"),
  isSaved: text("is_saved").default("false"),
});

export const savedIssues = pgTable("saved_issues", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  issueId: text("issue_id").notNull(),
  savedAt: timestamp("saved_at").defaultNow(),
});

export const searchFilters = pgTable("search_filters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  languages: json("languages").$type<string[]>().default([]),
  difficulties: json("difficulties").$type<string[]>().default([]),
  labels: json("labels").$type<string[]>().default([]),
  sort: text("sort").default("updated"),
  query: text("query").default(""),
});

export const insertIssueSchema = createInsertSchema(issues).omit({
  id: true,
});

export const insertSavedIssueSchema = createInsertSchema(savedIssues).omit({
  id: true,
  savedAt: true,
});

export const insertSearchFiltersSchema = createInsertSchema(searchFilters).omit({
  id: true,
});

export type Issue = typeof issues.$inferSelect;
export type InsertIssue = z.infer<typeof insertIssueSchema>;
export type SavedIssue = typeof savedIssues.$inferSelect;
export type InsertSavedIssue = z.infer<typeof insertSavedIssueSchema>;
export type SearchFilters = typeof searchFilters.$inferSelect;
export type InsertSearchFilters = z.infer<typeof insertSearchFiltersSchema>;

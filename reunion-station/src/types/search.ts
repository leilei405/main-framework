import type { Item } from "./item"
import type { MissingChild } from "./missingChild"

export interface SearchParams {
  keyword?: string
  type?: SearchType
  category?: string
  location?: string
  dateRange?: [string, string]
  radius?: number // 搜索半径（公里）
  coordinates?: {
    lat: number
    lng: number
  }
  sortBy?: SortBy
  page?: number
  limit?: number
}

export enum SearchType {
  ALL = "all",
  ITEMS = "items",
  MISSING_CHILDREN = "missing_children",
}

export enum SortBy {
  RELEVANCE = "relevance", // 相关性
  DATE_DESC = "date_desc", // 时间倒序
  DATE_ASC = "date_asc", // 时间正序
  DISTANCE = "distance", // 距离
  PRIORITY = "priority", // 优先级
}

export interface SearchResult {
  items: Item[]
  missingChildren: MissingChild[]
  total: number
  matches: MatchResult[]
  suggestions: string[]
}

export interface MatchResult {
  id: string
  lostItem: Item
  foundItem: Item
  matchScore: number
  matchReasons: string[]
  status: MatchStatus
  createdAt: string
}

export enum MatchStatus {
  PENDING = "pending", // 待确认
  CONFIRMED = "confirmed", // 已确认
  REJECTED = "rejected", // 已拒绝
  COMPLETED = "completed", // 已完成
}

export interface SearchHistory {
  id: string
  keyword: string
  params: SearchParams
  resultCount: number
  searchTime: string
  userId: string
}

export interface SavedSearch {
  id: string
  name: string
  params: SearchParams
  userId: string
  createdAt: string
  notificationEnabled: boolean
}

export const SEARCH_TYPE_LABELS = {
  [SearchType.ALL]: "全部",
  [SearchType.ITEMS]: "物品",
  [SearchType.MISSING_CHILDREN]: "失踪儿童",
}

export const SORT_BY_LABELS = {
  [SortBy.RELEVANCE]: "相关性",
  [SortBy.DATE_DESC]: "最新发布",
  [SortBy.DATE_ASC]: "最早发布",
  [SortBy.DISTANCE]: "距离最近",
  [SortBy.PRIORITY]: "优先级",
}

export const MATCH_STATUS_LABELS = {
  [MatchStatus.PENDING]: "待确认",
  [MatchStatus.CONFIRMED]: "已确认",
  [MatchStatus.REJECTED]: "已拒绝",
  [MatchStatus.COMPLETED]: "已完成",
}

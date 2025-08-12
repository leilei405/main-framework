export interface Item {
  id: string
  title: string
  description: string
  category: ItemCategory
  type: ItemType
  status: ItemStatus
  images: string[]
  location: {
    province: string
    city: string
    district: string
    address: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  contactInfo: {
    name: string
    phone: string
    email?: string
    wechat?: string
  }
  userId: string
  userName: string
  createdAt: string
  updatedAt: string
  foundAt?: string // 找到时间
  reward?: number // 悬赏金额
  tags: string[]
}

export enum ItemType {
  LOST = "lost", // 丢失物品
  FOUND = "found", // 捡到物品
}

export enum ItemStatus {
  ACTIVE = "active", // 活跃中
  MATCHED = "matched", // 已匹配
  CLOSED = "closed", // 已关闭
  EXPIRED = "expired", // 已过期
}

export enum ItemCategory {
  ELECTRONICS = "electronics", // 电子产品
  DOCUMENTS = "documents", // 证件文件
  JEWELRY = "jewelry", // 首饰
  CLOTHING = "clothing", // 服装
  BAGS = "bags", // 包类
  KEYS = "keys", // 钥匙
  PETS = "pets", // 宠物
  VEHICLES = "vehicles", // 交通工具
  BOOKS = "books", // 书籍
  SPORTS = "sports", // 运动用品
  TOYS = "toys", // 玩具
  OTHER = "other", // 其他
}

export const CATEGORY_LABELS = {
  [ItemCategory.ELECTRONICS]: "电子产品",
  [ItemCategory.DOCUMENTS]: "证件文件",
  [ItemCategory.JEWELRY]: "首饰",
  [ItemCategory.CLOTHING]: "服装",
  [ItemCategory.BAGS]: "包类",
  [ItemCategory.KEYS]: "钥匙",
  [ItemCategory.PETS]: "宠物",
  [ItemCategory.VEHICLES]: "交通工具",
  [ItemCategory.BOOKS]: "书籍",
  [ItemCategory.SPORTS]: "运动用品",
  [ItemCategory.TOYS]: "玩具",
  [ItemCategory.OTHER]: "其他",
}

export const STATUS_LABELS = {
  [ItemStatus.ACTIVE]: "活跃中",
  [ItemStatus.MATCHED]: "已匹配",
  [ItemStatus.CLOSED]: "已关闭",
  [ItemStatus.EXPIRED]: "已过期",
}

export const TYPE_LABELS = {
  [ItemType.LOST]: "丢失物品",
  [ItemType.FOUND]: "捡到物品",
}

export interface CreateItemData {
  title: string
  description: string
  category: ItemCategory
  type: ItemType
  images: string[]
  location: {
    province: string
    city: string
    district: string
    address: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  contactInfo: {
    name: string
    phone: string
    email?: string
    wechat?: string
  }
  reward?: number
  tags: string[]
}

export interface ItemSearchParams {
  keyword?: string
  category?: ItemCategory
  type?: ItemType
  status?: ItemStatus
  location?: string
  page?: number
  limit?: number
}

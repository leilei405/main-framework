export interface MissingChild {
  id: string
  name: string
  age: number
  gender: "male" | "female"
  description: string
  physicalFeatures: {
    height?: string
    weight?: string
    hairColor?: string
    eyeColor?: string
    skinTone?: string
    distinguishingMarks?: string
  }
  clothing: {
    description: string
    colors: string[]
  }
  lastSeenLocation: {
    province: string
    city: string
    district: string
    address: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  lastSeenTime: string
  circumstances: string // 失踪经过
  images: string[]
  reporterInfo: {
    name: string
    relationship: string // 与失踪儿童的关系
    phone: string
    email?: string
    idNumber: string // 身份证号（加密存储）
  }
  policeInfo?: {
    caseNumber?: string // 报案号
    officerName?: string
    officerContact?: string
    policeStation?: string
  }
  status: MissingChildStatus
  priority: MissingChildPriority
  userId: string
  createdAt: string
  updatedAt: string
  approvedAt?: string
  approvedBy?: string
  rejectedReason?: string
  tips: MissingChildTip[] // 线索信息
}

export interface MissingChildTip {
  id: string
  childId: string
  content: string
  location?: string
  reportTime: string
  reporterContact?: string
  status: TipStatus
  verifiedBy?: string
  verifiedAt?: string
}

export enum MissingChildStatus {
  PENDING = "pending", // 待审核
  APPROVED = "approved", // 已审核通过
  REJECTED = "rejected", // 审核拒绝
  FOUND = "found", // 已找到
  CLOSED = "closed", // 已关闭
}

export enum MissingChildPriority {
  LOW = "low", // 低优先级
  MEDIUM = "medium", // 中优先级
  HIGH = "high", // 高优先级
  URGENT = "urgent", // 紧急
}

export enum TipStatus {
  PENDING = "pending", // 待验证
  VERIFIED = "verified", // 已验证
  FALSE = "false", // 虚假信息
}

export const STATUS_LABELS = {
  [MissingChildStatus.PENDING]: "待审核",
  [MissingChildStatus.APPROVED]: "已发布",
  [MissingChildStatus.REJECTED]: "审核拒绝",
  [MissingChildStatus.FOUND]: "已找到",
  [MissingChildStatus.CLOSED]: "已关闭",
}

export const PRIORITY_LABELS = {
  [MissingChildPriority.LOW]: "低优先级",
  [MissingChildPriority.MEDIUM]: "中优先级",
  [MissingChildPriority.HIGH]: "高优先级",
  [MissingChildPriority.URGENT]: "紧急",
}

export const TIP_STATUS_LABELS = {
  [TipStatus.PENDING]: "待验证",
  [TipStatus.VERIFIED]: "已验证",
  [TipStatus.FALSE]: "虚假信息",
}

export interface CreateMissingChildData {
  name: string
  age: number
  gender: "male" | "female"
  description: string
  physicalFeatures: {
    height?: string
    weight?: string
    hairColor?: string
    eyeColor?: string
    skinTone?: string
    distinguishingMarks?: string
  }
  clothing: {
    description: string
    colors: string[]
  }
  lastSeenLocation: {
    province: string
    city: string
    district: string
    address: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  lastSeenTime: string
  circumstances: string
  images: string[]
  reporterInfo: {
    name: string
    relationship: string
    phone: string
    email?: string
    idNumber: string
  }
  policeInfo?: {
    caseNumber?: string
    officerName?: string
    officerContact?: string
    policeStation?: string
  }
}

export interface MissingChildSearchParams {
  keyword?: string
  status?: MissingChildStatus
  priority?: MissingChildPriority
  location?: string
  ageRange?: [number, number]
  gender?: "male" | "female"
  page?: number
  limit?: number
}

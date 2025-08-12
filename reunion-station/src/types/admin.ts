export interface AdminStats {
  users: {
    total: number;
    active: number;
    newToday: number;
    banned: number;
  };
  items: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  missingChildren: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    found: number;
  };
  reports: {
    total: number;
    pending: number;
    resolved: number;
  };
  matches: {
    total: number;
    confirmed: number;
    pending: number;
  };
}

export interface UserManagement {
  id: string;
  username: string;
  email: string;
  phone: string;
  role: "user" | "admin";
  status: UserStatus;
  createdAt: string;
  lastLoginAt?: string;
  itemsCount: number;
  reportsCount: number;
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  BANNED = "banned",
  SUSPENDED = "suspended",
}

export interface Report {
  id: string;
  type: ReportType;
  targetId: string;
  targetType: "item" | "missing_child" | "user";
  reporterId: string;
  reporterName: string;
  reason: string;
  description: string;
  status: ReportStatus;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolution?: string;
}

export enum ReportType {
  SPAM = "spam",
  INAPPROPRIATE = "inappropriate",
  FALSE_INFO = "false_info",
  HARASSMENT = "harassment",
  OTHER = "other",
}

export enum ReportStatus {
  PENDING = "pending",
  INVESTIGATING = "investigating",
  RESOLVED = "resolved",
  DISMISSED = "dismissed",
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  createdAt: string;
}

export const USER_STATUS_LABELS = {
  [UserStatus.ACTIVE]: "正常",
  [UserStatus.INACTIVE]: "未激活",
  [UserStatus.BANNED]: "已封禁",
  [UserStatus.SUSPENDED]: "已暂停",
};

export const REPORT_TYPE_LABELS = {
  [ReportType.SPAM]: "垃圾信息",
  [ReportType.INAPPROPRIATE]: "不当内容",
  [ReportType.FALSE_INFO]: "虚假信息",
  [ReportType.HARASSMENT]: "骚扰行为",
  [ReportType.OTHER]: "其他",
};

export const REPORT_STATUS_LABELS = {
  [ReportStatus.PENDING]: "待处理",
  [ReportStatus.INVESTIGATING]: "调查中",
  [ReportStatus.RESOLVED]: "已解决",
  [ReportStatus.DISMISSED]: "已驳回",
};

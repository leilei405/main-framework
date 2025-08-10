import type {
  ReactNode,
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
} from "react";

/** 按钮的尺寸 */
export type ButtonSize = "large" | "small" | "medium";

/** 按钮的类型 */
export type ButtonType =
  | "primary"
  | "default"
  | "danger"
  | "link"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "light"
  | "dark";

/**  按钮的尺寸 */
interface BaseButtonProps {
  href?: string;
  size?: ButtonSize;
  className?: string;
  disabled?: boolean;
  btnType?: ButtonType;
  children: ReactNode;
}

/** 原生按钮的属性 */
type NativeButtonProps = BaseButtonProps & ButtonHTMLAttributes<HTMLElement>;

/** 链接按钮的属性 */
type AnchorButtonProps = BaseButtonProps & AnchorHTMLAttributes<HTMLElement>;

/** 按钮的属性 */
export type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps>;

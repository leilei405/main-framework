import type { FC } from "react";
import classNames from "classnames";

import type { ButtonProps } from "./buttonProps";

export const Button: FC<ButtonProps> = (props) => {
  const {
    btnType = "default",
    className,
    disabled = false,
    size = "medium",
    children,
    href,
    ...restProps
  } = props;

  /** 按钮类型 */
  const classes = classNames("btn", className, {
    [`fll-btn-${btnType}`]: btnType,
    [`fll-btn-${size}`]: size,
    disabled: btnType === "link" && disabled,
  });

  /** 链接按钮 */
  if (btnType === "link" && href) {
    return (
      <a className={classes} href={href} {...restProps}>
        {children}
      </a>
    );
  }

  /** 普通按钮 */
  return (
    <button className={classes} disabled={disabled} {...restProps}>
      {children}
    </button>
  );
};

export default Button;

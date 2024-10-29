import React from "react";
import { Typography, Link, TypographyProps } from "@mui/material";
import { Variant } from "@mui/material/styles/createTypography";
import { convertToString } from "../../functions/utils/stringUtils";

interface ClickableTextProps extends TypographyProps {
  children: string | number | (string | number)[];
  clickablePart?: string | number | (string | number)[];
  onClick: () => void;
  linkStyle?: React.CSSProperties;
  variant?: Variant;
}

const ClickableText: React.FC<ClickableTextProps> = ({
  children,
  clickablePart,
  onClick,
  linkStyle,
  variant,
  ...typographyProps
}) => {
  children = convertToString(children);
  // clickablePart が指定されていない場合は children 全体をクリック可能にする
  const targetText = convertToString(clickablePart) || children;
  
  // clickablePart が見つからない場合の処理
  const index = children.indexOf(targetText);
  if (index === -1) {
    console.warn(`ClickableText: The specified clickablePart "${targetText}" was not found in children.`);
    return <Typography variant={variant} {...typographyProps}>{children}</Typography>;
  }

  const before = children.substring(0, index);
  const after = children.substring(index + targetText.length);

  return (
    <Typography variant={variant} {...typographyProps}>
      {before}
      <Link
        component="button"
        onClick={onClick}
        underline="always"
        style={{ cursor: "pointer", ...linkStyle }}
        aria-label={`Clickable part: ${targetText}`}
      >
        {targetText}
      </Link>
      {after}
    </Typography>
  );
};

export default ClickableText;

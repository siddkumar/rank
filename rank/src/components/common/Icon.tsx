import React from "react";

interface IconProps {
  className: string;
  onClick?: (e: React.MouseEvent) => void;
}

export function Icon({ className, onClick }: IconProps) {
  return <i className={className} aria-hidden="true" onClick={onClick}></i>;
}

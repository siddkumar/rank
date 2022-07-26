import React from "react";

export interface HeaderProps {
  title: string;
}

function Header(props: HeaderProps) {
  return (
    <div className="App-header">
      <p>Welcome to the {props.title} page.</p>
    </div>
  );
}

export default Header;

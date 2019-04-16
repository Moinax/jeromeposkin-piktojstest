import React from "react";

export default ({ text, ...props }) => <div {...props} draggable="false">{text}</div>;

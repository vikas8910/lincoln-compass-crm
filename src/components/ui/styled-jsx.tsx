
import React from 'react';

interface StyledJSXProps {
  children: string;
}

// A simple component to handle styled-jsx like syntax
export const Style: React.FC<StyledJSXProps> = ({ children }) => {
  return <style dangerouslySetInnerHTML={{ __html: children }} />;
};

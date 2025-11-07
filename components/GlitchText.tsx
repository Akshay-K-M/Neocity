
import React from 'react';

const GlitchText = ({ text }: { text: string }) => {
  return (
    <span className="glitch" data-text={text}>
      {text}
    </span>
  );
};

export default GlitchText;

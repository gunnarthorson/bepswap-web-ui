import React from 'react';
import ContentLoader from 'react-content-loader';
import { palette } from 'styled-theme';

const SwapLoader = () => (
  <ContentLoader
    className="content-loader"
    height={400}
    width={1000}
    speed={1}
    backgroundColor={palette('background', 2)}
    foregroundColor={palette('gray', 1)}
  >
    <rect x="0" y="20" rx="2" ry="2" width="120" height="20" />
    <rect x="0" y="56" rx="4" ry="4" width="120" height="50" />
    <rect x="0" y="120" rx="4" ry="4" width="80%" height="65" />
    <rect x="0" y="185" rx="4" ry="4" width="80%" height="65" />
    <rect x="0" y="250" rx="4" ry="4" width="80%" height="65" />
  </ContentLoader>
);

export default SwapLoader;

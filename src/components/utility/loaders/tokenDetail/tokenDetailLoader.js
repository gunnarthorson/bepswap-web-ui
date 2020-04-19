import React from 'react';
import ContentLoader from 'react-content-loader';
import { palette } from 'styled-theme';

const TokenDetailLoader = () => (
  <ContentLoader
    className="token-detail-loader"
    height={240}
    width={240}
    speed={1}
    backgroundColor={palette('background', 2)}
    foregroundColor={palette('gray', 1)}
  >
    <rect x="70" y="20" rx="2" ry="2" width="100" height="20" />
    <rect x="20" y="80" rx="2" ry="2" width="200" height="20" />
    <rect x="20" y="140" rx="2" ry="2" width="200" height="20" />
    <rect x="20" y="200" rx="2" ry="2" width="200" height="20" />
  </ContentLoader>
);

export default TokenDetailLoader;

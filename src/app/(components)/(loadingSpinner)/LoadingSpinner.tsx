// src/components/LoadingSpinner.tsx
"use client";

import React from "react";
import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const SpinnerSvg = styled.svg<{ $size?: number }>`
  animation: ${rotate} 1.2s linear infinite;
  transform-origin: center;
  width: ${(props) => props.$size || 120}px;
  height: ${(props) => props.$size || 120}px;
`;

interface SpinnerProps {
  size?: number;
}

export const LoadingSpinner: React.FC<SpinnerProps> = ({ size = 120 }) => (
  <SpinnerSvg
    $size={size}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 120 120"
    fill="none"
  >
    <path
      d="M21.7764 21.7764C19.4553 19.4553 15.6657 19.4383 13.5855 21.9777C7.24742 29.7146 2.92306 38.9403 1.04918 48.8286C-1.19483 60.6701 0.179324 72.9129 4.99265 83.9623C9.80598 95.0117 17.8353 104.355 28.0348 110.776C38.2343 117.197 50.1311 120.398 62.1754 119.961C74.2197 119.524 85.8533 115.469 95.5606 108.326C105.268 101.183 112.599 91.2823 116.599 79.9132C120.599 68.5441 121.083 56.2338 117.986 44.5861C115.401 34.8595 110.419 25.9715 103.537 18.7142C101.278 16.3323 97.5001 16.6238 95.3532 19.107C93.2064 21.5903 93.5115 25.3217 95.7113 27.7582C100.817 33.413 104.526 40.2224 106.498 47.6399C108.981 56.98 108.593 66.8513 105.386 75.9679C102.178 85.0846 96.2994 93.0239 88.5153 98.7518C80.7312 104.48 71.4025 107.731 61.7444 108.081C52.0863 108.431 42.5466 105.865 34.3678 100.716C26.1891 95.5676 19.7506 88.0751 15.8909 79.2148C12.0312 70.3546 10.9293 60.5373 12.7287 51.0419C14.1577 43.501 17.364 36.4407 22.0462 30.4308C24.0637 27.8413 24.0976 24.0976 21.7764 21.7764Z"
      fill="url(#paint0_linear_103_611)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_103_611"
        x1="97"
        y1="19.5"
        x2="23.5"
        y2="19.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#008E9B" />
        <stop offset="0.511286" stopColor="#1D7D85" />
        <stop offset="1" stopColor="#183133" />
      </linearGradient>
    </defs>
  </SpinnerSvg>
);

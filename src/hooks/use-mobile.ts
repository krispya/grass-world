import { useMemo } from 'react';

type NavigatorWithUAData = Navigator & {
  userAgentData?: {
    mobile?: boolean;
  };
};

export function isMobileHardware() {
  if (typeof navigator === 'undefined') return false;

  const userAgentData = (navigator as NavigatorWithUAData).userAgentData;
  if (typeof userAgentData?.mobile === 'boolean') return userAgentData.mobile;

  const userAgent = navigator.userAgent;
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent)) {
    return true;
  }

  // iPadOS can identify as Mac, but still reports touch capability.
  if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) {
    return true;
  }

  const hasCoarsePointer =
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
  const hasSmallScreen = typeof window !== 'undefined' && window.innerWidth <= 1024;

  return navigator.maxTouchPoints > 0 && hasCoarsePointer && hasSmallScreen;
}

export function useMobile() {
  return useMemo(isMobileHardware, []);
}

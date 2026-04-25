import { useCallback, useRef, useState } from 'react';

export function usePortalSettings(initialTitle = 'Dev Portal') {
  const [portalTitle, setPortalTitleState] = useState(initialTitle);
  const portalTitleRef = useRef(initialTitle);

  const setPortalTitle = useCallback((title: string) => {
    portalTitleRef.current = title;
    setPortalTitleState(title);
  }, []);

  return { portalTitle, portalTitleRef, setPortalTitle, setPortalTitleState };
}

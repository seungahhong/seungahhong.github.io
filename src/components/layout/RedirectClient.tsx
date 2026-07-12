'use client';

import { useEffect } from 'react';

export default function RedirectClient({ target }: { target: string }) {
  useEffect(() => {
    window.location.replace(target);
  }, [target]);
  return null;
}

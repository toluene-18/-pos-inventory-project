import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { pageByName } from '../routes/navigation';

/** Returns a function that navigates by page name, e.g. go('Products'). */
export default function usePageNavigate() {
  const navigate = useNavigate();
  return useCallback(name => {
    const page = pageByName(name);
    if (page) navigate(page.path);
  }, [navigate]);
}

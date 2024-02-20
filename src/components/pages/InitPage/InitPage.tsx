import { useNavigate } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import routes from '@/constants/routes.ts';

function InitPage() {
  const navigate = useNavigate();

  useEffectOnce(() => {
    navigate(routes.selectBook);
  });

  return null;
}

export default InitPage;

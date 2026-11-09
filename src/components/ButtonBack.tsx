import Button from './Button';
import { useNavigate } from 'react-router';

function ButtonBack() {
  const navigate = useNavigate();

  return (
    <Button variant="back" onClick={() => navigate(-1)}>
      &larr; Back
    </Button>
  );
}

export default ButtonBack;

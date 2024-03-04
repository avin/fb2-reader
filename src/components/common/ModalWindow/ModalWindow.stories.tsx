import { useToggle } from 'react-use';
import ModalWindow from './ModalWindow';

export default {
  component: ModalWindow,
};

export const Default = () => {
  const [isOpen, toggleIsOpen] = useToggle(false);

  return (
    <div>
      <button type="button" onClick={toggleIsOpen}>
        open
      </button>
      <ModalWindow open={isOpen} onClose={toggleIsOpen}>
        <div>Hello</div>
      </ModalWindow>
    </div>
  );
};

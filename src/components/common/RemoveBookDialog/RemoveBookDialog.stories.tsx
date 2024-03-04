import { useToggle } from 'react-use';
import RemoveBookDialog from './RemoveBookDialog';

export default {
  component: RemoveBookDialog,
};

export const Default = () => {
  const [isOpen, toggleIsOpen] = useToggle(false);

  return (
    <div>
      <button type="button" onClick={toggleIsOpen}>
        open
      </button>
      <RemoveBookDialog open={isOpen} onCancel={toggleIsOpen} onConfirm={toggleIsOpen} />
    </div>
  );
};

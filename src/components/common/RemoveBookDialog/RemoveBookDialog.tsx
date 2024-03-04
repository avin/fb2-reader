import React from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import ModalWindow from '@/components/common/ModalWindow/ModalWindow.tsx';

interface Props {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function RemoveBookDialog({ open, onConfirm, onCancel }: Props) {
  return (
    <ModalWindow open={open} onClose={onCancel}>
      <div className="rounded-xl overflow-hidden shadow-xl">
        {/*<div className="flex bg-white px-4 pb-4 pt-5">*/}
        <div className="flex bg-white px-4 pt-5 p-6 pb-4">
          <div className="rounded-full bg bg-red-100 size-12 mr-4 flex justify-center items-center">
            <TrashIcon className="size-6 text-red-500" />
          </div>
          <div>
            <div className="text-base font-semibold leading-6 text-gray-900">Remove book</div>
            <div className="mt-2 text-sm text-gray-500">Are you sure want to remove this book?</div>
          </div>
        </div>
        <div className="flex justify-end bg-gray-50 px-4 py-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mt-0 w-auto"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 ml-3 w-auto"
          >
            Remove
          </button>
        </div>
      </div>
    </ModalWindow>
  );
}

export default RemoveBookDialog;

import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import { BookOpenIcon } from '@heroicons/react/24/outline';
import cn from 'clsx';
import SavedBooksList from '@/components/pages/SelectBookPage/SavedBooksList/SavedBooksList.tsx';
import routes from '@/constants/routes.ts';
import { hashString } from '@/utils/hash.ts';

function SelectBookPage() {
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e) => {
    e.preventDefault(); // Необходимо для возможности сбросить файл
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const readFileContent = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e: ProgressEvent<FileReader>) => {
      const buffer = e.target?.result as ArrayBuffer;

      // Используем TextDecoder для декодирования первой части файла и извлечения кодировки
      const initialDecoder = new TextDecoder('utf-8');
      const initialContent = initialDecoder.decode(buffer.slice(0, 1024)); // Читаем первые 1024 байта для безопасности
      const encodingMatch = initialContent.match(/encoding="([^"]+)"/);
      let content: string;

      if (encodingMatch && encodingMatch[1]) {
        // Если найдена кодировка и она отличается от utf-8, декодируем с правильной кодировкой
        const actualEncoding = encodingMatch[1];
        const decoder = new TextDecoder(actualEncoding);
        content = decoder.decode(buffer);
      } else {
        // Если кодировка не найдена или utf-8, используем уже прочитанное содержимое
        content = initialContent;
      }

      if (content) {
        const hash: string = await hashString(content);
        navigate(routes.viewBook.replace(':id', hash), { state: { data: content } });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      readFileContent(files[0]);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      readFileContent(files[0]);
    }
  };

  return (
    <div
      className={cn('flex flex-col justify-start items-center px-4', { '': isDragging })}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <button
        type="button"
        onClick={() => inputFileRef.current!.click()}
        className="border-2 border-dashed border-gray-500 rounded-3xl p-8 flex flex-col items-center w-full max-w-2xl my-8"
      >
        <BookOpenIcon className="w-8 mb-2 text-gray-500" />
        <p className="mt-1 text-lg text-gray-500">
          <span className="text-blue-600">Upload a book file</span> or drag and drop
        </p>
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
          ref={inputFileRef}
          accept=".fb2,application/x-fictionbook+xml"
        />
      </button>
      <SavedBooksList className="" />
    </div>
  );
}

export default SelectBookPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import cn from 'clsx';
import SavedBooksList from '@/components/pages/SelectBookPage/SavedBooksList/SavedBooksList.tsx';
import routes from '@/constants/routes.ts';
import { booksDbManagerInstance } from '@/utils/db/booksDbManagerInstance.ts';
import { hashString } from '@/utils/hash.ts';
import styles from './SelectBookPage.module.scss';

function SelectBookPage() {
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();
  const [savedBookMetas, setSavedBookMetas] = useState<any>(null);

  useEffectOnce(() => {
    void (async () => {
      const metas = await booksDbManagerInstance.getAllBookMetas();
      setSavedBookMetas(metas);
    })();
  });

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
      const content = e.target?.result as string;
      if (content) {
        const hash: string = await hashString(content);
        navigate(routes.viewBook.replace(':id', hash), { state: { data: content } });
      }
    };
    reader.readAsText(file);
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
      className={cn(styles.page, { [styles.dragging]: isDragging })}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={styles.dropBookArea}>
        Drop a book onto this page or load it manually:
        <input type="file" className={styles.openFileButton} onChange={handleFileChange} />
      </div>
      <div className={styles.selectPreviousBlock}>
        <div>or select a previously loaded book:</div>
        {savedBookMetas && <SavedBooksList savedBookMetas={savedBookMetas} />}
      </div>
    </div>
  );
}

export default SelectBookPage;
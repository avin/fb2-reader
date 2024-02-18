import React, { useState } from 'react';
import { useEffectOnce } from 'react-use';
import BookView from '@/components/common/BookView/BookView.tsx';
import { FB2 } from '@/utils/fb2/FB2.ts';

function InitPage() {
  const [content, setContent] = useState<string | null>(null);

  useEffectOnce(() => {
    void (async () => {
      const fb2 = FB2.init();
      const text = await fb2.loadExample();
      setContent(text);
    })();
  });

  if (!content) {
    return null;
  }

  return <BookView content={content} />;
}

export default InitPage;

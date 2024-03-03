export function resizeBase64Img(base64: string, size: number): Promise<string> {
  return new Promise((resolve, reject) => {
    // Создаем новый объект изображения
    const img = new Image();
    img.src = base64;

    img.onload = () => {
      // Вычисляем новые размеры для сохранения пропорций
      const aspectRatio = img.width / img.height;
      let newWidth = size;
      let newHeight = size;

      if (img.width > img.height) {
        newHeight = size / aspectRatio;
      } else {
        newWidth = size * aspectRatio;
      }

      // Создаем элемент canvas
      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Unable to get canvas context'));
        return;
      }

      // Изменяем размер изображения и рисуем на canvas
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      // Преобразуем canvas обратно в строку base64
      resolve(canvas.toDataURL());
    };

    img.onerror = (error) => {
      reject(error);
    };
  });
}

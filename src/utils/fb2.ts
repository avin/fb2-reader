import fxparser from 'fast-xml-parser';
import { BookMeta } from '@/types';
import { resizeBase64Img } from '@/utils/image.ts';

export function parseBookXml(content: string): any {
  const parser = new fxparser.XMLParser({
    ignoreAttributes: false,
    preserveOrder: true,
    trimValues: false,
  });
  return parser.parse(content);
}

export async function getBookMetadata(bookObj: any): Promise<BookMeta> {
  const descriptionBlock = bookObj.find((i) => Object.keys(i)[0] === 'description')['description'];
  const titleInfo = descriptionBlock.find((i) => Object.keys(i)[0] === 'title-info')['title-info'];

  const genres = titleInfo
    .filter((i) => Object.keys(i)[0] === 'genre')
    .map((i) => i['genre'][0]['#text']);

  const bookTitle = titleInfo.find((i) => Object.keys(i)[0] === 'book-title')?.['book-title'][0][
    '#text'
  ];
  const annotation = titleInfo.find((i) => Object.keys(i)[0] === 'annotation')?.['annotation'];
  const coverPage = titleInfo.find((i) => Object.keys(i)[0] === 'coverpage')?.['coverpage'];
  const date = titleInfo.find((i) => Object.keys(i)[0] === 'date')?.['date'][0]?.['#text'];

  const coverPageImgPreview = await (async () => {
    try {
      const coverPageItem = coverPage.find((i) => !!i[':@']);
      if (!coverPageItem) {
        return undefined;
      }

      const hrefKey = Object.keys(coverPageItem[':@']).find((i) => i.endsWith(':href'))!;
      if (!hrefKey) {
        return;
      }

      const id = coverPageItem[':@'][hrefKey].replace(/^#/, '');
      const binObj = bookObj.find((i) => {
        return i.binary && i[':@']?.['@_id'] === id;
      });

      const base64Text = binObj.binary[0]['#text'].replace(/[^A-Za-z0-9+/]+/g, '');
      const imageBase64Str = `data:${binObj[':@']['@_content-type']};base64,${base64Text}`;

      const smallImageBase64Str = await resizeBase64Img(imageBase64Str, 100);

      return smallImageBase64Str;
    } catch (e) {
      console.warn(e);
      return undefined;
    }
  })();

  const authors = titleInfo
    .filter((i) => Object.keys(i)[0] === 'author')
    .map((i) => i['author'])
    .map((i) => {
      const dict = {
        firstName: 'first-name',
        middleName: 'middle-name',
        lastName: 'last-name',
        nickname: 'nickname',
        homePage: 'home-page',
        email: 'email',
        id: 'id',
      };
      const result = {};
      Object.entries(dict).map(([key, fbKey]) => {
        result[key] = i.find((i) => Object.keys(i)[0] === fbKey)?.[fbKey][0]['#text'];
      });
      return result;
    });

  return {
    genres,
    authors,
    bookTitle,
    annotation,
    date,
    coverPage,
    coverPageImgPreview,
  };
}

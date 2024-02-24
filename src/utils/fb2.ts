import fxparser from 'fast-xml-parser';

export function parseBookXml(content: string): any {
  const parser = new fxparser.XMLParser({
    ignoreAttributes: false,
    preserveOrder: true,
    trimValues: false,
  });
  return parser.parse(content);
}

export function getBookMetadata(bookObj: any) {
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
  };
}

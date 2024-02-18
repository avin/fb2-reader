interface Section {
  title: string | null;
  content: Array<{ type: string; text?: string; href?: string; poem?: Poem }>;
  subsections: Section[];
}

interface Poem {
  title: string | null;
  stanzas: Stanza[];
}

interface Stanza {
  lines: string[];
}

interface Author {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  nickname?: string;
  homePage?: string;
  email?: string;
}

interface TitleInfo {
  genres: string[];
  author: Author;
  bookTitle?: string;
  annotation?: string;
  keywords?: string;
  date?: string;
  coverpage?: string;
  lang?: string;
  srcLang?: string;
  translation?: Author;
}

interface DocumentInfo {
  author: Author;
  programUsed?: string;
  date?: string;
  id?: string;
  version?: string;
  history?: string;
}

interface PublishInfo {
  bookName?: string;
  publisher?: string;
  city?: string;
  year?: string;
  isbn?: string;
}

interface CustomInfo {
  infoType: string;
  content: string;
}

interface Binary {
  id: string;
  contentType: string;
  content: string;
}

interface Body {
  name?: string;
  sections: Section[];
}

export interface Book {
  titleInfo?: TitleInfo;
  documentInfo?: DocumentInfo;
  publishInfo?: PublishInfo;
  customInfo: CustomInfo[];
  bodies: Body[];
  binaries: Binary[];
}

class FB2Parser {
  parseSection(sectionNode: Element): Section {
    const section: Section = {
      title: null,
      content: [],
      subsections: [],
    };

    const titleNode = sectionNode.querySelector('title');
    if (titleNode) {
      section.title = titleNode.innerHTML;
    }

    sectionNode.childNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        switch (element.tagName.toLowerCase()) {
          case 'p':
            section.content.push({ type: 'paragraph', text: element.innerHTML || '' });
            break;
          case 'image':
            section.content.push({ type: 'image', href: element.getAttribute('xlink:href') || '' });
            break;
          case 'poem':
            section.content.push({ type: 'poem', poem: this.parsePoem(element) });
            break;
          case 'section':
            section.subsections.push(this.parseSection(element));
            break;
        }
      }
    });

    return section;
  }

  parsePoem(poemNode: Element): Poem {
    const poem: Poem = {
      title: null,
      stanzas: [],
    };

    const titleNode = poemNode.querySelector('title');
    if (titleNode) {
      poem.title = titleNode.textContent;
    }

    poemNode.querySelectorAll('stanza').forEach((stanzaNode) => {
      const stanza: Stanza = {
        lines: Array.from(stanzaNode.querySelectorAll('v')).map((v) => v.textContent || ''),
      };
      poem.stanzas.push(stanza);
    });

    return poem;
  }

  parse(content: string): any {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(content, 'text/xml');

    const book: Book = {
      titleInfo: undefined,
      documentInfo: undefined,
      publishInfo: undefined,
      customInfo: [],
      bodies: [],
      binaries: [],
    };

    // Title Info
    const titleInfoNode = xmlDoc.querySelector('title-info');
    if (titleInfoNode) {
      book.titleInfo = {
        genres: Array.from(titleInfoNode.querySelectorAll('genre')).map(
          (node) => node.textContent ?? '',
        ),
        author: {
          firstName: titleInfoNode.querySelector('author > first-name')?.textContent ?? undefined,
          middleName: titleInfoNode.querySelector('author > middle-name')?.textContent ?? undefined,
          lastName: titleInfoNode.querySelector('author > last-name')?.textContent ?? undefined,
        },
        bookTitle: titleInfoNode.querySelector('book-title')?.textContent ?? undefined,
        annotation: titleInfoNode.querySelector('annotation')?.textContent ?? undefined,
        keywords: titleInfoNode.querySelector('keywords')?.textContent ?? undefined,
        date: titleInfoNode.querySelector('date')?.textContent ?? undefined,
        coverpage:
          titleInfoNode.querySelector('coverpage > image')?.getAttribute('xlink:href') ?? undefined,
        lang: titleInfoNode.querySelector('lang')?.textContent ?? undefined,
        srcLang: titleInfoNode.querySelector('src-lang')?.textContent ?? undefined,
        translation: {
          firstName:
            titleInfoNode.querySelector('translator > first-name')?.textContent ?? undefined,
          middleName:
            titleInfoNode.querySelector('translator > middle-name')?.textContent ?? undefined,
          lastName: titleInfoNode.querySelector('translator > last-name')?.textContent ?? undefined,
        },
      };
    }

    // Document Info
    const documentInfoNode = xmlDoc.querySelector('document-info');
    if (documentInfoNode) {
      book.documentInfo = {
        author: {
          nickname: documentInfoNode.querySelector('author > nickname')?.textContent ?? undefined,
          homePage: documentInfoNode.querySelector('author > home-page')?.textContent ?? undefined,
          email: documentInfoNode.querySelector('author > email')?.textContent ?? undefined,
        },
        programUsed: documentInfoNode.querySelector('program-used')?.textContent ?? undefined,
        date: documentInfoNode.querySelector('date')?.textContent ?? undefined,
        id: documentInfoNode.querySelector('id')?.textContent ?? undefined,
        version: documentInfoNode.querySelector('version')?.textContent ?? undefined,
        history: documentInfoNode.querySelector('history')?.textContent ?? undefined,
      };
    }

    // Publish Info
    const publishInfoNode = xmlDoc.querySelector('publish-info');
    if (publishInfoNode) {
      book.publishInfo = {
        bookName: publishInfoNode.querySelector('book-name')?.textContent ?? undefined,
        publisher: publishInfoNode.querySelector('publisher')?.textContent ?? undefined,
        city: publishInfoNode.querySelector('city')?.textContent ?? undefined,
        year: publishInfoNode.querySelector('year')?.textContent ?? undefined,
        isbn: publishInfoNode.querySelector('isbn')?.textContent ?? undefined,
      };
    }

    // Custom Info
    xmlDoc.querySelectorAll('custom-info').forEach((node) => {
      book.customInfo.push({
        infoType: node.getAttribute('info-type') ?? '',
        content: node.textContent ?? '',
      });
    });

    // Binaries
    xmlDoc.querySelectorAll('binary').forEach((binaryNode) => {
      const binary: Binary = {
        id: binaryNode.getAttribute('id') ?? '',
        contentType: binaryNode.getAttribute('content-type') ?? '',
        content: binaryNode.textContent ?? '',
      };
      book.binaries.push(binary);
    });

    // Bodies
    xmlDoc.querySelectorAll('body').forEach((bodyNode) => {
      const body: Body = {
        name: bodyNode.getAttribute('name') ?? undefined,
        sections: this.parseSections(bodyNode),
      };
      book.bodies.push(body);
    });

    return book;
  }

  parseSections(bodyNode: Element): Section[] {
    const sections: Section[] = [];
    bodyNode.querySelectorAll('section').forEach((sectionNode) => {
      sections.push(this.parseSection(sectionNode));
    });
    return sections;
  }

  // Optionally, you can add methods for loading examples or fetching content as needed.
}

export default FB2Parser;

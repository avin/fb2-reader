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

class FB2Parser {
  parseSection(sectionNode: Element): Section {
    const section: Section = {
      title: null,
      content: [],
      subsections: []
    };

    const titleNode = sectionNode.querySelector("title");
    if (titleNode) {
      section.title = titleNode.textContent;
    }

    sectionNode.childNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        switch (element.tagName.toLowerCase()) {
          case 'p':
            section.content.push({ type: 'paragraph', text: element.textContent || '' });
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
      stanzas: []
    };

    const titleNode = poemNode.querySelector("title");
    if (titleNode) {
      poem.title = titleNode.textContent;
    }

    poemNode.querySelectorAll("stanza").forEach(stanzaNode => {
      const stanza: Stanza = {
        lines: Array.from(stanzaNode.querySelectorAll("v")).map(v => v.textContent || '')
      };
      poem.stanzas.push(stanza);
    });

    return poem;
  }

  parse(content: string): any {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(content, "text/xml");

    const book: any = {
      titleInfo: null,
      documentInfo: null,
      publishInfo: null,
      customInfo: [],
      bodies: [],
      binaries: []
    };

    // Title Info
    const titleInfoNode = xmlDoc.querySelector("title-info");
    if (titleInfoNode) {
      book.titleInfo = {
        genres: Array.from(titleInfoNode.querySelectorAll("genre")).map(node => node.textContent),
        author: {
          firstName: titleInfoNode.querySelector("author > first-name")?.textContent,
          middleName: titleInfoNode.querySelector("author > middle-name")?.textContent,
          lastName: titleInfoNode.querySelector("author > last-name")?.textContent
        },
        bookTitle: titleInfoNode.querySelector("book-title")?.textContent,
        annotation: titleInfoNode.querySelector("annotation")?.textContent,
        keywords: titleInfoNode.querySelector("keywords")?.textContent,
        date: titleInfoNode.querySelector("date")?.textContent,
        coverpage: titleInfoNode.querySelector("coverpage > image")?.getAttribute("xlink:href"),
        lang: titleInfoNode.querySelector("lang")?.textContent,
        srcLang: titleInfoNode.querySelector("src-lang")?.textContent,
        translation: {
          firstName: titleInfoNode.querySelector("translator > first-name")?.textContent,
          middleName: titleInfoNode.querySelector("translator > middle-name")?.textContent,
          lastName: titleInfoNode.querySelector("translator > last-name")?.textContent,
        },
      };
    }

    // Document Info
    const documentInfoNode = xmlDoc.querySelector("document-info");
    if (documentInfoNode) {
      book.documentInfo = {
        author: {
          nickname: documentInfoNode.querySelector("author > nickname")?.textContent,
          homePage: documentInfoNode.querySelector("author > home-page")?.textContent,
          email: documentInfoNode.querySelector("author > email")?.textContent
        },
        programUsed: documentInfoNode.querySelector("program-used")?.textContent,
        date: documentInfoNode.querySelector("date")?.textContent,
        id: documentInfoNode.querySelector("id")?.textContent,
        version: documentInfoNode.querySelector("version")?.textContent,
        history: documentInfoNode.querySelector("history")?.textContent,
      };
    }

    // Publish Info
    const publishInfoNode = xmlDoc.querySelector("publish-info");
    if (publishInfoNode) {
      book.publishInfo = {
        bookName: publishInfoNode.querySelector("book-name")?.textContent,
        publisher: publishInfoNode.querySelector("publisher")?.textContent,
        city: publishInfoNode.querySelector("city")?.textContent,
        year: publishInfoNode.querySelector("year")?.textContent,
        isbn: publishInfoNode.querySelector("isbn")?.textContent,
      };
    }

    // Custom Info
    xmlDoc.querySelectorAll("custom-info").forEach(node => {
      book.customInfo.push({
        infoType: node.getAttribute("info-type"),
        content: node.textContent
      });
    });

    // Binaries
    xmlDoc.querySelectorAll("binary").forEach(binaryNode => {
      const binary = {
        id: binaryNode.getAttribute("id"),
        contentType: binaryNode.getAttribute("content-type"),
        content: binaryNode.textContent
      };
      book.binaries.push(binary);
    });

    // Bodies
    xmlDoc.querySelectorAll("body").forEach(bodyNode => {
      const body = {
        name: bodyNode.getAttribute("name"),
        sections: this.parseSections(bodyNode)
      };
      book.bodies.push(body);
    });

    return book;
  }

  parseSections(bodyNode: Element): Section[] {
    const sections: Section[] = [];
    bodyNode.querySelectorAll("section").forEach(sectionNode => {
      sections.push(this.parseSection(sectionNode));
    });
    return sections;
  }

  // Optionally, you can add methods for loading examples or fetching content as needed.
}

export default FB2Parser;
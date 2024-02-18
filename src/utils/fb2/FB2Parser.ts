import fxparser from 'fast-xml-parser';

class FB2Parser {
  parse(content: string): any {
    const parser = new fxparser.XMLParser({
      ignoreAttributes: false,
      preserveOrder: true,
    });
    return parser.parse(content);
  }
}

export default FB2Parser;

export interface DOMParserOptions {
  delimiters?: [string, string]
  isVoidTag?: (tag: string) => boolean
}

export const parserOptions: DOMParserOptions = {
  delimiters: ['{{', '}}'],
  isVoidTag: tag => {
    const voidTags = ['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']
    return voidTags.includes(tag)
  }
}

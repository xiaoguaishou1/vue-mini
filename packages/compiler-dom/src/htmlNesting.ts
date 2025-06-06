export function isVoidTag(tag: string): boolean {
  const voidTags = ['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']
  return voidTags.includes(tag)
}

export function isValidHTMLNesting(tag: string, parent: string): boolean {
  if (parent === 'p' && isVoidTag(tag)) return false
  return true
}

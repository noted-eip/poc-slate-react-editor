// This example is for an Editor with `ReactEditor` and `HistoryEditor`
import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

export type ParagraphElement = {
  type: 'paragraph'
  children: CustomText[]
}

export type HeadingElement = {
  type: 'heading'
  level: number
  children: CustomText[]
}

export type CodeElement = {
  type: 'code'
  children: CustomText[]
}

export type CustomElement = ParagraphElement | HeadingElement | CodeElement

export type FormattedText = { text: string; bold?: true }

export type CustomText = FormattedText

export type CustomNode = Node | CustomElement

declare module 'slate' {
  // only possible to extend Editor, Element and Text
  // experimental for Selection, Range, and Point
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText
  }
}
import { Editor, Text, Element, Transforms } from "slate"

export const CustomEditor = {
    isBigMarkActive(editor: Editor) {
        const [match]: any = Editor.nodes(editor, {
          match: n => Text.isText(n) && n.big === true,
          universal: true,
        })
        return !!match
      },

    isRedMarkActive(editor: Editor) {
        const [match]: any = Editor.nodes(editor, {
          match: n => Text.isText(n) && n.red === true,
          universal: true,
        })
        return !!match
      },

    isUnderlineMarkActive(editor: Editor) {
        const [match]: any = Editor.nodes(editor, {
          match: n => Text.isText(n) && n.underline === true,
          universal: true,
        })
        return !!match
      },

    isItalicMarkActive(editor: Editor) {
        const [match]: any = Editor.nodes(editor, {
          match: n => Text.isText(n) && n.italic === true,
          universal: true,
        })
        return !!match
      },

    isBoldMarkActive(editor: Editor) {
      const [match]: any = Editor.nodes(editor, {
        match: n => Text.isText(n) && n.bold === true,
        universal: true,
      })
      return !!match
    },
  
    isCodeBlockActive(editor: Editor) {
      const [match]: any = Editor.nodes(editor, {
        match: n => Element.isElement(n) && n.type === 'code',
      })
      return !!match
    },

    toggleBigMark(editor: Editor) {
        const isActive = CustomEditor.isBigMarkActive(editor)
        Transforms.setNodes(
          editor,
          { big: isActive ? undefined : true },
          { match: n => Text.isText(n), split: true }
        )
      },

    toggleRedMark(editor: Editor) {
    const isActive = CustomEditor.isRedMarkActive(editor)
    Transforms.setNodes(
        editor,
        { red: isActive ? undefined : true },
        { match: n => Text.isText(n), split: true }
    )
    },

    toggleUnderlineMark(editor: Editor) {
        const isActive = CustomEditor.isUnderlineMarkActive(editor)
        Transforms.setNodes(
          editor,
          { underline: isActive ? undefined : true },
          { match: n => Text.isText(n), split: true }
        )
      },

    toggleItalicMark(editor: Editor) {
        const isActive = CustomEditor.isItalicMarkActive(editor)
        Transforms.setNodes(
          editor,
          { italic: isActive ? undefined : true },
          { match: n => Text.isText(n), split: true }
        )
      },
  
    toggleBoldMark(editor: Editor) {
      const isActive = CustomEditor.isBoldMarkActive(editor)
      Transforms.setNodes(
        editor,
        { bold: isActive ? undefined : true },
        { match: n => Text.isText(n), split: true }
      )
    },
  
    toggleCodeBlock(editor: Editor) {
      const isActive = CustomEditor.isCodeBlockActive(editor)
      Transforms.setNodes(
        editor,
        { type: isActive ? undefined : 'code' },
        { match: n => Editor.isBlock(editor, n) }
      )
    },
  }
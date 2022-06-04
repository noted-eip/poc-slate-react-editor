import React, { useCallback, useMemo } from 'react'
import { Text, Element, createEditor, Descendant, Editor, Transforms } from 'slate'
import { Slate, Editable, withReact, RenderElementProps, RenderLeafProps } from 'slate-react'

const CustomEditor = {
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

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
]

const App = () => {
  const editor = useMemo(() => withReact(createEditor()), [])

  const initialValue = useMemo(
    () => {
      const content: string | null = localStorage.getItem('content');
      return content ? JSON.parse(content) : 
        [{
          type: 'paragraph',
          children: [{ text: 'A line of text in a paragraph.' }],
        }]
    }, []
      
  )

  const renderElement = useCallback((props: RenderElementProps) => {
      switch (props.element.type) {
          case 'code':
            return <CodeElement {...props} />
          default:
            return <DefaultElement {...props} />
          }
  }, [])

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />
  }, [])

  return (
    <Slate
      editor={editor}
      value={initialValue}
      onChange={value => {
        const isAstChange = editor.operations.some(
          op => 'set_selection' !== op.type
        )
        if (isAstChange) {
          const content = JSON.stringify(value)
          localStorage.setItem('content', content)
        }
      }}>
        <div>
          <button onMouseDown={event => {
            event.preventDefault()
            CustomEditor.toggleBoldMark(editor) }}>
              Bold
          </button>
          <button onMouseDown={event => {
            event.preventDefault()
            CustomEditor.toggleCodeBlock(editor) }}>
              Code
          </button>
        </div>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={event => {
            if (!event.ctrlKey) {
              return
            }

            // Replace the `onKeyDown` logic with our new commands.
            switch (event.key) {
              case '`': {
                event.preventDefault()
                CustomEditor.toggleCodeBlock(editor)
                break
              }

              case 'b': {
                event.preventDefault()
                CustomEditor.toggleBoldMark(editor)
                break
              }
            }
          }}
        />
    </Slate>
  )
}

const CodeElement = (props: RenderElementProps) => {
    return (
        <pre {...props.attributes}>
            <code>{props.children}</code>
        </pre>
    );
}

const DefaultElement = (props: RenderElementProps) => {
    return (<p {...props.attributes}>{props.children}</p>);
}

const Leaf = (props: RenderLeafProps) => {
  return (
    <span
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal' }}
    >
      {props.children}
    </span>
  );
}

export default App;
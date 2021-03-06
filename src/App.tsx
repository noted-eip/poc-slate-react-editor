import React, { useCallback, useMemo } from 'react'
import { createEditor, Descendant } from 'slate'
import { Slate, Editable, withReact, RenderElementProps, RenderLeafProps } from 'slate-react'
import { CustomEditor } from './editor'

const placeholder: Descendant[] = [
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
      return content ? JSON.parse(content) : placeholder;
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
            CustomEditor.toggleBigMark(editor) }}>
              Big
          </button>
          <button onMouseDown={event => {
            event.preventDefault()
            CustomEditor.toggleRedMark(editor) }}>
              Red
          </button>
        <button onMouseDown={event => {
            event.preventDefault()
            CustomEditor.toggleUnderlineMark(editor) }}>
              Underline
          </button>
        <button onMouseDown={event => {
            event.preventDefault()
            CustomEditor.toggleItalicMark(editor) }}>
              Italic
          </button>
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
              case 'u': {
                event.preventDefault()
                CustomEditor.toggleUnderlineMark(editor)
                break
              }

              case 'i': {
                event.preventDefault()
                CustomEditor.toggleItalicMark(editor)
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
      style={{
        fontWeight: props.leaf.bold ? 'bold' : 'normal',
        fontSize: props.leaf.big ? 25 : 16,
        fontStyle: props.leaf.italic ? 'italic' : 'normal',
        textDecorationLine: props.leaf.underline ? 'underline' : 'none',
        color: props.leaf.red ? 'red' : 'black'
      }}
    >
      {props.children}
    </span>
  );
}

export default App;
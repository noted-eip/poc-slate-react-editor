import React, { useCallback, useMemo } from 'react'
import { Text, Element, createEditor, Descendant, Editor, Transforms } from 'slate'
import { Slate, Editable, withReact, RenderElementProps, RenderLeafProps } from 'slate-react'

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
]

const App = () => {
  const editor = useMemo(() => withReact(createEditor()), [])

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
    <Slate editor={editor} value={initialValue}>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={event => {
            if (!event.ctrlKey) {
              return
            }
  
            switch (event.key) {
              case '`': {
                event.preventDefault()
                const [match]: any = Editor.nodes(editor, {
                  match: n => Element.isElement(n) && n.type === 'code'
                })
                
                Transforms.setNodes(
                  editor,
                  { type: match ? 'paragraph' : 'code' },
                  { match: n => Editor.isBlock(editor, n) }
                )
                break
              }
  
              case 'b': {
                event.preventDefault()
                const [match]: any = Editor.nodes(editor, {
                  match: n => Text.isText(n) && n.bold === true
                })
                Transforms.setNodes(
                  editor,
                  { bold: match ? undefined : true },
                  { match: n => Text.isText(n), split: true }
                )
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


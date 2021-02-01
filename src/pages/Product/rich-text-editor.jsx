// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { EditorState, convertToRaw, ContentState } from 'draft-js';
// import { Editor } from 'react-draft-wysiwyg';
// import draftToHtml from 'draftjs-to-html';
// import htmlToDraft from 'html-to-draftjs';
// // import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
// import 'draft-js/dist/Draft.css';


// export default class RichTextEditor extends Component {
//     static propType = {
//         detail: PropTypes.string
//     }
//     state = {
//         editorState: EditorState.createEmpty(), // 创建一个没有内容的编辑对象
//       }
//     constructor(props) {
//         super(props);
//         const html = this.props.detail;
//         let editorState
//         if (html) {
//             const contentBlock = htmlToDraft(html);
//             if (contentBlock) {
//                 const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
//                 const editorState = EditorState.createWithContent(contentState);
//                 this.state = {
//                     editorState,
//                 };
//             } else {
//                 this.state = {
//                     editorState: EditorState.createEmpty(),  //创建了一个没有内容的编辑对象
//                 }
//             }
//         }

//     }
//     uploadImageCallBack = (file) => {
//         return new Promise(
//             (resolve, reject) => {
//                 const xhr = new XMLHttpRequest()
//                 xhr.open('POST', '/manage/img/upload')
//                 xhr.setRequestHeader('Authorization', 'Client-ID XXXXX')
//                 const data = new FormData()
//                 data.append('image', file)
//                 xhr.send(data)
//                 xhr.addEventListener('load', () => {
//                     const response = JSON.parse(xhr.responseText)
//                     const url = response.data.url
//                     resolve({data: {link:url}})
//                 });
//                 xhr.addEventListener('error', () => {
//                     const error = JSON.parse(xhr.responseText);
//                     reject(error)
//                 });
//             }
//         )
//     }

//     onEditorStateChange = (editorState) => {
//         this.setState({
//             editorState,
//         });
//     };
//     getDetail = () => {
//         return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
//     }

//     render() {
//         const { editorState } = this.state;
//         return (
//             <div>
//                 <Editor
//                     editorState={editorState}
//                     editorStyle={{ border: '1px solid black', minHeight: 200, paddingLeft: 20 }}
//                     onEditorStateChange={this.onEditorStateChange}
//                     toolbar={{
//                         image: {
//                           urlEnabled: true,
//                           uploadEnabled: true,
//                           alignmentEnabled: true,   // 是否显示排列按钮 相当于text-align
//                           uploadCallback: this.uploadImageCallBack,
//                           previewImage: true,
//                           inputAccept: 'image/*',
//                           alt: {present: false, mandatory: false,previewImage: true}
//                         },
//                       }}
//                 />
//             </div>
//         );
//     }
// }
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Upload,Modal,message } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import { reqDeleteImg } from '../../api'
import {BASE_IMG_URL} from '../../utils/constant'



export default class PicturesWall extends Component {
    static propTypes = {
        imgs: PropTypes.array
    }
    constructor(props) {
        super(props)
        let fileList = []
        const {imgs} = this.props
        // console.log('.....', imgs)
        if(imgs && imgs.length > 0) {
            fileList = imgs.map((img, index) => ({
                uid: -index,
                name: img,
                status: "done",
                url: BASE_IMG_URL + img
            }))
        }
        this.state = { 
            previewVisible: false,  //标识是否显示大图预览
            previewImage: '', //显示大图
            fileList 
        }
    }

    getImgs = () => {
        return this.state.fileList.map(file => file.name)
    }
    /**
     * 隐藏Modal
     */
    handleCancel = () => this.setState({previewVisible: false})
    
    handlePreview = file => {
        this.setState({
            previewImage:file.url || file.thumbUrl,
            previewVisible: true,
        })
    }
    /**
     * file当前操作的图片文件（上传/删除）
     *  fileList: 所有已上传图片文件对象的数组
     */
    handeleChange = async ({ file, fileList }) => {
        // console.log('handleChange()', file, fileList)
        if(file.status == 'done') {
            const result = file.response  //{status: 0, data:{name: 'xxx.jpg', url:'图片地址'}}
            if(result.status === 0) {
                message.success('上传图片成功')
                const {name, url} = result.data
                file = fileList[fileList.length - 1]
                file.name = name
                file.url = url
            } else {
                message.error('上传图片失败')
            }
        } else if(file.status === 'removed') {
            //删除图片
            const result = await reqDeleteImg(file.name)
            if( result.status === 0) {
                message.success('删除图片成功')
            } else {
                message.error('删除图片失败')
            }
           
        }
        this.setState({ fileList })
    };

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div>
                <Upload
                    action="/manage/img/upload" //上传图片的接口
                    accept='image'
                    listType="picture-card"
                    fileList={fileList} //所有已上传图片文件对象的数组
                    name='image' 
                    onChange={this.handeleChange}
                    onPreview={this.handlePreview}>
                    {fileList.length >=3 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img src={previewImage} style={{ width: '100%'}} alt=""/>
                </Modal>
            </div>
        );
    }
}

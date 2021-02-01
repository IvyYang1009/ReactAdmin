import React, { Component } from 'react'
import {
    Card,
    Table,
    Button,
    message,
    Breadcrumb,
    Modal
} from 'antd'
import { PlusOutlined} from '@ant-design/icons';
import LinkButton from '../../components/link-button'
import { reqCategorys, reqAddCategory, reqUpdateCategory } from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'
/**
 * 商品分类路由
 */

export default class Category extends Component {
    
    state = {

        loading: false,
        categorys: [], //一级分类列表
        subCategorys: [], //二级分类列表
        parentId: '0', // 当前需要显示的分类列表ID
        parentName: '',
        isAddModalVisible: false,
        iUpdateModalVisible: false
    }
    /**
     * 获取一级分类列表和二级分类列表
     */
    getCategorys = async () => {
        this.setState({ loading: true })
        const { parentId } = this.state
        const result = await reqCategorys(parentId)
        this.setState({ loading: false })

        if (result.status === 0) {
            //取出分类的数组(可能是一级也有可能是二级)
            const categorys = result.data
            if (parentId === '0') {
                //更新状态
                this.setState({
                    categorys: categorys
                })
            } else {
                this.setState({
                    subCategorys: categorys
                })
            }

        } else {
            message.error('失败')
        }
    }
    /**
     * 发送异步ajax请求
     */
    componentDidMount() {
        //获取一级分类列表显示
        this.getCategorys()
    }
    /**
     * 
     * 获取二级列表
     */
    showSubCategorys = (category) => {
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => { //重新render()后执行
            console.log(this.state.parentId)
            this.getCategorys()
        })
       
    }
    /**
     * 显示一级分类列表
     */
    showCategorys = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: []
        })
    }
    /**
     * 点击取消
     */
    handleCancel = () => {
        //清除输入数据
        this.form.resetFields()
        console.log(this.form.getFieldsValue())
        //隐藏form
        this.setState({
            isAddModalVisible: false,
            isUpdateModalVisible: false
        })
    }
    /**
     * 显示添加对话框
     */
    showAdd = () => {
        this.setState({
            isAddModalVisible: true
        })
    }
    /**
     * 显示更新提示框
     */
    showUpdate = (category) => {
        //保存状态
        this.category = category
        this.setState({
            isUpdateModalVisible: true
        })
         
    }
    /**
     * 添加
     */
    addCategory = () => {
        this.setState({
            isAddModalVisible: true
        })
    }
    /**
     * 更新
     */
    updateCategory = async () => {
        //隐藏提示框
        this.setState({
            isUpdateModalVisible: false
        })
        const categoryId = this.category._id
        const categoryName = this.form.getFieldValue('categoryName')
        //清除输入数据
        this.form.resetFields()
        //发送请求更新
        const result = await reqUpdateCategory({categoryId,categoryName})
        if(result.status === 0) {
            //刷新显示更改后的信息
            this.getCategorys()
        }
    }

    render() {
        //读取状态数据
        const { categorys, subCategorys, parentId, parentName, loading, isAddModalVisible, isUpdateModalVisible } = this.state
        const category = this.category || {}
        const title = parentId === '0' ? '一级分类列表' : (
            <Breadcrumb separator=">">
                <Breadcrumb.Item onClick={this.showCategorys}>一级分类列表</Breadcrumb.Item>
                <Breadcrumb.Item>{parentName}</Breadcrumb.Item>
            </Breadcrumb>
        )
        const extra = (
            <Button icon={<PlusOutlined />} type='primary' onClick={this.showAdd}>
                添加
            </Button>
        )
      
        const columns = [
            {
                title: '分类的名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                width: 300,
                render: (category) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
                        {this.state.parentId === '0' ? <LinkButton onClick={() => { this.showSubCategorys(category) }}>查看子分类</LinkButton> : null}

                    </span>
                )
            },

        ];
        return (
            <>
                <Card title={title} extra={extra}>
                    <Table
                        bordered
                        rowKey='_id'
                        dataSource={parentId === '0' ? categorys : subCategorys}
                        columns={columns}
                        pagination={{ defaultPageSize: 5, showQuickJumper: true }}
                        loading={loading} />


                    <Modal title="添加分类" visible={isAddModalVisible} onOk={this.addCategory} onCancel={this.handleCancel}>
                        <AddForm></AddForm>
                    </Modal>

                    <Modal title="更新分类" visible={isUpdateModalVisible} onOk={this.updateCategory} onCancel={this.handleCancel}>
                        <UpdateForm 
                            categoryName={category.name} 
                            setForm = {(form) => {this.form = form}}>
                        </UpdateForm>
                    </Modal>

                </Card>

            </>
        )
    }
}

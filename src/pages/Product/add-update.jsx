import React, { Component } from 'react'
import {
    Card,
    Form,
    Input,
    Cascader,
    Upload,
    Button,
    message

} from 'antd'
import PicturesWall from './pictures-wall'
import { ArrowLeftOutlined } from '@ant-design/icons'
import LinkButton from '../../components/link-button'
import { reqCategorys, reqAddOrUpdateProduct } from '../../api'
// import RichTextEditor from './rich-text-editor'
const { Item } = Form
const { TextArea } = Input

/**
 * 添加和更新子路由组件
 */
const formItemLayout = {
    labelCol: {
        span: 3,
    },
    wrapperCol: {
        span: 14,
    },
};

export default class ProductAddUpdate extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef()
        this.pw = React.createRef()
        this.editor = React.createRef()
        this.state = {
            options: [],
        }
    }

    initOptions = async (categorys) => {
        //categorys 是一个数组，生成一个新数组
        const options = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false,
        }))
        const { isUpdate, product } = this
        const { pCategoryId } = product
        if (isUpdate && pCategoryId !== '0') {
            const subCategorys = await this.getCategorys(pCategoryId)
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }))
            const targetOption = options.find(option => option.value === pCategoryId)
            targetOption.children = childOptions
        }
        this.setState({
            options
        })
    }

    /**
     * 获取一级、二级分类列表
     */
    getCategorys = async (parentId) => {
        const result = await reqCategorys(parentId)
        if (result.status === 0) {
            const categorys = result.data
            //如果是一级分类
            if (parentId === '0') {
                this.initOptions(categorys)
            } else { //获取二级分类列表
                return categorys //返回二级列表 
            }
        }
    }
    /**
     * 用于加载下一级列表的回调函数
     */
    loadData = async selectedOptions => {
        const targetOption = selectedOptions[0]
        targetOption.loading = true
        //根据选中的分类，请求下一级分类列表
        const subCategorys = await this.getCategorys(targetOption.value)
        targetOption.loading = false
        if (subCategorys && subCategorys.length > 0) {
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }))
            targetOption.children = childOptions
        } else {
            targetOption.isLeaf = true
        }

        this.setState({
            options: [...this.state.options]
        })

    }
    /**
     * 自定义校验价格是否为数字
     */
    validatePrice = (_, value) => {
        if (value * 1 > 0) {
            return Promise.resolve()
        }
        return Promise.reject('价格必须是数字且大于0')

    }
    /**
     * 提交表单发起验证
     */
    submit = () => {
        //进行表单验证，如果通过了，发送请求
        this.formRef.current.validateFields().then(async values => {
            const { name, desc, price, categoryIds } = values
            // console.log(categoryIds)
            let pCategoryId, categoryId
            if (categoryIds.length === 1) {
                pCategoryId = '0'
                categoryId = categoryIds[0]
            } else {
                categoryId = categoryIds[0]
                categoryId = categoryIds[1]
            }
            const imgs = this.pw.current.getImgs()
            const detail = this.editor.current.getDetail()
            const product = { name, desc, price, imgs, detail, pCategoryId, categoryId }
            //如果是更新要添加_id
            if (this.isUpdate) {
                product._id = this.product._id
            }
            const result = await reqAddOrUpdateProduct(product)
            if (result.status === 0) {
                message.success(`${this.isUpdate ? '更新' : '添加'}成功`)
                this.props.history.goBack()
            } else {
                message.error(`${this.isUpdate ? '更新' : '添加'}失败`)
            }
        })
    }
    onChange = e => {
        console.log(e);
    }
    /**
     * 获取表单所有信息
     */
    componentDidMount() {
        this.getCategorys('0')
        // console.log(this.formRef.current.getFieldsValue())
    }
    componentWillMount() {
        const product = this.props.location.state
        //保存是否是更新的标识
        this.isUpdate = !!product
        //保存商品（如果没有，保存的是{}）
        this.product = product || {}
    }


    render() {
        const { isUpdate, product } = this
        const { pCategoryId, categoryId, imgs, detail } = product
        // console.log('1111111', product)
        const categoryIds = []
        if (isUpdate) {
            if (pCategoryId === '0') {
                categoryIds.push(categoryId)
            } else {
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }
        const title = (
            <span>
                <LinkButton onClick={() => { this.props.history.go(-1) }}>
                    <ArrowLeftOutlined style={{ marginRight: 10, fontSize: 20 }} />
                </LinkButton>
                <span>{isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        )
        return (
            <Card title={title}>
                <Form   {...formItemLayout} ref={this.formRef}>
                    <Item label="商品名称"
                        name="name"
                        rules={[{ required: true, message: '必须输入商品名称' }]}
                        initialValue={this.product.name}>
                        <Input placeholder="请输入商品名称" />
                    </Item>
                    <Item label="商品描述"
                        name="desc"
                        rules={[{ required: true, message: '必须输入商品描述' }]}
                        initialValue={this.product.desc}>
                        <TextArea
                            onChange={this.onChange}
                            placeholder="请输入商品描述信息"
                            autoSize={{ minRows: 3, maxRows: 5 }} />
                    </Item>
                    <Item label="商品价格"
                        name="price"
                        rules={[
                            { required: true, message: '必须输入商品价格' },
                            { validator: this.validatePrice }
                        ]}
                        initialValue={this.product.price}>
                        <Input prefix="￥" suffix="RMB" placeholder="请输入商品价格" />
                    </Item>
                    <Item label="商品分类"
                        name="categoryIds"
                        rules={[{ required: true }]}
                        initialValue={categoryIds}>
                        <Cascader
                            options={this.state.options}
                            loadData={this.loadData}
                        />
                    </Item>
                    <Item label="商品图片"
                        name="img"
                    // rules={[{ required: true, message: '必须上传商品图片' }]}
                    >
                        <PicturesWall ref={this.pw} imgs={imgs} />
                    </Item>
                    <Item label="商品详情"
                        name="description"
                        labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
                        {/* <RichTextEditor ref={this.editor} detail={detail} /> */}
                    </Item>
                    <Item>
                        <Button type="primary" onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}

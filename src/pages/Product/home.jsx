import React, { Component } from 'react'
import {
    Card,
    Select,
    Input,
    Button,
    Table,
    message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import LinkButton from '../../components/link-button/index'
import {reqProducts, reqSearchProducts, reqUpdateStatus} from '../../api'
import { PAGE_SIZE } from '../../utils/constant'
const Option = Select.Option
export default class ProductHome extends Component {
    state = {
        total: 0,//商品的总数量
        products: [],
        loading: false,
        searchName: '', //搜索的关键字
        searchType: 'productName', //根据哪个字段搜索 默认商品名称
    }
    /**
     * 初始化列数组
     */
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                width: 100,
                title: '价格',
                dataIndex: 'price',
                render: (price) => '￥' + price
            },
            {
                width: 100,
                title: '状态',
                // dataIndex: 'status',
                render: (product) => {
                    const {status, _id} = product
                    return (
                        <span>
                            <Button  
                                type="primary" 
                                onClick={() => this.updateStatus(_id, status === 0 ? 1 : 0)}>{status === 0 ? '下架': '上架'}
                            </Button>
                            <span>{status === 0 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                width: 100,
                title: '操作',
                render: (product) => {
                    return (
                        <span>
                            <LinkButton onClick = {() => {this.props.history.push('/product/detail', product)}}>详情</LinkButton>
                            <LinkButton onClick = {() => {this.props.history.push('/product/addupdate', product)}}>修改</LinkButton>
                        </span>
                    )
                }
            },
        ];
    }
    /**
     * 获取指定页码的列表数据显示
     */
    getProducts = async (pageNum) => {
        this.pageNum = pageNum
        this.setState({loading: true})
        const {searchName, searchType} = this.state
        //如果搜索关键词有值，说明我们要搜索分页
        let result
        if(searchName) { //搜索分页
            result = await reqSearchProducts({pageNum, pageSize: PAGE_SIZE, searchName, searchType})
        }  else { //一般分页
            result = await reqProducts(pageNum, PAGE_SIZE)
        }
        this.setState({loading: false})
        if(result.status === 0) {
            //取出分页数据
            const {total, list} = result.data
            this.setState({
                total,
                products: list
            })
        }
    }
    componentWillMount () {
        this.initColumns()
    }
    componentDidMount () {
        this.getProducts(1)
    }
    /**
     * 更新指定商品的状态
     */
    updateStatus = async (productId, status) => {
        const result = await reqUpdateStatus(productId,status)
        if(result.status === 0) {
            message.success('更新商品成功')
            this.getProducts(this.pageNum)
        }
    }
    render() {
        const {products, total, loading, searchType, searchName } = this.state
        const title = (
            <span>
                <Select 
                    value = {searchType} 
                    style = {{ width: 150 }} 
                    onChange = {value => this.setState({searchType: value})}
                    >
                    <Option value='productName'>按名字搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input 
                    placeholder="关键字" 
                    style={{ width: 150, margin: '0 15px' }} 
                    value={searchName}
                    onChange = {event => this.setState({searchName: event.target.value})}
                    />
                <Button type="primary" onClick={() => this.getProducts(1)}>搜索</Button>
            </span>
        )
        const extra = (
            <Button icon={<PlusOutlined />} type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
                添加商品
            </Button>
        )
      

      
        return (
            <Card title={title} extra={extra}>
                <Table 
                rowKey = '_id'
                bordered
                loading = {loading}
                dataSource={products} 
                columns={this.columns}
                pagination={{
                    current: this.pageNum,
                    defaultPageSize: PAGE_SIZE, 
                    showQuickJumper: true,
                    total,
                    onChange: (pageNum) => {this.getProducts(pageNum)}
                    }} />
            </Card>
        )
    }
}

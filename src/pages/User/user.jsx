import React, { Component } from 'react'
import {
    Card,
    Button,
    Table,
    Modal,
    message
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import LinkButton from '../../components/link-button'
import { reqUsers, reqDeleteUser, reqAddOrUpdateUser } from '../../api'
import { PAGE_SIZE } from '../../utils/constant'
import { formateDate } from '../../utils/dateUtils'
import UserForm from './user-form'
/**
 * 用户路由
 */
export default class User extends Component {
    state = {
        users: [], //获取所有用户
        roles: [], //获取所有角色
        isShow: false //是否显示确认框
    }
    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username',
            },
            {
                title: '邮箱',
                dataIndex: 'email',
            },
            {
                title: '电话',
                dataIndex: 'phone',
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                render: (role_id) => this.roleNames[role_id]
                // {
                //     return this.state.roles.find(role =>role._id === role_id).name
                // } 
            },
            {
                title: '操作',
                render: (users) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(users)}>修改</LinkButton>
                        <LinkButton onClick={() => this.deleteUser(users)}>删除</LinkButton>
                    </span>
                )
            }
        ]
    }
    /**
     * 展示更新
     */
    showUpdate = (users) => {
        this.users = users
        this.setState({
            isShow: true
        })
    }
    /**
     *展示新增用户
     */
    showAdd = () => {
        this.users = null
        this.setState({
            isShow: true
        })
    }
    /**
     * 点击comfirm删除用户
     */
    deleteUser = (users) => {
        Modal.confirm({
            title: `确认删除${users.username}`,
            icon: <ExclamationCircleOutlined />,
            onOk: async () => {
                const result = await reqDeleteUser(users._id)
                if(result.status === 0) {
                    message.success('删除成功')
                    this.getUsers()
                } 
              },
        });
    }
    /**
     * 点击OK修改或者添加用户
     */
    addOrUpdateUser = () => {
        this.setState({isShow:false})
        this.form.validateFields().then(async user => {
            this.form.resetFields()
            if(this.users) {
                user._id = this.users._id
            }
            const result = await reqAddOrUpdateUser(user)
            if(result.status === 0) {
                message.success(`${this.users ? '修改': '添加'}用户成功`)
                this.getUsers()
            }
        })
        
    }

    /**
     * 获取roleName
     */
    initalRoleNames = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})
        this.roleNames = roleNames
    }

    /**
     * 获取所有用户列表
     */
    getUsers = async () => {
        const result = await reqUsers()
        if (result.status === 0) {
            const { users, roles } = result.data
            this.initalRoleNames(roles)
            this.setState({
                users,
                roles
            })
        }
    }
    componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getUsers()
    }
    render() {
        const { users, isShow, roles } = this.state
        const user = this.users || {}
        const title = <Button type='primary' onClick={this.showAdd}>创建用户</Button>
        return (
            <Card title={title}>
                <Table
                    dataSource={users}
                    columns={this.columns}
                    bordered
                    pagination={{ defaultPageSize: PAGE_SIZE}}
                    rowKey='_id'
                />
                <Modal
                    title={user._id ? '更改用户' : '添加用户'}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => {
                        console.log(this.form)
                        this.form.resetFields()
                        console.log(this.form)
                        this.setState({ isShow: false })
                    }}
                >
                    <UserForm setForm={form => this.form = form} 
                                roles={roles}
                                users={user}
                    />
                </Modal>
            </Card>
        )
    }
}

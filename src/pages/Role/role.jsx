import React, { Component } from 'react'
import {
    Card,
    Button,
    Table,
    Modal,
    message
  } from 'antd'
import { PAGE_SIZE } from '../../utils/constant'
import { reqRoles,  reqAddRole, reqUpdateRole} from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import {formateDate} from '../../utils/dateUtils'
/**
 * 角色管理路由
 */
export default class Role extends Component {
    state = { 
        roles: [], //所有角色的列表
        role: {}, //选中的role
        isShowAdd: false, //是否显示添加界面
        isShowAuth: false //是否显示设置权限界面
    }
    constructor(props) {
        super(props)
        this.auth = React.createRef()
    }
    /**
     * 
     * 获取角色列表
     */
    getRoles =  async () => {
        const result = await reqRoles()
        if(result.status === 0) {
            const roles = result.data
            this.setState( {
                roles
            })
        }
    }
    /**
     * 点击选中行
     */
    onRow = (role) => {
        return {
            onClick : event =>  {  // 点击行
                this.setState({
                    role
                })
                // console.log(role)
            }
        }
    }
    initColumn = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (create_time) => formateDate(create_time)
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: (auth_time) => formateDate(auth_time)

            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            }
        ]
       
    }
    /**
     * 添加角色
     */
    addRole = () => {
        console.log('111111',this.form)
        this.form.validateFields().then(async values => {
            this.setState({
                isShowAdd: false
            })
            const {roleName} = values
            this.form.resetFields()
            const result = await reqAddRole(roleName)
            if(result.status === 0) {
                message.success('添加角色成功')
                const role = result.data
                // const roles = [...this.state.roles]
                // roles.push(role)
                // this.setState({
                //     roles
                // })
                this.setState(state => ({
                    roles:[...state.roles, role]
                }))
            } else {
                message.success('添加失败')
            }
        })
        
    }
    /**
     * 更新角色权限
     */
    updateRole = async() => {
        this.setState({
            isShowAuth: false
        })
        const role = this.state.role
        const menus = this.auth.current.getMenus()
        // console.log(this.auth.current)
        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = memoryUtils.user.username
        const result = await reqUpdateRole(role) 
        if(result.status === 0 ) {
            // this.getRoles()
            if(role._id === memoryUtils.user.role_id) {
                memoryUtils.user = {}
                storageUtils.removeUser()
                this.props.history.replace('/login')
                message.success('权限变更，请重新登录')
            } else {
                message.success('设置角色成功')
                this.getRoles()
            }
        }
    }
    componentDidMount () {
        this.getRoles()
    }
    
 
    render() {
        this.initColumn()
        const {roles, role , isShowAdd,isShowAuth} = this.state
        const title = (
            <span>
                <Button type='primary' onClick={() => this.setState({isShowAdd: true})}>创建角色</Button>&nbsp;&nbsp;
                <Button type='primary' onClick={() => this.setState({isShowAuth: true})} disabled={!role._id}>设置角色权限</Button>
            </span>
        )
        return (
            <Card title={title}>
                <Table 
                    bordered
                    rowKey='_id'
                    dataSource = {roles}
                    columns={this.columns}
                    pagination={{defaultPageSize: PAGE_SIZE}}
                    rowSelection={{
                        type:'radio', 
                        selectedRowKeys: [role._id],
                        onSelect: (role) => {
                            this.setState({
                                role
                            })
                        }
                    }}
                    onRow = {this.onRow}
                />
                {/* 添加角色 */}
                <Modal
                    title='添加角色'
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel = {() => {
                        this.setState({isShowAdd: false})
                        this.form.resetFields()
                      }}
                >
                    <AddForm
                        // roleName = {roles.name} 
                        setForm = {(form) => {this.form = form}}
                    />
                </Modal>
                {/* 更新角色 */}
                <Modal
                    title='设置角色权限'
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel = {() => {
                        this.setState({isShowAuth: false})
                      }}
                >
                    <AuthForm ref={this.auth} role={role}/>
                </Modal>
            
            </Card>
        )
    }
}

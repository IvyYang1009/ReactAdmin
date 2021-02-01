import React, { Component } from 'react'
import PropTypes from 'prop-types'
import menuList from '../../config/menuConfig'
import {
    Form,
    Input,
    Tree
} from 'antd'

export default class AuthForm extends Component {
    constructor(props) {
        super(props)
        const { menus } = this.props.role
        this.state = {
            treeData: [],
            checkedKeys: menus
        }
    }
      

    static propTypes = {
        role: PropTypes.object
    }
    /**
     * 父组件获取最新数据的方法
     */
    getMenus = () => this.state.checkedKeys
    /**
     * 获取所有节点的方法
     */
    getTreeNodes = (menuList) => {
        return menuList.reduce((pre, item) => {
            var parentNodes = {
                title: item.title,
                key: item.key
            }
            if (item.children) {
                parentNodes.children = this.getTreeNodes(item.children)
            }
            pre.push(parentNodes)
            return pre
        }, [])
        //     // if (!item.children) {
        //     //     pre.push({
        //     //         title: item.title,
        //     //         key: item.key
        //     //     })
        //     // } else {
        //     //     pre.push({
        //     //         title: item.title,
        //     //         key: item.key,
        //     //         children: item.children
        //     //     })
        //     // }
        //     return pre
        // }, [])
    }

    UNSAFE_componentWillMount() {
        this.treeNodes = this.getTreeNodes(menuList)
        this.setState({
            treeData: [{title: '平台权限', key: 'auth',children: this.treeNodes}]
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        // console.log('componentWillReceiveProp', nextProps)
        const menus = nextProps.role.menus
        this.setState({
            checkedKeys: menus
        })
    }
    onSelect = () => {

    }
    /**
     * 选中某个节点时
     */
    onCheck = checkedKeys => {
        this.setState({checkedKeys})
    }
    render() {
        const Item = Form.Item
        const { role } = this.props
        const { checkedKeys, treeData } = this.state
        // console.log(role)
        return (
            <div>
                <Form>
                    <Item name='roleName' label="角色名称">
                        <Input defaultValue={role.name} disabled />
                    </Item>
                </Form>
                <Tree
                    checkable
                    defaultExpandAll={true}
                    checkedKeys={checkedKeys}
                    onSelect={this.onSelect}
                    onCheck={this.onCheck}
                    treeData={treeData}
                />
            </div>


        )
    }
}

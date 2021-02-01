import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import logo from '../../assets/images/logo.png'
import './index.less'
import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils'
 
const { Sider } = Layout;
const { SubMenu } = Menu;


class LeftNav extends Component {
    state = {
        collapsed: false,
    };
    // map 方法遍历
    // getMenuNodes_map = (menuList) => {
    //     return menuList.map((item) => {
    //         if (!item.children) {
    //             return (
    //                 <Menu.Item key={item.key} icon={item.icon}>
    //                     <Link to={item.key}>
    //                         <span>{item.title}</span>
    //                     </Link>
    //                 </Menu.Item>
    //             )
    //         } else {
    //             return (
    //                 <SubMenu key={item.key} icon={item.icon} title={item.title}>
    //                     {/*第一种方法 再遍历一次 */}
    //                     {/* {item.children.map((children) => {
    //                         return (
    //                             <Menu.Item key={children.key} icon={children.icon}>
    //                                 <Link to={children.key}>
    //                                     <span>{children.title}</span>
    //                                 </Link>
    //                             </Menu.Item>
    //                         )
    //                     })}  */}
    //                     {/*第二种方法 递归调用 */}
    //                     {
    //                         this.getMenuNodes_map(item.children)
    //                     }
    //                 </SubMenu>
    //             )
    //         }
    //     })
    // }
    /**
    * 判断当前登录用户对item是否有权限
    */
    hasAuth = (item) => {
        const {key, isPublic} = item
        const menus = memoryUtils.user.role.menus
        const username = memoryUtils.user.username
         //1. 如果当前用户是admin， 则全部显示
         //2. 当前item是公开的直接返回true
         //3. 当前用户有此item的权限，看key是否在menu中
         if(username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
             return true
         } else if(item.children){
             //4. 如果当前用户有此item的子item的权限
            return !!item.children.find(child => menus.indexOf(child.key) !== -1)
         }
         return false
    }
    
    getMenuNodes = menuList => {
        const path =  this.props.location.pathname;

        return menuList.reduce((pre, item) => {
            if(this.hasAuth(item)) {
                if(!item.children) {
                    pre.push((
                        <Menu.Item key={item.key} icon={item.icon}>
                            <Link to={item.key}>
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    ))
                } else {
                    const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                    if(cItem) {
                        this.openKey = item.key
                    }
                    pre.push((
                        <SubMenu key={item.key} icon={item.icon} title={item.title}>
                            {
                                this.getMenuNodes(item.children)
                            }
                        </SubMenu>
                    ))
                }
            }
            
            return pre
        },[])
        
    }
    
    render() {
        const menuNodes = this.getMenuNodes(menuList)
        let path =  this.props.location.pathname;
        if(path.indexOf('/product') === 0) { //当前请求的是商品或者是商品的子节点
            path = '/product'
        }
        const openKey = this.openKey
        return (
           
            <div to='/' className="left-nav">
                <Link to='/' className="left-nav-header">
                    <img src={logo} alt="logo" />
                    <h1>后台管理</h1>
                </Link>
                <Sider collapsed={this.state.collapsed} >
                    <div className="logo" />
                    <Menu theme="dark" selectedKeys={[path]} defaultOpenKeys={[openKey]} mode="inline">
                        {/* <Menu.Item key="/home" icon={<HomeOutlined/>}>
                            <Link to='/home'>
                                <span>首页</span>
                            </Link>
                        </Menu.Item>
                        <SubMenu key="sub1" icon={<AppstoreOutlined/>} title="商品">
                            <Menu.Item key="/category" icon={<KeyOutlined/>}>
                                <Link to='/category'>
                                    品类管理
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="/product" icon={<ProfileOutlined/>}>
                                <Link to='/product'>
                                商品管理
                                </Link>
                            </Menu.Item>
                        </SubMenu> */}
                        { menuNodes }
                    </Menu>
                </Sider>
            </div>
        )
    }
}
/**
 * withRouter高阶组件包裹普通组件，可以返回一个新的组件
 * 让普通组件拥有路由组件的属性
 */

export default withRouter(LeftNav)
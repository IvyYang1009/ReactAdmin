import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Layout, Menu, Breadcrumb } from 'antd';
import {
    HomeOutlined,
    BarsOutlined,
    AppstoreOutlined,
    ToolOutlined,
    ProfileOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import logo from '../../assets/images/logo.png'
import './index.less'

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;


export default class LeftNav extends Component {
    state = {
        collapsed: false,
    };

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };
    render() {
        return (
            
            <div to='/' className="left-nav">
                    <Link to='/' className="left-nav-header">
                        <img src={logo} alt="logo" />
                        <h1>后台管理</h1>
                    </Link>
                    <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                    <div className="logo" />
                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                        <Menu.Item key="1" icon={<HomeOutlined/>}>
                            <span>首页</span>
                        </Menu.Item>
                        <SubMenu key="sub1" icon={<HomeOutlined/>} title="商品">
                            <Menu.Item key="3" icon={<AppstoreOutlined/>}>品类管理</Menu.Item>
                            <Menu.Item key="4" icon={<ProfileOutlined/>}>商品管理</Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
            </div>
        )
    }
}

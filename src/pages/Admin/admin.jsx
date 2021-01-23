import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Layout } from 'antd'
import memoryUtils from '../../utils/memoryUtils'
import LeftNav from '../../components/LeftNav'
import Header from '../../components/Header'
import Home from '../Home/home'
import Category from '../Category/category'
import Line from '../Charts/line'
import Pie from '../Charts/pie'
import Bar from '../Charts/bar'
import Product from '../Product/product'
import Role from '../Role/role'
import User from '../User/user'



const { Footer, Sider, Content } = Layout;
/**
 * 后台管理的路由组件
 */
export default class Admin extends Component {
    render() {
        const user = memoryUtils.user
        //如果内存中没有存储user
        if (!user || !user._id) {
            return <Redirect to='/login' />
        }
        return (
            <Layout style={{height: '100%'}}>
                <Sider>
                    <LeftNav></LeftNav>
                </Sider>
                <Layout>
                    <Header></Header>
                    <Content style={{backgroundColor: '#fff'}}>
                        <Switch>
                            <Route path="/home" component={Home}></Route>
                            <Route path="/category" component={Category}></Route>
                            <Route path="/product" component={Product}></Route>
                            <Route path="/role" component={Role}></Route>
                            <Route path="/user" component={User}></Route>
                            <Route path="/charts/bar" component={Bar}></Route>
                            <Route path="/charts/line" component={Line}></Route>
                            <Route path="/charts/pie" component={Pie}></Route>
                            <Redirect to="/home"></Redirect>
                        </Switch>
                    </Content>
                    <Footer style={{ textAlign: 'center', color: '#ccc'}}>推荐使用谷歌浏览器，可以获得最佳操作体验</Footer>
                </Layout>
            </Layout>
        )
    }
}

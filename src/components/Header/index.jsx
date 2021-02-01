import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import LinkButton from '../link-button'
import './index.less'

 class Header extends Component {
    getTitle = () => {
        //得到当前的请求路径
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            if(item.key === path) {
                title = item.title
            } else if (item.children) {
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                if(cItem) {
                    title = cItem.title
                }
            }
        })
        return title
    }
    logOut = () => {
        const { confirm } = Modal;
        confirm({
            title: '确定要退出吗？',
            icon: <ExclamationCircleOutlined />,
            onOk: () => {
              storageUtils.removeUser()
              memoryUtils.user = {}
              this.props.history.replace('/login')
            },
            onCancel() {
              console.log('取消');
            },
          });
    }
    render() {
        //去除当前需要显示的title
        const title = this.getTitle()
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎，{memoryUtils.user.username}登录</span>
                    <LinkButton onClick={this.logOut}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>2021-1-24 10:12:36</span>
                        <img src="http://api.map.baidu.com/images/weather/day/qing.png" alt=""/>
                        <span>晴</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Header)

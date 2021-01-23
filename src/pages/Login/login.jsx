import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Redirect } from 'react-router-dom'
import './login.less'
import logo from '../../assets/images/logo.png'
import { reqLogin } from '../../api';
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

/**
 * 登录的路由组件
 */
 export default class Login extends Component {
       
    formRef = React.createRef();
     //对密码进行验证
        validatePwd = (rule,value) => {
            if(!value) {
                return Promise.reject('密码必须输入')
            } else if(value.length > 12) {
                return Promise.reject('密码必须小于12位')
            } else if(value.length < 4) {
                return Promise.reject('密码必须大于4位')
            } else if(!/^[a-zA-Z0-9_]+$/.test(value)) {
                return Promise.reject('密码必须是英文、数字、或下划线组成')
            }
            return Promise.resolve();
        }
        // (nameList?: NamePath[]) => Promise
        onFinish = (value) => {
            this.formRef.current.validateFields().then(async values=> {
                const {username, password} = values
                const result = await reqLogin(username, password)
                // console.log('请求成功', reponse.data)
                // const result = reponse
                console.log(result)
                if(result.status === 0) {
                    const user = result.data
                    memoryUtils.user = user
                    storageUtils.saveUser(user) //保存到local中
                    message.success('登录成功')
                    this.props.history.replace('/')
                } else { 
                    message.error(result.msg)
                }
            })
                
        }
       
        render() {
            //判断用户是否登录，自动跳转到管理界面
            const user = memoryUtils.user
            if(!user && !user._id) {
                return <Redirect to='/'></Redirect>
            }
            return (
                <div className="login">
                    <header className="login-header">
                        <img src={logo} alt="logo" />
                        <h1>后台管理系统</h1>
                    </header>
                    <section className="login-content">
                        <h2>用户登录</h2>
                        <Form
                            name="normal_login"
                            className="login-form"
                            onFinish={this.onFinish}
                            ref={this.formRef}
                        >
                            <Form.Item
                                name="username"
                                //声明式验证
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入用户名!',
                                    },
                                    // {
                                    //     min: 4,
                                    //     message: 'Username must be no less than 4 characters ',
                                    // },
                                    // {
                                    //     max: 12,
                                    //     message: 'Username must not exceed 12 characters ',
                                    // },
                                    {
                                        pattern: /^[a-zA-Z0-9_]{4,12}$/,
                                        message: '用户名必须是4-12字母数字下划线',
                                    }
                                ]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        validator: this.validatePwd
                                    },
                                ]}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    placeholder="Password"
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    Log in
                                </Button>
                                Or <a href="">register now!</a>
                            </Form.Item>
                        </Form>
                    </section>
                </div>
            )
        }
    }


  
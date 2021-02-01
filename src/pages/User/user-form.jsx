import React, { Component } from 'react'
import {
    Form,
    Input,
    Select,
    
} from 'antd'


export default class UserForm extends Component {
    formRef = React.createRef()
    componentDidMount() {
        this.props.setForm(this.formRef.current)
    }
    render() {
        const Item = Form.Item
        const Option = Select.Option
        // 指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 4 },  // 左侧label的宽度
            wrapperCol: { span: 15 }, // 右侧包裹的宽度
        }
        const { roles,users } = this.props
        return (
            <Form ref={this.formRef} {...formItemLayout}>
                <Item label="用户名" name="username" initialValue={users.username}>
                    <Input placeholder="请输入用户名" />
                </Item>
                {
                    users._id ? null :  (
                        <Item label="密码" name="password" >
                            <Input placeholder="请输入密码" type="password" />
                        </Item>
                    )
                   
                }
                <Item label="手机号" name="phone" initialValue={users.phone}>
                    <Input placeholder="请输入手机号" />
                </Item>
                <Item label="邮箱" name="email" initialValue={users.email}>
                    <Input placeholder="请输入邮箱" />
                </Item>
                <Item label=" 角色" name="role_id" initialValue={users.role_id}> 
                    <Select placeholder="请选择角色">
                        {
                            roles.map(roles => {
                                return <Option value={roles._id} key={roles._id}>{roles.name}</Option>
                            })
                        }
                    </Select>
                </Item>
            </Form>
        )
    }
}

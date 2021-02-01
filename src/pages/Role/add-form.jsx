import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Input
} from 'antd'
export default class AddForm extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();

    }
    static propTypes = {
        setForm: PropTypes.func.isRequired
    }
    
    componentDidMount () {
        this.props.setForm(this.formRef.current)
    }
    render() {
        const Item = Form.Item
        return (
            <Form  ref={this.formRef}>
                <Item name='roleName' 
                    label="角色名称" 
                    rules={[{ required: true, message: '必须输入商品名称' }]}
                    initialValue={''}
                >
                    <Input  placeholder='请输入角色名称'></Input>
                </Item>
            </Form>
        )
    }
}

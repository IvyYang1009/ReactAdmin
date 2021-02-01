import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Input
} from 'antd'
export default class UpdateForm extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();

    }
    static propType = {
        categoryName: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }

    
    componentDidMount () {
        this.props.setForm(this.formRef.current)
        console.log('22222',this.formRef.current.getFieldsValue())
    }
 

    render() {
        const Item = Form.Item
        const {categoryName} = this.props
        return (
            <Form  ref={this.formRef}>
                <Item name='categoryName' initialValue={categoryName}>
                    <Input  placeholder='请输入分类名称'></Input>
                </Item>
            </Form>
        )
    }
}

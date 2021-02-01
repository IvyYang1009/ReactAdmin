import React, { Component } from 'react'
import {
    Card,
    List,

} from 'antd'
import LinkButton from '../../components/link-button'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { reqCategory } from '../../api'
import {BASE_IMG_URL} from '../../utils/constant'
const Item = List.Item


 
/**
 * 详情页
 */
export default class ProductDetail extends Component {
    state = {
        cName1: '', //一级标题
        cName2: ''  //二级标题
    }
    // async componentDidMount () {
    //     const {pCategoryId, categoryId } = this.props.location.state
    //     if(pCategoryId === '0') { //一级分类下的商品
    //         const result = await reqCategory(categoryId)
    //         const cName1 = result.data.name 
    //         this.setState({cName1})
    //     } else { //二级分类下的商品
    //通过await 方式发送 效率低下  
    //         const result1 = await reqCategory(pCategoryId)
    //         const result2 = await reqCategory(categoryId)
    //         console.log(result1.data)
    //         const cName1 = result1.data.name 
    //         const cName2 = result2.data.name 
    //用promise.all的方式发送  得到的results是个数组  一次性发送多个请求，只有都成功了，才正常处理
    //  const results = await Promise.all([eqCategory(pCategoryId),reqCategory(categoryId)])
    //  const cName1 = results[0].data.name 
    //  const cName2 = results[1].data.name
    //         this.setState({
    //             cName1,
    //             cName2
    //         })
    //     }
    // }
    render() {
        const { name, desc, price, detail,imgs,_id} = this.props.location.state
        const {cName1, cName2} = this.state
        console.log(this.props.location.state)
        const title = (
            <span>
                <LinkButton onClick = {() => {this.props.history.go(-1)}}>
                    <ArrowLeftOutlined style={{ marginRight: 10, fontSize:20 }}/>
                </LinkButton>
                <span>商品详情</span>
            </span>
        )
        return (
           <Card title={title} className='product-detail'>
               <List>
                   <Item>
                        <div className="left">商品名称 : 
                            <span className="right">{name}</span>
                        </div>
                       {/* <span className="right">联想ThinkPad .....</span> */}
                   </Item>
                   <Item>
                        <div className="left">商品描述：
                            <span className="right">{desc}</span>
                        </div>
                        
                   </Item>
                   <Item>
                        <div className="left">商品价格：
                            <span className="right">{price}元</span>
                        </div>
                   </Item>
                   <Item>
                        <div className="left">所属分类：
                            {/* <span className="right">{cName1}{cName2 ? '-->' + cName2: ''}</span> */}
                            <span>aaaaa --  bbbb</span>
                        </div>
                   </Item>
                   <Item>
                        <div className="left">商品图片：
                            {/* {
                                imgs.map(item => {
                                    return <img src={item} key={_id}></img>
                                })
                            } */}
                            {/* <img src={img1} alt=""/> */}
                        </div>
                   </Item>
                   <Item>
                        <div className="left">商品详情: 
                            <span className="right" dangerouslySetInnerHTML={{__html: detail}}></span>
                        </div>
                   </Item>
               </List>
           </Card>
        )
    }
}

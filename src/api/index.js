import ajax from './ajax'

const BASE = ''
//登录
export const reqLogin = (username,password) => ajax(BASE + '/login', {username,password}, 'POST')
//获取分类列表
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', {parentId}) 
//添加分类
export const reqAddCategory = (categoryName,parentId) => ajax(BASE + '/manage/category/list', {categoryName,parentId}, 'POST') 
//更新分类
export const reqUpdateCategory = ({categoryId,categoryName}) => ajax(BASE + '/manage/category/update', {categoryId,categoryName}, 'POST') 
//获取一个分类
export const reqCategory = ({categoryId}) => ajax(BASE + '/manage/category/info', {categoryId})
//获取商品分页列表
export const reqProducts = (pageNum,pageSize) => ajax(BASE + '/manage/product/list', {pageNum,pageSize})
//更新商品的状态（上架、下架）
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', {productId, status}, 'POST')
/**
 * 
 * 搜索商品分页列表
 * searchType: 搜索的类型， productName / productDesc
 */
export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax(BASE + '/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: searchName
    
})
/**
 * 删除图片
 */
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', {name}, 'POST')

/**
 * 添加商品
 */
// export const reqAddProduct = (product) => ajax(BASE + '/manage/product/add', {product}, 'POST')
/**
 * 修改商品
 */
// export const reqUpdateProduct = (product) => ajax(BASE + '/manage/product/update', {product}, 'POST')
//将添加商品和修改商品改成一个接口
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' +( product._id ? 'update' : 'add'), product, 'POST')
/**
 * 获取所有角色的列表
 */
export const reqRoles = () => ajax(BASE + '/manage/role/list')
/**
 * 添加角色
 */
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', {roleName}, 'POST')
/**
 * 更新角色
 */
export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update', role, 'POST')
/**
 * 获取所有用户
 */
export const reqUsers = () => ajax(BASE + '/manage/user/list')
/**
 * 删除用户
 */
export const reqDeleteUser = (userId) => ajax(BASE + '/manage/user/delete', {userId}, 'POST')
/**
 * 添加用户
 */
export const reqAddOrUpdateUser = (user) => ajax(BASE + '/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')
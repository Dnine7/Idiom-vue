// src/api/index.js
import axios from 'axios'

const apiClient = axios.create({
    // baseURL: 'http://localhost:779/api',
    baseURL: 'http://120.46.174.236:779/api', //华为云
    // baseURL: 'http://api.idiom.dnine7.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

export default {
    // 单词相关接口
    getWords() {
        return apiClient.get('/idiom/list')
    },
    getWord(id) {
        return apiClient.get(`/idiom/${id}`)
    },
    createWord(params) {
        return apiClient.post('/idiom/add', params)
    },
    updateWord(id,params) {
        params.id = id
        return apiClient.put(`/idiom/update`, params)
    },
    deleteWord(id) {
        return apiClient.delete(`/idiom/delete/${id}`)
    },

    // 分类相关接口
    getCategories() {
        return apiClient.get('/type/list')
    },
    createCategory(params) {
        return apiClient.post('/type/add', params)
    },
    updateCategory(id,params) {
        params.id = id
        return apiClient.put(`/type/update`, params)
    },
    deleteCategory(id) {
        return apiClient.delete(`/type/delete/${id}`)
    },

    // 编组相关接口
    getGroups() {
        return apiClient.get('/group/list')
    },
    createGroup(group) {
        return apiClient.post('/group/add', group)
    },
    updateGroup(id,group) {
        group.id = id
        return apiClient.put(`/group/update`, group)
    },
    deleteGroup(id) {
        return apiClient.delete(`/groups/delete/${id}`)
    },

    // 查询接口
    searchWords(params) {
        return apiClient.post('/idiom/list', params)
    },
}

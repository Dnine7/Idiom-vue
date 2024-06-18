// src/api/index.js
import axios from 'axios'

const apiClient = axios.create({
    baseURL: 'http://idiom.dnine7.com/api/idiom',
    headers: {
        'Content-Type': 'application/json',
    },
})

export default {
    // 单词相关接口
    getWords() {
        return apiClient.get('/words')
    },
    getWord(id) {
        return apiClient.get(`/words/${id}`)
    },
    createWord(word) {
        return apiClient.post('/words', word)
    },
    updateWord(id, word) {
        return apiClient.put(`/words/${id}`, word)
    },
    deleteWord(id) {
        return apiClient.delete(`/words/${id}`)
    },

    // 分类相关接口
    getCategories() {
        return apiClient.get('/categories')
    },
    createCategory(category) {
        return apiClient.post('/categories', category)
    },
    updateCategory(id, category) {
        return apiClient.put(`/categories/${id}`, category)
    },
    deleteCategory(id) {
        return apiClient.delete(`/categories/${id}`)
    },

    // 编组相关接口
    getGroups() {
        return apiClient.get('/groups')
    },
    createGroup(group) {
        return apiClient.post('/groups', group)
    },
    updateGroup(id, group) {
        return apiClient.put(`/groups/${id}`, group)
    },
    deleteGroup(id) {
        return apiClient.delete(`/groups/${id}`)
    },

    // 查询接口
    searchWords(params) {
        return apiClient.get('/search', { params })
    },
}

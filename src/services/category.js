const Category = require('~/models/category')
const { createError } = require('~/utils/errorsHelper')
const { DOCUMENT_ALREADY_EXISTS, BAD_REQUEST } = require('~/consts/errors')


const categoryService = {
    getCategories: async (pipeline) => {
        const [response] = await Category.aggregate(pipeline).exec()
        return response
    },

    getCategoryById: async (id) => {
        return await Category.findById(id)
    },
      
    createCategory: async ({ name, appearance }) => {
        if (!name || !appearance.icon || !appearance.color) {
          throw createError(400, BAD_REQUEST)
        }

        const existingCategory = await Category.findOne({ name })
        if (existingCategory) {
            throw createError(409, DOCUMENT_ALREADY_EXISTS('name'))
        }
        
        const category = new Category({ name, appearance })
        return await category.save()
    },

    deleteCategory: async (categoryId) => {
        await Category.findByIdAndRemove(categoryId).exec()
    }
}

module.exports = categoryService

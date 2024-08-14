const router = require('express').Router()

const asyncWrapper = require('~/middlewares/asyncWrapper')
const categoryController = require('~/controllers/category')
const { authMiddleware, restrictTo } = require('~/middlewares/auth')
const {
  roles: { ADMIN }
} = require('~/consts/auth')

router.use(authMiddleware)

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Retrieve a list of categories with optional filtering, sorting, and pagination
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter categories by name (supports partial matching with regex)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         required: false
 *         description: The maximum number of categories to return
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         required: false
 *         description: The number of categories to skip before starting to collect the result set
 *     responses:
 *       200:
 *         description: A list of categories matching the query, each with its associated subjects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The category ID
 *                         example: '1234567890abcdef12345678'
 *                       name:
 *                         type: string
 *                         description: The name of the category
 *                         example: 'Technology'
 *                       subjects:
 *                         type: array
 *                         description: The list of subjects associated with the category
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               description: The subject ID
 *                               example: 'abcdef1234567890abcdef12'
 *                             name:
 *                               type: string
 *                               description: The name of the subject
 *                               example: 'AI'
 *                             category:
 *                               type: string
 *                               format: ObjectId
 *                               description: The ObjectId reference to the associated category
 *                               example: '1234567890abcdef12345678'
 *       401:
 *         description: Unauthorized user
 */
router.get('/', asyncWrapper(categoryController.getCategories))

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Retrieve a single category by its ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the category to retrieve
 *     responses:
 *       200:
 *         description: The category data for the specified ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The category ID
 *                   example: '1234567890abcdef12345678'
 *                 name:
 *                   type: string
 *                   description: The name of the category
 *                   example: 'Technology'
 *                 appearance:
 *                   type: object
 *                   properties:
 *                     icon:
 *                       type: string
 *                       description: The icon associated with the category
 *                       example: 'mocked-path-to-icon'
 *                     color:
 *                       type: string
 *                       description: The color associated with the category
 *                       example: '#66C42C'
 *       404:
 *         description: Category not found
 *       401:
 *         description: Unauthorized access
 */
router.get('/:id', asyncWrapper(categoryController.getCategoryById))

/**
 * @swagger
 *   post:
 *     summary: Create a new category
 *     tags: [Category]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryRequest'
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Invalid request body or parameters
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden, insufficient permissions
 *       409:
 *         description: Category already exists
 *       500:
 *         description: Server error
 */
router.post('/', restrictTo(ADMIN), asyncWrapper(categoryController.createCategory))

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category by its ID
 *     tags: [Categories]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the category to delete
 *     responses:
 *       204:
 *         description: Category deleted successfully, no content
 *       404:
 *         description: Category not found
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden, insufficient permissions
 */

router.delete('/:id', restrictTo(ADMIN), asyncWrapper(categoryController.deleteCategory))

module.exports = router

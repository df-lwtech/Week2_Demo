// Sequelize-backed Item model wrapper
const { DataTypes } = require('sequelize')
const { sequelize } = require('./index')

// Define the Sequelize model
const Item = sequelize.define('Item', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'items',
  timestamps: true,
})

// Keep an API similar to the previous in-memory model
module.exports = {
  // validation remains synchronous (same shape as before)
  validate(item) {
    if (!item) return { valid: false, error: 'Item is required' }
    if (!item.name || typeof item.name !== 'string' || item.name.trim() === '') {
      return { valid: false, error: 'Name is required and must be a non-empty string' }
    }
    if (!item.description || typeof item.description !== 'string') {
      return { valid: false, error: 'Description is required and must be a string' }
    }
    return { valid: true }
  },

  // create returns the created item
  async create({ name, description }) {
    const created = await Item.create({ name, description })
    return created.toJSON()
  },

  async list() {
    const rows = await Item.findAll({ order: [['createdAt', 'DESC']] })
    return rows.map(r => r.toJSON())
  },

  async get(id) {
    const row = await Item.findByPk(id)
    return row ? row.toJSON() : null
  },

  async update(id, { name, description }) {
    const row = await Item.findByPk(id)
    if (!row) return null
    if (name !== undefined) row.name = name
    if (description !== undefined) row.description = description
    await row.save()
    return row.toJSON()
  },

  async delete(id) {
    return !!(await Item.destroy({ where: { id } }))
  },

  // expose the Sequelize model for advanced use
  Model: Item,
}

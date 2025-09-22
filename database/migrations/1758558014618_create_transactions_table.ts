import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('client_id').unsigned().references('id').inTable('clients').onDelete('SET NULL')
      table
        .integer('gateway_id')
        .unsigned()
        .references('id')
        .inTable('gateways')
        .onDelete('SET NULL')
      table.string('external_id').notNullable() // ID da transação no gateway
      table.string('status').notNullable()
      table.integer('amount').notNullable() // Valor em centavos
      table.string('card_last_numbers').notNullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

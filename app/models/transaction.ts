import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import Client from '#models/client'
import Gateway from '#models/gateway'
import Product from '#models/product'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'client_id' })
  declare clientId: number

  @column({ columnName: 'gateway_id' })
  declare gatewayId: number

  @column({ columnName: 'external_id' })
  declare externalId: string

  @column()
  declare status: string

  @column()
  declare amount: number

  @column({ columnName: 'card_last_numbers' })
  declare cardLastNumbers: string

  @belongsTo(() => Client)
  declare client: BelongsTo<typeof Client>

  @belongsTo(() => Gateway)
  declare gateway: BelongsTo<typeof Gateway>

  @manyToMany(() => Product, {
    pivotTable: 'transaction_products',
    pivotColumns: ['quantity'],
  })
  declare products: ManyToMany<typeof Product>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

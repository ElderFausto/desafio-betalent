import type { HttpContext } from '@adonisjs/core/http'
import { createTransactionValidator } from '#validators/create_transaction'
import PaymentService from '#services/payment_service'

export default class TransactionsController {
  public async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createTransactionValidator)
    const paymentService = new PaymentService()

    try {
      const transaction = await paymentService.processPayment(payload)
      return response.created(transaction)
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }
}

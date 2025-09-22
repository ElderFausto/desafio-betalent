// app/Services/PaymentService.ts
import Gateway from '#models/gateway'
import Client from '#models/client'
import Transaction from '#models/transaction'
import axios from 'axios'

interface PaymentPayload {
  name: string
  email: string
  amount: number
  cardNumber: string
  cvv: string
}

export default class PaymentService {
  private mapToGateway1(payload: PaymentPayload) {
    return {
      amount: payload.amount,
      name: payload.name,
      email: payload.email,
      cardNumber: payload.cardNumber,
      cvv: payload.cvv,
    }
  }

  private mapToGateway2(payload: PaymentPayload) {
    return {
      valor: payload.amount,
      nome: payload.name,
      email: payload.email,
      numeroCartao: payload.cardNumber,
      cvv: payload.cvv,
    }
  }

  public async processPayment(payload: PaymentPayload) {
    const gateways = await Gateway.query().where('is_active', true).orderBy('priority', 'asc')

    let successfulTransactionData: any = null
    let successfulGateway: Gateway | null = null

    for (const gateway of gateways) {
      try {
        let response
        if (gateway.name === 'Gateway 1') {
          response = await axios.post(
            'http://localhost:3001/transactions',
            this.mapToGateway1(payload)
          )
        } else if (gateway.name === 'Gateway 2') {
          response = await axios.post(
            'http://localhost:3002/transacoes',
            this.mapToGateway2(payload)
          )
        } else {
          continue
        }

        successfulTransactionData = response.data
        successfulGateway = gateway
        break
      } catch (error) {
        console.error(`Erro ao processar pagamento no ${gateway.name}:`, error.message)
      }
    }

    if (!successfulGateway || !successfulTransactionData) {
      throw new Error('Falha ao processar pagamento em todos os gateways.')
    }

    const client = await Client.updateOrCreate({ email: payload.email }, { name: payload.name })

    const transaction = await Transaction.create({
      clientId: client.id,
      gatewayId: successfulGateway.id,
      amount: payload.amount,
      status: successfulTransactionData.status || 'paid',
      externalId: String(successfulTransactionData.id),
      cardLastNumbers: payload.cardNumber.slice(-4),
    })

    return transaction
  }
}

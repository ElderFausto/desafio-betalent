import router from '@adonisjs/core/services/router'
const TransactionsController = () => import('#controllers/transactions_controller')

router.get('/', async () => {
  return { hello: 'world' }
})

router.post('/purchase', [TransactionsController, 'store'])

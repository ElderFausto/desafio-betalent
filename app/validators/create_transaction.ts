import vine from '@vinejs/vine'

export const createTransactionValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    email: vine.string().email(),
    amount: vine.number().positive(),
    cardNumber: vine.string().fixedLength(16).regex(/^\d+$/),
    cvv: vine.string().fixedLength(3).regex(/^\d+$/),
  })
)

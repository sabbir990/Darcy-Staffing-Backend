interface Payment {
cardNumber: number,
expirationDate: string,
CVC: number,
cardholderName: string,
clientEmail: string,

// Billing Address

streetAddress: string,
city: string,
state: string,
zipCode: string,
contractType: string,
pricePaid: number
}

export default Payment;
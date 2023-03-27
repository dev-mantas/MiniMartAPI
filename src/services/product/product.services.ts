import { Request, Response } from 'express'
import  Stripe from "stripe"
import * as dotenv from 'dotenv'
dotenv.config()

const secretStripeKey = String(process.env.SECRET_STRIPE_KEY)
const stripe = new Stripe(secretStripeKey, {
    apiVersion: '2022-11-15',
    typescript: true
})

export async function createProduct(req: Request, res: Response) {
    const { name, active, description, metadata, images, shippable, url, unit_amount} = req.body
    try {
        const product = await stripe.products.create({
            name: name,
            active: active,
            description: description,
            metadata: JSON.parse(metadata),
            images: [images],
            shippable: shippable,
            url: url
        }).then(product => {
            stripe.prices.create({
              unit_amount: unit_amount,
              currency: 'usd',
              product: product.id,
            })
          });
        return res.status(200).send({message: 'PRODUCT_CREATED'})
    } catch(error) {
        console.log(error)
        throw res.status(400).send({message: 'ERROR_CREATING_PRODUCT'})
    }
}


export async function listPublicProducts(req: Request, res: Response) {
    const products = await stripe.products.list({
        limit: 25
    })

    return res.status(200).send(products)
}
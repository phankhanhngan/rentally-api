import { Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { User } from 'src/entities';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  async createCustomer(user: User): Promise<Stripe.Response<Stripe.Customer>> {
    return await this.stripe.customers.create({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      phone: user.phoneNumber,
      description: `Created from server for user with id [${user.id}]`,
    });
  }

  async createCard(
    user: User,
  ): Promise<Stripe.Response<Stripe.CustomerSource>> {
    try {
      const token = await this.stripe.tokens.create({
        card: {
          number: user.cardNumber,
          exp_month: user.cardExpMonth,
          exp_year: user.cardExpYear,
          cvc: user.cardCVC,
        },
      });
      return await this.stripe.customers.createSource(user.customerId, {
        // source: token.id,
        source: 'tok_mastercard',
      });
    } catch (e) {
      this.logger.error('Calling createCard()', e, StripeService.name);
      throw e;
    }
  }

  async payout(
    user: User,
    amount: number,
  ): Promise<Stripe.Response<Stripe.Payout>> {
    return await this.stripe.payouts.create({
      amount: amount,
      currency: 'vnd',
      destination: user.cardId,
    });
  }

  async testPayout(body) {
    // const account = await this.stripe.accounts.create({
    //   type: 'custom',
    //   country: 'VN',
    //   email: body.email,
    //   business_type: 'individual',

    //   individual: {
    //     email: body.email,
    //     first_name: body.firstName,
    //     last_name: body.lastName,
    //     gender: 'female',
    //     phone: '+84896224055',
    //     dob: {
    //       day: 1,
    //       month: 1,
    //       year: 2002,
    //     },
    //   },
    //   capabilities: {
    //     transfers: { requested: true },
    //   },
    //   tos_acceptance: {
    //     date: Math.floor(Date.now() / 1000),
    //     ip: '8.8.8.8',
    //     service_agreement: 'recipient',
    //   },
    // });

    // const transfer = await this.stripe.transfers.create({
    //   amount: Math.round(Number(body.amount) / 24000) * 100,
    //   currency: 'usd',
    //   destination: account.id,
    //   transfer_group: 'ORDER_95',
    // });
    // const token = await this.stripe.tokens.create({
    //   bank_account: {
    //     country: 'VN',
    //     currency: 'vnd',
    //     account_holder_name: 'Jenny Rosen',
    //     account_holder_type: 'individual',
    //     routing_number: '01101100',
    //     account_number: '000123456789',
    //   },
    // });

    // const bankAccount = await this.stripe.accounts.createExternalAccount(
    //   account.id,
    //   {
    //     external_account: token.id,
    //   },
    // );
    // console.log(transfer.amount);
    // console.log(((transfer.amount - 500) * 24000) / 100);
    // console.log(account.id);
    const balance = await this.stripe.balance.retrieve({
      stripeAccount: 'acct_1OH7F2PxWdElQ2Kk',
    });
    console.log(balance.available[0].source_types);
    return await this.stripe.payouts.create(
      {
        amount: 1000000,
        currency: 'vnd',
        destination: 'ba_1OH7FBPxWdElQ2Kkm1N6Iwca',
        source_type: 'card',
        method: 'standard',
      },
      {
        stripeAccount: 'acct_1OH7F2PxWdElQ2Kk',
      },
    );
  }
}

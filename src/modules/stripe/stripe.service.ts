import { Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { EXCHANGE_RATE_BACK } from 'src/common/constants/stripe';
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

  async createConnectAccount(
    user: User,
  ): Promise<Stripe.Response<Stripe.Account>> {
    return await this.stripe.accounts.create({
      type: 'custom',
      country: 'VN',
      email: user.email,
      business_type: 'individual',

      individual: {
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        gender: 'female',
        phone: user.phoneNumber,
        dob: {
          day: 1,
          month: 1,
          year: 2002,
        },
      },
      capabilities: {
        transfers: { requested: true },
      },
      tos_acceptance: {
        date: Math.floor(Date.now() / 1000),
        ip: '8.8.8.8',
        service_agreement: 'recipient',
      },
    });
  }

  async createBankAccount(
    user: User,
  ): Promise<Stripe.Response<Stripe.ExternalAccount>> {
    const token = await this.stripe.tokens.create({
      bank_account: {
        country: 'VN',
        currency: 'vnd',
        account_holder_name: 'Jenny Rosen',
        account_holder_type: 'individual',
        routing_number: user.bankCode,
        account_number: user.accountNumber,
      },
    });

    return await this.stripe.accounts.createExternalAccount(
      user.stripeAccountId,
      {
        external_account: token.id,
      },
    );
  }

  async payout(user: User, amount: number) {
    try {
      if (!user.stripeAccountId || !user.stripeBankAccountId) {
        this.logger.error(
          `Calling payout() - User account id=[${user.id}] missing stripe account id and stripe bank account id`,
          StripeService.name,
        );
        return;
      }
      const amountInCent = Math.round(amount * EXCHANGE_RATE_BACK * 100);
      const transfer = await this.stripe.transfers.create({
        amount: Math.ceil((amountInCent * 101) / 100),
        currency: 'usd',
        destination: user.stripeAccountId,
      });
      console.log(transfer.balance_transaction);
      return await this.stripe.payouts.create(
        {
          amount: amount,
          currency: 'vnd',
          destination: user.stripeBankAccountId,
          source_type: 'card',
          method: 'standard',
        },
        {
          stripeAccount: user.stripeAccountId,
        },
      );
    } catch (e) {
      throw e;
    }
  }
}

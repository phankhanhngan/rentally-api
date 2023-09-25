import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, Auth } from 'googleapis';

@Injectable()
export class OAuth2Client {
  oauth2Client: Auth.OAuth2Client;
  constructor(private readonly configService: ConfigService) {
    this.oauth2Client = new google.auth.OAuth2({
      clientId: this.configService.get<string>('GOOGLE_AUTH_CLIENT_ID'),
      clientSecret: this.configService.get<string>('GOOGLE_AUTH_CLIENT_SECRET'),
      redirectUri: this.configService.get<string>('GOOGLE_AUTH_CALLBACK_URL'),
    });
  }

  async getInfo(accessToken: string) {
    try {
      this.oauth2Client.setCredentials({
        access_token: accessToken,
        token_type: 'Bearer',
      });

      const { data } = await google
        .oauth2({
          auth: this.oauth2Client,
          version: 'v2',
        })
        .userinfo.v2.me.get();
      return data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class EventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  afterInit(server: any) {}
  handleConnection(client: any) {
    client.join(client.handshake.query.loginId);
  }

  sendNotification(
    renterId: number,
    month: number,
    year: number,
    paymentId: number,
  ) {
    const data = {
      message: `You are due to pay the rent for ${month}/${year}`,
      paymentId: paymentId,
    };
    this.server.to(renterId.toString()).emit('getNotification', data);
  }

  sendNotificationRental(toId: number, message: string) {
    this.server.to(toId.toString()).emit('getNotification', { message });
  }

  handleDisconnect(client: any) {}
}

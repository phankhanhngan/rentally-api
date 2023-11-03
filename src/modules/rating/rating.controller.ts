import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RatingService } from './rating.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { RoleAuthGuard } from 'src/common/guards/role-auth.guard';
import { Role } from 'src/common/enum/common.enum';
import { Request, Response } from 'express';
import { RatingDTO } from './dto/rating.dto';

@UseGuards(JwtAuthGuard)
@Controller('rating')
export class RatingController {
  constructor(
    private readonly ratingService: RatingService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(RoleAuthGuard([Role.USER, Role.MOD, Role.ADMIN]))
  @Post()
  async createRating(
    @Res() res: Response,
    @Req() req,
    @Body(new ValidationPipe({ transform: true })) ratingDto: RatingDTO,
  ) {
    try {
      const idLogin = req.user.id;
      await this.ratingService.createRating(idLogin, ratingDto);
      res.status(200).json({
        message: 'Send rating successfully',
        status: 'success',
        data: ratingDto,
      });
    } catch (error) {
      this.logger.error('Calling createRating()', error, RatingController.name);
      throw error;
    }
  }
}

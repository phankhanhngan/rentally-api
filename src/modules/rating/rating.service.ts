import { Injectable } from '@nestjs/common';
import { RatingDTO } from './dto/rating.dto';

@Injectable()
export class RatingService {
    async createRating(idLogin: any, ratingDto: RatingDTO) {
        try {
            
        } catch (error) {
            throw error;
        }
    }
}

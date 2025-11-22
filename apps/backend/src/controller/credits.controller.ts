import { UpdateTokensRequest } from '@shared/schemas/apikeys.schema';
import { Payload } from '@src/config/strategy';
import { AUTH_ERRORS } from '@src/constants';
import { toUserDTO } from '@src/mappers/user.mapper';
import { UserModel } from '@src/model/user.model';
import { createLowCreditsTemplate, sendMail } from '@src/service/mail';
import { ApiResponse } from '@src/utils/api-response';
import { updateTokens } from '@src/utils/key-management';
import { NextFunction, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';

export async function decrementCredits(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    const { email } = req.user as Payload;

    const { index, tokensUsed } = req.body as UpdateTokensRequest;

    const user = await UserModel.findOne({ email });

    // Handle user not found
    if (!user) {
        res.status(StatusCodes.NOT_FOUND).json(
            new ApiResponse(false, AUTH_ERRORS.USER_NOT_FOUND, {
                reason: 'No user found with this email',
            }),
        );
        return;
    }

    // update the redis api keys tokens used
    updateTokens(index, tokensUsed);

    // Handle invalid credits type
    if (typeof user.credits !== 'number' || isNaN(user.credits)) {
        res.status(StatusCodes.OK).json(new ApiResponse(true, 'Credits are unlimited'));
        return;
    }

    // Handle negative credits
    if (user.credits < 0) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
            new ApiResponse(false, 'Invalid credits state reached', {
                reason: 'Credits cannot be negative',
                credits: user.credits,
            }),
        );
        return;
    }

    // Send low credit warning email (if < 3 and > 0)
    if (user.credits > 0 && user.credits < 3) {
        try {
            const emailBody = createLowCreditsTemplate(user.name, user.credits);
            await sendMail(user.email, 'Low Credits', emailBody);
        } catch (err) {
            // Don’t block user if email fails; just log
            console.error('Failed to send low credit email:', err);
        }
    }

    // Block if credits are zero
    if (user.credits === 0) {
        res.status(StatusCodes.FORBIDDEN).json(
            new ApiResponse(false, AUTH_ERRORS.NO_CREDITS, {
                reason: 'No credits left',
            }),
        );
        return;
    }

    // Decrement credits and save
    await user.decrementCredits(1);

    // Return success response
    res.status(StatusCodes.OK).json(new ApiResponse(true, 'Credits decremented', toUserDTO(user)));
    return;
}

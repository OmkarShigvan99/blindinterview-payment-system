import { UserModel } from '@src/model/user.model';
import { ApiResponse } from '@src/utils/api-response';
import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { toUserDTO } from '@src/mappers/user.mapper';
import { type UserDTO } from '@shared/types/user';
import { AUTH_ERRORS } from '@src/constants';

export async function getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    const page = !Number.isNaN(parseInt(req.query.page as string, 10))
        ? parseInt(req.query.page as string, 10)
        : 1;
    const limit = !Number.isNaN(parseInt(req.query.limit as string, 10))
        ? parseInt(req.query.limit as string, 10)
        : 10;
    const skip = (page - 1) * limit;

    try {
        const [users, total] = await Promise.all([
            UserModel.find({})
                .sort({ createdAt: -1 }) // Optional: latest first
                .skip(skip)
                .limit(limit),
            UserModel.countDocuments({}),
        ]);

        res.status(StatusCodes.OK).json(
            new ApiResponse(true, 'Users fetched successfully', {
                data: users.map((user) => {
                    return toUserDTO(user, true);
                }),
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                    hasNextPage: page * limit < total,
                },
            }),
        );
    } catch (err) {
        next(err);
    }
}

export async function getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const user = await UserModel.findById(req.params.id);
    if (user === null) {
        res.status(StatusCodes.NOT_FOUND).json(
            new ApiResponse(false, AUTH_ERRORS.USER_NOT_FOUND, {
                reason: 'No user found with this id',
            }),
        );
        return;
    }
    res.status(StatusCodes.OK).json(
        new ApiResponse(true, 'User fetched successfully', toUserDTO(user, true)),
    );
}

export async function updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userDTO = (await req.body) as UserDTO;

    const user = await UserModel.findByIdAndUpdate(req.params.id, userDTO, { new: true });
    if (user === null) {
        res.status(StatusCodes.NOT_FOUND).json(
            new ApiResponse(false, AUTH_ERRORS.USER_NOT_FOUND, {
                reason: 'No user found with this id',
            }),
        );
        return;
    }
    res.status(StatusCodes.OK).json(
        new ApiResponse(true, 'User updated successfully', toUserDTO(user, true)),
    );
}

export async function deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (user === null) {
        res.status(StatusCodes.NOT_FOUND).json(
            new ApiResponse(false, AUTH_ERRORS.USER_NOT_FOUND, {
                reason: 'No user found with this id',
            }),
        );
        return;
    }
    res.status(StatusCodes.OK).json(
        new ApiResponse(true, 'User deleted successfully', toUserDTO(user, true)),
    );
}

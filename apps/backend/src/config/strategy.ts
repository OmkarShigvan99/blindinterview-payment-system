import type { UserDTO } from '@shared/types/user';
import { UserModel } from '@src/model/user.model';
import type { Request } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import {
    type StrategyOptions,
    ExtractJwt,
    type VerifiedCallback,
    type Strategy as JwtStrategy,
    Strategy,
} from 'passport-jwt';
import { ENV } from './env';

export interface Payload extends JwtPayload {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
    isEmailVerified: boolean;
}

const accessOpt: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        fromCookie('accessToken'),
    ]),
    secretOrKey: (() => {
        if (ENV.JWT_ACCESS_SECRET === '' || ENV.JWT_ACCESS_SECRET === undefined) {
            throw new Error('JWT_ACCESS_SECRET is not defined in environment variables');
        }
        return ENV.JWT_ACCESS_SECRET;
    })(),
};

export const accessJwtStrategy: JwtStrategy = new Strategy(
    accessOpt,
    (payload: JwtPayload, done: VerifiedCallback) => {
        UserModel.findById(payload.id)
            .then((user) => {
                if (user !== null) {
                    const userDTO: Pick<
                        UserDTO,
                        'id' | 'email' | 'name' | 'role' | 'isEmailVerified'
                    > = {
                        id: String(user._id),
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        isEmailVerified: user.isEmailVerified,
                    };
                    done(null, userDTO);
                } else {
                    done(null, false);
                }
            })
            .catch((error) => {
                done(error, false);
            });
    },
);

const refreshOpt: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([fromCookie('refreshToken')]),
    secretOrKey: (() => {
        if (ENV.JWT_REFRESH_SECRET === '' || ENV.JWT_REFRESH_SECRET === undefined) {
            throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
        }
        return ENV.JWT_REFRESH_SECRET;
    })(),
};

export const refreshJwtStrategy = new Strategy(
    refreshOpt,
    (payload: Payload, done: VerifiedCallback): void => {
        UserModel.findById(payload.id)
            .then((user) => {
                if (user !== null) {
                    const userDTO: Pick<
                        UserDTO,
                        'id' | 'email' | 'name' | 'role' | 'isEmailVerified'
                    > = {
                        id: String(user._id),
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        isEmailVerified: user.isEmailVerified,
                    };
                    done(null, userDTO);
                } else {
                    done(null, false);
                }
            })
            .catch((error) => {
                done(error, false);
            });
    },
);

export const formStrategy = (formName: 'email' | 'reset-forgot-password'): JwtStrategy => {
    const tokenOpt: StrategyOptions = {
        jwtFromRequest: fromHeader('x-token'),
        secretOrKey: (() => {
            if (formName === 'email') {
                if (ENV.JWT_EMAIL_SECRET === '' || ENV.JWT_EMAIL_SECRET === undefined) {
                    throw new Error('JWT_EMAIL_SECRET is not defined in environment variables');
                }
                return ENV.JWT_EMAIL_SECRET;
            }

            if (
                ENV.JWT_FORGOT_PASSWORD_SECRET === '' ||
                ENV.JWT_FORGOT_PASSWORD_SECRET === undefined
            ) {
                throw new Error(
                    'JWT_RESET_PASSWORD_SECRET is not defined in environment variables',
                );
            }
            return ENV.JWT_FORGOT_PASSWORD_SECRET;
        })(),
    };

    const tokenJwtStrategy = new Strategy(
        tokenOpt,
        (payload: JwtPayload, done: VerifiedCallback): void => {
            UserModel.findById(payload.id)
                .then((user) => {
                    if (user !== null) {
                        const userDTO: Pick<
                            UserDTO,
                            'id' | 'email' | 'name' | 'role' | 'isEmailVerified'
                        > = {
                            id: String(user._id),
                            name: user.name,
                            email: user.email,
                            role: user.role,
                            isEmailVerified: user.isEmailVerified,
                        };
                        done(null, userDTO);
                    } else {
                        done(null, false);
                    }
                })
                .catch((error) => {
                    done(error, false);
                });
        },
    );

    return tokenJwtStrategy;
};

function fromCookie(cookieName: string): (req: Request) => string | null {
    return (req: Request): string | null => {
        if (req.cookies[cookieName] !== undefined && req.cookies[cookieName] !== null) {
            return req.cookies[cookieName];
        }
        return null;
    };
}

function fromHeader(headerName: string): (req: Request) => string | null {
    return (req: Request): string | null => {
        if (req.headers[headerName] !== undefined && req.headers[headerName] !== null) {
            return req.headers[headerName] as string;
        }
        return null;
    };
}

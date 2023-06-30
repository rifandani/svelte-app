import { rest } from 'msw';
import type { LoginSchema } from '../../../modules/auth/api/auth.schema';
import { getBaseUrl } from '../../util.mock';
import { mockLoginResponse } from '../entities.http';

export const authHandlers = [
  rest.post(getBaseUrl('auth/login'), async (req, res, ctx) => {
    const { username, password } = await req.json<LoginSchema>();

    if (username === 'kminchelle' && password === '0lelplR') {
      return res(ctx.status(200), ctx.json(mockLoginResponse()));
    }

    return res(ctx.status(400), ctx.json({ message: 'Invalid credentials' }));
  }),

  rest.post(getBaseUrl('auth/refresh-token'), (_req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        token: 'refreshed-token',
      }),
    ),
  ),
];

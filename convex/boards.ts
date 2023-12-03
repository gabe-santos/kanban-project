import { v } from 'convex/values';
import { query } from './_generated/server';

export const get = query({
	args: {},
	handler: async ctx => {
		return await ctx.db.query('boards').collect();
	},
});

export const getBoardByID = query({
	args: { boardID: v.id('boards') },
	handler: async (ctx, args) => {
		return await ctx.db.get(args.boardID);
	},
});

const { AuthenticationError } = require("apollo-server-express");
const { User, JournalEntry } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
	Query: {
		journalEntries: async (parent, { createdAt, date, id }) => {
			const params = {};

			if (createdAt) {
				params.createdAt = createdAt;
			}

			if (date) {
				params.date = {
					$regex: date,
				};
			}

			// if (id) {
			// 	params.id = {
			// 		$regex: id,
			// 	};
			// }

			return await JournalEntry.find(params).populate('journalEntry');
		},
		journalEntry: async (parent, { id }) => {
			return await JournalEntry.findById(id).populate('journalEntry');
		},
		getUsers: async (parent) => {
			return await User.find().populate("journalEntries");
		},
		me: async (parent, args, context) => {
			if (context.user) {
				const user = await User.findOne({_id: context.user._id})
				.select('-__v -password')
				.populate('journalEntries')
			
			 return user;

			}

			throw new AuthenticationError("Not logged in");
		},
	},

	Mutation: {
		addUser: async (parent, args) => {
			const user = await User.create(args);
			const token = signToken(user);

			return { token, user };
		},
		addJournalEntry: async (parent, { entryText }, context) => {
			console.log("checking context\n--------------");
			console.log(context.user);
			if (context.user) {
				console.log("user exists");
				const journalEntry = await JournalEntry.create({
					journalText: entryText,
				});

				await User.findByIdAndUpdate(context.user.id, {
					$push: { journalEntries: journalEntry._id },
				});

				return journalEntry;
			}

			throw new AuthenticationError("Not logged in");
		},

		updateJournalEntry: async (parent, args, context) => {
			if (context.user) {
				return await JournalEntry.findByIdAndUpdate(
					args.journalID,
					{
						entryText: args.entryText,
					},
					{
						new: true,
					}
				);
			}

			throw new AuthenticationError("Not logged in");
		},

		// deleteJournalEntry: async (parent, {journalID}, context) => {
		// 	console.log("checking context\n--------------");
		// 	console.log(context.user);
		// 	if (context.user) {
		// 		const journalEntry = await JournalEntry.findOneAndDelete({
		// 			_id: journalID,
		// 			author: context.user.username,
		// 		  });
		// 		  await User.findOneAndUpdate(
		// 			{ _id: context.user._id },
		// 			{ $pull: { journalEntries: journalEntry._id } }
		// 		  );
		// 			console.log("deleted journal entry");
		// 		  return journalEntry;
		// 	}
				
		// 		const journalEntry = await JournalEntry.create({
		// 			journalText: entryText,
		// 		});

		// 		await User.findByIdAndUpdate(context.user.id, {
		// 			$push: { journalEntries: journalEntry._id },
		// 		});

		// 		return journalEntry;
		// 	}

		// 	throw new AuthenticationError("Not logged in");
		// },

		login: async (parent, { email, password }) => {
			const user = await User.findOne({ email });

			if (!user) {
				throw new AuthenticationError("Incorrect credentials");
			}

			const correctPw = await user.isCorrectPassword(password);

			if (!correctPw) {
				throw new AuthenticationError("Incorrect credentials");
			}

			const token = signToken(user);

			return { token, user };
		}
	}
};

module.exports = resolvers;

import User from "../models/User.js";
import { AuthenticationError } from "apollo-server-express";

const resolvers = {
  Query: {
    me: async (_: any, ctx: any) => {
      if (ctx.user) {
        try {
          const userData = await User.findOne({ _id: ctx.user._id })
            .select("-__v -password")
            .populate("savedBooks");

          return userData;
        } catch (err) {
          throw new Error("Error fetching user data");
        }
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
  Mutation: {
    saveBook: async (_: any, { bookData: book }: any, ctx: any) => {
      if (ctx.user) {
        try {
          const updatedUser = await User.findByIdAndUpdate(
            { _id: ctx.user._id },
            { $push: { savedBooks: book } },
            { new: true }
          );

          return updatedUser;
        } catch (err) {
          throw new Error("Error saving book");
        }
      }

      throw new AuthenticationError("You need to be logged in!");
    },
    removeBook: async (_: any, { bookId: id }: any, ctx: any) => {
      if (ctx.user) {
        try {
          const updatedUser = await User.findOneAndUpdate(
            { _id: ctx.user._id },
            { $pull: { savedBooks: { bookId: id } } },
            { new: true }
          );

          return updatedUser;
        } catch (err) {
          throw new Error("Error removing book");
        }
      }

      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

export default resolvers;

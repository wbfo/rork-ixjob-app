import { z } from "zod";
import { publicProcedure } from "../../../create-context";

export default publicProcedure
  .input(z.object({ name: z.string().optional() }))
  .query(({ input }) => {
    return {
      hello: input.name || "world",
      date: new Date(),
    };
  });
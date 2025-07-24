import { z, ZodType } from "zod";

export class UserValidation {
  
  static readonly REGISTER: ZodType = z.object({
    username: z.string().min(4).max(20),
    password: z.string().min(6).max(12),
    name: z.string().min(1).max(32),
  });
  
  static readonly LOGIN: ZodType = z.object({
    username: z.string().min(4).max(20),
    password: z.string().min(6).max(12)
  });
  
  static readonly UPDATE :ZodType = z.object ({
    name: z.string().min(1).max(32).optional(),
    password: z.string().min(1).max(100).optional()
  })
}

import z from "zod"

export const registerSchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string()
})

export const loginSchema = registerSchema.pick({
    email: true,
    password: true,
})
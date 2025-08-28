import prisma from "../utils/prisma";

export const isEmailExist = async (email) => {
    const count =  await  prisma.user.count({
        where: {
            email: email
        }
    })

    return count > 0;
}

export const createUser = async ({ name, email, password, photo }) => {
    return await prisma.user.create({
        data: {
            name,
            email,
            password,
            photo,
            bio: ""
        },
    });
};

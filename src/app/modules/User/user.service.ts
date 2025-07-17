import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import * as bcrypt from "bcrypt";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { Prisma, User } from "@prisma/client";
import { userSearchAbleFields } from "./user.costant";
import config from "../../../config";
import { fileUploader } from "../../../helpars/fileUploader";
import { IUserFilterRequest, TUser } from "./user.interface";
import { emailSender } from "../../../shared/emailSender";
import crypto from "crypto";

const createUserIntoDb = async (payload: TUser) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      email: payload.email,
    },
  });

  if (existingUser) {
    if (existingUser.email === payload.email) {
      throw new ApiError(
        400,
        `User with this email ${payload.email} already exists`
      );
    }
  }
  const hashedPassword: string = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds)
  );

  const user = await prisma.user.create({
    data: { ...payload, password: hashedPassword },
    select: {
      id: true,
      email: true,
      role: true,
      varifiedEmail: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Generate a new OTP
  const otp = Number(crypto.randomInt(1000, 9999));

  // Set OTP expiration time to 10 minutes from now
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  // Create the email content
  const html = `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 30px; background: linear-gradient(135deg, #6c63ff, #3f51b5); border-radius: 8px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px;">
          <h2 style="color: #ffffff; font-size: 28px; text-align: center; margin-bottom: 20px;">
              <span style="color: #ffeb3b;">Email varification OTP</span>
          </h2>
          <p style="font-size: 16px; color: #333; line-height: 1.5; text-align: center;">
              Your email varification OTP code is below.
          </p>
          <p style="font-size: 32px; font-weight: bold; color: #ff4081; text-align: center; margin: 20px 0;">
              ${otp}
          </p>
          <div style="text-align: center; margin-bottom: 20px;">
              <p style="font-size: 14px; color: #555; margin-bottom: 10px;">
                  This OTP will expire in <strong>10 minutes</strong>. If you did not request this, please ignore this email.
              </p>
              <p style="font-size: 14px; color: #555; margin-bottom: 10px;">
                  If you need assistance, feel free to contact us.
              </p>
          </div>
          <div style="text-align: center; margin-top: 30px;">
              <p style="font-size: 12px; color: #999; text-align: center;">
                  Best Regards,<br/>
                  <span style="font-weight: bold; color: #3f51b5;">Nmbull Team</span><br/>
                  <a href="mailto:support@nmbull.com" style="color: #ffffff; text-decoration: none; font-weight: bold;">Contact Support</a>
              </p>
          </div>
      </div>
  </div> `;

  await emailSender(user.email, html, "Email varification OTP");

  await prisma.user.update({
    where: { id: user.id },
    data: {
      otp: otp,
      expirationOtp: otpExpires,
    },
  });

  return {
    message: "Email varification code sended successfully",
    varifiedEmail: user.varifiedEmail,
  };
};

const getUsersFromDb = async (
  params: IUserFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.UserWhereInput[] = [];

  if (params.searchTerm) {
    andCondions.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  const whereConditons: Prisma.UserWhereInput = { AND: andCondions };

  const result = await prisma.user.findMany({
    where: whereConditons,
    skip,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  const total = await prisma.user.count({
    where: whereConditons,
  });

  if (!result || result.length === 0) {
    throw new ApiError(404, "No active users found");
  }
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getMyProfile = async (userEmail: string) => {
  const userProfile = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      image: true,
      location: true,
      phoneNumber: true,
      about: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return userProfile;
};

const updateProfile = async (payload: User, imageFile: any, userId: string) => {
  const result = await prisma.$transaction(async (prisma) => {
    let image = "";
    if (imageFile) {
      image = (await fileUploader.uploadToCloudinary(imageFile)).Location;
    }

    const createUserProfile = await prisma.user.update({
      where: { id: userId },
      data: { ...payload, image },
    });

    return createUserProfile;
  });

  return result;
};

export const userService = {
  createUserIntoDb,
  getUsersFromDb,
  getMyProfile,
  updateProfile,
};

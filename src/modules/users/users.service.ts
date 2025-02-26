import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '@repositories/user-repository';
import { CreateUserInput, CreateUserOutput } from '@modules/users/dto/create-user.dto';
import { ConflictError } from '@error/ConflictError';
import { ErrorCode } from '@enums/ErrorCodeEnum';
import { DeleteUserInput, DeleteUserOutput } from '@modules/users/dto/delete-user.dto';
import { User } from '@entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserInput: CreateUserInput): Promise<CreateUserOutput | null> {
    const existingUser: User = await this.userRepository.findOneBy({
      email: createUserInput.email,
    });

    if (existingUser) {
      throw new ConflictError(
        'There is a user with that email already',
        ErrorCode.DUPLICATED_EMAIL,
      );
    }

    const newUser: User = createUserInput.toUserEntity();
    const user: User = await this.userRepository.save(newUser);

    return { ok: true, results: { user } };
  }

  async deleteUser(authUser, deleteUserInput: DeleteUserInput): Promise<DeleteUserOutput> {
    const existUser: User = await this.userRepository.findOne({
      where: { id: authUser.id },
      select: { id: true, email: true, password: true },
    });

    if (existUser) {
      const passwordCorrect: Promise<boolean> = existUser.checkPassword(deleteUserInput.password);
      if (!passwordCorrect) {
        throw new UnauthorizedException('wrong password', ErrorCode.INVALID_PASSWORD);
      }
    }

    await this.userRepository.softRemove(existUser);

    return {
      ok: true,
      results: 'user deleted',
    };
  }
}

// src/auth/auth.service.ts
import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { Role, User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private dataSource: DataSource, private jwtService: JwtService) {}

  async signup(dto: SignupDto) {
    const userRepo = this.dataSource.getRepository(User);

    // Check if email exists
    const existingUser = await userRepo.findOne({ where: { email: dto.email } });
    if (existingUser) throw new BadRequestException('Email already exists');

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create user
    const user = userRepo.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: Role.USER,
    });

    await userRepo.save(user);

    return {
      message: 'User created successfully',
      user: { id: user.id, name: user.name, email: user.email },
    };
  }

  async login(dto: LoginDto) {
    const userRepo = this.dataSource.getRepository(User);

    const user = await userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    const payload = { id: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      accessToken: token,
      user: { id: user.id, name: user.name, email: user.email },
    };
  }
}

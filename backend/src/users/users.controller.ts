import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Res, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { AppConfig } from 'src/common/config/AppConfig';
import type { Request,  Response } from 'express';
import { JwtUserPayLoad } from 'src/types/types';
import { Throttle } from '@nestjs/throttler';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Public()
    @Post('login')
    @Throttle({ default: { limit: 5, ttl: 900000 } })
    @HttpCode(HttpStatus.OK)
    async login(@Body() body: UpdateUserDto, @Res({ passthrough: true }) res: Response) {
        const { token, payload } = await this.usersService.login(body);
        res.cookie('token', token, {
            httpOnly: true,
            secure: AppConfig.NODE_ENV === 'production',
            sameSite: AppConfig.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        return { payload };
    }

    @Roles('admin', 'user')
    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
        this.usersService.logout(req?.cookies.token);
        res.clearCookie('token');
        return { success: true };
    }

    @Public()
    @Throttle({ default: { limit: 5, ttl: 900000 } })
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Roles('admin')
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Roles('admin', 'user')
    @Get('me')
    verifyMe(@Req() req: Request & { payload: JwtUserPayLoad }) {
        return this.usersService.verifyMe(req.payload);
    }

    @Roles('admin', 'user')
    @Get(':id')
    findOne(@Param('id', ParseObjectIdPipe) id: string) {
        return this.usersService.findOne(id);
    }

    @Roles('admin')
    @Patch(':id')
    update(@Param('id', ParseObjectIdPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    @Roles('admin')
    @Delete(':id')
    remove(@Param('id', ParseObjectIdPipe) id: string) {
        return this.usersService.remove(id);
    }

    @Roles('admin')
    @Patch(':id/disable')
    disable(@Param('id', ParseObjectIdPipe) id: string, @Body() body: { isDisabled: boolean }) {
        return this.usersService.disableUser(id, body.isDisabled);
    }

    @Roles('admin')
    @Patch(':id/blacklist')
    blacklist(
        @Param('id', ParseObjectIdPipe) id: string,
        @Body() body: { isBlacklisted: boolean },
    ) {
        return this.usersService.blacklistUser(id, body.isBlacklisted);
    }
}

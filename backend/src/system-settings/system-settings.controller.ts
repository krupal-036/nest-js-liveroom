import {
    Body,
    Controller,
    Get,
    Patch,
} from '@nestjs/common';

import { Roles } from 'src/common/decorators/roles.decorator';

import { SystemSettingsService } from './system-settings.service';
import { UpdateSystemSettingsDto } from './dto/update-system-settings.dto';

@Controller('system-settings')
export class SystemSettingsController {
    constructor(
        private readonly systemSettingsService: SystemSettingsService,
    ) {}

    @Roles('admin')
    @Get()
    getSettings() {
        return this.systemSettingsService.getSettings();
    }

    @Roles('admin')
    @Patch('auth')
    updateAuthSettings(
        @Body() body: UpdateSystemSettingsDto,
    ) {
        return this.systemSettingsService.updateSettings(body);
    }
}
// backend/src/system-settings/system-settings.controller.ts
import { Roles } from "@/common/decorators/roles.decorator";
import { Body, Controller, Get, Patch } from "@nestjs/common";
import { SystemSettingsService } from "@/system-settings/system-settings.service";
import { UpdateSystemSettingsDto } from "@/system-settings/dto/update-system-settings.dto";

@Controller("system-settings")
export class SystemSettingsController {
    constructor(private readonly systemSettingsService: SystemSettingsService) {}

    @Roles("admin")
    @Get()
    getSettings() {
        return this.systemSettingsService.getSettings();
    }

    @Roles("admin")
    @Patch("auth")
    updateAuthSettings(@Body() body: UpdateSystemSettingsDto) {
        return this.systemSettingsService.updateSettings(body);
    }
}
